// src/context/AuthContext.jsx
/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

const DEMO_USERS = [
  {
    username: 'teacher',
    password: 'admin123',
    role: 'teacher',
    name: 'Ms. Karuna Ghimire',
    title: 'Class Teacher',
  },
  {
    username: 'student',
    password: 'student123',
    role: 'student',
    name: 'Student Portal',
    title: 'Learner',
    studentId: '101',
  },
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('spa_auth');
    return stored ? JSON.parse(stored) : null;
  });
  const isAuthenticated = Boolean(user);

  const login = (username, password) => {
    const match = DEMO_USERS.find(
      (candidate) => candidate.username === username && candidate.password === password,
    );

    if (match) {
      const safeUser = {
        username: match.username,
        role: match.role,
        name: match.name,
        title: match.title,
        studentId: match.studentId,
      };
      localStorage.setItem('spa_auth', JSON.stringify(safeUser));
      setUser(safeUser);
      return { success: true };
    }
    return { success: false, error: 'Invalid username or password.' };
  };

  const logout = () => {
    localStorage.removeItem('spa_auth');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, teacher: user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
