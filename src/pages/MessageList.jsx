import { useState } from 'react';
import { createMessage, getMessages, getStudents, replyToMessage } from '../services/portalService';

function MessageList({ auth }) {
  const [form, setForm] = useState({ subject: '', preview: '' });
  const [replyDrafts, setReplyDrafts] = useState({});
  const [notice, setNotice] = useState('');
  const [refresh, setRefresh] = useState(0);
  const isTeacher = auth?.role === 'teacher';
  const messages = getMessages();
  const students = getStudents();
  const visibleMessages = isTeacher
    ? messages
    : messages.filter((message) =>
        message.sender === auth?.name ||
        message.recipient === auth?.name ||
        (message.sender === 'Teacher' && message.recipient === auth?.name)
      );

  const handleSend = (event) => {
    event.preventDefault();
    if (!form.subject.trim() || !form.preview.trim()) {
      setNotice('Enter a subject and message before sending.');
      return;
    }

    createMessage({
      sender: auth.name,
      recipient: isTeacher ? form.recipient : 'Ms. Rivera',
      subject: form.subject.trim(),
      preview: form.preview.trim(),
      status: 'Unread'
    });
    setForm({ subject: '', preview: '' });
    setNotice('Message sent and saved.');
    setRefresh((value) => value + 1);
  };

  const handleReply = (event, message) => {
    event.preventDefault();
    const text = replyDrafts[message.id]?.trim();
    if (!text) {
      setNotice('Write a reply before sending.');
      return;
    }

    replyToMessage(message.id, { sender: auth.name, text });
    setReplyDrafts((drafts) => ({ ...drafts, [message.id]: '' }));
    setNotice('Reply sent and saved.');
    setRefresh((value) => value + 1);
  };

  return (
    <div className="page-shell">
      <div className="container page-header">
        <div>
          <p className="eyebrow">{isTeacher ? 'Teacher inbox' : 'Student communication'}</p>
          <h1>Messages</h1>
        </div>
      </div>

      <div className="container dashboard-grid" key={refresh}>
        <section className="panel form-panel">
          <h2>{isTeacher ? 'Start a conversation' : 'Message your teacher'}</h2>
          <form onSubmit={handleSend} className="stack-form">
            {isTeacher && (
              <label>
                To
                <select
                  value={form.recipient || ''}
                  onChange={(event) => setForm((current) => ({ ...current, recipient: event.target.value }))}
                  required
                >
                  <option value="" disabled>Select a student</option>
                  {students.map((student) => <option key={student.id}>{student.name}</option>)}
                </select>
              </label>
            )}
            <label>
              Subject
              <input
                value={form.subject}
                onChange={(event) => setForm((current) => ({ ...current, subject: event.target.value }))}
                required
              />
            </label>
            <label>
              Message
              <textarea
                rows="4"
                value={form.preview}
                onChange={(event) => setForm((current) => ({ ...current, preview: event.target.value }))}
                required
              />
            </label>
            {notice && <p className="form-message success" role="status">{notice}</p>}
            <button type="submit" className="primary-btn">Send message</button>
          </form>
        </section>

        <section className="panel">
          <div className="panel-header">
            <h2>{isTeacher ? 'All conversations' : 'My conversations'}</h2>
            <span>{visibleMessages.length} messages</span>
          </div>
          {visibleMessages.length ? (
            <ul className="message-list">
              {visibleMessages.map((message) => (
                <li className="conversation-card" key={message.id}>
                  <div className="conversation-heading">
                    <strong>{message.subject}</strong>
                    <small>{message.status}</small>
                  </div>
                  <p className="conversation-participants">{message.sender} → {message.recipient}</p>
                  <p>{message.preview}</p>
                  {message.replies?.map((reply) => (
                    <div className="conversation-reply" key={reply.id}>
                      <strong>{reply.sender} replied</strong>
                      <p>{reply.text}</p>
                      <small>{reply.timestamp}</small>
                    </div>
                  ))}
                  {isTeacher && (
                    <form className="reply-form" onSubmit={(event) => handleReply(event, message)}>
                      <label>
                        Reply
                        <textarea
                          rows="2"
                          value={replyDrafts[message.id] || ''}
                          onChange={(event) => setReplyDrafts((drafts) => ({ ...drafts, [message.id]: event.target.value }))}
                          placeholder="Write a reply to this student..."
                          required
                        />
                      </label>
                      <button className="secondary-btn" type="submit">Send reply</button>
                    </form>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="student-list-empty">No conversations yet. Send a message to get started.</p>
          )}
        </section>
      </div>
    </div>
  );
}

export default MessageList;
