// src/context/SessionContext.jsx
/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from 'react';

const SessionContext = createContext(null);

export function SessionProvider({ children }) {
  const [studentClass, setStudentClass] = useState('Class 8');
  const [year, setYear] = useState(new Date().getFullYear());
  const [term, setTerm] = useState('First');

  return (
    <SessionContext.Provider value={{ studentClass, setStudentClass, year, setYear, term, setTerm }}>
      {children}
    </SessionContext.Provider>
  );
}

export const useSession = () => useContext(SessionContext);
