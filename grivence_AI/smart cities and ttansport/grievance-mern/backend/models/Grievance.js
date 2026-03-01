const mongoose = require('mongoose');

const grievanceSchema = new mongoose.Schema({
  id: { type: Number, unique: true, sparse: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  location: String,
  // Geolocation / location ML results
  locationLat: Number,
  locationLng: Number,
  locationConfidence: Number,
  department: {
    type: String,
    enum: ['Water & Sanitation', 'Roads & Transport', 'Electricity', 'Healthcare', 
           'Education', 'Public Safety', 'Environment', 'Administration'],
    required: true
  },
  status: {
    type: String,
    enum: ['Open', 'In Progress', 'Resolved', 'Closed', 'Escalated'],
    default: 'Open'
  },
  urgency: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Critical'],
    default: 'Medium'
  },
  // Priority can be set by user or the system (mirrors urgency by default)
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Critical'],
    default: 'Medium'
  },
  emotion: {
    type: String,
    enum: ['neutral', 'frustrated', 'angry', 'distress', 'satisfied'],
    default: 'neutral'
  },
  citizenId: mongoose.Schema.Types.ObjectId,
  citizenName: String,
  citizenEmail: String,
  citizenPhone: String,
  attachments: [String],
  aiClassification: String,
  assignedTo: String,
  comments: [
    {
      user: String,
      text: String,
      timestamp: { type: Date, default: Date.now }
    }
  ],
  escalation: {
    isEscalated: { type: Boolean, default: false },
    level: { type: Number, default: 0 },
    escalatedTo: String,
    escalatedAt: Date,
    history: [
      {
        level: Number,
        to: String,
        reason: String,
        timestamp: { type: Date, default: Date.now }
      }
    ]
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Grievance', grievanceSchema);
