import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

function LoginPage({ auth, onLogin }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '', role: 'teacher' });
  const [error, setError] = useState('');

  if (auth.isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
  event.preventDefault();
  setError('');

  const email = form.email.trim().toLowerCase();
  const password = form.password;

  try {
    // 1. Authenticate with Supabase
    const { data, error: loginError } =
      await supabase.auth.signInWithPassword({
        email,
        password
      });

    if (loginError) {
      setError('Invalid email or password.');
      return;
    }

    if (!data.user) {
      setError('Login failed. Please try again.');
      return;
    }

    // 2. Get the user's profile and role
    const { data: profile, error: profileError } =
      await supabase
        .from('profiles')
        .select('name, email, role')
        .eq('id', data.user.id)
        .single();

    if (profileError || !profile) {
      await supabase.auth.signOut();
      setError('Your account profile could not be found.');
      return;
    }

    // 3. Make sure the selected role matches the database role
    if (profile.role !== form.role) {
      await supabase.auth.signOut();
      setError(`This account is registered as a ${profile.role}.`);
      return;
    }

    // 4. Tell the React app that login succeeded
    onLogin({
      isAuthenticated: true,
      role: profile.role,
      name: profile.name,
      email: profile.email
    });

    navigate('/dashboard');
  } catch (error) {
    console.error('Login error:', error);
    setError('Something went wrong. Please try again.');
  }
};

  return (
    <div className="page-shell auth-page">
      <div className="container auth-layout">
        <section className="auth-panel glass-panel">
          <p className="eyebrow">Welcome back</p>
          <h1>Access the academic portal</h1>
          <p className="auth-copy">
            Sign in as a teacher or student to view updates, communicate with classmates, and manage academic progress.
          </p>

          <div className="role-pills" aria-label="Select account type">
  {['teacher', 'student'].map((role) => (
    <button
      key={role}
      type="button"
      className={`role-pill ${form.role === role ? 'selected' : ''}`}
      onClick={() => setForm((current) => ({ ...current, role }))}
    >
      {role === 'teacher' ? 'Teacher access' : 'Student access'}
    </button>
  ))}
</div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <label>
              <span>Email</span>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder={form.role === 'teacher' ? 'teacher@portal.edu' : 'student@portal.edu'}
                required
              />
            </label>

            <label>
              <span>Password</span>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder={form.role === 'teacher' ? 'admin123' : 'student123'}
                required
              />
            </label>

            {error && <div className="form-error">{error}</div>}

            <button type="submit" className="primary-btn auth-submit">
              Sign in
            </button>
          </form>
        </section>

        <aside className="credential-panel glass-panel">
          <h2>Demo credentials</h2>
          <div className="credential-list">
            <div>
              <span className="credential-label">Teacher</span>
              <strong>teacher@portal.edu</strong>
              <small>Password: admin123</small>
            </div>
            <div>
              <span className="credential-label">Student</span>
              <strong>student@portal.edu</strong>
              <small>Password: student123</small>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default LoginPage;
