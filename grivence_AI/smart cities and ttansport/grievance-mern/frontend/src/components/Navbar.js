import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
    window.location.reload();
  };

  return (
    <>
      <header className="header" style={{ position: 'relative' }}>
        <div style={{ position: 'absolute', top: '20px', right: '20px', display: 'flex', gap: '10px' }}>
          {token ? (
            <>
              {userRole !== 'admin' && (
                <Link to="/citizen-dashboard" className="btn btn-secondary" style={{ padding: '8px 16px' }}>
                  My Grievances
                </Link>
              )}
              {userRole === 'admin' && (
                <Link to="/admin" className="btn btn-secondary" style={{ padding: '8px 16px' }}>
                  Admin Panel
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="btn btn-secondary"
                style={{ padding: '8px 16px' }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/admin-login" className="btn btn-secondary" style={{ padding: '8px 16px' }}>Admin Login</Link>
              <Link to="/citizen-login" className="btn btn-secondary" style={{ padding: '8px 16px' }}>Citizen Login</Link>
            </>
          )}
        </div>
        <h1>Smart City Grievance System</h1>
        <p>AI-Powered Grievance Management for Better Governance</p>
      </header>

      <nav className="nav">
        <Link to="/">Home</Link>
        <Link to="/submit">Submit Grievance</Link>
        <Link to="/track">Track Status</Link>
        <Link to="/transparency">Transparency</Link>
        <Link to="/reports">Reports</Link>
        <Link to="/escalations">Escalations</Link>
        <Link to="/departments">Departments</Link>
        <Link to="/ai-insights">AI Insights</Link>
        <Link to="/advanced-analytics">Analytics</Link>
      </nav>
    </>
  );
}

export default Navbar;
