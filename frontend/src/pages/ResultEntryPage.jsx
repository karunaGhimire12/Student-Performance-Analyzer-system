import { useMemo, useRef, useState } from 'react';
import * as XLSX from 'xlsx';
import { bulkSaveResults } from '../api/api';
import { useSession } from '../context/SessionContext';
import {
  SUBJECT_LABELS,
  SUBJECTS,
  calcAverage,
  calcCategory,
  calcDivision,
  categoryBadge,
  divisionBadge,
  makeDefaultRows,
  makeEmptyResultRow,
  toBulkPayload,
  toExportRows,
  validateRows,
} from '../utils/results';
import './ResultEntryPage.css';

const CLASS_OPTIONS = ['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10'];
const TERM_OPTIONS = ['First', 'Second', 'Third', 'Final'];

function readCell(row, names) {
  const key = names.find((name) => row[name] !== undefined);
  return key ? row[key] : '';
}

export default function ResultEntryPage() {
  const { studentClass, setStudentClass, year, setYear, term, setTerm } = useSession();
  const defaults = useMemo(
    () => ({ student_class: studentClass, year, term }),
    [studentClass, year, term],
  );
  const [rows, setRows] = useState(() => makeDefaultRows(defaults));
  const [selected, setSelected] = useState(new Set());
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const fileRef = useRef(null);

  const showMessage = (type, text) => {
    setMessage({ type, text });
    window.setTimeout(() => setMessage(null), 4000);
  };

  const updateCell = (id, field, value) => {
    setRows((current) => current.map((row) => (row.id === id ? { ...row, [field]: value } : row)));
  };

  const syncContext = (field, value) => {
    if (field === 'student_class') setStudentClass(value);
    if (field === 'year') setYear(Number(value));
    if (field === 'term') setTerm(value);
    setRows((current) => current.map((row) => ({ ...row, [field]: value })));
  };

  const addRow = () => setRows((current) => [...current, makeEmptyResultRow(defaults)]);

  const deleteRows = () => {
    if (selected.size === 0) {
      showMessage('warning', 'Select at least one row to delete.');
      return;
    }
    setRows((current) => {
      const nextRows = current.filter((row) => !selected.has(row.id));
      return nextRows.length ? nextRows : makeDefaultRows(defaults);
    });
    setSelected(new Set());
  };

  const duplicateRows = () => {
    const rowsToCopy = rows.filter((row) => selected.has(row.id));
    if (!rowsToCopy.length) {
      showMessage('warning', 'Select rows before duplicating.');
      return;
    }
    setRows((current) => [
      ...current,
      ...rowsToCopy.map((row) => ({ ...row, id: crypto.randomUUID(), roll: '' })),
    ]);
  };

  const clearTable = () => {
    setRows(makeDefaultRows(defaults));
    setSelected(new Set());
  };

  const toggleRow = (id) => {
    setSelected((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    setSelected(selected.size === rows.length ? new Set() : new Set(rows.map((row) => row.id)));
  };

  const saveRows = async () => {
    const payload = toBulkPayload(rows);
    const errors = validateRows(payload);
    if (!payload.length) {
      showMessage('warning', 'Add at least one complete student result before saving.');
      return;
    }
    if (errors.length) {
      showMessage('danger', `Please fix row ${errors[0].index}: ${errors[0].missing.join(', ')}.`);
      return;
    }

    setSaving(true);
    try {
      await bulkSaveResults(payload);
      showMessage('success', `${payload.length} result${payload.length === 1 ? '' : 's'} saved to the database.`);
    } catch (error) {
      showMessage('danger', error?.response?.data?.detail ?? 'Could not save results. Check that the backend is running.');
    } finally {
      setSaving(false);
    }
  };

  const exportExcel = () => {
    const data = toExportRows(rows);
    if (!data.length) {
      showMessage('warning', 'There are no rows to export.');
      return;
    }
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Results');
    XLSX.writeFile(workbook, `results_${studentClass}_${term}_${year}.xlsx`);
  };

  const exportCSV = () => {
    const data = toExportRows(rows);
    if (!data.length) {
      showMessage('warning', 'There are no rows to export.');
      return;
    }
    const worksheet = XLSX.utils.json_to_sheet(data);
    const csv = XLSX.utils.sheet_to_csv(worksheet);
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = `results_${studentClass}_${term}_${year}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const importSheet = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (loadEvent) => {
      const workbook = XLSX.read(loadEvent.target.result, { type: 'array' });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const data = XLSX.utils.sheet_to_json(worksheet, { defval: '' });
      const importedRows = data.map((row) => ({
        id: crypto.randomUUID(),
        roll: readCell(row, ['Roll', 'roll', 'Student ID', 'student_id']),
        name: readCell(row, ['Name', 'name', 'Student Name', 'student_name']),
        student_class: readCell(row, ['Class', 'student_class', 'Student Class']) || studentClass,
        term: readCell(row, ['Term', 'term']) || term,
        year: readCell(row, ['Year', 'year']) || year,
        english: readCell(row, ['English', 'english']),
        nepali: readCell(row, ['Nepali', 'nepali']),
        mathematics: readCell(row, ['Math', 'Mathematics', 'mathematics']),
        science: readCell(row, ['Science', 'science']),
        social: readCell(row, ['Social', 'social']),
        attendance: readCell(row, ['Attendance', 'attendance']),
      }));
      setRows(importedRows.length ? importedRows : makeDefaultRows(defaults));
      setSelected(new Set());
      showMessage('success', `${importedRows.length} row${importedRows.length === 1 ? '' : 's'} imported and ready to edit.`);
    };
    reader.readAsArrayBuffer(file);
    event.target.value = '';
  };

  const completeRows = rows.filter((row) => row.roll && row.name).length;

  return (
    <div className="page-wrapper">
      <div className="page-header flex-between">
        <div>
          <p className="eyebrow">Result Entry</p>
          <h1>Editable Spreadsheet</h1>
          <p>Import a file or type marks manually, validate the sheet, then save directly to the FastAPI backend.</p>
        </div>
        <button className="btn btn-success" onClick={saveRows} disabled={saving}>
          {saving && <span className="spinner spinner-light" />}
          Save to Database
        </button>
      </div>

      <div className="entry-session-bar">
        <label>
          Class
          <select value={studentClass} onChange={(event) => syncContext('student_class', event.target.value)}>
            {CLASS_OPTIONS.map((option) => <option key={option}>{option}</option>)}
          </select>
        </label>
        <label>
          Term
          <select value={term} onChange={(event) => syncContext('term', event.target.value)}>
            {TERM_OPTIONS.map((option) => <option key={option}>{option}</option>)}
          </select>
        </label>
        <label>
          Year
          <input type="number" value={year} onChange={(event) => syncContext('year', event.target.value)} />
        </label>
        <div className="sheet-status">
          <strong>{completeRows}</strong>
          <span>rows ready</span>
        </div>
      </div>

      {message && <div className={`alert alert-${message.type} mb-4`}>{message.text}</div>}

      <div className="sheet-toolbar">
        <input ref={fileRef} type="file" accept=".xlsx,.xls,.csv" hidden onChange={importSheet} />
        <button className="btn btn-ghost" onClick={() => fileRef.current?.click()}>Import Excel/CSV</button>
        <button className="btn btn-ghost" onClick={exportCSV}>Download CSV</button>
        <button className="btn btn-ghost" onClick={exportExcel}>Download Excel</button>
        <button className="btn btn-ghost" onClick={addRow}>Add Row</button>
        <button className="btn btn-ghost" onClick={duplicateRows}>Duplicate</button>
        <button className="btn btn-danger" onClick={deleteRows}>Delete</button>
        <button className="btn btn-warning" onClick={clearTable}>Clear Table</button>
      </div>

      <div className="sheet-card">
        <div className="sheet-scroll">
          <table className="sheet-table">
            <thead>
              <tr>
                <th className="select-col">
                  <input type="checkbox" checked={selected.size === rows.length} onChange={toggleAll} />
                </th>
                <th>Roll</th>
                <th>Name</th>
                <th>Class</th>
                <th>Term</th>
                <th>Year</th>
                {SUBJECTS.map((subject) => <th key={subject}>{SUBJECT_LABELS[subject]}</th>)}
                <th>Attendance</th>
                <th>Average</th>
                <th>Division</th>
                <th>Category</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => {
                const average = calcAverage(row);
                const hasMarks = SUBJECTS.some((subject) => row[subject] !== '');
                const division = calcDivision(average);
                const category = calcCategory(average);

                return (
                  <tr key={row.id} className={selected.has(row.id) ? 'selected' : ''}>
                    <td className="select-col">
                      <input type="checkbox" checked={selected.has(row.id)} onChange={() => toggleRow(row.id)} />
                    </td>
                    <td><input type="number" value={row.roll} onChange={(event) => updateCell(row.id, 'roll', event.target.value)} /></td>
                    <td><input className="wide-cell" value={row.name} onChange={(event) => updateCell(row.id, 'name', event.target.value)} /></td>
                    <td>
                      <select value={row.student_class} onChange={(event) => updateCell(row.id, 'student_class', event.target.value)}>
                        {CLASS_OPTIONS.map((option) => <option key={option}>{option}</option>)}
                      </select>
                    </td>
                    <td>
                      <select value={row.term} onChange={(event) => updateCell(row.id, 'term', event.target.value)}>
                        {TERM_OPTIONS.map((option) => <option key={option}>{option}</option>)}
                      </select>
                    </td>
                    <td><input type="number" value={row.year} onChange={(event) => updateCell(row.id, 'year', event.target.value)} /></td>
                    {SUBJECTS.map((subject) => (
                      <td key={subject}>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={row[subject]}
                          onChange={(event) => updateCell(row.id, subject, event.target.value)}
                        />
                      </td>
                    ))}
                    <td><input type="number" min="0" max="100" value={row.attendance} onChange={(event) => updateCell(row.id, 'attendance', event.target.value)} /></td>
                    <td><span className="auto-value">{hasMarks ? average.toFixed(1) : '-'}</span></td>
                    <td><span className={`badge ${hasMarks ? divisionBadge(division) : 'badge-muted'}`}>{hasMarks ? division : '-'}</span></td>
                    <td><span className={`badge ${hasMarks ? categoryBadge(category) : 'badge-muted'}`}>{hasMarks ? category : '-'}</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="sheet-footer">
          <span>{rows.length} total rows</span>
          <span>{selected.size} selected</span>
          <span>Auto-calculates Average, Division, and Category</span>
        </div>
      </div>
    </div>
  );
}
