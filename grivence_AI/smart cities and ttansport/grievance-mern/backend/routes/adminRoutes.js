const express = require('express');
const router = express.Router();
const Grievance = require('../models/Grievance');

// Get admin dashboard stats
router.get('/stats', async (req, res) => {
  try {
    const total = await Grievance.countDocuments();
    const open = await Grievance.countDocuments({ status: 'Open' });
    const inProgress = await Grievance.countDocuments({ status: 'In Progress' });
    const resolved = await Grievance.countDocuments({ status: 'Resolved' });
    const critical = await Grievance.countDocuments({ urgency: 'Critical' });

    res.json({
      total,
      open,
      inProgress,
      resolved,
      critical
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get grievances by department
router.get('/by-department', async (req, res) => {
  try {
    const data = await Grievance.aggregate([
      {
        $group: {
          _id: '$department',
          count: { $sum: 1 }
        }
      }
    ]);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get escalations
router.get('/escalations', async (req, res) => {
  try {
    const escalations = await Grievance.find({ status: 'Escalated' })
      .sort({ createdAt: -1 })
      .limit(10);
    res.json(escalations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
