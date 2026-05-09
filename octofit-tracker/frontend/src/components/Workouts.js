import React, { useState, useEffect } from 'react';

function Workouts() {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getBaseUrl = () => {
    if (process.env.REACT_APP_CODESPACE_NAME) {
      return `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev`;
    }
    return 'http://localhost:8000';
  };

  useEffect(() => {
    const url = `${getBaseUrl()}/api/workouts/`;
    console.log('Fetching workouts from:', url);
    fetch(url)
      .then(res => res.json())
      .then(data => {
        console.log('Workouts data:', data);
        setWorkouts(Array.isArray(data) ? data : data.results || data.workouts || []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching workouts:', err);
        setError('Failed to load workouts.');
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="container mt-4"><div className="spinner-border" role="status"></div></div>;
  if (error) return <div className="container mt-4"><div className="alert alert-danger">{error}</div></div>;

  return (
    <div className="container mt-4">
      <h2 className="mb-4">💪 Workouts</h2>
      {workouts.length === 0 ? (
        <div className="alert alert-info">No workouts found. Create your first workout!</div>
      ) : (
        <table className="table table-striped table-bordered">
          <thead className="table-dark">
            <tr><th>#</th><th>Workout</th><th>Details</th></tr>
          </thead>
          <tbody>
            {workouts.map((workout, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{workout.name || workout.workout_type || JSON.stringify(workout)}</td>
                <td>{workout.description || workout.duration || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Workouts;
