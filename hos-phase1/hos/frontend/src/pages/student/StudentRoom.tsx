import { useEffect, useState } from 'react';
import { api } from '../../services/api';

interface Profile {
  block: string | null;
  room_number: string | null;
  capacity: number | null;
  bed_number: number | null;
}

export function StudentRoom() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get('/student/profile')
      .then((res) => setProfile(res.data.data))
      .catch(() => setError('Unable to load room info. Please try again.'));
  }, []);

  if (error) return <p className="text-sm text-red-600">{error}</p>;
  if (!profile) return <p className="text-sm text-slate-500">Loading…</p>;

  return (
    <div className="max-w-lg">
      <h1 className="font-display text-2xl font-semibold text-ink">My Room</h1>

      {profile.block ? (
        <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6 shadow-card">
          <p className="font-display text-3xl font-semibold text-ink">
            {profile.block}-{profile.room_number}
          </p>
          <p className="mt-1 text-sm text-slate-500">Bed {profile.bed_number} of {profile.capacity}</p>
          <button
            disabled
            title="Coming in a later phase"
            className="focus-ring mt-5 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-400"
          >
            Request Room Change
          </button>
        </div>
      ) : (
        <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-card">
          No room has been assigned yet. Contact your warden.
        </div>
      )}
    </div>
  );
}
