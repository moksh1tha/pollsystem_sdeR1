import React, { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import RoleSelection from './components/RoleSelection';
import TeacherDashboard from './components/TeacherDashboard';
import StudentDashboard from './components/StudentDashboard';
import StudentNameForm from './components/StudentNameForm';
import ChatPopup from './components/ChatPopup';
import KickedOut from './components/KickedOut';

interface User {
  role: 'teacher' | 'student' | null;
  name?: string;
}

function App() {
  const [user, setUser] = useState<User>({ role: null });
  const [socket, setSocket] = useState<Socket | null>(null);
  const [showChat, setShowChat] = useState(false);
  const [isKickedOut, setIsKickedOut] = useState(false);

  useEffect(() => {
    // Check if user role is stored in sessionStorage
    const storedRole = sessionStorage.getItem('userRole');
    const storedName = sessionStorage.getItem('userName');
    
    if (storedRole) {
      setUser({ role: storedRole as 'teacher' | 'student', name: storedName || undefined });
    }
  }, []);

  useEffect(() => {
    if (user.role) {
      const newSocket = io('http://localhost:3001');
      setSocket(newSocket);

      newSocket.on('kicked-out', () => {
        setIsKickedOut(true);
        sessionStorage.removeItem('userRole');
        sessionStorage.removeItem('userName');
      });

      return () => {
        newSocket.close();
      };
    }
  }, [user.role]);

  const handleRoleSelect = (role: 'teacher' | 'student') => {
    setUser({ role });
    sessionStorage.setItem('userRole', role);
  };

  const handleStudentNameSubmit = (name: string) => {
    setUser({ role: 'student', name });
    sessionStorage.setItem('userName', name);
  };

  const handleReturnToHome = () => {
    setUser({ role: null });
    setIsKickedOut(false);
    sessionStorage.removeItem('userRole');
    sessionStorage.removeItem('userName');
  };

  if (isKickedOut) {
    return <KickedOut onReturnHome={handleReturnToHome} />;
  }

  if (!user.role) {
    return <RoleSelection onRoleSelect={handleRoleSelect} />;
  }

  if (user.role === 'student' && !user.name) {
    return <StudentNameForm onNameSubmit={handleStudentNameSubmit} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {user.role === 'teacher' && socket && (
        <TeacherDashboard socket={socket} onShowChat={() => setShowChat(true)} />
      )}
      
      {user.role === 'student' && socket && user.name && (
        <StudentDashboard 
          socket={socket} 
          studentName={user.name} 
          onShowChat={() => setShowChat(true)} 
        />
      )}

      {showChat && socket && (
        <ChatPopup 
          socket={socket} 
          userName={user.name || 'Teacher'} 
          userType={user.role || 'teacher'} 
          onClose={() => setShowChat(false)} 
        />
      )}
    </div>
  );
}

export default App;