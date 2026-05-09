import React, { useState, useEffect } from 'react';

function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getBaseUrl = () => {
    if (process.env.REACT_APP_CODESPACE_NAME) {
      return `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev`;
    }
    return 'http://localhost:8000';
  };

  useEffect(() => {
    const url = `${getBaseUrl()}/api/leaderboard/`;
    console.log('Fetching leaderboard from:', url);
    fetch(url)
      .then(res => res.json())
      .then(data => {
        console.log('Leaderboard data:', data);
        setLeaderboard(Array.isArray(data) ? data : data.results || data.leaderboard || []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching leaderboard:', err);
        setError('Failed to load leaderboard.');
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="container mt-4"><div className="spinner-border" role="status"></div></div>;
  if (error) return <div className="container mt-4"><div className="alert alert-danger">{error}</div></div>;

  return (
    <div className="container mt-4">
      <h2 className="mb-4">🏆 Leaderboard</h2>
      {leaderboard.length === 0 ? (
        <div className="alert alert-info">No leaderboard entries found. Start competing!</div>
      ) : (
        <table className="table table-striped table-bordered">
          <thead className="table-dark">
            <tr><th>#</th><th>Name</th><th>Details</th></tr>
          </thead>
          <tbody>
            {leaderboard.map((entry, index) => (
              <tr key={index}>
                <td><span className="badge bg-warning">{index + 1}</span></td>
                <td>{entry.name || entry.user_name || JSON.stringify(entry)}</td>
                <td>{entry.score || entry.points || entry.description || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Leaderboard;
