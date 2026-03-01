const mongoose = require('mongoose');
const Grievance = require('./models/Grievance');

mongoose.connect('mongodb://localhost:27017/grievance_system', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected')).catch(err => console.error(err));

const sampleGrievances = [
  {
    id: 1,
    title: 'Water pipe burst on Main Street',
    description: 'Major water pipe burst causing flooding in residential area',
    location: 'Main Street, Downtown',
    department: 'Water & Sanitation',
    urgency: 'Critical',
    priority: 'Critical',
    emotion: 'distress',
    status: 'In Progress',
    citizenName: 'John Doe',
    citizenEmail: 'john@example.com',
    citizenPhone: '1234567890'
  },
  {
    id: 2,
    title: 'Streetlight not working',
    description: 'Streetlight on Oak Avenue has been out for 3 days',
    location: 'Oak Avenue',
    department: 'Electricity',
    urgency: 'Medium',
    priority: 'Medium',
    emotion: 'frustrated',
    status: 'Open',
    citizenName: 'Jane Smith',
    citizenEmail: 'jane@example.com',
    citizenPhone: '0987654321'
  },
  {
    id: 3,
    title: 'Garbage not collected',
    description: 'Garbage has not been collected for 2 weeks in our area',
    location: 'Residential Area Block A',
    department: 'Water & Sanitation',
    urgency: 'High',
    priority: 'High',
    emotion: 'angry',
    status: 'Open',
    citizenName: 'Mike Johnson',
    citizenEmail: 'mike@example.com',
    citizenPhone: '5551234567'
  },
  {
    id: 4,
    title: 'Pothole on Highway 101',
    description: 'Large pothole causing accidents on Highway 101',
    location: 'Highway 101 Mile 5',
    department: 'Roads & Transport',
    urgency: 'Critical',
    priority: 'Critical',
    emotion: 'angry',
    status: 'Escalated',
    citizenName: 'Sarah Williams',
    citizenEmail: 'sarah@example.com',
    citizenPhone: '5559876543',
    escalation: {
      isEscalated: true,
      level: 2,
      escalatedTo: 'Senior Engineer',
      escalatedAt: new Date(),
      history: [{ level: 1, to: 'Department Head', reason: 'Overdue' }]
    }
  },
  {
    id: 5,
    title: 'Park maintenance needed',
    description: 'Central Park needs cleaning and maintenance',
    location: 'Central Park',
    department: 'Environment',
    urgency: 'Low',
    priority: 'Low',
    emotion: 'neutral',
    status: 'Resolved',
    citizenName: 'Tom Brown',
    citizenEmail: 'tom@example.com',
    citizenPhone: '5554567890'
  }
];

async function addSampleData() {
  try {
    await Grievance.deleteMany({});
    await Grievance.insertMany(sampleGrievances);
    console.log('✅ Sample grievances added successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error adding sample data:', error);
    process.exit(1);
  }
}

addSampleData();
