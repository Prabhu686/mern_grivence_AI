import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/CitizenDashboard.css';

function CitizenDashboard() {
  const [grievances, setGrievances] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const email = localStorage.getItem('userEmail');
    if (!email) {
      navigate('/citizen-login');
      return;
    }
    fetchGrievances(email);
  }, [navigate]);

  const fetchGrievances = async (email) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/grievances/citizen/my-grievances?email=${email}`);
      setGrievances(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching grievances:', error);
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'Open': '#ff9800',
      'In Progress': '#2196f3',
      'Resolved': '#4caf50',
      'Closed': '#9e9e9e',
      'Escalated': '#f44336'
    };
    return colors[status] || '#9e9e9e';
  };

  if (loading) return <div className="citizen-dashboard"><p>Loading your grievances...</p></div>;

  return (
    <div className="citizen-dashboard">
      <h1>My Grievances</h1>
      <p className="subtitle">Track and manage your submitted complaints</p>

      <div className="stats-row">
        <div className="stat-box">
          <div className="stat-value">{grievances.length}</div>
          <div className="stat-label">Total</div>
        </div>
        <div className="stat-box">
          <div className="stat-value">{grievances.filter(g => g.status === 'Open').length}</div>
          <div className="stat-label">Open</div>
        </div>
        <div className="stat-box">
          <div className="stat-value">{grievances.filter(g => g.status === 'In Progress').length}</div>
          <div className="stat-label">In Progress</div>
        </div>
        <div className="stat-box">
          <div className="stat-value">{grievances.filter(g => g.status === 'Resolved').length}</div>
          <div className="stat-label">Resolved</div>
        </div>
      </div>

      <div className="grievances-list">
        {grievances.length === 0 ? (
          <div className="no-grievances">
            <p>You haven't submitted any grievances yet.</p>
            <button onClick={() => navigate('/submit')} className="btn-submit">Submit Your First Grievance</button>
          </div>
        ) : (
          grievances.map(g => (
            <div key={g._id} className="grievance-card">
              <div className="card-header">
                <span className="grievance-id">#{g.id}</span>
                <span className="status-badge" style={{background: getStatusColor(g.status)}}>{g.status}</span>
              </div>
              <h3>{g.title}</h3>
              <div className="card-details">
                <span className="detail-item">Department: {g.department}</span>
                <span className="detail-item">Priority: {g.priority}</span>
                <span className="detail-item">Date: {new Date(g.createdAt).toLocaleDateString()}</span>
              </div>
              <p className="description">{g.description}</p>
              <button onClick={() => navigate(`/grievance/${g._id}/comments`)} className="view-comments-btn">View Comments</button>
              {g.comments && g.comments.length > 0 && (
                <div className="comments-section">
                  <strong>Latest Update:</strong>
                  <p>{g.comments[g.comments.length - 1].text}</p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default CitizenDashboard;
