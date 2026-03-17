import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';

// Pages
import Home from './pages/Home';
import SubmitGrievance from './pages/SubmitGrievance';
import TrackGrievance from './pages/TrackGrievance';
import AdminDashboard from './pages/AdminDashboard';
import AdminLogin from './pages/AdminLogin';
import CitizenLogin from './pages/CitizenLogin';
import CitizenRegister from './pages/CitizenRegister';
import { AdminPanel, Analytics, Reports, Transparency, GrievanceDetails } from './pages/index';
import Escalations from './pages/Escalations';
import Departments from './pages/Departments';
import AIInsights from './pages/AIInsights';
import CitizenDashboard from './pages/CitizenDashboard';
import GrievanceComments from './pages/GrievanceComments';
import AdvancedAnalytics from './pages/AdvancedAnalytics';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [userRole, setUserRole] = useState('admin');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('userRole');
    if (token) {
      setIsAuthenticated(true);
      setUserRole(role);
    }
  }, []);

  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/submit" element={<SubmitGrievance />} />
        <Route path="/track" element={<TrackGrievance />} />
        <Route path="/admin-login" element={<AdminLogin setIsAuthenticated={setIsAuthenticated} setUserRole={setUserRole} />} />
        <Route path="/citizen-login" element={<CitizenLogin />} />
        <Route path="/citizen-register" element={<CitizenRegister />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin-panel" element={<AdminPanel />} />
        <Route path="/admin_panel" element={<AdminPanel />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/transparency" element={<Transparency />} />
        <Route path="/escalations" element={<Escalations />} />
        <Route path="/departments" element={<Departments />} />
        <Route path="/ai-insights" element={<AIInsights />} />
        <Route path="/citizen-dashboard" element={<CitizenDashboard />} />
        <Route path="/grievance/:id" element={<GrievanceDetails />} />
        <Route path="/grievance/:id/comments" element={<GrievanceComments />} />
        <Route path="/advanced-analytics" element={<AdvancedAnalytics />} />
      </Routes>
    </Router>
  );
}

export default App;
