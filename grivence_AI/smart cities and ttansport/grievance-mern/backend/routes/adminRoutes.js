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

// Seed sample data
router.post('/seed', async (req, res) => {
  try {
    await Grievance.deleteMany({});
    await Grievance.insertMany([
      { id: 1, title: 'Water pipe burst on Main Street', description: 'Major water pipe burst causing flooding in residential area.', location: 'Main Street, Downtown', department: 'Water & Sanitation', urgency: 'Critical', priority: 'Critical', status: 'In Progress', citizenName: 'John Doe', citizenEmail: 'john@example.com', citizenPhone: '1234567890' },
      { id: 2, title: 'Streetlight not working', description: 'Streetlight on Oak Avenue has been out for 3 days causing safety concerns.', location: 'Oak Avenue', department: 'Electricity', urgency: 'Medium', priority: 'Medium', status: 'Open', citizenName: 'Jane Smith', citizenEmail: 'jane@example.com', citizenPhone: '0987654321' },
      { id: 3, title: 'Garbage not collected', description: 'Garbage has not been collected for 2 weeks causing health hazards.', location: 'Residential Area Block A', department: 'Water & Sanitation', urgency: 'High', priority: 'High', status: 'Open', citizenName: 'Mike Johnson', citizenEmail: 'mike@example.com', citizenPhone: '5551234567' },
      { id: 4, title: 'Pothole on Highway 101', description: 'Large dangerous pothole causing accidents on Highway 101.', location: 'Highway 101 Mile 5', department: 'Roads & Transport', urgency: 'Critical', priority: 'Critical', status: 'Escalated', citizenName: 'Sarah Williams', citizenEmail: 'sarah@example.com', citizenPhone: '5559876543' },
      { id: 5, title: 'Park maintenance needed', description: 'Central Park needs cleaning and maintenance.', location: 'Central Park', department: 'Environment', urgency: 'Low', priority: 'Low', status: 'Resolved', citizenName: 'Tom Brown', citizenEmail: 'tom@example.com', citizenPhone: '5554567890' },
      { id: 6, title: 'Traffic signal malfunction', description: 'Traffic signal at 5th Avenue not working properly.', location: '5th Avenue & Market Street', department: 'Roads & Transport', urgency: 'High', priority: 'High', status: 'In Progress', citizenName: 'David Lee', citizenEmail: 'david@example.com', citizenPhone: '5551112222' },
      { id: 7, title: 'Illegal dumping in vacant lot', description: 'People are illegally dumping construction waste near school.', location: 'Vacant Lot, School Street', department: 'Environment', urgency: 'Medium', priority: 'Medium', status: 'Open', citizenName: 'Emily Chen', citizenEmail: 'emily@example.com', citizenPhone: '5553334444' },
      { id: 8, title: 'Power outage in residential area', description: 'Frequent power outages in our neighborhood for the past week.', location: 'Residential Area Block C', department: 'Electricity', urgency: 'High', priority: 'High', status: 'Open', citizenName: 'Robert Martinez', citizenEmail: 'robert@example.com', citizenPhone: '5555556666' }
    ]);
    res.json({ message: '✅ Sample data added successfully', count: 8 });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
