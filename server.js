import express from 'express';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import cors from 'cors';

const app = express();
const server = createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

// Store data in memory (in production, use a database)
let currentPoll = null;
let pollHistory = [];
let students = new Map();
let pollResults = new Map();
let chatMessages = [];

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Handle teacher joining
  socket.on('teacher-join', () => {
    socket.join('teachers');
    socket.emit('poll-history', pollHistory);
    socket.emit('current-poll', currentPoll);
    socket.emit('chat-messages', chatMessages);
    
    // Send current students list
    const studentsList = Array.from(students.values());
    socket.emit('students-list', studentsList);
  });

  // Handle student joining
  socket.on('student-join', (studentName) => {
    const student = {
      id: socket.id,
      name: studentName,
      hasAnswered: false
    };
    
    students.set(socket.id, student);
    socket.join('students');
    
    // Notify teachers about new student
    io.to('teachers').emit('student-joined', student);
    io.to('teachers').emit('students-list', Array.from(students.values()));
    
    // Send current poll to student
    socket.emit('current-poll', currentPoll);
    socket.emit('chat-messages', chatMessages);
  });

  // Handle creating a new poll
  socket.on('create-poll', (pollData) => {
    currentPoll = {
      id: Date.now(),
      question: pollData.question,
      options: pollData.options,
      timeLimit: pollData.timeLimit || 60,
      createdAt: new Date(),
      active: true
    };
    
    pollResults.clear();
    
    // Reset all students' answer status
    students.forEach(student => {
      student.hasAnswered = false;
    });
    
    // Send poll to all students
    io.to('students').emit('new-poll', currentPoll);
    io.to('teachers').emit('current-poll', currentPoll);
    
    // Start timer
    setTimeout(() => {
      if (currentPoll && currentPoll.id === pollData.id) {
        currentPoll.active = false;
        io.emit('poll-ended', currentPoll.id);
      }
    }, (pollData.timeLimit || 60) * 1000);
  });

  // Handle student answer
  socket.on('submit-answer', (data) => {
    const student = students.get(socket.id);
    if (student && currentPoll && currentPoll.active && !student.hasAnswered) {
      student.hasAnswered = true;
      
      if (!pollResults.has(data.optionIndex)) {
        pollResults.set(data.optionIndex, []);
      }
      pollResults.get(data.optionIndex).push(student.name);
      
      // Send updated results to everyone
      const results = calculateResults();
      io.emit('poll-results', results);
      
      // Check if all students have answered
      const allAnswered = Array.from(students.values()).every(s => s.hasAnswered);
      if (allAnswered) {
        endCurrentPoll();
      }
    }
  });

  // Handle chat messages
  socket.on('send-message', (data) => {
    const message = {
      id: Date.now(),
      text: data.text,
      sender: data.sender,
      senderType: data.senderType,
      timestamp: new Date()
    };
    
    chatMessages.push(message);
    
    // Keep only last 100 messages
    if (chatMessages.length > 100) {
      chatMessages = chatMessages.slice(-100);
    }
    
    io.emit('new-message', message);
  });

  // Handle kick student
  socket.on('kick-student', (studentId) => {
    const student = students.get(studentId);
    if (student) {
      io.to(studentId).emit('kicked-out');
      students.delete(studentId);
      io.to('teachers').emit('students-list', Array.from(students.values()));
    }
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    
    if (students.has(socket.id)) {
      const student = students.get(socket.id);
      students.delete(socket.id);
      io.to('teachers').emit('student-left', student);
      io.to('teachers').emit('students-list', Array.from(students.values()));
    }
  });
});

function calculateResults() {
  const totalStudents = Array.from(students.values()).filter(s => s.hasAnswered).length;
  const results = [];
  
  if (currentPoll) {
    currentPoll.options.forEach((option, index) => {
      const votes = pollResults.get(index) || [];
      const percentage = totalStudents > 0 ? Math.round((votes.length / totalStudents) * 100) : 0;
      
      results.push({
        option,
        votes: votes.length,
        percentage,
        voters: votes
      });
    });
  }
  
  return results;
}

function endCurrentPoll() {
  if (currentPoll) {
    currentPoll.active = false;
    const results = calculateResults();
    
    // Add to history
    pollHistory.push({
      ...currentPoll,
      results,
      endedAt: new Date()
    });
    
    io.emit('poll-ended', currentPoll.id);
    io.to('teachers').emit('poll-history', pollHistory);
  }
}

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});