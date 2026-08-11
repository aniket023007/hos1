import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { api } from '../../services/api';

interface StudentRow {
  id: string;
  student_code: string;
  full_name: string;
  email: string;
  course: string | null;
  year: number | null;
  block: string | null;
  room_number: string | null;
}

export function WardenStudents() {
  const [students, setStudents] = useState<StudentRow[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(true);
      api
        .get('/warden/students', { params: { search } })
        .then((res) => setStudents(res.data.data))
        .catch(() => setError('Unable to load students. Please try again.'))
        .finally(() => setLoading(false));
    }, 250);
    return () => clearTimeout(timeout);
  }, [search]);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold text-ink">Students</h1>
      </div>

      <div className="relative mt-4 max-w-sm">
        <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, ID or email…"
          className="focus-ring w-full rounded-lg border border-slate-300 bg-white py-2 pl-9 pr-3 text-sm"
        />
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-card">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Student</th>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Course / Year</th>
              <th className="px-4 py-3">Room</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading && (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-slate-400">Loading…</td>
              </tr>
            )}
            {!loading && error && (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-red-600">{error}</td>
              </tr>
            )}
            {!loading && !error && students.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-slate-400">No students found.</td>
              </tr>
            )}
            {!loading &&
              !error &&
              students.map((s) => (
                <tr key={s.id}>
                  <td className="px-4 py-3">
                    <p className="font-medium text-ink">{s.full_name}</p>
                    <p className="text-xs text-slate-400">{s.email}</p>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{s.student_code}</td>
                  <td className="px-4 py-3 text-slate-600">
                    {s.course || '—'} {s.year ? `· Yr ${s.year}` : ''}
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {s.block ? `${s.block}-${s.room_number}` : <span className="text-slate-400">Unassigned</span>}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
