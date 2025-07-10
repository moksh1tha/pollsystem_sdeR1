import React from 'react';
import { ArrowLeft, MessageSquare } from 'lucide-react';

interface PollHistoryProps {
  history: Array<{
    id: number;
    question: string;
    options: string[];
    results: Array<{
      option: string;
      votes: number;
      percentage: number;
    }>;
    createdAt: Date;
  }>;
  onClose: () => void;
  onShowChat: () => void;
}

const PollHistory: React.FC<PollHistoryProps> = ({ history, onClose, onShowChat }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={onClose}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back</span>
              </button>
              <h1 className="text-2xl font-bold text-gray-800">View Poll History</h1>
            </div>
            <button
              onClick={onShowChat}
              className="bg-blue-500 text-white px-4 py-2 rounded-full hover:shadow-lg transition-shadow"
            >
              <MessageSquare className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-8">
            {history.map((poll, pollIndex) => (
              <div key={poll.id} className="border-b border-gray-200 pb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Question {pollIndex + 1}
                </h3>
                
                <div className="bg-gray-800 text-white p-4 rounded-lg mb-4">
                  <h4 className="text-lg font-semibold">{poll.question}</h4>
                </div>

                <div className="space-y-3">
                  {poll.results.map((result, index) => (
                    <div key={index} className="flex items-center space-x-4">
                      <div className="w-4 h-4 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex-shrink-0"></div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium text-gray-700">{result.option}</span>
                          <span className="text-sm font-semibold text-gray-800">{result.percentage}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-4">
                          <div 
                            className="bg-gradient-to-r from-purple-500 to-blue-500 h-4 rounded-full transition-all duration-1000"
                            style={{ width: `${result.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {history.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-600">No poll history available yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PollHistory;