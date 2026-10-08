import { NavLink } from 'react-router-dom';

const baseNavItems = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' }
];

const teacherNavItems = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/students', label: 'Students' },
  { to: '/messages', label: 'Messages' },
  { to: '/announcements', label: 'Announcements' },
  { to: '/assignments', label: 'Assignments' },
  { to: '/history', label: 'History' }
];

const studentNavItems = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/messages', label: 'Messages' },
  { to: '/announcements', label: 'Announcements' },
  { to: '/assignments', label: 'Assignments' }
];

function Navbar({ auth, onLogout }) {
  const authenticatedNavItems = auth.role === 'teacher' ? teacherNavItems : studentNavItems;
  const navItems = auth.isAuthenticated ? [...authenticatedNavItems, ...baseNavItems] : baseNavItems;

  return (
    <header className="site-header">
      <div className="container nav-wrap">
        <NavLink to={auth.isAuthenticated ? '/dashboard' : '/'} className="brand" end>
          <span className="brand-mark">T</span>
          <span>Teacher Student Portal</span>
        </NavLink>

        <nav className="site-nav" aria-label="Main navigation">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/' || item.to === '/dashboard'}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              {item.label}
            </NavLink>
          ))}

          {auth.isAuthenticated ? (
            <div className="user-chip">
              <span className="user-role">{auth.role}</span>
              <span className="user-name">{auth.name}</span>
              <button type="button" className="logout-btn" onClick={onLogout}>Logout</button>
            </div>
          ) : (
            <NavLink to="/login" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              Login
            </NavLink>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
