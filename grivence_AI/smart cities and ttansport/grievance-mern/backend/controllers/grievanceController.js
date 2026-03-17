const Grievance = require('../models/Grievance');
const axios = require('axios');
const { analyzeComplaint } = require('../utils/aiAnalyzer');
const { sendEscalationNotification } = require('../utils/notificationService');
const { detectFakeGrievance } = require('../utils/spamDetector');
const { sendGrievanceSubmittedSMS, sendGrievanceEscalatedSMS, sendGrievanceStatusUpdateSMS } = require('../utils/smsService');

// Create a new grievance
exports.createGrievance = async (req, res) => {
  try {
    const { title, description, location, citizenName, citizenEmail, citizenPhone, priority } = req.body;

    const imagePaths = req.files ? req.files.map(file => file.path) : [];

    // Get the next sequential ID
    const lastGrievance = await Grievance.findOne().sort({ id: -1 });
    const nextId = lastGrievance && lastGrievance.id ? lastGrievance.id + 1 : 1;

    // Call Python ML service to classify
    let classification = {};
    try {
      const aiResponse = await axios.post('http://localhost:5002/classify', {
        title,
        description
      });
      classification = aiResponse.data;
    } catch (error) {
      console.log('ML service unavailable, using defaults');
      classification = { department: 'Administration', priority: 'Medium' };
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
      urgency: classification.priority || 'Medium',
      priority: priority || classification.priority || 'Medium',
      emotion: 'neutral',
      citizenName,
      citizenEmail,
      citizenPhone,
      attachments: imagePaths,
      status: 'Open'
    });

    // AI Analysis - Run smart complaint analyzer
    try {
      const aiAnalysis = analyzeComplaint(title, description, location);
      Object.assign(grievance, aiAnalysis);
      
      // Use AI-detected category as department if more accurate
      if (aiAnalysis.aiCategory && aiAnalysis.aiCategory !== 'Administration') {
        grievance.department = aiAnalysis.aiCategory;
      }
    } catch (aiError) {
      console.log('AI analysis failed, continuing without it:', aiError.message);
    }

    // Spam/Fake Detection
    try {
      const verification = detectFakeGrievance(
        title, 
        description, 
        location, 
        imagePaths, 
        citizenEmail, 
        citizenPhone
      );
      const { status: _ignoreStatus, flags, ...verificationData } = verification;
      Object.assign(grievance, verificationData);
      
      // Log suspicious grievances
      if (!verification.isLegitimate) {
        console.log('⚠️ SUSPICIOUS GRIEVANCE DETECTED:');
        console.log(`ID: ${nextId}`);
        console.log(`Status: ${verification.status}`);
        console.log(`Flags: ${flags ? flags.join(', ') : verification.verificationFlags}`);
      }
    } catch (verifyError) {
      console.log('Verification failed, continuing without it:', verifyError.message);
    }

    await grievance.save();

    // Send SMS notification to citizen
    if (citizenPhone) {
      sendGrievanceSubmittedSMS(citizenPhone, nextId, grievance.department);
    }

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
    
    // Send escalation notifications
    sendEscalationNotification(grievance, { level, to, reason });
    
    // Send SMS to citizen
    if (grievance.citizenPhone) {
      sendGrievanceEscalatedSMS(grievance.citizenPhone, grievance.id, level);
    }
    
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
    
    // Send SMS notification on status change
    if (grievance.citizenPhone) {
      sendGrievanceStatusUpdateSMS(grievance.citizenPhone, grievance.id, status);
    }
    
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

// Get AI insights statistics
exports.getAIInsights = async (req, res) => {
  try {
    const grievances = await Grievance.find({ aiAnalyzedAt: { $exists: true } });
    
    const priorityCount = { Low: 0, Medium: 0, High: 0, Critical: 0 };
    const categoryCount = {};
    let totalImpact = 0;
    
    grievances.forEach(g => {
      if (g.aiPriority) priorityCount[g.aiPriority]++;
      if (g.aiCategory) categoryCount[g.aiCategory] = (categoryCount[g.aiCategory] || 0) + 1;
      if (g.aiImpactScore) totalImpact += g.aiImpactScore;
    });
    
    res.json({
      total: grievances.length,
      priorityDistribution: priorityCount,
      categoryDistribution: categoryCount,
      avgImpactScore: grievances.length ? (totalImpact / grievances.length).toFixed(1) : 0,
      recentAnalysis: grievances.slice(0, 10).map(g => ({
        id: g.id,
        title: g.title,
        aiPriority: g.aiPriority,
        aiCategory: g.aiCategory,
        aiImpactScore: g.aiImpactScore,
        aiSummary: g.aiSummary
      }))
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get citizen's grievances by email
exports.getCitizenGrievances = async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ error: 'Email required' });
    
    const grievances = await Grievance.find({ citizenEmail: email }).sort({ createdAt: -1 });
    res.json(grievances);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get analytics data for charts
exports.getAnalyticsData = async (req, res) => {
  try {
    const grievances = await Grievance.find();
    
    const statusData = {};
    const departmentData = {};
    const priorityData = {};
    const monthlyData = {};
    
    grievances.forEach(g => {
      statusData[g.status] = (statusData[g.status] || 0) + 1;
      departmentData[g.department] = (departmentData[g.department] || 0) + 1;
      priorityData[g.priority] = (priorityData[g.priority] || 0) + 1;
      
      const month = new Date(g.createdAt).toLocaleString('default', { month: 'short' });
      monthlyData[month] = (monthlyData[month] || 0) + 1;
    });
    
    res.json({
      status: Object.entries(statusData).map(([name, value]) => ({ name, value })),
      department: Object.entries(departmentData).map(([name, value]) => ({ name, value })),
      priority: Object.entries(priorityData).map(([name, value]) => ({ name, value })),
      monthly: Object.entries(monthlyData).map(([name, value]) => ({ name, value })),
      total: grievances.length
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
