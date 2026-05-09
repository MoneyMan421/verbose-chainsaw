import React, { useState, useEffect } from 'react';

function Activities() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getBaseUrl = () => {
    if (process.env.REACT_APP_CODESPACE_NAME) {
      return `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev`;
    }
    return 'http://localhost:8000';
  };

  useEffect(() => {
    const url = `${getBaseUrl()}/api/activities/`;
    console.log('Fetching activities from:', url);
    fetch(url)
      .then(res => res.json())
      .then(data => {
        console.log('Activities data:', data);
        setActivities(Array.isArray(data) ? data : data.results || data.activities || []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching activities:', err);
        setError('Failed to load activities.');
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="container mt-4"><div className="spinner-border" role="status"></div></div>;
  if (error) return <div className="container mt-4"><div className="alert alert-danger">{error}</div></div>;

  return (
    <div className="container mt-4">
      <h2 className="mb-4">🏃 Activities</h2>
      {activities.length === 0 ? (
        <div className="alert alert-info">No activities found. Start logging your workouts!</div>
      ) : (
        <table className="table table-striped table-bordered">
          <thead className="table-dark">
            <tr><th>#</th><th>Activity</th><th>Details</th></tr>
          </thead>
          <tbody>
            {activities.map((activity, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{activity.name || activity.activity_type || JSON.stringify(activity)}</td>
                <td>{activity.description || activity.duration || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Activities;
