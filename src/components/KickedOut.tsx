import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface KickedOutProps {
  onReturnHome: () => void;
}

const KickedOut: React.FC<KickedOutProps> = ({ onReturnHome }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full mb-4">
          <AlertTriangle className="w-8 h-8 text-white" />
        </div>
        
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          You've been Kicked out !
        </h1>
        
        <p className="text-gray-600 mb-6">
          Looks like the teacher has removed you from the poll system. Please try again sometime.
        </p>
        
        <button
          onClick={onReturnHome}
          className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg transition-shadow"
        >
          Return to Home
        </button>
      </div>
    </div>
  );
};

export default KickedOut;