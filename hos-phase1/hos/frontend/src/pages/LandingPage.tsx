import { Link } from 'react-router-dom';
import { MessageSquare, Building2, UtensilsCrossed, Wallet, CalendarClock, Users, ShieldAlert, QrCode } from 'lucide-react';

const features = [
  { icon: MessageSquare, title: 'Complaint Management', desc: 'Log, track and resolve maintenance issues in one place.' },
  { icon: Building2, title: 'Room Management', desc: 'Live occupancy, allocations and room-change requests.' },
  { icon: UtensilsCrossed, title: 'Mess Management', desc: 'Weekly menus and food feedback ratings.' },
  { icon: Wallet, title: 'Fee Management', desc: 'Track dues, payments and downloadable receipts.' },
  { icon: CalendarClock, title: 'Leave Management', desc: 'Apply, approve and track student leave requests.' },
  { icon: Users, title: 'Visitor Management', desc: 'Log and approve visitor entries for residents.' },
  { icon: ShieldAlert, title: 'Emergency Support', desc: 'One-tap SOS with instant warden alerts.' },
  { icon: QrCode, title: 'Digital Gate Pass', desc: 'QR-verified exit and return tracking at the gate.' },
];

export function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500 font-display font-bold text-white">
            H
          </div>
          <span className="font-display text-lg font-semibold text-ink">HOS</span>
        </div>
        <div className="flex gap-3">
          <Link to="/student/login" className="focus-ring rounded-lg px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100">
            Student Login
          </Link>
          <Link to="/warden/login" className="focus-ring rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600">
            Warden Login
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-4xl px-6 py-20 text-center">
        <h1 className="font-display text-4xl font-bold leading-tight text-ink sm:text-5xl">
          Smart Hostel Management, Made Simple
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-lg text-slate-500">
          One platform for students, wardens and hostel operations.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Link to="/student/login" className="focus-ring rounded-lg bg-brand-500 px-6 py-3 text-sm font-semibold text-white hover:bg-brand-600">
            Student Login
          </Link>
          <Link to="/warden/login" className="focus-ring rounded-lg border border-slate-300 px-6 py-3 text-sm font-semibold text-ink hover:bg-slate-50">
            Warden Login
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="rounded-xl border border-slate-200 p-5">
              <span className="inline-flex rounded-lg bg-brand-50 p-2 text-brand-600">
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 font-display font-semibold text-ink">{title}</h3>
              <p className="mt-1 text-sm text-slate-500">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-slate-200 py-8 text-center text-sm text-slate-400">
        © {new Date().getFullYear()} Hostel Operating System — Phase 1 build
      </footer>
    </div>
  );
}
