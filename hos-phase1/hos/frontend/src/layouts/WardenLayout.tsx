import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, Users, LogOut, Bell } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { to: '/warden/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/warden/students', label: 'Students', icon: Users },
];

export function WardenLayout() {
  const { user, logout } = useAuth();
  const profile = user?.profile ?? {};

  return (
    <div className="flex min-h-screen bg-slate-950">
      <aside className="hidden w-64 flex-col border-r border-slate-800 bg-slate-950 md:flex">
        <div className="flex items-center gap-2 px-6 py-5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500 font-display font-bold text-white">
            H
          </div>
          <span className="font-display text-lg font-semibold text-white">HOS Admin</span>
        </div>
        <nav className="flex-1 space-y-1 px-3">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `focus-ring flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                  isActive ? 'bg-brand-500/15 text-brand-300' : 'text-slate-400 hover:bg-white/5'
                }`
              }
            >
              <Icon className="h-4 w-4" />
              {label}
            </NavLink>
          ))}
        </nav>
        <button
          onClick={logout}
          className="focus-ring m-3 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-400 hover:bg-white/5"
        >
          <LogOut className="h-4 w-4" />
          Log out
        </button>
      </aside>

      <div className="flex flex-1 flex-col bg-slate-50">
        <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Warden Portal</p>
            <p className="font-display text-lg font-semibold text-ink">{profile.full_name || 'Warden'}</p>
          </div>
          <div className="flex items-center gap-4">
            <button className="focus-ring relative rounded-full p-2 text-slate-500 hover:bg-slate-100">
              <Bell className="h-5 w-5" />
            </button>
            <div className="h-9 w-9 rounded-full bg-brand-100 text-center font-display text-sm font-semibold leading-9 text-brand-700">
              {(profile.full_name || 'W')[0]}
            </div>
          </div>
        </header>
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
