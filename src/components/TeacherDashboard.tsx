import React, { useState, useEffect } from 'react';
import { Socket } from 'socket.io-client';
import { MessageSquare, Clock, Users, Eye, Plus } from 'lucide-react';
import PollCreator from './PollCreator';
import PollResults from './PollResults';
import PollHistory from './PollHistory';
import StudentsList from './StudentsList';

interface TeacherDashboardProps {
  socket: Socket;
  onShowChat: () => void;
}

interface Poll {
  id: number;
  question: string;
  options: string[];
  timeLimit: number;
  active: boolean;
  createdAt: Date;
}

interface Student {
  id: string;
  name: string;
  hasAnswered: boolean;
}

const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ socket, onShowChat }) => {
  const [currentPoll, setCurrentPoll] = useState<Poll | null>(null);
  const [pollHistory, setPollHistory] = useState<any[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [showPollCreator, setShowPollCreator] = useState(false);
  const [showPollHistory, setShowPollHistory] = useState(false);
  const [pollResults, setPollResults] = useState<any[]>([]);

  useEffect(() => {
    socket.emit('teacher-join');

    socket.on('current-poll', (poll) => {
      setCurrentPoll(poll);
      if (!poll) {
        setPollResults([]);
      }
    });

    socket.on('poll-history', (history) => {
      setPollHistory(history);
    });

    socket.on('students-list', (studentsList) => {
      setStudents(studentsList);
    });

    socket.on('poll-results', (results) => {
      setPollResults(results);
    });

    socket.on('poll-ended', () => {
      if (currentPoll) {
        setCurrentPoll(prev => prev ? { ...prev, active: false } : null);
      }
    });

    return () => {
      socket.off('current-poll');
      socket.off('poll-history');
      socket.off('students-list');
      socket.off('poll-results');
      socket.off('poll-ended');
    };
  }, [socket, currentPoll]);

  const handleCreatePoll = (pollData: any) => {
    socket.emit('create-poll', pollData);
    setShowPollCreator(false);
  };

  const handleKickStudent = (studentId: string) => {
    socket.emit('kick-student', studentId);
  };

  const canCreateNewPoll = !currentPoll || !currentPoll.active;

  if (showPollHistory) {
    return (
      <PollHistory 
        history={pollHistory} 
        onClose={() => setShowPollHistory(false)} 
        onShowChat={onShowChat}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <div className="inline-flex items-center justify-center w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full mb-2">
                <span className="text-white text-sm font-bold">T</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-800">Let's Get Started</h1>
              <p className="text-gray-600">
                You'll have the ability to create and manage polls, ask questions, and monitor your students' responses in real-time.
              </p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setShowPollHistory(true)}
                className="flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white px-4 py-2 rounded-full hover:shadow-lg transition-shadow"
              >
                <Eye className="w-4 h-4" />
                <span>View Poll History</span>
              </button>
              <button
                onClick={onShowChat}
                className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-full hover:shadow-lg transition-shadow"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Chat</span>
              </button>
            </div>
          </div>

          {showPollCreator ? (
            <PollCreator 
              onCreatePoll={handleCreatePoll}
              onCancel={() => setShowPollCreator(false)}
            />
          ) : (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-800">Enter your question</h2>
                <div className="flex items-center space-x-2 text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>60 seconds</span>
                </div>
              </div>

              {canCreateNewPoll && (
                <button
                  onClick={() => setShowPollCreator(true)}
                  className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 transition-colors text-gray-600 hover:text-purple-500"
                >
                  <Plus className="w-8 h-8 mx-auto mb-2" />
                  Click to create a new poll
                </button>
              )}
            </div>
          )}
        </div>

        {currentPoll && (
          <PollResults 
            poll={currentPoll} 
            results={pollResults} 
            students={students}
            onShowChat={onShowChat}
            canCreateNew={canCreateNewPoll}
            onCreateNew={() => setShowPollCreator(true)}
          />
        )}

        <StudentsList students={students} onKickStudent={handleKickStudent} />
      </div>
    </div>
  );
};

export default TeacherDashboard;