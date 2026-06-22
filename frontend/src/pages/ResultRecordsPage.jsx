import { useCallback, useMemo, useState } from 'react';
import * as XLSX from 'xlsx';
import { getResultsByTerm } from '../api/api';
import { useSession } from '../context/SessionContext';
import { categoryBadge, divisionBadge, normalizeResult } from '../utils/results';
import './ResultRecordsPage.css';

export default function ResultRecordsPage() {
  const { studentClass, year, term } = useSession();
  const [records, setRecords] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetched, setFetched] = useState(false);
  const [error, setError] = useState('');

  const loadRecords = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await getResultsByTerm(year, term);
      setRecords((response.data ?? []).map(normalizeResult));
      setFetched(true);
    } catch (loadError) {
      setRecords([]);
      setFetched(true);
      if (loadError?.response?.status !== 404) {
        setError(loadError?.response?.data?.detail ?? 'Could not fetch result records.');
      }
    } finally {
      setLoading(false);
    }
  }, [term, year]);

  const filteredRecords = useMemo(() => {
    const query = search.trim().toLowerCase();
    return records
      .filter((record) => !record.student_class || record.student_class === studentClass)
      .filter((record) => (
        !query
        || String(record.roll).includes(query)
        || record.name.toLowerCase().includes(query)
        || record.category.toLowerCase().includes(query)
      ))
      .sort((a, b) => Number(a.roll) - Number(b.roll));
  }, [records, search, studentClass]);

  const exportRecords = (format) => {
    if (!filteredRecords.length) return;
    const data = filteredRecords.map((record) => ({
      Roll: record.roll,
      Name: record.name,
      Class: record.student_class || studentClass,
      Term: record.term || term,
      Year: record.year || year,
      English: record.english,
      Nepali: record.nepali,
      Math: record.mathematics,
      Science: record.science,
      Social: record.social,
      Attendance: record.attendance,
      Average: record.average.toFixed(1),
      Division: record.division,
      Category: record.category,
    }));
    const worksheet = XLSX.utils.json_to_sheet(data);

    if (format === 'csv') {
      const url = URL.createObjectURL(new Blob([XLSX.utils.sheet_to_csv(worksheet)], { type: 'text/csv' }));
      const link = document.createElement('a');
      link.href = url;
      link.download = `records_${studentClass}_${term}_${year}.csv`;
      link.click();
      URL.revokeObjectURL(url);
      return;
    }

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Records');
    XLSX.writeFile(workbook, `records_${studentClass}_${term}_${year}.xlsx`);
  };

  return (
    <div className="page-wrapper">
      <div className="page-header flex-between">
        <div>
          <p className="eyebrow">Result Records</p>
          <h1>Saved Term Results</h1>
          <p>{studentClass} · {term} Term · {year}</p>
        </div>
        <div className="toolbar-inline">
          <button className="btn btn-ghost" onClick={() => exportRecords('csv')} disabled={!filteredRecords.length}>Export CSV</button>
          <button className="btn btn-ghost" onClick={() => exportRecords('xlsx')} disabled={!filteredRecords.length}>Export Excel</button>
          <button className="btn btn-primary" onClick={loadRecords} disabled={loading}>
            {loading && <span className="spinner spinner-light" />}
            Fetch Records
          </button>
        </div>
      </div>

      {error && <div className="alert alert-danger mb-4">{error}</div>}

      <section className="panel">
        <div className="panel-header">
          <input
            className="form-control record-search"
            placeholder="Search by roll, name, or category"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <span className="muted-count">{filteredRecords.length} records</span>
        </div>

        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Roll</th>
                <th>Name</th>
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
              {filteredRecords.map((record) => (
                <tr key={`${record.result_id}-${record.roll}`}>
                  <td className="fw-600">{record.roll}</td>
                  <td>{record.name}</td>
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
              {!filteredRecords.length && (
                <tr>
                  <td colSpan="11" className="empty-cell">
                    {fetched ? 'No records match the current filters.' : 'Choose filters above and fetch records.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
