function AboutPage() {
  return (
    <div className="page-shell">
      <div className="container page-header">
        <div>
          <p className="eyebrow">About</p>
          <h1>How this portal helps</h1>
        </div>
      </div>

      <div className="container about-grid">
        <article className="panel">
          <h2>Purpose</h2>
          <p>
            The Teacher-Student Communication Portal is designed to help faculties and students stay connected, track academic progress, and share important updates in one place.
          </p>
        </article>

        <article className="panel">
          <h2>Key use cases</h2>
          <ul className="feature-list">
            <li>Student profile tracking and academic monitoring</li>
            <li>Announcements for classes and departments</li>
            <li>Quick messaging between teachers and students</li>
            <li>Communication history and activity tracking</li>
          </ul>
        </article>

        <article className="panel">
          <h2>Future-ready design</h2>
          <p>
            This prototype uses a simple local data layer so it can later be connected to Supabase or a real backend without reworking the full interface.
          </p>
        </article>
      </div>
    </div>
  );
}

export default AboutPage;
