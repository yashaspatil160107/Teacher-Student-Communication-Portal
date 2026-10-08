import { useState } from 'react';
import { createAnnouncement, getAnnouncements, getStudents } from '../services/portalService';

const initialForm = {
  title: '',
  details: '',
  audience: '',
  priority: 'Medium'
};

function AnnouncementList({ auth }) {
  const [refresh, setRefresh] = useState(0);
  const announcements = getAnnouncements();
  const isTeacher = auth?.role === 'teacher';
  const profile = isTeacher ? null : getStudents().find((student) => student.email === auth?.email);
  const visibleAnnouncements = isTeacher
    ? announcements
    : announcements.filter((announcement) =>
        announcement.audience === 'All Students' ||
        announcement.audience === profile?.section ||
        announcement.audience === profile?.year
      );
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!form.title.trim() || !form.details.trim() || !form.audience.trim()) {
      setError('Title, details, and audience are required.');
      setSuccess('');
      return;
    }

    createAnnouncement(form);
    setSuccess('Announcement published successfully.');
    setError('');
    setForm(initialForm);
    setRefresh((value) => value + 1);
  };

  return (
    <div className="page-shell">
      <div className="container page-header">
        <div>
          <p className="eyebrow">Campus updates</p>
          <h1>Announcements</h1>
        </div>
      </div>

      <div className="container dashboard-grid" key={refresh}>
        {isTeacher && <section className="panel form-panel">
          <h2>Create announcement</h2>
          <form onSubmit={handleSubmit} className="stack-form">
            <label>
              Title
              <input name="title" value={form.title} onChange={handleChange} placeholder="Announcement title" />
            </label>
            <label>
              Audience
              <input name="audience" value={form.audience} onChange={handleChange} placeholder="All Students or CS-2A" />
            </label>
            <label>
              Priority
              <select name="priority" value={form.priority} onChange={handleChange}>
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
            </label>
            <label>
              Details
              <textarea name="details" rows="5" value={form.details} onChange={handleChange} placeholder="Share important academic information..." />
            </label>

            {error && <p className="form-message error">{error}</p>}
            {success && <p className="form-message success">{success}</p>}

            <button type="submit" className="primary-btn">Publish</button>
          </form>
        </section>}

        <section className="panel">
          <div className="panel-header">
            <h2>{isTeacher ? 'Published notices' : 'Notices for you'}</h2>
          </div>
          <ul className="announce-list">
            {visibleAnnouncements.map((announcement) => (
              <li key={announcement.id}>
                <strong>{announcement.title}</strong>
                <p>{announcement.details}</p>
                <small>{announcement.audience}</small>
                <span className={`priority-tag ${announcement.priority.toLowerCase()}`}>
                  {announcement.priority}
                </span>
              </li>
            ))}
          </ul>
          {!visibleAnnouncements.length && <p className="student-list-empty">No announcements are available for your class.</p>}
        </section>
      </div>
    </div>
  );
}

export default AnnouncementList;
