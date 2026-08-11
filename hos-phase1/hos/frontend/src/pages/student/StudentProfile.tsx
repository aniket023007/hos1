import { useEffect, useState } from 'react';
import { api } from '../../services/api';

interface Profile {
  full_name: string;
  student_code: string;
  email: string;
  phone: string | null;
  course: string | null;
  department: string | null;
  year: number | null;
  block: string | null;
  room_number: string | null;
}

export function StudentProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get('/student/profile')
      .then((res) => setProfile(res.data.data))
      .catch(() => setError('Unable to load profile. Please try again.'));
  }, []);

  if (error) return <p className="text-sm text-red-600">{error}</p>;
  if (!profile) return <p className="text-sm text-slate-500">Loading profile…</p>;

  const fields: [string, string | number | null][] = [
    ['Full name', profile.full_name],
    ['Student ID', profile.student_code],
    ['Email', profile.email],
    ['Phone', profile.phone],
    ['Course', profile.course],
    ['Department', profile.department],
    ['Year', profile.year],
    ['Room', profile.block ? `${profile.block}-${profile.room_number}` : 'Not assigned'],
  ];

  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-2xl font-semibold text-ink">My Profile</h1>
      <p className="mt-1 text-sm text-slate-500">Editing opens up in a later phase — this is read-only for now.</p>

      <dl className="mt-6 divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white shadow-card">
        {fields.map(([label, value]) => (
          <div key={label} className="grid grid-cols-3 gap-4 px-5 py-3.5">
            <dt className="text-sm font-medium text-slate-500">{label}</dt>
            <dd className="col-span-2 text-sm text-ink">{value ?? '—'}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
