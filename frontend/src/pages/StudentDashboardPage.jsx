import { useEffect, useMemo, useState } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { getStudentHistory, getStudentResult } from '../api/api';
import { useAuth } from '../context/AuthContext';
import { categoryBadge, normalizeResult } from '../utils/results';
import { TranscriptTable } from './StudentPerformancePage';

const TERMS = ['First', 'Second', 'Third', 'Final'];

export default function StudentDashboardPage() {
  const { user, logout } = useAuth();
  const [studentId, setStudentId] = useState(user?.studentId ?? '');
  const [year, setYear] = useState(new Date().getFullYear());
  const [term, setTerm] = useState('First');
  const [currentResult, setCurrentResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const loadPortal = async () => {
    if (!studentId) return;
    setLoading(true);
    setMessage('');
    try {
      const [resultResponse, historyResponse] = await Promise.allSettled([
        getStudentResult(studentId, year, term),
        getStudentHistory(studentId),
      ]);

      setCurrentResult(
        resultResponse.status === 'fulfilled'
          ? normalizeResult(resultResponse.value.data)
          : null,
      );
      setHistory(
        historyResponse.status === 'fulfilled'
          ? (historyResponse.value.data ?? []).map(normalizeResult)
          : [],
      );
      if (resultResponse.status === 'rejected') {
        setMessage('No current result found for this year and term.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = window.setTimeout(loadPortal, 0);
    return () => window.clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const chartData = useMemo(
    () => history.map((record) => ({ label: `${record.term} ${record.year}`, average: record.average })),
    [history],
  );

  return (
    <main className="student-portal">
      <header className="student-header">
        <div>
          <p className="eyebrow">Student Portal</p>
          <h1>My Academic Progress</h1>
          <p>View your current term result, transcript, and performance trend.</p>
        </div>
        <button className="btn btn-ghost" onClick={logout}>Sign Out</button>
      </header>

      <section className="student-filter panel">
        <label>
          Student ID
          <input value={studentId} onChange={(event) => setStudentId(event.target.value)} />
        </label>
        <label>
          Year
          <input type="number" value={year} onChange={(event) => setYear(Number(event.target.value))} />
        </label>
        <label>
          Term
          <select value={term} onChange={(event) => setTerm(event.target.value)}>
            {TERMS.map((option) => <option key={option}>{option}</option>)}
          </select>
        </label>
        <button className="btn btn-primary" onClick={loadPortal} disabled={loading}>
          {loading && <span className="spinner spinner-light" />}
          View Result
        </button>
      </section>

      {message && <div className="alert alert-warning">{message}</div>}

      {currentResult && (
        <section className="current-result">
          <div className="score-card">
            <span>Average</span>
            <strong>{currentResult.average.toFixed(1)}%</strong>
            <em className={`badge ${categoryBadge(currentResult.category)}`}>{currentResult.category}</em>
          </div>
          {['english', 'nepali', 'mathematics', 'science', 'social'].map((subject) => (
            <div className="subject-card" key={subject}>
              <span>{subject === 'mathematics' ? 'Math' : subject[0].toUpperCase() + subject.slice(1)}</span>
              <strong>{currentResult[subject]}</strong>
            </div>
          ))}
        </section>
      )}

      <section className="panel mt-4">
        <div className="panel-header">
          <div>
            <h2>Progress Graph</h2>
            <p>Term-wise average trend.</p>
          </div>
        </div>
        {chartData.length ? (
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="portalTrend" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#2563EB" stopOpacity={0.22} />
                  <stop offset="100%" stopColor="#2563EB" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="label" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Area dataKey="average" stroke="#2563EB" strokeWidth={2.5} fill="url(#portalTrend)" />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="empty-state">No transcript data available yet.</div>
        )}
      </section>

      {history.length > 0 && <TranscriptTable records={history} />}
    </main>
  );
}
