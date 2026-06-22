// src/components/Topbar.jsx
import { useSession } from '../context/SessionContext';
import { useLocation } from 'react-router-dom';
import './Topbar.css';

const CLASS_OPTIONS = ['Class 1','Class 2','Class 3','Class 4','Class 5','Class 6','Class 7','Class 8','Class 9','Class 10'];
const TERM_OPTIONS  = ['First','Second','Third','Final'];

const PAGE_TITLES = {
  '/dashboard':           'Dashboard',
  '/result-entry':        'Result Entry',
  '/result-records':      'Result Records',
  '/analytics':           'Analytics',
  '/student-performance': 'Student Performance',
  '/settings':            'Settings',
};

export default function Topbar() {
  const { studentClass, setStudentClass, year, setYear, term, setTerm } = useSession();
  const location = useLocation();
  const pageTitle = PAGE_TITLES[location.pathname] ?? 'Dashboard';

  return (
    <header className="topbar">
      <div className="topbar-left">
        <div className="topbar-breadcrumb">
          EduTrack Pro &nbsp;/&nbsp; <strong>{pageTitle}</strong>
        </div>
      </div>

      <div className="topbar-right">
        {/* Class Selector */}
        <div className="topbar-select-group">
          <label>Class</label>
          <select
            className="topbar-select"
            value={studentClass}
            onChange={e => setStudentClass(e.target.value)}
          >
            {CLASS_OPTIONS.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>

        {/* Year Selector */}
        <div className="topbar-select-group">
          <label>Year</label>
          <input
            type="number"
            className="topbar-year-input"
            value={year}
            onChange={e => setYear(Number(e.target.value))}
            min={2000} max={2100}
          />
        </div>

        {/* Term Selector */}
        <div className="topbar-select-group">
          <label>Term</label>
          <select
            className="topbar-select"
            value={term}
            onChange={e => setTerm(e.target.value)}
          >
            {TERM_OPTIONS.map(t => <option key={t}>{t}</option>)}
          </select>
        </div>

        {/* Active session badge */}
        <div className="session-badge">
          <span className="session-dot" />
          {studentClass} · {term} {year}
        </div>
      </div>
    </header>
  );
}
