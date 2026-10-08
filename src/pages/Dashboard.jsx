import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getActivities, getAnnouncements, getAssignments, getMessages, getStudents } from '../services/portalService';
import StatCard from '../components/StatCard';
import { mockClasses } from '../data/mockData';

function Dashboard({ auth }) {
  const students = getStudents();
  const announcements = getAnnouncements();
  const assignments = getAssignments();
  const messages = getMessages();
  const activities = getActivities();
  const isTeacher = auth?.role === 'teacher';

  const profile = useMemo(() => {
    if (!isTeacher) {
      return students.find((student) => student.email === auth?.email) || students[0];
    }

    return null;
  }, [auth, isTeacher, students]);

  const studentAssignments = useMemo(
    () => assignments.filter((assignment) =>
      assignment.studentId === profile?.id ||
      assignment.audience === 'All Students' ||
      assignment.audience === profile?.section
    ),
    [assignments, profile]
  );
  const studentClasses = useMemo(
    () => mockClasses.filter((classItem) => classItem.section === profile?.section),
    [profile]
  );
  const studentAnnouncements = announcements.filter((announcement) =>
    announcement.audience === 'All Students' ||
    announcement.audience === profile?.section ||
    announcement.audience === profile?.year
  );
  const studentMessages = messages.filter((message) =>
    message.recipient === profile?.name || message.sender === profile?.name
  );
  const assignmentProgress = studentAssignments.length
    ? Math.round(
        studentAssignments.reduce((total, assignment) => total + assignment.progress, 0) /
          studentAssignments.length
      )
    : 0;
  const upcomingDeadlines = studentAssignments
    .filter((assignment) => assignment.status !== 'Submitted' && assignment.dueDate >= new Date().toISOString().slice(0, 10))
    .sort((first, second) => first.dueDate.localeCompare(second.dueDate));

  const summary = useMemo(() => {
    const totalStudents = students.length;
    const onTrack = students.filter((student) => student.status === 'On Track').length;
    const needsAttention = students.filter((student) => student.status === 'Needs Attention').length;
    const avgAttendance = Math.round(
      students.reduce((sum, student) => sum + student.attendance, 0) / totalStudents
    );
    const unread = messages.filter((message) => message.status === 'Unread').length;

    return { totalStudents, onTrack, needsAttention, avgAttendance, unread };
  }, [students, messages]);

  if (!isTeacher && profile) {
    return (
      <div className="page-shell">
        <div className="container page-header">
          <div>
            <p className="eyebrow">Student view</p>
            <h1>Welcome, {profile.name}</h1>
          </div>
          <Link className="primary-btn" to="/messages">Message teacher</Link>
        </div>

        <div className="container stats-grid">
          <StatCard title="Attendance" value={`${profile.attendance}%`} tone="blue" />
          <StatCard title="Status" value={profile.status} tone="green" />
          <StatCard title="Section" value={profile.section} tone="purple" />
          <StatCard title="Advisor" value={profile.advisor} tone="orange" />
        </div>

        <div className="container dashboard-grid">
          <section className="panel">
            <div className="panel-header">
              <h2>My profile</h2>
            </div>
            <div className="student-profile-box">
              <p><strong>Course:</strong> {profile.course}</p>
              <p><strong>Year:</strong> {profile.year}</p>
              <p><strong>Email:</strong> {profile.email}</p>
              <p><strong>Notes:</strong> {profile.notes}</p>
            </div>
          </section>

          <section className="panel">
            <div className="panel-header">
              <h2>Assignment progress</h2>
              <span>{assignmentProgress}% overall</span>
            </div>
            <div
              className="progress-track"
              role="progressbar"
              aria-label="Overall assignment progress"
              aria-valuemin="0"
              aria-valuemax="100"
              aria-valuenow={assignmentProgress}
            >
              <span style={{ width: `${assignmentProgress}%` }} />
            </div>
            <ul className="student-work-list">
              {studentAssignments.map((assignment) => (
                <li key={assignment.id}>
                  <div>
                    <strong>{assignment.title}</strong>
                    <small>{assignment.course}</small>
                  </div>
                  <span className={`work-status ${assignment.status.toLowerCase().replaceAll(' ', '-')}`}>
                    {assignment.status}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          <section className="panel">
            <div className="panel-header">
              <h2>Upcoming deadlines</h2>
              <span>{upcomingDeadlines.length} due</span>
            </div>
            {upcomingDeadlines.length ? (
              <ul className="student-work-list">
                {upcomingDeadlines.map((assignment) => (
                  <li key={assignment.id}>
                    <div>
                      <strong>{assignment.title}</strong>
                      <small>{assignment.course}</small>
                    </div>
                    <time dateTime={assignment.dueDate}>
                      {new Date(`${assignment.dueDate}T00:00:00`).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric'
                      })}
                    </time>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="student-list-empty">No upcoming deadlines.</p>
            )}
          </section>

          <section className="panel">
            <div className="panel-header">
              <h2>My classes</h2>
              <span>{studentClasses.length} classes</span>
            </div>
            <ul className="student-work-list">
              {studentClasses.map((classItem) => (
                <li key={classItem.id}>
                  <div>
                    <strong>{classItem.name}</strong>
                    <small>{classItem.teacher}</small>
                  </div>
                  <time>{classItem.schedule}</time>
                </li>
              ))}
            </ul>
          </section>

          <section className="panel">
            <div className="panel-header">
              <h2>Announcements</h2>
              <Link to="/announcements">View all</Link>
            </div>
            <ul className="announce-list">
              {studentAnnouncements.slice(0, 3).map((announcement) => (
                <li key={announcement.id}>
                  <strong>{announcement.title}</strong>
                  <p>{announcement.details}</p>
                  <small>{announcement.audience}</small>
                </li>
              ))}
            </ul>
          </section>

          <section className="panel">
            <div className="panel-header">
              <h2>Inbox</h2>
              <span>{studentMessages.length} items</span>
            </div>
            <ul className="message-list compact">
              {studentMessages.slice(0, 4).map((message) => (
                <li key={message.id}>
                  <strong>{message.subject}</strong>
                  <p>{message.preview}</p>
                  <small>{message.status}</small>
                  {message.replies?.map((reply) => <p key={reply.id}><strong>{reply.sender}:</strong> {reply.text}</p>)}
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    );
  }

  return (
    <div className="page-shell">
      <div className="container page-header">
        <div>
          <p className="eyebrow">Teacher overview</p>
          <h1>Academic Dashboard</h1>
        </div>
        <Link className="primary-btn" to="/students/new">Add student</Link>
      </div>

      <div className="container stats-grid">
        <StatCard title="Total students" value={summary.totalStudents} tone="blue" />
        <StatCard title="On track" value={summary.onTrack} tone="green" />
        <StatCard title="Needs attention" value={summary.needsAttention} tone="orange" />
        <StatCard title="Average attendance" value={`${summary.avgAttendance}%`} tone="purple" />
      </div>

      <div className="container dashboard-grid">
        <section className="panel">
          <div className="panel-header">
            <h2>Recent activity</h2>
            <span>{activities.length} updates</span>
          </div>
          <ul className="activity-list">
            {activities.slice(0, 6).map((activity) => (
              <li key={activity.id}>
                <div className="dot" />
                <div>
                  <strong>{activity.type}</strong>
                  <p>{activity.message}</p>
                </div>
                <small>{activity.timestamp}</small>
              </li>
            ))}
          </ul>
        </section>

        <section className="panel">
          <div className="panel-header">
            <h2>Announcements</h2>
            <Link to="/announcements">View all</Link>
          </div>
          <ul className="announce-list">
            {announcements.slice(0, 3).map((announcement) => (
              <li key={announcement.id}>
                <strong>{announcement.title}</strong>
                <p>{announcement.details}</p>
                <small>{announcement.audience}</small>
              </li>
            ))}
          </ul>
        </section>

        <section className="panel">
          <div className="panel-header">
            <h2>Inbox</h2>
            <span>{summary.unread} unread</span>
          </div>
          <ul className="message-list compact">
            {messages.slice(0, 4).map((message) => (
              <li key={message.id}>
                <strong>{message.subject}</strong>
                <p>{message.preview}</p>
                <small>{message.status}</small>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}

export default Dashboard;
