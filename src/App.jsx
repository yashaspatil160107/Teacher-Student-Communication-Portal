import { useEffect, useMemo, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import Navbar from './components/Navbar';
import Footer from './components/Footer';

import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import StudentList from './pages/StudentList';
import StudentForm from './pages/StudentForm';
import StudentDetail from './pages/StudentDetail';
import MessageList from './pages/MessageList';
import AnnouncementList from './pages/AnnouncementList';
import HistoryPage from './pages/HistoryPage';
import AboutPage from './pages/AboutPage';
import NotFound from './pages/NotFound';
import LoginPage from './pages/LoginPage';
import AssignmentList from './pages/AssignmentList';
import AssignmentDetail from './pages/AssignmentDetail';

import { supabase } from './lib/supabase';

function App() {
  const [auth, setAuth] = useState({
    isAuthenticated: false,
    role: null,
    name: '',
    email: '',
    loading: true
  });

  useEffect(() => {
    let mounted = true;

    const loadProfile = async (session) => {
      if (!session?.user) {
        if (mounted) {
          setAuth({
            isAuthenticated: false,
            role: null,
            name: '',
            email: '',
            loading: false
          });
        }

        return;
      }

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('name, email, role')
        .eq('id', session.user.id)
        .single();

      if (!mounted) return;

      if (error || !profile) {
        setAuth({
          isAuthenticated: false,
          role: null,
          name: '',
          email: '',
          loading: false
        });

        return;
      }

      setAuth({
        isAuthenticated: true,
        role: profile.role,
        name: profile.name,
        email: profile.email,
        loading: false
      });
    };

    const initializeSession = async () => {
      const {
        data: { session }
      } = await supabase.auth.getSession();

      await loadProfile(session);
    };

    initializeSession();

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      loadProfile(session);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const handleLogin = (session) => {
    setAuth({
      ...session,
      isAuthenticated: true,
      loading: false
    });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();

    setAuth({
      isAuthenticated: false,
      role: null,
      name: '',
      email: '',
      loading: false
    });
  };

  const routes = useMemo(
    () => (
      <Routes>
        <Route
          path="/"
          element={<Home auth={auth} onLogout={handleLogout} />}
        />

        <Route
          path="/login"
          element={
            <LoginPage
              auth={auth}
              onLogin={handleLogin}
            />
          }
        />

        <Route
          path="/dashboard"
          element={
            auth.isAuthenticated ? (
              <Dashboard
                auth={auth}
                onLogout={handleLogout}
              />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/students"
          element={
            auth.role === 'teacher' ? (
              <StudentList
                auth={auth}
                onLogout={handleLogout}
              />
            ) : (
              <Navigate to="/dashboard" replace />
            )
          }
        />

        <Route
          path="/students/new"
          element={
            auth.role === 'teacher' ? (
              <StudentForm
                auth={auth}
                onLogout={handleLogout}
              />
            ) : (
              <Navigate to="/dashboard" replace />
            )
          }
        />

        <Route
          path="/students/:studentId"
          element={
            auth.role === 'teacher' ? (
              <StudentDetail
                auth={auth}
                onLogout={handleLogout}
              />
            ) : (
              <Navigate to="/dashboard" replace />
            )
          }
        />

        <Route
          path="/students/:studentId/edit"
          element={
            auth.role === 'teacher' ? (
              <StudentForm
                auth={auth}
                onLogout={handleLogout}
              />
            ) : (
              <Navigate to="/dashboard" replace />
            )
          }
        />

        <Route
          path="/messages"
          element={
            auth.isAuthenticated ? (
              <MessageList
                auth={auth}
                onLogout={handleLogout}
              />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/announcements"
          element={
            auth.isAuthenticated ? (
              <AnnouncementList
                auth={auth}
                onLogout={handleLogout}
              />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/assignments"
          element={
            auth.isAuthenticated ? (
              <AssignmentList auth={auth} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/assignments/:assignmentId"
          element={
            auth.isAuthenticated ? (
              <AssignmentDetail auth={auth} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/history"
          element={
            auth.role === 'teacher' ? (
              <HistoryPage
                auth={auth}
                onLogout={handleLogout}
              />
            ) : (
              <Navigate to="/dashboard" replace />
            )
          }
        />

        <Route
          path="/about"
          element={<AboutPage />}
        />

        <Route
          path="*"
          element={<NotFound />}
        />
      </Routes>
    ),
    [auth]
  );

  if (auth.loading) {
    return (
      <div className="app-loading">
        Loading portal...
      </div>
    );
  }

  return (
    <div className="app-shell">
      <Navbar
        auth={auth}
        onLogout={handleLogout}
      />

      <main className="main-content">
        {routes}
      </main>

      <Footer />
    </div>
  );
}

export default App;