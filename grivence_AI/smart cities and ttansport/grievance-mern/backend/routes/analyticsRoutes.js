const express = require('express');
const router = express.Router();
const Grievance = require('../models/Grievance');

// Get grievance statistics
router.get('/statistics', async (req, res) => {
  try {
    const grievances = await Grievance.find();

    const byStatus = {};
    const byDepartment = {};
    const byUrgency = {};

    grievances.forEach(g => {
      byStatus[g.status] = (byStatus[g.status] || 0) + 1;
      byDepartment[g.department] = (byDepartment[g.department] || 0) + 1;
      byUrgency[g.urgency] = (byUrgency[g.urgency] || 0) + 1;
    });

    res.json({
      byStatus,
      byDepartment,
      byUrgency,
      total: grievances.length
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get hotspots
router.get('/hotspots', async (req, res) => {
  try {
    const hotspots = await Grievance.aggregate([
      {
        $group: {
          _id: '$location',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);
    res.json(hotspots);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get performance metrics
router.get('/performance', async (req, res) => {
  try {
    const resolved = await Grievance.countDocuments({ status: 'Resolved' });
    const total = await Grievance.countDocuments();
    const averageResolutionTime = await Grievance.aggregate([
      {
        $match: { status: 'Resolved' }
      },
      {
        $group: {
          _id: null,
          avgTime: {
            $avg: {
              $subtract: ['$updatedAt', '$createdAt']
            }
          }
        }
      }
    ]);

    res.json({
      resolutionRate: total > 0 ? ((resolved / total) * 100).toFixed(2) + '%' : '0%',
      resolvedCount: resolved,
      totalCount: total,
      averageResolutionTime: averageResolutionTime[0]?.avgTime || 0
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
