import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { createStudent, getStudentById, updateStudent } from '../services/portalService';

const initialForm = {
  name: '',
  email: '',
  course: '',
  section: '',
  year: 'First Year',
  attendance: 0,
  status: 'On Track',
  advisor: '',
  notes: ''
};

function StudentForm() {
  const navigate = useNavigate();
  const { studentId } = useParams();
  const isEditing = Boolean(studentId);
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!isEditing) {
      return;
    }

    const student = getStudentById(studentId);
    if (!student) {
      setError('Student not found.');
      return;
    }

    setForm({
      name: student.name,
      email: student.email,
      course: student.course,
      section: student.section,
      year: student.year,
      attendance: student.attendance,
      status: student.status,
      advisor: student.advisor,
      notes: student.notes
    });
  }, [isEditing, studentId]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((previous) => ({
      ...previous,
      [name]: name === 'attendance' ? Number(value) : value
    }));
  };

  const validate = () => {
    if (!form.name.trim()) {
      return 'Student name is required.';
    }

    if (!form.email.trim() || !form.email.includes('@')) {
      return 'Enter a valid email address.';
    }

    if (!form.course.trim()) {
      return 'Course name is required.';
    }

    if (!form.section.trim()) {
      return 'Section is required.';
    }

    if (form.attendance < 0 || form.attendance > 100) {
      return 'Attendance must be between 0 and 100.';
    }

    return '';
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const validationError = validate();

    if (validationError) {
      setError(validationError);
      setSuccess('');
      return;
    }

    if (isEditing) {
      updateStudent(studentId, form);
      setSuccess('Student details updated successfully.');
      setError('');
      setTimeout(() => navigate('/students'), 700);
      return;
    }

    createStudent(form);
    setSuccess('Student record added successfully.');
    setError('');
    setTimeout(() => navigate('/students'), 700);
  };

  return (
    <div className="page-shell">
      <div className="container page-header">
        <div>
          <p className="eyebrow">Student profile</p>
          <h1>{isEditing ? 'Edit Student' : 'Add Student'}</h1>
        </div>
        <Link className="secondary-btn" to="/students">Back to roster</Link>
      </div>

      <div className="container form-layout">
        <form className="panel form-panel" onSubmit={handleSubmit}>
          <div className="two-column">
            <label>
              Full name
              <input name="name" value={form.name} onChange={handleChange} placeholder="Enter student name" />
            </label>
            <label>
              Email
              <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="student@campus.edu" />
            </label>
          </div>

          <div className="two-column">
            <label>
              Course
              <input name="course" value={form.course} onChange={handleChange} placeholder="e.g. B.Tech Computer Science" />
            </label>
            <label>
              Section
              <input name="section" value={form.section} onChange={handleChange} placeholder="e.g. CS-2A" />
            </label>
          </div>

          <div className="two-column">
            <label>
              Year
              <select name="year" value={form.year} onChange={handleChange}>
                <option>First Year</option>
                <option>Second Year</option>
                <option>Third Year</option>
                <option>Final Year</option>
              </select>
            </label>
            <label>
              Attendance (%)
              <input name="attendance" type="number" min="0" max="100" value={form.attendance} onChange={handleChange} />
            </label>
          </div>

          <div className="two-column">
            <label>
              Academic status
              <select name="status" value={form.status} onChange={handleChange}>
                <option>On Track</option>
                <option>Needs Attention</option>
              </select>
            </label>
            <label>
              Faculty advisor
              <input name="advisor" value={form.advisor} onChange={handleChange} placeholder="e.g. Dr. Mehta" />
            </label>
          </div>

          <label>
            Notes
            <textarea name="notes" value={form.notes} onChange={handleChange} rows="4" placeholder="Add academic notes or support details..." />
          </label>

          {error && <p className="form-message error">{error}</p>}
          {success && <p className="form-message success">{success}</p>}

          <div className="form-actions">
            <button type="submit" className="primary-btn">{isEditing ? 'Save changes' : 'Create student'}</button>
            <Link className="secondary-btn" to="/students">Cancel</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default StudentForm;
