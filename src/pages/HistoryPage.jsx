import { getActivities } from '../services/portalService';

function HistoryPage() {
  const activities = getActivities();

  return (
    <div className="page-shell">
      <div className="container page-header">
        <div>
          <p className="eyebrow">Record</p>
          <h1>Communication History</h1>
        </div>
      </div>

      <div className="container">
        <section className="panel history-panel">
          <ul className="activity-list history-list">
            {activities.map((activity) => (
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
      </div>
    </div>
  );
}

export default HistoryPage;
