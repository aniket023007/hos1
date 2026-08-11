import { useEffect, useState } from 'react';
import { Users, Building2, BedDouble, MessageSquare, CalendarClock, QrCode, Wallet, ShieldAlert } from 'lucide-react';
import { StatCard } from '../../components/StatCard';
import { api } from '../../services/api';

interface Stats {
  totalStudents: number;
  totalRooms: number;
  totalBeds: number;
  occupiedBeds: number;
  availableBeds: number;
  pendingComplaints: number;
  pendingLeaves: number;
  pendingGatePasses: number;
  pendingFees: number;
  activeSosAlerts: number;
}

export function WardenDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get('/warden/dashboard')
      .then((res) => setStats(res.data.data))
      .catch(() => setError('Unable to load dashboard. Please try again.'));
  }, []);

  if (error) return <p className="text-sm text-red-600">{error}</p>;
  if (!stats) return <p className="text-sm text-slate-500">Loading dashboard…</p>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink">Hostel Overview</h1>
        <p className="text-sm text-slate-500">Live snapshot of students, rooms and pending actions.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Students" value={stats.totalStudents} icon={Users} tone="brand" />
        <StatCard label="Total Rooms" value={stats.totalRooms} icon={Building2} tone="brand" />
        <StatCard label="Occupied Beds" value={`${stats.occupiedBeds} / ${stats.totalBeds}`} icon={BedDouble} tone="accent" />
        <StatCard label="Available Beds" value={stats.availableBeds} icon={BedDouble} tone="accent" />
        <StatCard label="Pending Complaints" value={stats.pendingComplaints} icon={MessageSquare} tone="amber" />
        <StatCard label="Pending Leaves" value={stats.pendingLeaves} icon={CalendarClock} tone="amber" />
        <StatCard label="Pending Gate Passes" value={stats.pendingGatePasses} icon={QrCode} tone="amber" />
        <StatCard label="Active SOS Alerts" value={stats.activeSosAlerts} icon={ShieldAlert} tone="rose" />
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-card">
        <h2 className="font-display font-semibold text-ink">Recent activity</h2>
        <p className="mt-2 text-sm text-slate-500">
          Complaint, leave, fee and SOS activity feeds will populate here starting Phase 3.
        </p>
      </div>
    </div>
  );
}
