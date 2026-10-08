import { useState } from 'react';
import { Link } from 'react-router-dom';
import { createAssignment, getAssignments, getStudents } from '../services/portalService';

const initialForm = {
  title: '',
  course: '',
  description: '',
  dueDate: '',
  audience: 'CS-2A'
};

function AssignmentList({ auth }) {
  const [form, setForm] = useState(initialForm);
  const [refresh, setRefresh] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const assignments = getAssignments();
  const isTeacher = auth?.role === 'teacher';
  const profile = !isTeacher
    ? getStudents().find((student) => student.email === auth?.email)
    : null;
  const visibleAssignments = isTeacher
    ? assignments
    : assignments.filter((assignment) =>
        assignment.studentId === profile?.id ||
        assignment.audience === 'All Students' ||
        assignment.audience === profile?.section
      );

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!form.title.trim() || !form.course.trim() || !form.description.trim() || !form.dueDate) {
      setError('Complete all assignment fields before publishing.');
      setSuccess('');
      return;
    }

    createAssignment(form);
    setForm(initialForm);
    setError('');
    setSuccess('Assignment published and saved.');
    setRefresh((value) => value + 1);
  };

  return (
    <div className="page-shell">
      <div className="container page-header">
        <div>
          <p className="eyebrow">{isTeacher ? 'Coursework management' : 'Your coursework'}</p>
          <h1>Assignments</h1>
        </div>
      </div>

      <div className="container dashboard-grid">
        {isTeacher && (
          <section className="panel form-panel">
            <h2>Create assignment</h2>
            <form onSubmit={handleSubmit} className="stack-form">
              <label>Title<input value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} required /></label>
              <label>Course<input value={form.course} onChange={(event) => setForm({ ...form, course: event.target.value })} required /></label>
              <label>Audience
                <select value={form.audience} onChange={(event) => setForm({ ...form, audience: event.target.value })}>
                  <option>CS-2A</option>
                  <option>All Students</option>
                </select>
              </label>
              <label>Due date<input type="date" value={form.dueDate} onChange={(event) => setForm({ ...form, dueDate: event.target.value })} required /></label>
              <label>Instructions<textarea rows="4" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} required /></label>
              {error && <p className="form-message error">{error}</p>}
              {success && <p className="form-message success">{success}</p>}
              <button className="primary-btn" type="submit">Publish assignment</button>
            </form>
          </section>
        )}

        <section className="panel assignment-panel" aria-live="polite" key={refresh}>
          <div className="panel-header">
            <h2>{isTeacher ? 'Published assignments' : 'Assigned to me'}</h2>
            <span>{visibleAssignments.length} assignments</span>
          </div>
          {visibleAssignments.length ? (
            <ul className="student-work-list">
              {visibleAssignments.map((assignment) => (
                <li key={assignment.id}>
                  <div>
                    <strong>{assignment.title}</strong>
                    <small>{assignment.course} · Due {assignment.dueDate}</small>
                  </div>
                  <Link className="link-btn" to={`/assignments/${assignment.id}`}>Details</Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="student-list-empty">No assignments are available for your class yet.</p>
          )}
        </section>
      </div>
    </div>
  );
}

export default AssignmentList;
