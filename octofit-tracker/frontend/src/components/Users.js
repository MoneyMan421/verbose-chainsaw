import React, { useState, useEffect } from 'react';

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getBaseUrl = () => {
    if (process.env.REACT_APP_CODESPACE_NAME) {
      return `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev`;
    }
    return 'http://localhost:8000';
  };

  useEffect(() => {
    const url = `${getBaseUrl()}/api/users/`;
    console.log('Fetching users from:', url);
    fetch(url)
      .then(res => res.json())
      .then(data => {
        console.log('Users data:', data);
        setUsers(Array.isArray(data) ? data : data.results || data.users || []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching users:', err);
        setError('Failed to load users.');
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="container mt-4"><div className="spinner-border" role="status"></div></div>;
  if (error) return <div className="container mt-4"><div className="alert alert-danger">{error}</div></div>;

  return (
    <div className="container mt-4">
      <h2 className="mb-4">👤 Users</h2>
      {users.length === 0 ? (
        <div className="alert alert-info">No users found. Register to get started!</div>
      ) : (
        <table className="table table-striped table-bordered">
          <thead className="table-dark">
            <tr><th>#</th><th>User Name</th><th>Details</th></tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{user.name || user.user_name || user.username || JSON.stringify(user)}</td>
                <td>{user.email || user.description || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Users;
