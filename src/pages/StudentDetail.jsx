import { Link, useNavigate, useParams } from 'react-router-dom';
import StatusBadge from '../components/StatusBadge';
import { deleteStudent, getStudentById } from '../services/portalService';

function StudentDetail() {
  const navigate = useNavigate();
  const { studentId } = useParams();
  const student = getStudentById(studentId);

  if (!student) {
    return (
      <div className="page-shell">
        <div className="container panel empty-state">
          <h2>Student not found</h2>
          <p>The requested student profile does not exist in the current roster.</p>
          <Link className="primary-btn" to="/students">Back to roster</Link>
        </div>
      </div>
    );
  }

  const handleDelete = () => {
    deleteStudent(student.id);
    navigate('/students');
  };

  return (
    <div className="page-shell">
      <div className="container page-header">
        <div>
          <p className="eyebrow">Student profile</p>
          <h1>{student.name}</h1>
        </div>
        <div className="inline-actions">
          <Link className="secondary-btn" to="/students">Go back</Link>
          <Link className="primary-btn" to={`/students/${student.id}/edit`}>Edit profile</Link>
        </div>
      </div>

      <div className="container detail-grid">
        <section className="panel detail-panel">
          <div className="detail-top">
            <span className="student-id">{student.id}</span>
            <StatusBadge status={student.status} />
          </div>

          <div className="detail-list">
            <div>
              <label>Email</label>
              <p>{student.email}</p>
            </div>
            <div>
              <label>Course</label>
              <p>{student.course}</p>
            </div>
            <div>
              <label>Section</label>
              <p>{student.section}</p>
            </div>
            <div>
              <label>Year</label>
              <p>{student.year}</p>
            </div>
            <div>
              <label>Attendance</label>
              <p>{student.attendance}%</p>
            </div>
            <div>
              <label>Advisor</label>
              <p>{student.advisor}</p>
            </div>
          </div>
        </section>

        <aside className="panel notes-panel">
          <h2>Academic notes</h2>
          <p>{student.notes}</p>
          <button type="button" className="danger-btn" onClick={handleDelete}>Delete student</button>
        </aside>
      </div>
    </div>
  );
}

export default StudentDetail;
