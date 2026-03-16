const express = require('express');
const router = express.Router();
const grievanceController = require('../controllers/grievanceController');
const upload = require('../utils/upload');

// Create a new grievance
router.post('/', upload.array('images', 5), grievanceController.createGrievance);

// Get all grievances with filters
router.get('/', grievanceController.getAllGrievances);

// Get grievance by ID
router.get('/:id', grievanceController.getGrievanceById);

// Update grievance status
router.put('/:id/status', grievanceController.updateGrievanceStatus);

// Update priority
router.put('/:id/priority', grievanceController.updatePriority);

// Escalate grievance
router.post('/:id/escalate', grievanceController.escalateGrievance);

// Track grievance
router.get('/:id/track', grievanceController.trackGrievance);

// Add comment to grievance
router.post('/:id/comments', grievanceController.addComment);

// Get AI insights
router.get('/ai/insights', grievanceController.getAIInsights);

// Get citizen's grievances
router.get('/citizen/my-grievances', grievanceController.getCitizenGrievances);

// Get analytics data
router.get('/analytics/data', grievanceController.getAnalyticsData);

module.exports = router;
