import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Notifications.css';

function Notifications() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchEscalatedGrievances();
    const interval = setInterval(fetchEscalatedGrievances, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchEscalatedGrievances = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/grievances?status=Escalated');
      setNotifications(response.data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  if (notifications.length === 0) return null;

  return (
    <div className="notifications-container">
      <div className="notification-badge">{notifications.length}</div>
      <div className="notifications-dropdown">
        <h3>Escalated Grievances</h3>
        {notifications.map(notif => (
          <div key={notif._id} className="notification-item">
            <strong>#{notif.id} - {notif.title}</strong>
            <p>Department: {notif.department}</p>
            <p>Level: {notif.escalation.level}</p>
            <small>{new Date(notif.escalation.escalatedAt).toLocaleString()}</small>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Notifications;
