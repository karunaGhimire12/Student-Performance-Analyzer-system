import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './LoginPage.css';

const ROLE_PRESETS = {
  teacher: { username: 'teacher', password: 'admin123' },
  student: { username: 'student', password: 'student123' },
};

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState('teacher');
  const [form, setForm] = useState(ROLE_PRESETS.teacher);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const chooseRole = (nextRole) => {
    setRole(nextRole);
    setForm(ROLE_PRESETS[nextRole]);
    setError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 350));
    const result = login(form.username.trim(), form.password);
    setLoading(false);

    if (result.success) {
      navigate(role === 'student' ? '/student-dashboard' : '/dashboard');
      return;
    }
    setError(result.error);
  };

  return (
    <main className="login-root">
      <section className="login-brand-panel">
        <div className="brand-mark">SP</div>
        <div>
          <p className="eyebrow">School ERP</p>
          <h1>Student Performance Analyzer</h1>
          <p>
            Enter results, analyze academic performance, and give students a clear view of their progress across terms.
          </p>
        </div>

        <div className="login-capabilities">
          <span>Editable result sheets</span>
          <span>Term-wise analytics</span>
          <span>Student transcripts</span>
          <span>CSV and Excel reports</span>
        </div>
      </section>

      <section className="login-form-panel">
        <div className="login-card">
          <div className="login-card-header">
            <p className="eyebrow">Secure access</p>
            <h2>Sign in</h2>
          </div>

          <div className="segmented-control" aria-label="Choose portal">
            <button
              type="button"
              className={role === 'teacher' ? 'active' : ''}
              onClick={() => chooseRole('teacher')}
            >
              Teacher
            </button>
            <button
              type="button"
              className={role === 'student' ? 'active' : ''}
              onClick={() => chooseRole('student')}
            >
              Student
            </button>
          </div>

          {error && <div className="alert alert-danger">{error}</div>}

          <form onSubmit={handleSubmit} className="login-form">
            <label className="form-label" htmlFor="username">Username</label>
            <input
              id="username"
              className="form-control"
              value={form.username}
              onChange={(event) => setForm((current) => ({ ...current, username: event.target.value }))}
            />

            <label className="form-label" htmlFor="password">Password</label>
            <input
              id="password"
              className="form-control"
              type="password"
              value={form.password}
              onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
            />

            <button className="btn btn-primary btn-lg w-full" type="submit" disabled={loading}>
              {loading && <span className="spinner spinner-light" />}
              Sign in to {role === 'teacher' ? 'Teacher Dashboard' : 'Student Portal'}
            </button>
          </form>

          <div className="credential-grid">
            <div>
              <span>Teacher</span>
              <code>teacher / admin123</code>
            </div>
            <div>
              <span>Student</span>
              <code>student / student123</code>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
