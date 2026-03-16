import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PieChart, Pie, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell, ResponsiveContainer } from 'recharts';
import '../styles/AdvancedAnalytics.css';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658', '#FF6B9D'];

function AdvancedAnalytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/grievances/analytics/data`);
      setData(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      setLoading(false);
    }
  };

  if (loading) return <div className="analytics-page"><p>Loading analytics...</p></div>;
  if (!data) return <div className="analytics-page"><p>No data available</p></div>;

  return (
    <div className="analytics-page">
      <h1>Advanced Analytics</h1>
      <p className="subtitle">Visual insights and trends from grievance data</p>

      <div className="total-card">
        <h2>Total Grievances</h2>
        <div className="total-value">{data.total}</div>
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <h3>Status Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={data.status} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                {data.status.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3>Department Breakdown</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.department}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="name" stroke="#fff" angle={-45} textAnchor="end" height={100} />
              <YAxis stroke="#fff" />
              <Tooltip contentStyle={{background: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.2)'}} />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3>Priority Levels</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={data.priority} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                {data.priority.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3>Monthly Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data.monthly}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="name" stroke="#fff" />
              <YAxis stroke="#fff" />
              <Tooltip contentStyle={{background: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.2)'}} />
              <Legend />
              <Line type="monotone" dataKey="value" stroke="#82ca9d" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default AdvancedAnalytics;
