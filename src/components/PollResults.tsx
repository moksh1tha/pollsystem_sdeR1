import React from 'react';
import { MessageSquare, Plus, Eye } from 'lucide-react';

interface PollResultsProps {
  poll: {
    question: string;
    options: string[];
  };
  results: Array<{
    option: string;
    votes: number;
    percentage: number;
    voters: string[];
  }>;
  students: Array<{
    id: string;
    name: string;
    hasAnswered: boolean;
  }>;
  onShowChat?: () => void;
  canCreateNew?: boolean;
  onCreateNew?: () => void;
}

const PollResults: React.FC<PollResultsProps> = ({ 
  poll, 
  results, 
  students, 
  onShowChat, 
  canCreateNew, 
  onCreateNew 
}) => {
  const studentsWhoAnswered = students.filter(s => s.hasAnswered);
  const studentsWhoDidnt = students.filter(s => !s.hasAnswered);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Question</h3>
        <div className="bg-gray-800 text-white p-4 rounded-lg mb-4">
          <h4 className="text-lg font-semibold">{poll.question}</h4>
        </div>
      </div>

      <div className="space-y-3 mb-6">
        {results.map((result, index) => (
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

      {/* Participants Panel */}
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <div className="flex justify-between items-center mb-2">
          <h4 className="text-sm font-semibold text-gray-700">Chat</h4>
          <h4 className="text-sm font-semibold text-gray-700">Participants</h4>
        </div>
        
        <div className="space-y-2">
          {studentsWhoAnswered.map((student) => (
            <div key={student.id} className="flex justify-between items-center">
              <span className="text-sm text-gray-600">{student.name}</span>
              <span className="text-xs text-green-600">Answered</span>
            </div>
          ))}
          
          {studentsWhoDidnt.map((student) => (
            <div key={student.id} className="flex justify-between items-center">
              <span className="text-sm text-gray-600">{student.name}</span>
              <span className="text-xs text-orange-600">Waiting...</span>
            </div>
          ))}
        </div>
      </div>

      {canCreateNew && (
        <div className="text-center">
          <button
            onClick={onCreateNew}
            className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-2 rounded-full font-semibold hover:shadow-lg transition-shadow"
          >
            + Ask a new question
          </button>
        </div>
      )}

      {onShowChat && (
        <button
          onClick={onShowChat}
          className="fixed bottom-6 right-6 bg-blue-500 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-shadow"
        >
          <MessageSquare className="w-6 h-6" />
        </button>
      )}
    </div>
  );
};

export default PollResults;