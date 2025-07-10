import React, { useState, useEffect } from 'react';
import { Socket } from 'socket.io-client';
import { MessageSquare, Clock, Loader } from 'lucide-react';
import PollQuestion from './PollQuestion';
import PollResults from './PollResults';

interface StudentDashboardProps {
  socket: Socket;
  studentName: string;
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

const StudentDashboard: React.FC<StudentDashboardProps> = ({ socket, studentName, onShowChat }) => {
  const [currentPoll, setCurrentPoll] = useState<Poll | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [pollResults, setPollResults] = useState<any[]>([]);
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    socket.emit('student-join', studentName);

    socket.on('current-poll', (poll) => {
      setCurrentPoll(poll);
      setHasAnswered(false);
      if (poll && poll.active) {
        setTimeLeft(poll.timeLimit);
      }
    });

    socket.on('new-poll', (poll) => {
      setCurrentPoll(poll);
      setHasAnswered(false);
      setTimeLeft(poll.timeLimit);
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
      socket.off('new-poll');
      socket.off('poll-results');
      socket.off('poll-ended');
    };
  }, [socket, studentName, currentPoll]);

  useEffect(() => {
    if (currentPoll && currentPoll.active && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [currentPoll, timeLeft]);

  const handleAnswerSubmit = (optionIndex: number) => {
    socket.emit('submit-answer', { optionIndex });
    setHasAnswered(true);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!currentPoll) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full mb-4">
              <span className="text-white text-lg font-bold">S</span>
            </div>
            <div className="animate-spin inline-block w-8 h-8 border-4 border-purple-200 border-t-purple-500 rounded-full mb-4"></div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              Wait for the teacher to ask questions..
            </h2>
          </div>
          <button
            onClick={onShowChat}
            className="fixed bottom-6 right-6 bg-blue-500 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-shadow"
          >
            <MessageSquare className="w-6 h-6" />
          </button>
        </div>
      </div>
    );
  }

  if (currentPoll.active && !hasAnswered && timeLeft > 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-2xl mx-auto p-6">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-800">Question 1</h2>
              <div className="flex items-center space-x-2 text-red-500">
                <Clock className="w-4 h-4" />
                <span className="font-mono">{formatTime(timeLeft)}</span>
              </div>
            </div>

            <PollQuestion 
              poll={currentPoll} 
              onAnswerSubmit={handleAnswerSubmit}
              timeLeft={timeLeft}
            />
          </div>
        </div>
        
        <button
          onClick={onShowChat}
          className="fixed bottom-6 right-6 bg-blue-500 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-shadow"
        >
          <MessageSquare className="w-6 h-6" />
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-800">Question 1</h2>
            <div className="flex items-center space-x-2 text-red-500">
              <Clock className="w-4 h-4" />
              <span className="font-mono">00:15</span>
            </div>
          </div>

          {pollResults.length > 0 ? (
            <div>
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  {currentPoll.question}
                </h3>
                <div className="space-y-3">
                  {pollResults.map((result, index) => (
                    <div key={index} className="relative">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-gray-700">{result.option}</span>
                        <span className="text-sm font-semibold text-gray-800">{result.percentage}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-8">
                        <div 
                          className="bg-gradient-to-r from-purple-500 to-blue-500 h-8 rounded-full transition-all duration-1000 flex items-center justify-center"
                          style={{ width: `${result.percentage}%` }}
                        >
                          <span className="text-white text-sm font-medium">
                            {result.percentage}%
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="text-center">
                <p className="text-gray-600 mb-4">Wait for the teacher to ask a new question..</p>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <div className="animate-spin inline-block w-8 h-8 border-4 border-purple-200 border-t-purple-500 rounded-full mb-4"></div>
              <p className="text-gray-600">Loading results...</p>
            </div>
          )}
        </div>
      </div>
      
      <button
        onClick={onShowChat}
        className="fixed bottom-6 right-6 bg-blue-500 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-shadow"
      >
        <MessageSquare className="w-6 h-6" />
      </button>
    </div>
  );
};

export default StudentDashboard;