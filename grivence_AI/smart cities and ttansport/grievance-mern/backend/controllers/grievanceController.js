const Grievance = require('../models/Grievance');
const axios = require('axios');

// Create a new grievance
exports.createGrievance = async (req, res) => {
  try {
    const { title, description, location, citizenName, citizenEmail, citizenPhone, priority } = req.body;

    // Get the next sequential ID
    const lastGrievance = await Grievance.findOne().sort({ id: -1 });
    const nextId = lastGrievance && lastGrievance.id ? lastGrievance.id + 1 : 1;

    // Call Python AI service to classify
    let classification = {};
    try {
      const aiResponse = await axios.post('http://localhost:5001/classify', {
        description,
        location
      });
      classification = aiResponse.data;
    } catch (error) {
      console.log('AI service unavailable, using defaults');
      classification = { department: 'Administration', urgency: 'Medium', emotion: 'neutral' };
    }

    // Try a location ML service (geocoding / location classifier) if available
    let locationResult = {};
    try {
      const locResp = await axios.post('http://localhost:5001/location', { location });
      locationResult = locResp.data || {};
    } catch (err) {
      // location service unavailable - continue
      locationResult = {};
    }

    const grievance = new Grievance({
      id: nextId,
      title,
      description,
      location,
      locationLat: locationResult.lat,
      locationLng: locationResult.lng,
      locationConfidence: locationResult.confidence,
      department: classification.department || 'Administration',
      urgency: classification.urgency || 'Medium',
      priority: priority || classification.urgency || 'Medium',
      emotion: classification.emotion || 'neutral',
      citizenName,
      citizenEmail,
      citizenPhone,
      status: 'Open'
    });

    await grievance.save();

    res.status(201).json({
      message: 'Grievance submitted successfully',
      grievance,
      trackingId: nextId
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update priority
exports.updatePriority = async (req, res) => {
  try {
    const { priority } = req.body;
    const grievance = await Grievance.findByIdAndUpdate(
      req.params.id,
      { priority, updatedAt: new Date() },
      { new: true }
    );
    if (!grievance) return res.status(404).json({ error: 'Grievance not found' });
    res.json(grievance);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Escalate grievance
exports.escalateGrievance = async (req, res) => {
  try {
    const { level = 1, to = '', reason = '' } = req.body;
    const grievance = await Grievance.findById(req.params.id);
    if (!grievance) return res.status(404).json({ error: 'Grievance not found' });

    grievance.escalation.isEscalated = true;
    grievance.escalation.level = level;
    grievance.escalation.escalatedTo = to;
    grievance.escalation.escalatedAt = new Date();
    grievance.escalation.history.push({ level, to, reason });
    grievance.status = 'Escalated';
    grievance.updatedAt = new Date();

    await grievance.save();
    res.json(grievance);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all grievances (with filters)
exports.getAllGrievances = async (req, res) => {
  try {
    const { status, department, urgency } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (department) filter.department = department;
    if (urgency) filter.urgency = urgency;

    const grievances = await Grievance.find(filter).sort({ createdAt: -1 });
    res.json(grievances);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get grievance by ID
exports.getGrievanceById = async (req, res) => {
  try {
    const grievance = await Grievance.findById(req.params.id);
    if (!grievance) return res.status(404).json({ error: 'Grievance not found' });
    res.json(grievance);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update grievance status
exports.updateGrievanceStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const grievance = await Grievance.findByIdAndUpdate(
      req.params.id,
      { status, updatedAt: new Date() },
      { new: true }
    );
    if (!grievance) return res.status(404).json({ error: 'Grievance not found' });
    res.json(grievance);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add comment to grievance
exports.addComment = async (req, res) => {
  try {
    const { user, text } = req.body;
    const grievance = await Grievance.findByIdAndUpdate(
      req.params.id,
      {
        $push: {
          comments: { user, text, timestamp: new Date() }
        },
        updatedAt: new Date()
      },
      { new: true }
    );
    if (!grievance) return res.status(404).json({ error: 'Grievance not found' });
    res.json(grievance);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Track grievance status
exports.trackGrievance = async (req, res) => {
  try {
    let grievance;
    const searchId = req.params.id;
    
    // Try to find by numeric ID first, then by MongoDB ObjectId
    if (/^\d+$/.test(searchId)) {
      grievance = await Grievance.findOne({ id: parseInt(searchId) });
    } else {
      grievance = await Grievance.findById(searchId);
    }
    
    if (!grievance) return res.status(404).json({ error: 'Grievance not found' });

    res.json({
      id: grievance._id,
      trackingId: grievance.id,
      title: grievance.title,
      status: grievance.status,
      department: grievance.department,
      urgency: grievance.urgency,
      priority: grievance.priority,
      escalation: grievance.escalation,
      createdAt: grievance.createdAt,
      updatedAt: grievance.updatedAt,
      comments: grievance.comments
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
