import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getDashboardAnalytics } from "../api/api";
import { useSession } from "../context/SessionContext";
import "./DashboardPage.css";

const SUMMARY = [
  { key: "total", label: "Total Students", color: "primary" },
  { key: "excellent", label: "Excellent", color: "success" },
  { key: "good", label: "Good", color: "primary" },
  { key: "average", label: "Average", color: "warning" },
  { key: "weak", label: "Weak", color: "warning" },
  { key: "struggling", label: "Struggling", color: "danger" },
];

export default function DashboardPage() {
  const { studentClass, year, term } = useSession();

  const [dashboard, setDashboard] = useState({
    summary: {
      total: 0,
      excellent: 0,
      good: 0,
      average: 0,
      weak: 0,
      struggling: 0,
    },
    students: {
      excellent: [],
      good: [],
      average: [],
      weak: [],
      struggling: [],
    },
  });

  const [activeBlock, setActiveBlock] = useState("total");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await getDashboardAnalytics(
        year,
        term,
        studentClass
      );

      setDashboard(response.data);
    } catch (loadError) {
      setDashboard({
        summary: {
          total: 0,
          excellent: 0,
          good: 0,
          average: 0,
          weak: 0,
          struggling: 0,
        },
        students: {
          excellent: [],
          good: [],
          average: [],
          weak: [],
          struggling: [],
        },
      });

      setError(
        loadError?.response?.data?.detail ??
          "Could not load dashboard analytics."
      );
    } finally {
      setLoading(false);
    }
  }, [studentClass, term, year]);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const { students, summary } = dashboard;

  const allStudents = [
    ...students.excellent,
    ...students.good,
    ...students.average,
    ...students.weak,
    ...students.struggling,
  ];

  const visibleStudents =
    {
      total: allStudents,
      excellent: students.excellent,
      good: students.good,
      average: students.average,
      weak: students.weak,
      struggling: students.struggling,
    }[activeBlock] || [];

  return (
    <div className="page-wrapper">
      <div className="page-header flex-between">
        <div>
          <p className="eyebrow">Teacher Dashboard</p>
          <h1>Performance Overview</h1>
          <p>
            {studentClass} · {term} Term · {year}
          </p>
        </div>

        <button
          className="btn btn-primary"
          onClick={loadDashboard}
          disabled={loading}
        >
          {loading && <span className="spinner spinner-light" />}
          Refresh
        </button>
      </div>

      {error && <div className="alert alert-warning mb-4">{error}</div>}

      <div className="metric-grid">
        {SUMMARY.map((item) => (
          <button
            key={item.key}
            className={`metric-card metric-${item.color} ${
              activeBlock === item.key ? "active" : ""
            }`}
            onClick={() => setActiveBlock(item.key)}
          >
            <span>{item.label}</span>

            <strong>{loading ? "-" : summary[item.key] ?? 0}</strong>

            <small>Click to view students</small>
          </button>
        ))}
      </div>

      <div className="dashboard-grid">
        <section className="panel">
          <div className="panel-header">
            <div>
              <h2>
                {SUMMARY.find((item) => item.key === activeBlock)?.label}
              </h2>

              <p>{visibleStudents.length} students in this view</p>
            </div>

            <Link className="btn btn-ghost btn-sm" to="/analytics">
              Open Analytics
            </Link>
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
                  <tr
                    key={`${student.student_id}-${student.term}-${student.year}`}
                  >
                    {/* Change to student.roll if your backend returns roll */}
                    <td>{student.student_id}</td>

                    <td className="fw-600">{student.name}</td>

                    <td>{student.average.toFixed(1)}%</td>

                    <td>{student.division}</td>

                    <td>{student.category}</td>
                  </tr>
                ))}

                {!visibleStudents.length && (
                  <tr>
                    <td colSpan="5" className="empty-cell">
                      No students found for this filter.
                    </td>
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

          <Link to="/student-performance">
            Search student history
          </Link>

          <Link to="/analytics">
            Analyze top, average, and weak groups
          </Link>
        </aside>
      </div>
    </div>
  );
}