import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">🏙️ Smart City</Link>
      </div>
      <div className="navbar-links">
        <Link to="/">Home</Link>
        <Link to="/submit">Submit</Link>
        <Link to="/track">Track</Link>
        <Link to="/transparency">Transparency</Link>
        <Link to="/reports">Reports</Link>
        <Link to="/escalations">Escalations</Link>
        <Link to="/departments">Departments</Link>
        <Link to="/ai-insights">AI Insights</Link>
        <Link to="/advanced-analytics">Analytics</Link>
        {userRole === 'admin' && <Link to="/admin">Admin</Link>}
        {token && userRole !== 'admin' && <Link to="/citizen-dashboard">My Grievances</Link>}
      </div>
      <div className="navbar-auth">
        {token ? (
          <button onClick={handleLogout} className="nav-btn logout">Logout</button>
        ) : (
          <>
            <Link to="/citizen-login" className="nav-btn">Citizen Login</Link>
            <Link to="/admin-login" className="nav-btn admin">Admin Login</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
