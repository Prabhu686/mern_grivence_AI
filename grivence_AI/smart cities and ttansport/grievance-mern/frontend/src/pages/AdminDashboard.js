import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Notifications from '../components/Notifications';
import '../styles/AdminDashboard.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    total: 0,
    open: 0,
    inProgress: 0,
    resolved: 0,
    critical: 0
  });
  const [grievances, setGrievances] = useState([]);
  const [filteredGrievances, setFilteredGrievances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterDepartment, setFilterDepartment] = useState('All');
  const [selectedGrievance, setSelectedGrievance] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [newPriority, setNewPriority] = useState('');
  const [escalateLevel, setEscalateLevel] = useState(1);
  const [escalateTo, setEscalateTo] = useState('');
  const [escalateReason, setEscalateReason] = useState('');
  const [updateMessage, setUpdateMessage] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/admin-login');
      return;
    }
    fetchDashboardData();
  }, [navigate]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      // Fetch stats
      const statsResponse = await axios.get(`${API_URL}/admin/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(statsResponse.data);

      // Fetch all grievances
      const grievancesResponse = await axios.get(`${API_URL}/grievances`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setGrievances(grievancesResponse.data);
      setFilteredGrievances(grievancesResponse.data);
      setError('');
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    filterGrievances(term, filterStatus, filterDepartment);
  };

  const handleStatusFilter = (status) => {
    setFilterStatus(status);
    filterGrievances(searchTerm, status, filterDepartment);
  };

  const handleDepartmentFilter = (dept) => {
    setFilterDepartment(dept);
    filterGrievances(searchTerm, filterStatus, dept);
  };

  const filterGrievances = (search, status, department) => {
    let filtered = grievances;

    if (status !== 'All') {
      filtered = filtered.filter(g => g.status === status);
    }

    if (department !== 'All') {
      filtered = filtered.filter(g => g.department === department);
    }

    if (search) {
      filtered = filtered.filter(g =>
        g.title.toLowerCase().includes(search) ||
        g.description.toLowerCase().includes(search) ||
        g._id.includes(search)
      );
    }

    setFilteredGrievances(filtered);
  };

  const handleUpdateStatus = async (grievanceId, newStat) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_URL}/grievances/${grievanceId}/status`, 
        { status: newStat },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setUpdateMessage('Status updated successfully!');
      setTimeout(() => setUpdateMessage(''), 3000);
      setSelectedGrievance(null);
      fetchDashboardData();
    } catch (err) {
      setUpdateMessage('Failed to update status');
      console.error(err);
    }
  };

  const StatCard = ({ title, value, color }) => (
    <div className={`stat-card stat-${color}`}>
      <h3>{title}</h3>
      <p className="stat-value">{value}</p>
    </div>
  );

  if (loading) return <div className="admin-dashboard"><p>Loading...</p></div>;

  return (
    <div className="admin-dashboard">
      <Notifications />
      <h1>Admin Dashboard</h1>
      
      {error && <div className="alert alert-error">{error}</div>}
      {updateMessage && <div className="alert alert-success">{updateMessage}</div>}

      {/* Statistics Cards */}
      <div className="stats-grid">
        <StatCard title="Total Grievances" value={stats.total} color="blue" />
        <StatCard title="Open" value={stats.open} color="red" />
        <StatCard title="In Progress" value={stats.inProgress} color="yellow" />
        <StatCard title="Resolved" value={stats.resolved} color="green" />
        <StatCard title="Critical" value={stats.critical} color="orange" />
      </div>

      {/* Grievances Management Section */}
      <div className="grievances-section">
        <h2>Grievance Management</h2>

        {/* Search and Filter */}
        <div className="search-filter">
          <input
            type="text"
            placeholder="Search by title, description, or ID..."
            value={searchTerm}
            onChange={handleSearch}
            className="search-input"
          />
          <div className="filter-buttons">
            {['All', 'Open', 'In Progress', 'Resolved', 'Escalated'].map(status => (
              <button
                key={status}
                className={`filter-btn ${filterStatus === status ? 'active' : ''}`}
                onClick={() => handleStatusFilter(status)}
              >
                {status}
              </button>
            ))}
          </div>
          <div className="department-filter">
            <label>Department:</label>
            <select 
              value={filterDepartment} 
              onChange={(e) => handleDepartmentFilter(e.target.value)}
              className="department-select"
            >
              <option value="All">All Departments</option>
              <option value="Electricity">Electricity</option>
              <option value="Roads & Transport">Roads & Transport</option>
              <option value="Water & Sanitation">Water & Sanitation</option>
              <option value="Public Safety">Public Safety</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Education">Education</option>
              <option value="Environment">Environment</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        {/* Grievances Table */}
        <div className="grievances-table-container">
          <table className="grievances-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Priority</th>
                <th>Title</th>
                <th>Department</th>
                <th>Status</th>
                <th>Urgency</th>
                <th>Escalation</th>
                <th>Submitted</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredGrievances.length > 0 ? (
                filteredGrievances.map(grievance => (
                  <tr key={grievance._id}>
                    <td className="id-cell">#{grievance.id}</td>
                    <td>
                      <span className={`priority-badge priority-${grievance.priority?.toLowerCase()}`}>
                        {grievance.priority}
                      </span>
                    </td>
                    <td className="title-cell">{grievance.title}</td>
                    <td>{grievance.department}</td>
                    <td>
                      <span className={`status-badge status-${grievance.status.replace(' ', '-').toLowerCase()}`}>
                        {grievance.status}
                      </span>
                    </td>
                    <td>
                      <span className={`urgency-badge urgency-${grievance.urgency.toLowerCase()}`}>
                        {grievance.urgency}
                      </span>
                    </td>
                    <td>
                      {grievance.escalation?.isEscalated ? (
                        <span className="badge badge-danger">Escalated (L{grievance.escalation.level})</span>
                      ) : (
                        <span className="badge badge-grey">No</span>
                      )}
                    </td>
                    <td>{new Date(grievance.createdAt).toLocaleDateString()}</td>
                    <td>
                      <button
                        className="action-btn"
                        onClick={() => setSelectedGrievance(grievance)}
                      >
                        Update
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="empty-message">No grievances found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Update Status Modal */}
      {selectedGrievance && (
        <div className="modal-overlay" onClick={() => setSelectedGrievance(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3>Update Grievance Status</h3>
            <div className="modal-body">
              <p><strong>Title:</strong> {selectedGrievance.title}</p>
              <p><strong>Current Status:</strong> {selectedGrievance.status}</p>
              <p><strong>Current Priority:</strong> {selectedGrievance.priority || selectedGrievance.urgency}</p>
              
              <div className="form-group">
                <label>New Status:</label>
                <select 
                  value={newStatus} 
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="form-control"
                >
                  <option value="">Select Status</option>
                  <option value="Open">Open</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Escalated">Escalated</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>
              <div className="form-group">
                <label>Change Priority:</label>
                <select
                  value={newPriority}
                  onChange={(e) => setNewPriority(e.target.value)}
                  className="form-control"
                >
                  <option value="">Select Priority</option>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>
              <hr />
              <h4>Escalate</h4>
              <div className="form-group">
                <label>Level:</label>
                <input
                  type="number"
                  min="1"
                  value={escalateLevel}
                  onChange={(e) => setEscalateLevel(Number(e.target.value))}
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label>To (department/person):</label>
                <input
                  type="text"
                  value={escalateTo}
                  onChange={(e) => setEscalateTo(e.target.value)}
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label>Reason:</label>
                <textarea
                  value={escalateReason}
                  onChange={(e) => setEscalateReason(e.target.value)}
                  className="form-control"
                ></textarea>
              </div>
            </div>
            
            <div className="modal-actions">
              <button 
                className="btn btn-secondary"
                onClick={() => setSelectedGrievance(null)}
              >
                Cancel
              </button>
              <button 
                className="btn btn-primary"
                onClick={() => handleUpdateStatus(selectedGrievance._id, newStatus)}
                disabled={!newStatus}
              >
                Update Status
              </button>
              <button
                className="btn btn-secondary ml-10"
                onClick={async () => {
                  if (!newPriority) return;
                  const token = localStorage.getItem('token');
                  try {
                    await axios.put(`${API_URL}/grievances/${selectedGrievance._id}/priority`,
                      { priority: newPriority },
                      { headers: { Authorization: `Bearer ${token}` } }
                    );
                    setUpdateMessage('Priority updated');
                    setTimeout(() => setUpdateMessage(''), 3000);
                    fetchDashboardData();
                  } catch (err) {
                    setUpdateMessage('Failed to update priority');
                  }
                }}
                disabled={!newPriority}
              >
                Change Priority
              </button>
              <button
                className="btn btn-danger ml-10"
                onClick={async () => {
                  const token = localStorage.getItem('token');
                  try {
                    await axios.post(`${API_URL}/grievances/${selectedGrievance._id}/escalate`,
                      { level: escalateLevel, to: escalateTo, reason: escalateReason },
                      { headers: { Authorization: `Bearer ${token}` } }
                    );
                    setUpdateMessage('Grievance escalated');
                    setTimeout(() => setUpdateMessage(''), 3000);
                    fetchDashboardData();
                    setSelectedGrievance(null);
                  } catch (err) {
                    setUpdateMessage('Failed to escalate');
                  }
                }}
                disabled={!escalateTo}
              >
                Escalate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
