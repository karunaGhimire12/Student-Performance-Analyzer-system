import { useCallback, useMemo, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { getAverageStudents, getTopStudents, getWeakStudents } from '../api/api';
import { useSession } from '../context/SessionContext';
import { normalizeResult } from '../utils/results';
import './AnalyticsPage.css';

const CATEGORY_COLORS = {
  Excellent: '#22C55E',
  Good: '#2563EB',
  Average: '#F59E0B',
  Weak: '#8B5CF6',
  Struggling: '#EF4444',
};

const DIVISION_COLORS = {
  'A+': '#16A34A',
  A: '#22C55E',
  'B+': '#2563EB',
  B: '#3B82F6',
  'C+': '#F59E0B',
  C: '#FBBF24',
  D: '#8B5CF6',
  NG: '#EF4444',
};

export default function AnalyticsPage() {
  const { studentClass, year, term } = useSession();
  const [groups, setGroups] = useState({ top: [], average: [], weak: [] });
  const [loading, setLoading] = useState(false);
  const [fetched, setFetched] = useState(false);
  const [error, setError] = useState('');

  const loadAnalytics = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [topRes, averageRes, weakRes] = await Promise.all([
        getTopStudents(year, term, studentClass),
        getAverageStudents(year, term, studentClass),
        getWeakStudents(year, term, studentClass),
      ]);
      setGroups({
        top: (topRes.data ?? []).map(normalizeResult),
        average: (averageRes.data ?? []).map(normalizeResult),
        weak: (weakRes.data ?? []).map(normalizeResult),
      });
      setFetched(true);
    } catch (loadError) {
      setGroups({ top: [], average: [], weak: [] });
      setFetched(true);
      setError(loadError?.response?.data?.detail ?? 'Could not load analytics from the backend.');
    } finally {
      setLoading(false);
    }
  }, [studentClass, term, year]);

  const allStudents = useMemo(
    () => [...groups.top, ...groups.average, ...groups.weak],
    [groups],
  );

  const categoryData = Object.entries(
    allStudents.reduce((acc, student) => {
      acc[student.category] = (acc[student.category] ?? 0) + 1;
      return acc;
    }, {}),
  ).map(([name, value]) => ({ name, value }));

  const divisionData = Object.entries(
    allStudents.reduce((acc, student) => {
      acc[student.division] = (acc[student.division] ?? 0) + 1;
      return acc;
    }, {}),
  ).map(([division, count]) => ({ division, count }));

  return (
    <div className="page-wrapper">
      <div className="page-header flex-between">
        <div>
          <p className="eyebrow">Analytics</p>
          <h1>Performance Intelligence</h1>
          <p>{studentClass} · {term} Term · {year}</p>
        </div>
        <button className="btn btn-primary" onClick={loadAnalytics} disabled={loading}>
          {loading && <span className="spinner spinner-light" />}
          Load Analytics
        </button>
      </div>

      {error && <div className="alert alert-warning mb-4">{error}</div>}

      <div className="analytics-pills">
        <div><strong>{allStudents.length}</strong><span>Total</span></div>
        <div><strong>{groups.top.length}</strong><span>Top</span></div>
        <div><strong>{groups.average.length}</strong><span>Average</span></div>
        <div><strong>{groups.weak.length}</strong><span>Weak</span></div>
      </div>

      <div className="grid-2 mb-6">
        <section className="panel">
          <div className="panel-header">
            <div>
              <h2>Category Distribution</h2>
              <p>Excellent, good, average, weak, and struggling students.</p>
            </div>
          </div>
          {categoryData.length ? (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={categoryData} dataKey="value" nameKey="name" innerRadius={64} outerRadius={104} paddingAngle={3}>
                  {categoryData.map((entry) => <Cell key={entry.name} fill={CATEGORY_COLORS[entry.name] ?? '#94A3B8'} />)}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : <EmptyAnalytics fetched={fetched} />}
        </section>

        <section className="panel">
          <div className="panel-header">
            <div>
              <h2>Division Distribution</h2>
              <p>Grade division count for the selected term.</p>
            </div>
          </div>
          {divisionData.length ? (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={divisionData} margin={{ left: -12, right: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="division" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {divisionData.map((entry) => <Cell key={entry.division} fill={DIVISION_COLORS[entry.division] ?? '#94A3B8'} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : <EmptyAnalytics fetched={fetched} />}
        </section>
      </div>

      <div className="analytics-lists">
        <StudentGroup title="Top Performance Students" students={groups.top} tone="success" />
        <StudentGroup title="Average Performance Students" students={groups.average} tone="warning" />
        <StudentGroup title="Weak Performance Students" students={groups.weak} tone="danger" />
      </div>
    </div>
  );
}

function EmptyAnalytics({ fetched }) {
  return <div className="empty-state">{fetched ? 'No analytics data for this filter.' : 'Load analytics to view charts.'}</div>;
}

function StudentGroup({ title, students, tone }) {
  return (
    <section className={`panel analytics-list ${tone}`}>
      <div className="panel-header">
        <h2>{title}</h2>
        <span className="muted-count">{students.length}</span>
      </div>
      <div className="student-stack">
        {students.map((student, index) => (
          <div className="student-row-card" key={`${student.student_id}-${index}`}>
            <span className="rank">{index + 1}</span>
            <div>
              <strong>{student.name}</strong>
              <small>Roll {student.roll} · {student.student_class || 'Class not set'}</small>
            </div>
            <span>{student.average.toFixed(1)}%</span>
          </div>
        ))}
        {!students.length && <div className="empty-state compact">No students in this group.</div>}
      </div>
    </section>
  );
}
