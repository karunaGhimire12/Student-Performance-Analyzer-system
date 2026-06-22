import { useMemo, useState } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { getStudentHistory } from '../api/api';
import { categoryBadge, divisionBadge, normalizeResult } from '../utils/results';
import './StudentPerformancePage.css';

export default function StudentPerformancePage() {
  const [studentId, setStudentId] = useState('');
  const [history, setHistory] = useState([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const searchStudent = async (event) => {
    event.preventDefault();
    if (!studentId.trim()) {
      setError('Enter a student ID to view history.');
      return;
    }
    setLoading(true);
    setError('');
    setSearched(false);
    try {
      const response = await getStudentHistory(studentId.trim());
      setHistory((Array.isArray(response.data) ? response.data : []).map(normalizeResult));
      setSearched(true);
    } catch (searchError) {
      setHistory([]);
      setSearched(true);
      setError(searchError?.response?.data?.detail ?? 'No history found for this student.');
    } finally {
      setLoading(false);
    }
  };

  const chartData = useMemo(
    () => history.map((record) => ({
      label: `${record.term} ${record.year}`,
      average: record.average,
    })),
    [history],
  );

  const latest = history.at(-1);
  const best = history.reduce((bestRecord, record) => (
    record.average > (bestRecord?.average ?? 0) ? record : bestRecord
  ), null);

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <p className="eyebrow">Student Performance</p>
        <h1>Academic History Search</h1>
        <p>Search by student ID to view term-wise performance, transcript records, and score trends.</p>
      </div>

      <section className="panel">
        <form className="search-form" onSubmit={searchStudent}>
          <input
            className="form-control"
            type="number"
            placeholder="Student ID"
            value={studentId}
            onChange={(event) => setStudentId(event.target.value)}
          />
          <button className="btn btn-primary" disabled={loading}>
            {loading && <span className="spinner spinner-light" />}
            Search
          </button>
        </form>
      </section>

      {error && <div className="alert alert-warning mt-4">{error}</div>}

      {history.length > 0 && (
        <>
          <div className="profile-strip">
            <div>
              <span>Student ID</span>
              <strong>{studentId}</strong>
            </div>
            <div>
              <span>Latest Average</span>
              <strong>{latest?.average.toFixed(1)}%</strong>
            </div>
            <div>
              <span>Best Term</span>
              <strong>{best?.average.toFixed(1)}%</strong>
            </div>
            <div>
              <span>Terms Recorded</span>
              <strong>{history.length}</strong>
            </div>
          </div>

          <section className="panel mt-4">
            <div className="panel-header">
              <div>
                <h2>Performance Graph</h2>
                <p>Average percentage trend across recorded terms.</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="studentTrend" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#2563EB" stopOpacity={0.22} />
                    <stop offset="100%" stopColor="#2563EB" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="label" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Area dataKey="average" stroke="#2563EB" strokeWidth={2.5} fill="url(#studentTrend)" />
              </AreaChart>
            </ResponsiveContainer>
          </section>

          <TranscriptTable records={history} />
        </>
      )}

      {searched && !history.length && !loading && !error && (
        <section className="panel empty-state mt-4">No records are available for this student.</section>
      )}
    </div>
  );
}

export function TranscriptTable({ records }) {
  return (
    <section className="panel mt-4 transcript-panel">
      <div className="panel-header">
        <h2>Transcript</h2>
        <span className="muted-count">{records.length} terms</span>
      </div>
      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>Year</th>
              <th>Term</th>
              <th>English</th>
              <th>Nepali</th>
              <th>Math</th>
              <th>Science</th>
              <th>Social</th>
              <th>Attendance</th>
              <th>Average</th>
              <th>Division</th>
              <th>Category</th>
            </tr>
          </thead>
          <tbody>
            {records.map((record, index) => (
              <tr key={`${record.year}-${record.term}-${index}`}>
                <td>{record.year}</td>
                <td>{record.term}</td>
                <td>{record.english}</td>
                <td>{record.nepali}</td>
                <td>{record.mathematics}</td>
                <td>{record.science}</td>
                <td>{record.social}</td>
                <td>{record.attendance}%</td>
                <td>{record.average.toFixed(1)}%</td>
                <td><span className={`badge ${divisionBadge(record.division)}`}>{record.division}</span></td>
                <td><span className={`badge ${categoryBadge(record.category)}`}>{record.category}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
