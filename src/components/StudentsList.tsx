import React from 'react';
import { UserX } from 'lucide-react';

interface StudentsListProps {
  students: Array<{
    id: string;
    name: string;
    hasAnswered: boolean;
  }>;
  onKickStudent: (studentId: string) => void;
}

const StudentsList: React.FC<StudentsListProps> = ({ students, onKickStudent }) => {
  if (students.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Connected Students ({students.length})
      </h3>
      
      <div className="space-y-3">
        {students.map((student) => (
          <div key={student.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-semibold">
                  {student.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="font-medium text-gray-800">{student.name}</p>
                <p className="text-sm text-gray-600">
                  {student.hasAnswered ? 'Answered' : 'Waiting...'}
                </p>
              </div>
            </div>
            
            <button
              onClick={() => onKickStudent(student.id)}
              className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition-colors"
              title="Kick student"
            >
              <UserX className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentsList;