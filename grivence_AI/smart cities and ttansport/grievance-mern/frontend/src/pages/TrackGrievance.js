import React, { useState } from 'react';
import axios from 'axios';
import '../styles/TrackGrievance.css';

function TrackGrievance() {
  const [grievanceId, setGrievanceId] = useState('');
  const [grievance, setGrievance] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTrack = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/grievances/${grievanceId}/track`
      );
      setGrievance(response.data);
    } catch (err) {
      setError('Grievance not found or service unavailable');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="track-page">
      <header className="header">
        <h1>Track Your Grievance</h1>
        <p>Check the status of your complaint</p>
      </header>

      <main className="container">
        <div className="track-form">
          <form onSubmit={handleTrack}>
            <div className="form-group">
              <label htmlFor="grievanceId">Grievance ID</label>
              <input
                type="text"
                id="grievanceId"
                value={grievanceId}
                onChange={(e) => setGrievanceId(e.target.value)}
                placeholder="Enter your grievance ID"
              />
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Tracking...' : 'Track Status'}
            </button>
          </form>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        {grievance && (
          <div className="grievance-card">
            <h2>Grievance Details</h2>
            <div className="detail-row">
              <span className="label">Title:</span>
              <span className="value">{grievance.title}</span>
            </div>
            <div className="detail-row">
              <span className="label">Status:</span>
              <span className="value status-badge">{grievance.status}</span>
            </div>
            <div className="detail-row">
              <span className="label">Department:</span>
              <span className="value">{grievance.department}</span>
            </div>
            <div className="detail-row">
              <span className="label">Priority:</span>
              <span className="value urgency-badge">{grievance.priority || grievance.urgency}</span>
            </div>
            <div className="detail-row">
              <span className="label">Escalation:</span>
              <span className="value">{grievance.escalation?.isEscalated ? `Yes (L${grievance.escalation.level})` : 'No'}</span>
            </div>
            <div className="detail-row">
              <span className="label">Submitted:</span>
              <span className="value">{new Date(grievance.createdAt).toLocaleString()}</span>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default TrackGrievance;
