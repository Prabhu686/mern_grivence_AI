import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Escalations.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const Escalations = () => {
  const [escalations, setEscalations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEscalations();
  }, []);

  const fetchEscalations = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/admin/escalations`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEscalations(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="escalations-page"><p>Loading...</p></div>;

  return (
    <div className="escalations-page">
      <h1>Escalated Grievances</h1>
      <p className="subtitle">High-priority cases requiring immediate attention</p>

      <div className="escalations-grid">
        {escalations.map((g, idx) => (
          <div key={g._id} className="escalation-card">
            <div className="escalation-header">
              <span className="escalation-level">Level {g.escalation.level}</span>
              <span className="escalation-id">#{g.id || idx + 1}</span>
            </div>
            <h3>{g.title}</h3>
            <div className="escalation-details">
              <p><strong>Department:</strong> {g.department}</p>
              <p><strong>Escalated To:</strong> {g.escalation.escalatedTo}</p>
              <p><strong>Priority:</strong> <span className={`badge priority-${g.priority?.toLowerCase()}`}>{g.priority}</span></p>
              <p><strong>Escalated On:</strong> {new Date(g.escalation.escalatedAt).toLocaleDateString()}</p>
            </div>
            {g.escalation.history.length > 0 && (
              <div className="escalation-history">
                <h4>Escalation History</h4>
                {g.escalation.history.map((h, i) => (
                  <div key={i} className="history-item">
                    <span>Level {h.level} → {h.to}</span>
                    <span className="reason">{h.reason}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Escalations;
