export const mockStudents = [
  {
    id: 'ST-100',
    name: 'Aarav Sharma',
    email: 'student@portal.edu',
    course: 'B.Tech. Computer Science',
    section: 'CS-2A',
    year: 'Second Year',
    attendance: 91,
    status: 'On Track',
    advisor: 'Ms. Rivera',
    lastSeen: 'Today',
    notes: 'Strong participation in coding labs and active in classroom discussions.'
  },
  {
    id: 'ST-101',
    name: 'Aanya Sharma',
    email: 'aanya.sharma@campus.edu',
    course: 'B.Sc. Computer Science',
    section: 'CS-2A',
    year: 'Second Year',
    attendance: 92,
    status: 'On Track',
    advisor: 'Dr. Mehta',
    lastSeen: 'Today',
    notes: 'Interested in machine learning projects and asks for extra lab practice.'
  },
  {
    id: 'ST-102',
    name: 'Rahul Verma',
    email: 'rahul.verma@campus.edu',
    course: 'B.Tech. Information Technology',
    section: 'IT-1B',
    year: 'First Year',
    attendance: 76,
    status: 'Needs Attention',
    advisor: 'Prof. Nair',
    lastSeen: '2 days ago',
    notes: 'Missed two assignments and needs a mentor follow-up.'
  },
  {
    id: 'ST-103',
    name: 'Meera Iyer',
    email: 'meera.iyer@campus.edu',
    course: 'B.Com. Business Analytics',
    section: 'BA-3C',
    year: 'Third Year',
    attendance: 88,
    status: 'On Track',
    advisor: 'Dr. Sethi',
    lastSeen: 'Yesterday',
    notes: 'Strong participation in presentations; may need internship guidance.'
  },
  {
    id: 'ST-104',
    name: 'Dev Patel',
    email: 'dev.patel@campus.edu',
    course: 'B.E. Mechanical',
    section: 'ME-4A',
    year: 'Final Year',
    attendance: 70,
    status: 'Needs Attention',
    advisor: 'Prof. Shah',
    lastSeen: '4 days ago',
    notes: 'Has not submitted final design portfolio and needs deadline review.'
  }
];

export const mockAnnouncements = [
  {
    id: 'ANN-201',
    title: 'Mid-Semester Feedback Week',
    details: 'Faculty will conduct one-to-one feedback sessions for all students next week. Please book a slot through the academic portal.',
    audience: 'All Students',
    priority: 'High',
    date: '2026-10-08'
  },
  {
    id: 'ANN-202',
    title: 'Lab Submission Deadline',
    details: 'The database practical assignment must be uploaded before Friday 5:00 PM. Late submissions will be marked as partial credit.',
    audience: 'CS-2A',
    priority: 'Medium',
    date: '2026-10-06'
  },
  {
    id: 'ANN-203',
    title: 'Career Workshop',
    details: 'A workshop on resume writing and interview preparation is scheduled in the seminar hall on Saturday morning.',
    audience: 'Final Year Students',
    priority: 'Low',
    date: '2026-10-04'
  }
];

export const mockMessages = [
  {
    id: 'MSG-301',
    sender: 'Teacher',
    recipient: 'Aanya Sharma',
    subject: 'Project review request',
    preview: 'Please bring your final ML project draft for a quick review this Thursday.',
    status: 'Unread'
  },
  {
    id: 'MSG-302',
    sender: 'Rahul Verma',
    recipient: 'Teacher',
    subject: 'Assignment clarification',
    preview: 'I missed the deadline due to a health issue. Could I submit the assignment by Monday?',
    status: 'Pending'
  },
  {
    id: 'MSG-303',
    sender: 'Teacher',
    recipient: 'Meera Iyer',
    subject: 'Presentation feedback',
    preview: 'Your presentation was excellent. Please work on adding more data insights in the conclusion.',
    status: 'Replied'
  }
];

export const mockAssignments = [
  {
    id: 'ASG-501',
    studentId: 'ST-100',
    title: 'Database practical',
    course: 'Database Systems',
    dueDate: '2026-10-12',
    status: 'In progress',
    progress: 65
  },
  {
    id: 'ASG-502',
    studentId: 'ST-100',
    title: 'Data structures problem set',
    course: 'Data Structures',
    dueDate: '2026-10-15',
    status: 'Not started',
    progress: 0
  },
  {
    id: 'ASG-503',
    studentId: 'ST-100',
    title: 'Web development lab',
    course: 'Web Technologies',
    dueDate: '2026-10-06',
    status: 'Submitted',
    progress: 100
  }
];

export const mockClasses = [
  {
    id: 'CLS-601',
    section: 'CS-2A',
    name: 'Database Systems',
    teacher: 'Ms. Rivera',
    schedule: 'Mon · 10:00 AM'
  },
  {
    id: 'CLS-602',
    section: 'CS-2A',
    name: 'Data Structures',
    teacher: 'Mr. Kulkarni',
    schedule: 'Tue · 11:30 AM'
  },
  {
    id: 'CLS-603',
    section: 'CS-2A',
    name: 'Web Technologies',
    teacher: 'Dr. Banerjee',
    schedule: 'Thu · 9:00 AM'
  }
];

export const mockActivities = [
  {
    id: 'ACT-401',
    type: 'Announcement',
    message: 'Mid-semester feedback week announced for all classes.',
    timestamp: '2026-10-08 09:30'
  },
  {
    id: 'ACT-402',
    type: 'Message',
    message: 'Rahul requested a deadline extension for lab work.',
    timestamp: '2026-10-07 15:45'
  },
  {
    id: 'ACT-403',
    type: 'Student Update',
    message: 'Aanya improved attendance from 87% to 92%.',
    timestamp: '2026-10-06 11:00'
  },
  {
    id: 'ACT-404',
    type: 'Review',
    message: 'Portfolio review schedule posted for final-year students.',
    timestamp: '2026-10-05 17:10'
  }
];
