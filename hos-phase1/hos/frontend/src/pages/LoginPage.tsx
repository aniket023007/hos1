import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { FormField } from '../components/FormField';
import { useAuth } from '../context/AuthContext';
import { Role } from '../types';

interface LoginPageProps {
  role: Role;
}

export function LoginPage({ role }: LoginPageProps) {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; form?: string }>({});

  const isStudent = role === 'student';

  function validate() {
    const next: typeof errors = {};
    if (!email.trim()) next.email = 'Email is required.';
    else if (!/^\S+@\S+\.\S+$/.test(email)) next.email = 'Enter a valid email address.';
    if (!password) next.password = 'Password is required.';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    setErrors({});
    try {
      const user = await login(role, email, password);
      navigate(user.role === 'student' ? '/student/dashboard' : '/warden/dashboard', { replace: true });
    } catch (err: any) {
      setErrors({ form: err?.message || 'Login failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-8 shadow-card">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-brand-500 font-display font-bold text-white">
            H
          </div>
          <h1 className="font-display text-xl font-semibold text-ink">
            {isStudent ? 'Student Login' : 'Warden Login'}
          </h1>
          <p className="mt-1 text-sm text-slate-500">Sign in to your HOS account</p>
        </div>

        {errors.form && (
          <div className="mb-4 rounded-lg bg-red-50 px-3.5 py-2.5 text-sm text-red-700">{errors.form}</div>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <FormField
            label={isStudent ? 'Student ID / Email' : 'Warden Email'}
            type="email"
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
          />

          <div className="relative">
            <FormField
              label="Password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="focus-ring absolute right-3 top-[34px] text-slate-400 hover:text-slate-600"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-slate-600">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-slate-300"
              />
              Remember me
            </label>
            <button type="button" className="focus-ring font-medium text-brand-600 hover:underline">
              Forgot password?
            </button>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="focus-ring flex w-full items-center justify-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-600 disabled:opacity-60"
          >
            {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            {isLoading ? 'Signing in…' : 'Login'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          <Link to="/" className="focus-ring font-medium text-brand-600 hover:underline">
            ← Back to home
          </Link>
        </p>
      </div>
    </div>
  );
}
