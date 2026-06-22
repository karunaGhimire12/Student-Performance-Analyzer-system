import { useSession } from '../context/SessionContext';

const TERMS = ['First', 'Second', 'Third', 'Final'];
const CLASSES = ['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10'];

export default function SettingsPage() {
  const { studentClass, setStudentClass, year, setYear, term, setTerm } = useSession();

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <p className="eyebrow">Settings</p>
        <h1>Academic Session Defaults</h1>
        <p>These defaults are used across dashboard analytics, result entry, and records.</p>
      </div>

      <section className="panel settings-panel">
        <label>
          Default Class
          <select value={studentClass} onChange={(event) => setStudentClass(event.target.value)}>
            {CLASSES.map((option) => <option key={option}>{option}</option>)}
          </select>
        </label>
        <label>
          Default Term
          <select value={term} onChange={(event) => setTerm(event.target.value)}>
            {TERMS.map((option) => <option key={option}>{option}</option>)}
          </select>
        </label>
        <label>
          Academic Year
          <input type="number" value={year} onChange={(event) => setYear(Number(event.target.value))} />
        </label>
      </section>
    </div>
  );
}
