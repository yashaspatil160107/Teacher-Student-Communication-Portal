import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div className="page-shell">
      <div className="container panel empty-state not-found">
        <h1>404</h1>
        <h2>Page not found</h2>
        <p>The route you are looking for does not exist.</p>
        <Link className="primary-btn" to="/">Return home</Link>
      </div>
    </div>
  );
}

export default NotFound;
