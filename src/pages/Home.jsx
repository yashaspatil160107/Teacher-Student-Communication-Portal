import { Link } from 'react-router-dom';
import DyeWhorl from '../components/DyeWhorl';

function Home({ auth }) {
  return (
    <div className="page-shell home-page">
      <DyeWhorl />

      <section className="hero-section container">
        <div className="hero-content">
          <p className="eyebrow">Academic communication hub</p>
          <h1>Bring teachers and students into one clear, connected learning space.</h1>
          <p className="hero-copy">
            Support communication, simplify announcements, monitor student progress, and keep the academic journey organized from one central place.
          </p>

          <div className="hero-actions">
            <Link className="primary-btn" to={auth.isAuthenticated ? '/dashboard' : '/login'}>
              {auth.isAuthenticated ? 'Open dashboard' : 'Go to login'}
            </Link>
            <Link className="secondary-btn" to={auth.isAuthenticated ? '/students' : '/login'}>
              {auth.isAuthenticated ? 'View students' : 'Access portal'}
            </Link>
          </div>
        </div>

        <div className="hero-panel glass-panel">
          <div className="mini-stat">
            <span>Active Students</span>
            <strong>184</strong>
          </div>
          <div className="mini-stat">
            <span>Pending Messages</span>
            <strong>12</strong>
          </div>
          <div className="mini-stat">
            <span>Upcoming Reviews</span>
            <strong>6</strong>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
