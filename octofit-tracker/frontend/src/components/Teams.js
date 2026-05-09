import React, { useState, useEffect } from 'react';

function Teams() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getBaseUrl = () => {
    if (process.env.REACT_APP_CODESPACE_NAME) {
      return `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev`;
    }
    return 'http://localhost:8000';
  };

  useEffect(() => {
    const url = `${getBaseUrl()}/api/teams/`;
    console.log('Fetching teams from:', url);
    fetch(url)
      .then(res => res.json())
      .then(data => {
        console.log('Teams data:', data);
        setTeams(Array.isArray(data) ? data : data.results || data.teams || []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching teams:', err);
        setError('Failed to load teams.');
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="container mt-4"><div className="spinner-border" role="status"></div></div>;
  if (error) return <div className="container mt-4"><div className="alert alert-danger">{error}</div></div>;

  return (
    <div className="container mt-4">
      <h2 className="mb-4">👥 Teams</h2>
      {teams.length === 0 ? (
        <div className="alert alert-info">No teams found. Create a team!</div>
      ) : (
        <table className="table table-striped table-bordered">
          <thead className="table-dark">
            <tr><th>#</th><th>Team Name</th><th>Details</th></tr>
          </thead>
          <tbody>
            {teams.map((team, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{team.name || team.team_name || JSON.stringify(team)}</td>
                <td>{team.description || team.members || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Teams;
