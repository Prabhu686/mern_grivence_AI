import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar, Pie, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import '../styles/Analytics.css';
import '../styles/Reports.css';
import '../styles/Transparency.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const AdminPanel = () => <div className="page"><h1>Admin Panel</h1><p>Admin Panel - to be implemented</p></div>;
const GrievanceDetails = () => <div className="page"><h1>Grievance Details</h1><p>Details - to be implemented</p></div>;

// Analytics Component
const Analytics = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    total: 0,
    open: 0,
    inProgress: 0,
    resolved: 0,
    critical: 0
  });
  const [departmentData, setDepartmentData] = useState([]);
  const [statusDistribution, setStatusDistribution] = useState({});
  const [urgencyDistribution, setUrgencyDistribution] = useState({});

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('Please log in to view analytics');
        setLoading(false);
        return;
      }

      // Fetch stats
      const statsRes = await axios.get(`${API_URL}/admin/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(statsRes.data || {});

      // Fetch department data
      const deptRes = await axios.get(`${API_URL}/admin/by-department`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDepartmentData(deptRes.data || []);

      // Fetch all grievances for status/urgency distribution
      const grievRes = await axios.get(`${API_URL}/grievances`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const statusDist = {};
      const urgencyDist = {};

      if (grievRes.data && Array.isArray(grievRes.data)) {
        grievRes.data.forEach(g => {
          statusDist[g.status] = (statusDist[g.status] || 0) + 1;
          urgencyDist[g.urgency] = (urgencyDist[g.urgency] || 0) + 1;
        });
      }

      setStatusDistribution(statusDist);
      setUrgencyDistribution(urgencyDist);
      setError('');
    } catch (err) {
      console.error('Analytics error:', err);
      setError(err.response?.data?.error || 'Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="analytics-page"><div style={{textAlign: 'center', padding: '40px'}}><p>Loading analytics...</p></div></div>;

  // Department Chart Data
  const deptChartData = {
    labels: departmentData.length > 0 ? departmentData.map(d => d._id) : ['No Data'],
    datasets: [{
      label: 'Grievances by Department',
      data: departmentData.length > 0 ? departmentData.map(d => d.count) : [0],
      backgroundColor: [
        '#667eea',
        '#764ba2',
        '#f093fb',
        '#4facfe',
        '#00f2fe',
        '#43e97b',
        '#fa709a',
        '#30cfd0'
      ],
    }]
  };

  // Status Distribution Chart Data
  const statusChartData = {
    labels: Object.keys(statusDistribution).length > 0 ? Object.keys(statusDistribution) : ['No Data'],
    datasets: [{
      label: 'Grievances by Status',
      data: Object.keys(statusDistribution).length > 0 ? Object.values(statusDistribution) : [0],
      borderColor: '#667eea',
      backgroundColor: 'rgba(102, 126, 234, 0.1)',
      tension: 0.4,
      fill: true,
    }]
  };

  // Urgency Distribution Chart Data
  const urgencyChartData = {
    labels: Object.keys(urgencyDistribution).length > 0 ? Object.keys(urgencyDistribution) : ['No Data'],
    datasets: [{
      label: 'Grievances by Urgency',
      data: Object.keys(urgencyDistribution).length > 0 ? Object.values(urgencyDistribution) : [0],
      backgroundColor: [
        '#43e97b',
        '#38f9d7',
        '#fa709a',
        '#fee140'
      ],
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      tooltip: {
        enabled: true,
      }
    }
  };

  return (
    <div className="analytics-page">
      <h1>Analytics Dashboard</h1>
      {error && <div className="alert alert-error">{error}</div>}

      <div className="stats-overview">
        <div className="stat-box">
          <h3>Total Grievances</h3>
          <p className="stat-number">{stats.total || 0}</p>
        </div>
        <div className="stat-box">
          <h3>Open</h3>
          <p className="stat-number" style={{color: '#ff6b6b'}}>{stats.open || 0}</p>
        </div>
        <div className="stat-box">
          <h3>In Progress</h3>
          <p className="stat-number" style={{color: '#ffa500'}}>{stats.inProgress || 0}</p>
        </div>
        <div className="stat-box">
          <h3>Resolved</h3>
          <p className="stat-number" style={{color: '#51cf66'}}>{stats.resolved || 0}</p>
        </div>
        <div className="stat-box">
          <h3>Critical</h3>
          <p className="stat-number" style={{color: '#ff4757'}}>{stats.critical || 0}</p>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-container">
          <h2>Grievances by Department</h2>
          {departmentData.length > 0 ? (
            <Bar data={deptChartData} options={chartOptions} />
          ) : (
            <p style={{textAlign: 'center', color: '#999', padding: '40px'}}>No department data available</p>
          )}
        </div>

        <div className="chart-container">
          <h2>Grievances by Status</h2>
          {Object.keys(statusDistribution).length > 0 ? (
            <Line data={statusChartData} options={chartOptions} />
          ) : (
            <p style={{textAlign: 'center', color: '#999', padding: '40px'}}>No status data available</p>
          )}
        </div>

        <div className="chart-container">
          <h2>Grievances by Urgency</h2>
          {Object.keys(urgencyDistribution).length > 0 ? (
            <Pie data={urgencyChartData} options={chartOptions} />
          ) : (
            <p style={{textAlign: 'center', color: '#999', padding: '40px'}}>No urgency data available</p>
          )}
        </div>
      </div>
    </div>
  );
};

// Reports Component
const Reports = () => {
  const [loading, setLoading] = useState(false);
  const [grievances, setGrievances] = useState([]);
  const [filters, setFilters] = useState({
    status: 'All',
    department: 'All',
    urgency: 'All',
    startDate: '',
    endDate: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchGrievances();
  }, []);

  const fetchGrievances = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/grievances`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setGrievances(res.data);
      setError('');
    } catch (err) {
      setError('Failed to load grievances');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getFilteredGrievances = () => {
    return grievances.filter(g => {
      if (filters.status !== 'All' && g.status !== filters.status) return false;
      if (filters.department !== 'All' && g.department !== filters.department) return false;
      if (filters.urgency !== 'All' && g.urgency !== filters.urgency) return false;
      if (filters.startDate && new Date(g.createdAt) < new Date(filters.startDate)) return false;
      if (filters.endDate && new Date(g.createdAt) > new Date(filters.endDate)) return false;
      return true;
    });
  };

  const exportToCSV = () => {
    const filtered = getFilteredGrievances();
    const csv = [
      ['ID', 'Title', 'Department', 'Status', 'Urgency', 'Submitted Date', 'Description'],
      ...filtered.map(g => [
        g._id,
        g.title,
        g.department,
        g.status,
        g.urgency,
        new Date(g.createdAt).toLocaleDateString(),
        g.description
      ])
    ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `grievance-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const filteredGrievances = getFilteredGrievances();

  return (
    <div className="reports-page">
      <h1>Grievance Reports</h1>
      {error && <div className="alert alert-error">{error}</div>}

      <div className="filter-section">
        <div className="filter-row">
          <div className="filter-group">
            <label>Status</label>
            <select name="status" value={filters.status} onChange={handleFilterChange}>
              <option>All</option>
              <option>Open</option>
              <option>In Progress</option>
              <option>Resolved</option>
              <option>Escalated</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Department</label>
            <select name="department" value={filters.department} onChange={handleFilterChange}>
              <option>All</option>
              <option>Municipal Corporation</option>
              <option>Water Supply</option>
              <option>Roads</option>
              <option>Electricity</option>
              <option>Sanitation</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Urgency</label>
            <select name="urgency" value={filters.urgency} onChange={handleFilterChange}>
              <option>All</option>
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
              <option>Critical</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Start Date</label>
            <input type="date" name="startDate" value={filters.startDate} onChange={handleFilterChange} />
          </div>

          <div className="filter-group">
            <label>End Date</label>
            <input type="date" name="endDate" value={filters.endDate} onChange={handleFilterChange} />
          </div>

          <button className="export-btn" onClick={exportToCSV}>
            📥 Export to CSV
          </button>
        </div>
      </div>

      <div className="report-info">
        <p>Showing <strong>{filteredGrievances.length}</strong> grievances</p>
      </div>

      <table className="report-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Department</th>
            <th>Status</th>
            <th>Urgency</th>
            <th>Submitted</th>
          </tr>
        </thead>
        <tbody>
          {filteredGrievances.length > 0 ? (
            filteredGrievances.map((g, index) => (
              <tr key={g._id}>
                <td>{index + 1}</td>
                <td>{g.title}</td>
                <td>{g.department}</td>
                <td><span className={`status-badge status-${g.status.replace(' ', '-').toLowerCase()}`}>{g.status}</span></td>
                <td><span className={`urgency-badge urgency-${g.urgency.toLowerCase()}`}>{g.urgency}</span></td>
                <td>{new Date(g.createdAt).toLocaleDateString()}</td>
              </tr>
            ))
          ) : (
            <tr><td colSpan="6" className="empty">No grievances found</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

// Transparency Component
const Transparency = () => {
  const [loading, setLoading] = useState(true);
  const [departmentStats, setDepartmentStats] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDepartmentStats();
  }, []);

  const fetchDepartmentStats = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/admin/by-department`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Fetch all grievances to calculate resolution rates
      const grievRes = await axios.get(`${API_URL}/grievances`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const statsMap = {};
      res.data.forEach(d => {
        statsMap[d._id] = { total: d.count, resolved: 0, pending: 0 };
      });

      grievRes.data.forEach(g => {
        if (!statsMap[g.department]) {
          statsMap[g.department] = { total: 0, resolved: 0, pending: 0 };
        }
        if (g.status === 'Resolved') {
          statsMap[g.department].resolved++;
        } else {
          statsMap[g.department].pending++;
        }
      });

      const enhanced = Object.entries(statsMap).map(([dept, data]) => ({
        department: dept,
        ...data,
        resolutionRate: data.total > 0 ? ((data.resolved / data.total) * 100).toFixed(1) : 0
      })).sort((a, b) => b.resolutionRate - a.resolutionRate);

      setDepartmentStats(enhanced);
      setError('');
    } catch (err) {
      setError('Failed to load transparency data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="transparency-page"><p>Loading...</p></div>;

  return (
    <div className="transparency-page">
      <h1>Transparency Dashboard</h1>
      <p className="subtitle">Department Performance & Accountability</p>
      {error && <div className="alert alert-error">{error}</div>}

      <div className="leaderboard">
        <div className="leaderboard-header">
          <div className="rank-col">Rank</div>
          <div className="dept-col">Department</div>
          <div className="stat-col">Total Grievances</div>
          <div className="stat-col">Resolved</div>
          <div className="stat-col">Pending</div>
          <div className="rate-col">Resolution Rate</div>
        </div>

        {departmentStats.map((dept, idx) => (
          <div key={dept.department} className="leaderboard-row">
            <div className="rank-col">
              <span className={`rank-badge rank-${idx + 1}`}>#{idx + 1}</span>
            </div>
            <div className="dept-col">{dept.department}</div>
            <div className="stat-col">{dept.total}</div>
            <div className="stat-col resolved">{dept.resolved}</div>
            <div className="stat-col pending">{dept.pending}</div>
            <div className="rate-col">
              <div className="rate-bar-container">
                <div className="rate-bar" style={{width: `${dept.resolutionRate}%`}}></div>
              </div>
              <span className="rate-text">{dept.resolutionRate}%</span>
            </div>
          </div>
        ))}
      </div>

      <div className="transparency-info">
        <h3>Legend</h3>
        <p><span className="badge resolved-b">Resolved</span> - Grievances successfully resolved</p>
        <p><span className="badge pending-b">Pending</span> - Grievances awaiting resolution</p>
        <p><span className="badge rate-b">Resolution Rate</span> - Percentage of resolved grievances</p>
      </div>
    </div>
  );
};

export { AdminPanel, Analytics, Reports, Transparency, GrievanceDetails };
