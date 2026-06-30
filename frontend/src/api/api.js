// src/api/api.js — Centralized API Service
import axios from 'axios';

const BASE_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// ─── RESULTS ──────────────────────────────────────────────
export const bulkSaveResults = (rows) =>
  api.post('/results/bulk', rows);

export const getStudentResult = (studentId, year, term) =>
  api.get(`/results/${studentId}`, { params: { year, term } });

export const getResultsByTerm = (year, term) =>
  api.get(`/results/term/${year}/${term}`);

// ─── STUDENTS ─────────────────────────────────────────────
export const getStudentById = (studentId) =>
  api.get(`/students/${studentId}`);

export const deleteStudent = (studentId) =>
  api.delete(`/students/${studentId}`);



// ─── ANALYTICS ────────────────────────────────────────────
export const getDashboardAnalytics= (
  year,
  term,
  studentClass
)=>{
  return api.get("/analytics/dashboard",{
    params:{year,
      term,
      student_class:studentClass
    },
  });
};


export const getTopStudents = (year, term, studentClass) =>
  api.get('/analytics/top-performance-students', {
    params: { year, term, student_class: studentClass },
  });

export const getAverageStudents = (year, term, studentClass) =>
  api.get('/analytics/average-performance-students', {
    params: { year, term, student_class: studentClass },
  });

export const getWeakStudents = (year, term, studentClass) =>
  api.get('/analytics/weak-performance-students', {
    params: { year, term, student_class: studentClass },
  });

export const getStudentHistory = (studentId) =>
  api.get(`/analytics/student-history/${studentId}`);

export default api;
