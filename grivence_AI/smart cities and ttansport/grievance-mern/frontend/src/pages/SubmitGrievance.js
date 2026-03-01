import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/SubmitGrievance.css';

function SubmitGrievance() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    citizenName: '',
    citizenEmail: '',
    citizenPhone: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [resolveTime, setResolveTime] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recognition, setRecognition] = useState(null);

  const departmentResolveTime = {
    'Water & Sanitation': '24-48 hours',
    'Roads & Transport': '48-72 hours',
    'Electricity': '12-24 hours',
    'Healthcare': '6-12 hours',
    'Education': '72 hours',
    'Public Safety': '2-6 hours',
    'Environment': '48 hours',
    'Administration': '24-48 hours'
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const startVoiceToText = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setError('Voice recognition not supported in this browser. Please use Chrome.');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognitionInstance = new SpeechRecognition();
    
    recognitionInstance.continuous = true;
    recognitionInstance.interimResults = true;
    recognitionInstance.lang = 'en-US';

    recognitionInstance.onresult = (event) => {
      let transcript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      setFormData(prev => ({
        ...prev,
        description: prev.description + ' ' + transcript
      }));
    };

    recognitionInstance.onerror = (event) => {
      setError('Voice recognition error: ' + event.error);
      setIsRecording(false);
    };

    recognitionInstance.onend = () => {
      setIsRecording(false);
    };

    recognitionInstance.start();
    setRecognition(recognitionInstance);
    setIsRecording(true);
  };

  const stopVoiceToText = () => {
    if (recognition) {
      recognition.stop();
      setIsRecording(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const payload = { ...formData };
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/grievances`, payload);

      const dept = response.data.grievance.department;
      const autoPriority = response.data.grievance.priority || response.data.grievance.urgency;
      const time = departmentResolveTime[dept] || '24-48 hours';
      
      setSuccess(`SUCCESS! Your grievance has been submitted.\n\nTracking ID: ${response.data.trackingId}\nDepartment: ${dept}\nAuto-Detected Priority: ${autoPriority}\nExpected Resolution Time: ${time}\n\nNote: Your case will be automatically escalated if not resolved within the expected timeframe.`);
      setResolveTime(time);
      setFormData({
        title: '',
        description: '',
        location: '',
        citizenName: '',
        citizenEmail: '',
        citizenPhone: ''
      });

      setTimeout(() => {
        setSuccess('');
        navigate('/');
      }, 15000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit grievance');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="submit-grievance-page">
      <header className="header">
        <h1 style={{color: 'white', textShadow: '2px 2px 4px rgba(0,0,0,0.8)', WebkitTextStroke: '1px black'}}>Submit Your Grievance</h1>
        <p>Report your issues to the city administration</p>
      </header>

      <main className="container">
        <div className="form-container">
          <form onSubmit={handleSubmit}>
            {error && <div className="alert alert-error">{error}</div>}
            {success && (
              <div className="alert alert-success">
                <div style={{whiteSpace: 'pre-line'}}>{success}</div>
              </div>
            )}

            <div className="form-group">
              <label htmlFor="title">Title *</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Brief title of your grievance"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description *</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Detailed description of the issue or click the microphone to speak"
                required
              ></textarea>
              <div style={{marginTop: '10px'}}>
                {!isRecording ? (
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={startVoiceToText}
                  >
                    🎤 Speak to Text
                  </button>
                ) : (
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={stopVoiceToText}
                    style={{background: '#ff4444', animation: 'pulse 1.5s infinite'}}
                  >
                    ⏹ Stop Recording
                  </button>
                )}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="location">Location *</label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Where is the issue?"
                required
              />
              <button
                type="button"
                className="btn btn-secondary mt-10"
                onClick={() => {
                  if (!navigator.geolocation) return setError('Geolocation not supported');
                  setLoading(true);
                  navigator.geolocation.getCurrentPosition(async (pos) => {
                    const lat = pos.coords.latitude;
                    const lng = pos.coords.longitude;
                    
                    try {
                      // Use reverse geocoding to get address
                      const response = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
                      );
                      const data = await response.json();
                      const address = data.display_name || `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
                      setFormData(prev => ({ ...prev, location: address }));
                    } catch (err) {
                      setFormData(prev => ({ ...prev, location: `${lat.toFixed(6)}, ${lng.toFixed(6)}` }));
                    } finally {
                      setLoading(false);
                    }
                  }, (err) => {
                    setError('Geolocation permission denied');
                    setLoading(false);
                  });
                }}
              >Use my current location</button>
            </div>

            <div className="form-group">
              <label htmlFor="citizenName">Your Name *</label>
              <input
                type="text"
                id="citizenName"
                name="citizenName"
                value={formData.citizenName}
                onChange={handleChange}
                placeholder="Full name"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="citizenEmail">Email *</label>
              <input
                type="email"
                id="citizenEmail"
                name="citizenEmail"
                value={formData.citizenEmail}
                onChange={handleChange}
                placeholder="Your email"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="citizenPhone">Phone *</label>
              <input
                type="tel"
                id="citizenPhone"
                name="citizenPhone"
                value={formData.citizenPhone}
                onChange={handleChange}
                placeholder="Your phone number"
                required
              />
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Grievance'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

export default SubmitGrievance;
