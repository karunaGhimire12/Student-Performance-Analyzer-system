export const SUBJECTS = ['english', 'nepali', 'mathematics', 'science', 'social'];

export const SUBJECT_LABELS = {
  english: 'English',
  nepali: 'Nepali',
  mathematics: 'Math',
  science: 'Science',
  social: 'Social',
};

export const makeEmptyResultRow = (defaults = {}) => ({
  id: crypto.randomUUID(),
  roll: '',
  name: '',
  student_class: defaults.student_class ?? 'Class 8',
  term: defaults.term ?? 'First',
  year: defaults.year ?? new Date().getFullYear(),
  english: '',
  nepali: '',
  mathematics: '',
  science: '',
  social: '',
  attendance: '',
});

export const makeDefaultRows = (defaults, count = 5) =>
  Array.from({ length: count }, () => makeEmptyResultRow(defaults));

export function calcAverage(row) {
  const marks = SUBJECTS.map((subject) => Number(row[subject]) || 0);
  return marks.reduce((sum, value) => sum + value, 0) / SUBJECTS.length;
}

export function calcDivision(avg) {
  if (avg >= 90) return 'A+';
  if (avg >= 80) return 'A';
  if (avg >= 70) return 'B+';
  if (avg >= 60) return 'B';
  if (avg >= 50) return 'C+';
  if (avg >= 40) return 'C';
  if (avg >= 35) return 'D';
  return 'NG';
}

export function calcCategory(avg) {
  if (avg >= 90) return 'Excellent';
  if (avg >= 80) return 'Good';
  if (avg >= 60) return 'Average';
  if (avg >= 40) return 'Weak';
  return 'Struggling';
}

export function categoryBadge(category) {
  if (category === 'Excellent') return 'badge-success';
  if (category === 'Good') return 'badge-primary';
  if (category === 'Average') return 'badge-warning';
  if (category === 'Weak') return 'badge-purple';
  if (category === 'Struggling') return 'badge-danger';
  return 'badge-muted';
}

export function divisionBadge(division) {
  if (division === 'A+' || division === 'A') return 'badge-success';
  if (division === 'B+' || division === 'B') return 'badge-primary';
  if (division === 'C+' || division === 'C') return 'badge-warning';
  if (division === 'D') return 'badge-purple';
  if (division === 'NG') return 'badge-danger';
  return 'badge-muted';
}

export function normalizeResult(record = {}) {
  const student = record.student ?? {};
  return {
    result_id: record.result_id ?? record.id,
    roll: record.roll ?? student.roll ?? record.student_id,
    student_id: record.student_id ?? record.roll ?? student.student_id,
    name: record.name ?? student.name ?? `Student ${record.student_id ?? record.roll ?? ''}`,
    student_class: record.student_class ?? student.student_class ?? record.class ?? '',
    term: record.term ?? '',
    year: record.year ?? '',
    english: record.english ?? '',
    nepali: record.nepali ?? '',
    mathematics: record.mathematics ?? '',
    science: record.science ?? '',
    social: record.social ?? '',
    attendance: record.attendance ?? '',
    average: Number(record.average ?? calcAverage(record)) || 0,
    division: record.division ?? calcDivision(Number(record.average ?? calcAverage(record)) || 0),
    category: record.category ?? calcCategory(Number(record.average ?? calcAverage(record)) || 0),
  };
}

export function validateRows(rows) {
  return rows
    .map((row, index) => {
      const missing = [];
      if (!row.roll) missing.push('Roll');
      if (!row.name?.trim()) missing.push('Name');
      if (!row.student_class) missing.push('Class');
      if (!row.term) missing.push('Term');
      if (!row.year) missing.push('Year');
      SUBJECTS.forEach((subject) => {
        const value = Number(row[subject]);
        if (row[subject] === '' || Number.isNaN(value) || value < 0 || value > 100) {
          missing.push(SUBJECT_LABELS[subject]);
        }
      });
      const attendance = Number(row.attendance);
      if (row.attendance !== '' && (Number.isNaN(attendance) || attendance < 0 || attendance > 100)) {
        missing.push('Attendance');
      }
      return { index: index + 1, missing };
    })
    .filter((item) => item.missing.length > 0);
}

export function toBulkPayload(rows) {
  return rows
    .filter((row) => row.roll || row.name || SUBJECTS.some((subject) => row[subject] !== ''))
    .map((row) => ({
      roll: Number(row.roll),
      name: row.name.trim(),
      student_class: row.student_class,
      term: row.term,
      year: Number(row.year),
      english: Number(row.english),
      nepali: Number(row.nepali),
      mathematics: Number(row.mathematics),
      science: Number(row.science),
      social: Number(row.social),
      attendance: Number(row.attendance) || 0,
    }));
}

export function toExportRows(rows) {
  return rows
    .filter((row) => row.roll || row.name)
    .map((row) => {
      const average = Number(row.average ?? calcAverage(row));
      return {
        Roll: row.roll,
        Name: row.name,
        Class: row.student_class,
        Term: row.term,
        Year: row.year,
        English: row.english,
        Nepali: row.nepali,
        Math: row.mathematics,
        Science: row.science,
        Social: row.social,
        Attendance: row.attendance,
        Average: average.toFixed(1),
        Division: row.division ?? calcDivision(average),
        Category: row.category ?? calcCategory(average),
      };
    });
}
