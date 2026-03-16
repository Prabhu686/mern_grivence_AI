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
  const [images, setImages] = useState([]);
  const [showMap, setShowMap] = useState(false);
  const [mapCoords, setMapCoords] = useState({ lat: 11.0168, lng: 76.9558 }); // Karpagam College default

  const departmentResolveTime = {
    'Public Safety': '1-6 hours',
    'Healthcare': '1-6 hours',
    'Electricity': '6-12 hours',
    'Water & Sanitation': '12-24 hours',
    'Roads & Transport': '24-48 hours',
    'Environment': '24-48 hours',
    'Education': '48-72 hours',
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
    
    recognitionInstance.continuous = false;
    recognitionInstance.interimResults = false;
    recognitionInstance.lang = 'en-US';

    recognitionInstance.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setFormData(prev => ({
        ...prev,
        description: prev.description ? prev.description + ' ' + transcript : transcript
      }));
    };

    recognitionInstance.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      if (event.error === 'no-speech') {
        setError('No speech detected. Please try again.');
      } else if (event.error === 'not-allowed') {
        setError('Microphone access denied. Please allow microphone access.');
      } else {
        setError('Voice recognition error: ' + event.error);
      }
      setIsRecording(false);
    };

    recognitionInstance.onend = () => {
      setIsRecording(false);
    };

    try {
      recognitionInstance.start();
      setRecognition(recognitionInstance);
      setIsRecording(true);
      setError('');
    } catch (err) {
      setError('Failed to start voice recognition');
      setIsRecording(false);
    }
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
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => formDataToSend.append(key, formData[key]));
      images.forEach(img => formDataToSend.append('images', img));
      
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/grievances`, formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

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
      setImages([]);

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
              <div style={{display: 'flex', gap: '10px', marginTop: '10px'}}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    if (!navigator.geolocation) {
                      setError('Geolocation not supported');
                      return;
                    }
                    setLoading(true);
                    navigator.geolocation.getCurrentPosition(async (pos) => {
                      const lat = pos.coords.latitude;
                      const lng = pos.coords.longitude;
                      setMapCoords({ lat, lng });
                      
                      try {
                        const response = await fetch(
                          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
                          { headers: { 'User-Agent': 'GrievanceApp/1.0' } }
                        );
                        const data = await response.json();
                        
                        let address = '';
                        if (data.address) {
                          const addr = data.address;
                          const parts = [];
                          
                          // Priority: Building/Institution name first
                          const placeName = addr.building || addr.university || addr.college || addr.amenity;
                          if (placeName) {
                            parts.push(placeName);
                          }
                          
                          // Add road/street
                          if (addr.road) {
                            parts.push(addr.road);
                          }
                          
                          // Add locality
                          const locality = addr.neighbourhood || addr.suburb || addr.village;
                          if (locality) {
                            parts.push(locality);
                          }
                          
                          // Add city
                          const city = addr.city || addr.town || addr.municipality;
                          if (city) {
                            parts.push(city);
                          }
                          
                          // Add state and postal
                          if (addr.state) parts.push(addr.state);
                          if (addr.postcode) parts.push(addr.postcode);
                          
                          address = parts.join(', ');
                        }
                        
                        // If no proper address, use display_name or coordinates
                        if (!address || address.length < 10) {
                          address = data.display_name || `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
                        }
                        
                        setFormData(prev => ({ ...prev, location: address }));
                      } catch (err) {
                        setFormData(prev => ({ ...prev, location: `${lat.toFixed(6)}, ${lng.toFixed(6)}` }));
                      }
                      setLoading(false);
                    }, (err) => {
                      setError('Failed to get location');
                      setLoading(false);
                    }, { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 });
                  }}
                >Use My Location</button>
                
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowMap(!showMap)}
                >{showMap ? 'Hide' : 'Show'} Map</button>
              </div>
              
              {showMap && (
                <div style={{marginTop: '15px', border: '2px solid rgba(255,255,255,0.2)', borderRadius: '8px', overflow: 'hidden'}}>
                  <iframe
                    width="100%"
                    height="400"
                    frameBorder="0"
                    style={{border: 0}}
                    src={`https://www.openstreetmap.org/export/embed.html?bbox=${mapCoords.lng-0.01},${mapCoords.lat-0.01},${mapCoords.lng+0.01},${mapCoords.lat+0.01}&layer=mapnik&marker=${mapCoords.lat},${mapCoords.lng}`}
                    allowFullScreen
                  ></iframe>
                  <div style={{padding: '10px', background: 'rgba(255,255,255,0.1)', color: 'white', fontSize: '0.9em'}}>
                    <strong>Current Location:</strong> {mapCoords.lat.toFixed(6)}, {mapCoords.lng.toFixed(6)}
                    <br/>
                    <small>Click "Use GPS" to update your current location on the map</small>
                  </div>
                </div>
              )}
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

            <div className="form-group">
              <label htmlFor="images">Attach Images (Optional)</label>
              <input
                type="file"
                id="images"
                accept="image/*"
                multiple
                onChange={(e) => setImages(Array.from(e.target.files))}
              />
              {images.length > 0 && (
                <div className="image-preview">
                  {images.map((img, idx) => (
                    <span key={idx} className="image-name">{img.name}</span>
                  ))}
                </div>
              )}
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
