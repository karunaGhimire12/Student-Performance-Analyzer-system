import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAverageStudents, getTopStudents, getWeakStudents } from '../api/api';
import { useSession } from '../context/SessionContext';
import { normalizeResult } from '../utils/results';
import './DashboardPage.css';

const SUMMARY = [
  { key: 'total', label: 'Total Students', color: 'primary' },
  { key: 'excellent', label: 'Excellent', color: 'success' },
  { key: 'good', label: 'Good', color: 'primary' },
  { key: 'average', label: 'Average', color: 'warning' },
  { key: 'weak', label: 'Weak', color: 'danger' },
];

export default function DashboardPage() {
  const { studentClass, year, term } = useSession();
  const [top, setTop] = useState([]);
  const [average, setAverage] = useState([]);
  const [weak, setWeak] = useState([]);
  const [activeBlock, setActiveBlock] = useState('total');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [topRes, averageRes, weakRes] = await Promise.all([
        getTopStudents(year, term, studentClass),
        getAverageStudents(year, term, studentClass),
        getWeakStudents(year, term, studentClass),
      ]);
      setTop((topRes.data ?? []).map(normalizeResult));
      setAverage((averageRes.data ?? []).map(normalizeResult));
      setWeak((weakRes.data ?? []).map(normalizeResult));
    } catch (loadError) {
      setTop([]);
      setAverage([]);
      setWeak([]);
      setError(loadError?.response?.data?.detail ?? 'Could not load dashboard analytics from the backend.');
    } finally {
      setLoading(false);
    }
  }, [studentClass, term, year]);

  useEffect(() => {
    const timer = window.setTimeout(loadDashboard, 0);
    return () => window.clearTimeout(timer);
  }, [loadDashboard]);

  const allStudents = useMemo(() => [...top, ...average, ...weak], [top, average, weak]);
  const summary = {
    total: allStudents.length,
    excellent: allStudents.filter((student) => student.category === 'Excellent').length,
    good: allStudents.filter((student) => student.category === 'Good').length,
    average: allStudents.filter((student) => student.category === 'Average').length || average.length,
    weak: weak.length,
  };

  const visibleStudents = {
    total: allStudents,
    excellent: allStudents.filter((student) => student.category === 'Excellent'),
    good: allStudents.filter((student) => student.category === 'Good'),
    average: allStudents.filter((student) => student.category === 'Average').length
      ? allStudents.filter((student) => student.category === 'Average')
      : average,
    weak,
  }[activeBlock];

  return (
    <div className="page-wrapper">
      <div className="page-header flex-between">
        <div>
          <p className="eyebrow">Teacher Dashboard</p>
          <h1>Performance Overview</h1>
          <p>{studentClass} · {term} Term · {year}</p>
        </div>
        <button className="btn btn-primary" onClick={loadDashboard} disabled={loading}>
          {loading && <span className="spinner spinner-light" />}
          Refresh
        </button>
      </div>

      {error && <div className="alert alert-warning mb-4">{error}</div>}

      <div className="metric-grid">
        {SUMMARY.map((item) => (
          <button
            key={item.key}
            className={`metric-card metric-${item.color} ${activeBlock === item.key ? 'active' : ''}`}
            onClick={() => setActiveBlock(item.key)}
          >
            <span>{item.label}</span>
            <strong>{loading ? '-' : summary[item.key]}</strong>
            <small>Click to view students</small>
          </button>
        ))}
      </div>

      <div className="dashboard-grid">
        <section className="panel">
          <div className="panel-header">
            <div>
              <h2>{SUMMARY.find((item) => item.key === activeBlock)?.label}</h2>
              <p>{visibleStudents.length} students in this view</p>
            </div>
            <Link className="btn btn-ghost btn-sm" to="/analytics">Open Analytics</Link>
          </div>

          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Roll</th>
                  <th>Name</th>
                  <th>Average</th>
                  <th>Division</th>
                  <th>Category</th>
                </tr>
              </thead>
              <tbody>
                {visibleStudents.slice(0, 10).map((student) => (
                  <tr key={`${student.student_id}-${student.term}-${student.year}`}>
                    <td>{student.roll}</td>
                    <td className="fw-600">{student.name}</td>
                    <td>{student.average.toFixed(1)}%</td>
                    <td>{student.division}</td>
                    <td>{student.category}</td>
                  </tr>
                ))}
                {!visibleStudents.length && (
                  <tr>
                    <td colSpan="5" className="empty-cell">No students found for this filter.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <aside className="panel action-panel">
          <h2>Quick Actions</h2>
          <Link to="/result-entry">Enter or import results</Link>
          <Link to="/result-records">Review result records</Link>
          <Link to="/student-performance">Search student history</Link>
          <Link to="/analytics">Analyze top, average, and weak groups</Link>
        </aside>
      </div>
    </div>
  );
}
