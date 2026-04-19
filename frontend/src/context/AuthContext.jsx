import React, { createContext, useContext, useState, useEffect } from 'react';
import { initializeAllRooms } from '../data/hostels';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userType, setUserType] = useState(null); // 'student' or 'admin'
  const [allRooms, setAllRooms] = useState(initializeAllRooms());
  const [studentAllocations, setStudentAllocations] = useState({}); // studentId -> { roomId, allocatedAt }
  const [allStudents, setAllStudents] = useState([]);

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem('user');
    const storedUserType = localStorage.getItem('userType');
    const storedRooms = localStorage.getItem('allRooms');
    const storedAllocations = localStorage.getItem('studentAllocations');
    
    if (storedUser && storedUserType) {
      setUser(JSON.parse(storedUser));
      setUserType(storedUserType);
      setIsAuthenticated(true);
    }

    if (storedRooms) {
      setAllRooms(JSON.parse(storedRooms));
    }

    if (storedAllocations) {
      setStudentAllocations(JSON.parse(storedAllocations));
    }

    setLoading(false);
  }, []);

  const login = (userData, type) => {
    setUser(userData);
    setUserType(type);
    setIsAuthenticated(true);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('userType', type);
  };

  const logout = () => {
    setUser(null);
    setUserType(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
    localStorage.removeItem('userType');
  };

  const updateRooms = (newRooms) => {
    setAllRooms(newRooms);
    localStorage.setItem('allRooms', JSON.stringify(newRooms));
  };

  const updateAllocations = (newAllocations) => {
    setStudentAllocations(newAllocations);
    localStorage.setItem('studentAllocations', JSON.stringify(newAllocations));
  };

  const addStudent = (student) => {
    const updatedStudents = [...allStudents];
    if (!updatedStudents.find(s => s.id === student.id)) {
      updatedStudents.push(student);
      setAllStudents(updatedStudents);
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isAuthenticated, 
        loading, 
        userType, 
        login, 
        logout,
        allRooms,
        updateRooms,
        studentAllocations,
        updateAllocations,
        allStudents,
        addStudent
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
