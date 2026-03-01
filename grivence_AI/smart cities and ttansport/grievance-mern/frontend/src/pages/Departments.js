import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Departments.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/admin/by-department`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDepartments(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const departmentInfo = {
    'Water & Sanitation': { icon: '', resolveTime: '24-48 hours' },
    'Roads & Transport': { icon: '', resolveTime: '48-72 hours' },
    'Electricity': { icon: '', resolveTime: '12-24 hours' },
    'Healthcare': { icon: '', resolveTime: '6-12 hours' },
    'Education': { icon: '', resolveTime: '72 hours' },
    'Public Safety': { icon: '', resolveTime: '2-6 hours' },
    'Environment': { icon: '', resolveTime: '48 hours' },
    'Administration': { icon: '', resolveTime: '24-48 hours' }
  };

  if (loading) return <div className="departments-page"><p>Loading...</p></div>;

  return (
    <div className="departments-page">
      <h1>Departments Overview</h1>
      <p className="subtitle">Service departments and expected resolution times</p>

      <div className="departments-grid">
        {Object.keys(departmentInfo).map(dept => {
          const stats = departments.find(d => d._id === dept) || { count: 0 };
          const info = departmentInfo[dept];
          
          return (
            <div key={dept} className="department-card">
              <div className="dept-icon">{info.icon}</div>
              <h3>{dept}</h3>
              <div className="dept-stats">
                <div className="stat">
                  <span className="stat-label">Active Grievances</span>
                  <span className="stat-value">{stats.count}</span>
                </div>
                <div className="stat">
                  <span className="stat-label">Expected Resolution</span>
                  <span className="stat-value resolve-time">{info.resolveTime}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Departments;
