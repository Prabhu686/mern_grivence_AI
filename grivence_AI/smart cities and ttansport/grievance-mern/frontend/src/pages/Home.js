import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Home.css';

function Home() {
  return (
    <div className="home-page">
      <header className="header" style={{position: 'relative'}}>
        <div style={{position: 'absolute', top: '20px', right: '20px', display: 'flex', gap: '10px'}}>
          {localStorage.getItem('token') ? (
            <button 
              onClick={() => {
                localStorage.clear();
                window.location.href = '/';
              }}
              className="btn btn-secondary"
              style={{padding: '8px 16px'}}
            >
              Logout
            </button>
          ) : (
            <>
              <Link to="/admin-login" className="btn btn-secondary" style={{padding: '8px 16px'}}>Admin Login</Link>
              <Link to="/citizen-login" className="btn btn-secondary" style={{padding: '8px 16px'}}>Citizen Login</Link>
            </>
          )}
        </div>
        <h1>Smart City Grievance System</h1>
        <p>AI-Powered Grievance Management for Better Governance</p>
      </header>

      <nav className="nav">
        <Link to="/submit">Submit Grievance</Link>
        <Link to="/track">Track Status</Link>
        <Link to="/transparency">Transparency</Link>
        <Link to="/reports">Reports</Link>
        <Link to="/escalations">Escalations</Link>
        <Link to="/departments">Departments</Link>
        <Link to="/ai-insights">AI Insights</Link>
        <Link to="/advanced-analytics">Analytics</Link>
      </nav>

      <main className="container">
        <div className="main-content">
          <section className="form-section">
            <h2 style={{color: '#ffffff'}}>Submit Your Grievance</h2>
            <p className="subtitle">
              Have a complaint about city services? Report it here and <span style={{color: '#ffffff'}}>our AI system</span> will prioritize it for quick resolution.
            </p>
            <Link to="/submit" className="btn btn-primary">Submit New Grievance</Link>
          </section>
        </div>

        <section className="features-section">
          <h2 style={{color: '#ffffff'}}>Why Use Our System?</h2>
          <div className="features-grid">
            <div className="feature">
              <h3>AI-Powered Classification</h3>
              <p>Our advanced artificial intelligence automatically categorizes and routes your grievance to the right department, ensuring faster response times and accurate handling of your complaint.</p>
            </div>
            <div className="feature">
              <h3>Fast Resolution</h3>
              <p>Priority-based system ensures critical issues are handled first. Our smart escalation mechanism automatically flags urgent complaints for immediate attention from senior officials.</p>
            </div>
            <div className="feature">
              <h3>Complete Transparency</h3>
              <p>Track your grievance in real-time with detailed status updates. Access public performance metrics of all departments and see how your city is improving through data-driven governance.</p>
            </div>
            <div className="feature">
              <h3>Instant Notifications</h3>
              <p>Stay informed with instant updates on your grievance status via email and SMS. Receive notifications when your complaint is assigned, in progress, or resolved by the concerned department.</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Home;
