import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/AIInsights.css';

function AIInsights() {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInsights();
  }, []);

  const fetchInsights = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/grievances/ai/insights`);
      setInsights(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching AI insights:', error);
      setLoading(false);
    }
  };

  if (loading) return <div className="ai-insights-page"><p>Loading AI insights...</p></div>;
  if (!insights) return <div className="ai-insights-page"><p>No AI insights available</p></div>;

  return (
    <div className="ai-insights-page">
      <h1>AI Insights Dashboard</h1>
      <p className="subtitle">Smart analysis of grievances using AI</p>

      <div className="insights-grid">
        <div className="insight-card">
          <h3>Total Analyzed</h3>
          <div className="stat-value">{insights.total}</div>
        </div>

        <div className="insight-card">
          <h3>Avg Impact Score</h3>
          <div className="stat-value">{insights.avgImpactScore}/10</div>
        </div>

        <div className="insight-card priority-card">
          <h3>Priority Distribution</h3>
          <div className="priority-bars">
            {Object.entries(insights.priorityDistribution).map(([priority, count]) => (
              <div key={priority} className="priority-item">
                <span className="priority-label">{priority}</span>
                <div className="priority-bar-bg">
                  <div className={`priority-bar priority-${priority.toLowerCase()}`} style={{width: `${(count/insights.total)*100}%`}}></div>
                </div>
                <span className="priority-count">{count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="insight-card category-card">
          <h3>Category Distribution</h3>
          <div className="category-list">
            {Object.entries(insights.categoryDistribution).map(([category, count]) => (
              <div key={category} className="category-item">
                <span className="category-name">{category}</span>
                <span className="category-count">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="recent-analysis">
        <h2>Recent AI Analysis</h2>
        <div className="analysis-list">
          {insights.recentAnalysis.map(item => (
            <div key={item.id} className="analysis-item">
              <div className="analysis-header">
                <span className="analysis-id">#{item.id}</span>
                <span className={`analysis-priority priority-${item.aiPriority?.toLowerCase()}`}>{item.aiPriority}</span>
                <span className="analysis-impact">Impact: {item.aiImpactScore}/10</span>
              </div>
              <h4>{item.title}</h4>
              <p className="analysis-category">{item.aiCategory}</p>
              <p className="analysis-summary">{item.aiSummary}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AIInsights;
