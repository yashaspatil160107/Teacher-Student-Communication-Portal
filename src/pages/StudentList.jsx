import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import StatusBadge from '../components/StatusBadge';

function StudentList() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    async function fetchStudents() {
      setLoading(true);
      setError('');

      try {
        const { data, error: fetchError } = await supabase
          .from('students')
          .select('*')
          .order('student_id');

        if (fetchError) {
          throw fetchError;
        }

        if (active) {
          const mappedStudents = (data || []).map((student) => ({
            ...student,
            section: student.class_section,
          }));

          setStudents(mappedStudents);
        }
      } catch (err) {
        console.error('Could not fetch students:', err);

        if (active) {
          setError(
            'Could not load students. Please check your connection and permissions.'
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    fetchStudents();

    return () => {
      active = false;
    };
  }, []);

  const filteredStudents = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return students;
    }

    return students.filter((student) => {
      const values = [
  student.id,
  student.student_id,
  student.name,
  student.course,
  student.section,
  student.status,
  student.email,
];

      return values.some((value) =>
        String(value ?? '').toLowerCase().includes(query)
      );
    });
  }, [students, search]);

  const handleDelete = () => {
    setError(
      'Delete is temporarily unavailable while database permissions are configured.'
    );
  };

  return (
    <div className="page-shell">
      <div className="container page-header">
        <div>
          <p className="eyebrow">All students</p>
          <h1>Student Roster</h1>
        </div>

        <Link className="primary-btn" to="/students/new">
          Add student
        </Link>
      </div>

      <div className="container panel search-panel">
        <label htmlFor="studentSearch">Search students</label>
        <input
          id="studentSearch"
          type="text"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Name, course, section, status..."
        />
      </div>

      <div className="container">
        {loading ? (
          <div className="empty-state panel">
            <p>Loading students...</p>
          </div>
        ) : error ? (
          <div className="empty-state panel" role="alert">
            <h3>Unable to complete the request</h3>
            <p>{error}</p>
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="empty-state panel">
            <h3>No student records found</h3>
            <p>Try a different keyword or add a new student.</p>
          </div>
        ) : (
          <div className="card-grid">
            {filteredStudents.map((student) => (
              <article key={student.id} className="student-card panel">
                <div className="card-top">
                  <div>
                    <span className="student-id">{student.id}</span>
                    <h3>{student.name}</h3>
                  </div>

                  <StatusBadge status={student.status} />
                </div>

                <div className="student-meta">
                  <p>{student.course}</p>
                  <p>{student.section}</p>
                  <p>{student.year}</p>
                </div>

                <div className="card-actions">
                  <Link
                    className="secondary-btn"
                    to={`/students/${student.id}`}
                  >
                    View profile
                  </Link>

                  <Link
                    className="link-btn"
                    to={`/students/${student.id}/edit`}
                  >
                    Edit
                  </Link>

                  <button
                    type="button"
                    className="danger-btn"
                    onClick={handleDelete}
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default StudentList;