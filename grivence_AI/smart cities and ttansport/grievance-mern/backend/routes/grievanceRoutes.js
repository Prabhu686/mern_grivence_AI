const express = require('express');
const router = express.Router();
const grievanceController = require('../controllers/grievanceController');

// Create a new grievance
router.post('/', grievanceController.createGrievance);

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

module.exports = router;
