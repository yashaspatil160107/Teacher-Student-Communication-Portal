import { Link, useParams } from 'react-router-dom';
import { getAssignmentById, getStudents } from '../services/portalService';

function AssignmentDetail({ auth }) {
  const { assignmentId } = useParams();
  const assignment = getAssignmentById(assignmentId);
  const profile = auth?.role === 'teacher'
    ? null
    : getStudents().find((student) => student.email === auth?.email);
  const canView = auth?.role === 'teacher' || (
    assignment && (
      assignment.studentId === profile?.id ||
      assignment.audience === 'All Students' ||
      assignment.audience === profile?.section
    )
  );

  if (!assignment || !canView) {
    return (
      <div className="page-shell">
        <div className="container panel empty-state">
          <h2>Assignment not found</h2>
          <Link className="primary-btn" to="/assignments">Back to assignments</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-shell">
      <div className="container page-header">
        <div>
          <p className="eyebrow">{assignment.course}</p>
          <h1>{assignment.title}</h1>
        </div>
        <Link className="secondary-btn" to="/assignments">Back to assignments</Link>
      </div>
      <section className="container panel assignment-detail">
        <div className="panel-header">
          <h2>Assignment details</h2>
          <time dateTime={assignment.dueDate}>Due {assignment.dueDate}</time>
        </div>
        <p>{assignment.description || 'No additional instructions were provided.'}</p>
        <p className="assignment-audience">For: {assignment.audience || 'Assigned student'}</p>
      </section>
    </div>
  );
}

export default AssignmentDetail;
