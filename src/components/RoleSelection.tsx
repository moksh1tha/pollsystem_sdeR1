import React from 'react';
import { GraduationCap, Users } from 'lucide-react';

interface RoleSelectionProps {
  onRoleSelect: (role: 'teacher' | 'student') => void;
}

const RoleSelection: React.FC<RoleSelectionProps> = ({ onRoleSelect }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full mb-4">
            <GraduationCap className="w-8 h-8 text-white" /> 
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Welcome to the Live Polling System
          </h1>
          <p className="text-gray-600">
            Please select the role that best describes you to begin using the live polling system.
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => onRoleSelect('student')}
            className="w-full p-4 border-2 border-gray-200 rounded-lg hover:border-purple-500 transition-colors text-left"
          >
            <div className="flex items-center">
              <Users className="w-6 h-6 text-purple-500 mr-3" />
              <div>
                <h3 className="font-semibold text-gray-800">I'm a Student</h3>
                <p className="text-sm text-gray-600">
                  Lorem ipsum is simply dummy text of the printing and typesetting industry.
                </p>
              </div>
            </div>
          </button>

          <button
            onClick={() => onRoleSelect('teacher')}
            className="w-full p-4 border-2 border-gray-200 rounded-lg hover:border-purple-500 transition-colors text-left"
          >
            <div className="flex items-center">
              <GraduationCap className="w-6 h-6 text-purple-500 mr-3" />
              <div>
                <h3 className="font-semibold text-gray-800">I'm a Teacher</h3>
                <p className="text-sm text-gray-600">
                  Submit answers and view live poll results in real-time.
                </p>
              </div>
            </div>
          </button>
        </div>

        <div className="mt-8 text-center">
          <button className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg transition-shadow">
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;