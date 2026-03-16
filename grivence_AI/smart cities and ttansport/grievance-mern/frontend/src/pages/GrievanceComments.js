import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/GrievanceComments.css';

function GrievanceComments() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [grievance, setGrievance] = useState(null);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchGrievance();
  }, [id]);

  const fetchGrievance = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/grievances/${id}`);
      setGrievance(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching grievance:', error);
      setLoading(false);
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    const userName = localStorage.getItem('userName') || 'Anonymous';
    
    try {
      setSubmitting(true);
      await axios.post(`${process.env.REACT_APP_API_URL}/grievances/${id}/comments`, {
        user: userName,
        text: comment
      });
      setComment('');
      fetchGrievance();
    } catch (error) {
      console.error('Error adding comment:', error);
      alert('Failed to add comment');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="comments-page"><p>Loading...</p></div>;
  if (!grievance) return <div className="comments-page"><p>Grievance not found</p></div>;

  return (
    <div className="comments-page">
      <button onClick={() => navigate(-1)} className="back-btn">← Back</button>
      
      <div className="grievance-header">
        <h1>#{grievance.id} - {grievance.title}</h1>
        <span className="status-badge">{grievance.status}</span>
      </div>

      <div className="grievance-info">
        <p><strong>Department:</strong> {grievance.department}</p>
        <p><strong>Priority:</strong> {grievance.priority}</p>
        <p><strong>Description:</strong> {grievance.description}</p>
        {grievance.attachments && grievance.attachments.length > 0 && (
          <div className="attachments">
            <strong>Attachments:</strong>
            <div className="image-grid">
              {grievance.attachments.map((img, idx) => (
                <img key={idx} src={`${process.env.REACT_APP_API_URL.replace('/api','')}/${img}`} alt={`Attachment ${idx + 1}`} />
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="comments-section">
        <h2>Updates & Comments ({grievance.comments?.length || 0})</h2>
        
        <form onSubmit={handleSubmitComment} className="comment-form">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Add a comment or update..."
            rows="4"
            disabled={submitting}
          />
          <button type="submit" disabled={submitting || !comment.trim()}>
            {submitting ? 'Posting...' : 'Post Comment'}
          </button>
        </form>

        <div className="comments-list">
          {grievance.comments && grievance.comments.length > 0 ? (
            [...grievance.comments].reverse().map((c, idx) => (
              <div key={idx} className="comment-item">
                <div className="comment-header">
                  <strong>{c.user}</strong>
                  <span className="comment-time">{new Date(c.timestamp).toLocaleString()}</span>
                </div>
                <p>{c.text}</p>
              </div>
            ))
          ) : (
            <p className="no-comments">No comments yet. Be the first to add one!</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default GrievanceComments;
