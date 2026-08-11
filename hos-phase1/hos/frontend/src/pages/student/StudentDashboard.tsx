import { useEffect, useState } from 'react';
import { MessageSquare, CalendarClock, QrCode, Wallet } from 'lucide-react';
import { StatCard } from '../../components/StatCard';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

interface DashboardData {
  student: { full_name: string; student_code: string; course: string; year: number; block: string | null; room_number: string | null };
  stats: { pendingComplaints: number; pendingLeaves: number; pendingGatePasses: number; feeStatus: string };
}

export function StudentDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/student/dashboard')
      .then((res) => setData(res.data.data))
      .catch(() => setError('Unable to load dashboard. Please try again.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-sm text-slate-500">Loading dashboard…</p>;
  if (error) return <p className="text-sm text-red-600">{error}</p>;
  if (!data) return null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink">
          Welcome back, {data.student.full_name.split(' ')[0]} 👋
        </h1>
        <p className="text-sm text-slate-500">
          {data.student.student_code} · {data.student.course} · Year {data.student.year} ·{' '}
          {data.student.block ? `Room ${data.student.block}-${data.student.room_number}` : 'No room assigned yet'}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Pending Complaints" value={data.stats.pendingComplaints} icon={MessageSquare} tone="amber" />
        <StatCard label="Leave Requests" value={data.stats.pendingLeaves} icon={CalendarClock} tone="brand" />
        <StatCard label="Gate Passes" value={data.stats.pendingGatePasses} icon={QrCode} tone="accent" />
        <StatCard label="Fee Status" value={data.stats.feeStatus === 'not_configured' ? '—' : data.stats.feeStatus} icon={Wallet} tone="rose" />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {['New Complaint', 'Apply Leave', 'Request Gate Pass', 'Pay Fee', 'Emergency SOS'].map((label) => (
          <button
            key={label}
            disabled
            title="Coming in a later phase"
            className="focus-ring rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-400"
          >
            {label}
          </button>
        ))}
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-card">
        <h2 className="font-display font-semibold text-ink">Recent activity</h2>
        <p className="mt-2 text-sm text-slate-500">
          No complaints, notices, or leave activity yet — these modules ship in later phases.
        </p>
      </div>
    </div>
  );
}
