import {
  mockActivities,
  mockAnnouncements,
  mockAssignments,
  mockMessages,
  mockStudents
} from '../data/mockData';

const STORAGE_KEY = 'teacher-student-portal-data';

const defaultData = {
  students: mockStudents,
  announcements: mockAnnouncements,
  assignments: mockAssignments,
  messages: mockMessages,
  activities: mockActivities
};

export function loadPortalData() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      return defaultData;
    }

    const parsed = JSON.parse(saved);
    const students = parsed.students || defaultData.students;
    const demoStudent = defaultData.students.find((student) => student.email === 'student@portal.edu');
    return {
      students: demoStudent && !students.some((student) => student.email === demoStudent.email)
        ? [...students, demoStudent]
        : students,
      announcements: parsed.announcements || defaultData.announcements,
      assignments: parsed.assignments || defaultData.assignments,
      messages: parsed.messages || defaultData.messages,
      activities: parsed.activities || defaultData.activities
    };
  } catch (error) {
    console.error('Could not load portal data:', error);
    return defaultData;
  }
}

export function savePortalData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('Could not save portal data:', error);
    return false;
  }
}

export function getStudents() {
  return loadPortalData().students;
}

export function getStudentById(studentId) {
  return getStudents().find((student) => student.id === studentId);
}

export function createStudent(studentData) {
  const data = loadPortalData();
  const newStudent = {
    ...studentData,
    id: studentData.id || `ST-${Date.now()}`,
    status: studentData.status || 'On Track',
    lastSeen: 'Just now'
  };

  data.students = [newStudent, ...data.students];
  data.activities = [
    {
      id: `ACT-${Date.now()}`,
      type: 'Student Added',
      message: `${newStudent.name} was added to the student roster.`,
      timestamp: new Date().toLocaleString()
    },
    ...data.activities
  ];

  savePortalData(data);
  return newStudent;
}

export function updateStudent(studentId, updates) {
  const data = loadPortalData();
  const studentIndex = data.students.findIndex((student) => student.id === studentId);

  if (studentIndex === -1) {
    return null;
  }

  data.students[studentIndex] = {
    ...data.students[studentIndex],
    ...updates,
    id: studentId
  };

  data.activities = [
    {
      id: `ACT-${Date.now()}`,
      type: 'Student Updated',
      message: `${data.students[studentIndex].name}'s profile was updated.`,
      timestamp: new Date().toLocaleString()
    },
    ...data.activities
  ];

  savePortalData(data);
  return data.students[studentIndex];
}

export function deleteStudent(studentId) {
  const data = loadPortalData();
  const studentToDelete = data.students.find((student) => student.id === studentId);

  data.students = data.students.filter((student) => student.id !== studentId);
  data.activities = [
    {
      id: `ACT-${Date.now()}`,
      type: 'Student Removed',
      message: `${studentToDelete?.name || 'A student'} was removed from the roster.`,
      timestamp: new Date().toLocaleString()
    },
    ...data.activities
  ];

  savePortalData(data);
  return true;
}

export function getAnnouncements() {
  return loadPortalData().announcements;
}

export function createAnnouncement(formData) {
  const data = loadPortalData();
  const newAnnouncement = {
    id: formData.id || `ANN-${Date.now()}`,
    title: formData.title,
    details: formData.details,
    audience: formData.audience,
    priority: formData.priority,
    date: formData.date || new Date().toISOString().split('T')[0]
  };

  data.announcements = [newAnnouncement, ...data.announcements];
  data.activities = [
    {
      id: `ACT-${Date.now()}`,
      type: 'Announcement',
      message: `${newAnnouncement.title} was published to ${newAnnouncement.audience}.`,
      timestamp: new Date().toLocaleString()
    },
    ...data.activities
  ];

  savePortalData(data);
  return newAnnouncement;
}

export function getAssignments() {
  return loadPortalData().assignments;
}

export function getAssignmentById(assignmentId) {
  return getAssignments().find((assignment) => assignment.id === assignmentId);
}

export function createAssignment(formData) {
  const data = loadPortalData();
  const newAssignment = {
    id: `ASG-${Date.now()}`,
    title: formData.title.trim(),
    course: formData.course.trim(),
    description: formData.description.trim(),
    dueDate: formData.dueDate,
    audience: formData.audience,
    status: 'Not started',
    progress: 0
  };

  data.assignments = [newAssignment, ...data.assignments];
  data.activities = [
    {
      id: `ACT-${Date.now()}`,
      type: 'Assignment',
      message: `${newAssignment.title} was assigned to ${newAssignment.audience}.`,
      timestamp: new Date().toLocaleString()
    },
    ...data.activities
  ];

  savePortalData(data);
  return newAssignment;
}

export function getMessages() {
  return loadPortalData().messages;
}

export function createMessage(formData) {
  const data = loadPortalData();
  const newMessage = {
    id: formData.id || `MSG-${Date.now()}`,
    sender: formData.sender,
    recipient: formData.recipient,
    subject: formData.subject,
    preview: formData.preview,
    status: formData.status || 'Pending',
    replies: []
  };

  data.messages = [newMessage, ...data.messages];
  data.activities = [
    {
      id: `ACT-${Date.now()}`,
      type: 'Message',
      message: `Message sent to ${newMessage.recipient}: ${newMessage.subject}.`,
      timestamp: new Date().toLocaleString()
    },
    ...data.activities
  ];

  savePortalData(data);
  return newMessage;
}

export function replyToMessage(messageId, replyData) {
  const data = loadPortalData();
  const message = data.messages.find((item) => item.id === messageId);

  if (!message) {
    return null;
  }

  const reply = {
    id: `RPL-${Date.now()}`,
    sender: replyData.sender,
    text: replyData.text.trim(),
    timestamp: new Date().toLocaleString()
  };

  message.replies = [...(message.replies || []), reply];
  message.status = 'Replied';
  data.activities = [
    {
      id: `ACT-${Date.now()}`,
      type: 'Message Reply',
      message: `${reply.sender} replied to "${message.subject}".`,
      timestamp: reply.timestamp
    },
    ...data.activities
  ];
  savePortalData(data);
  return message;
}

export function getActivities() {
  return loadPortalData().activities;
}
