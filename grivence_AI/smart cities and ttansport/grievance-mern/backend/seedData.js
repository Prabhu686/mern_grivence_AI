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
    description: 'Major water pipe burst causing flooding in residential area. Urgent repair needed to prevent property damage.',
    location: 'Main Street, Downtown',
    department: 'Water & Sanitation',
    urgency: 'Critical',
    priority: 'Critical',
    emotion: 'distress',
    status: 'In Progress',
    citizenName: 'John Doe',
    citizenEmail: 'john@example.com',
    citizenPhone: '1234567890',
    aiSummary: 'Critical water infrastructure failure requiring immediate attention',
    aiPriority: 'Critical',
    aiCategory: 'Water Infrastructure',
    aiImpactScore: 9,
    aiAnalyzedAt: new Date()
  },
  {
    id: 2,
    title: 'Streetlight not working',
    description: 'Streetlight on Oak Avenue has been out for 3 days causing safety concerns at night',
    location: 'Oak Avenue',
    department: 'Electricity',
    urgency: 'Medium',
    priority: 'Medium',
    emotion: 'frustrated',
    status: 'Open',
    citizenName: 'Jane Smith',
    citizenEmail: 'jane@example.com',
    citizenPhone: '0987654321',
    aiSummary: 'Public safety issue due to non-functional street lighting',
    aiPriority: 'Medium',
    aiCategory: 'Public Safety',
    aiImpactScore: 6,
    aiAnalyzedAt: new Date()
  },
  {
    id: 3,
    title: 'Garbage not collected',
    description: 'Garbage has not been collected for 2 weeks in our area causing health hazards and bad smell',
    location: 'Residential Area Block A',
    department: 'Water & Sanitation',
    urgency: 'High',
    priority: 'High',
    emotion: 'angry',
    status: 'Open',
    citizenName: 'Mike Johnson',
    citizenEmail: 'mike@example.com',
    citizenPhone: '5551234567',
    aiSummary: 'Sanitation service disruption creating health hazard',
    aiPriority: 'High',
    aiCategory: 'Sanitation',
    aiImpactScore: 8,
    aiAnalyzedAt: new Date()
  },
  {
    id: 4,
    title: 'Pothole on Highway 101',
    description: 'Large dangerous pothole causing accidents on Highway 101. Multiple vehicles damaged.',
    location: 'Highway 101 Mile 5',
    department: 'Roads & Transport',
    urgency: 'Critical',
    priority: 'Critical',
    emotion: 'angry',
    status: 'Escalated',
    citizenName: 'Sarah Williams',
    citizenEmail: 'sarah@example.com',
    citizenPhone: '5559876543',
    aiSummary: 'Critical road safety hazard requiring immediate repair',
    aiPriority: 'Critical',
    aiCategory: 'Road Safety',
    aiImpactScore: 10,
    aiAnalyzedAt: new Date(),
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
    description: 'Central Park needs cleaning and maintenance. Benches broken and trash bins overflowing.',
    location: 'Central Park',
    department: 'Environment',
    urgency: 'Low',
    priority: 'Low',
    emotion: 'neutral',
    status: 'Resolved',
    citizenName: 'Tom Brown',
    citizenEmail: 'tom@example.com',
    citizenPhone: '5554567890',
    aiSummary: 'Routine park maintenance and cleaning required',
    aiPriority: 'Low',
    aiCategory: 'Environment',
    aiImpactScore: 3,
    aiAnalyzedAt: new Date()
  },
  {
    id: 6,
    title: 'Traffic signal malfunction',
    description: 'Traffic signal at 5th Avenue intersection not working properly causing traffic congestion',
    location: '5th Avenue & Market Street',
    department: 'Roads & Transport',
    urgency: 'High',
    priority: 'High',
    emotion: 'frustrated',
    status: 'In Progress',
    citizenName: 'David Lee',
    citizenEmail: 'david@example.com',
    citizenPhone: '5551112222',
    aiSummary: 'Traffic control system failure affecting commuter safety',
    aiPriority: 'High',
    aiCategory: 'Traffic Management',
    aiImpactScore: 7,
    aiAnalyzedAt: new Date()
  },
  {
    id: 7,
    title: 'Illegal dumping in vacant lot',
    description: 'People are illegally dumping construction waste in the vacant lot near school',
    location: 'Vacant Lot, School Street',
    department: 'Environment',
    urgency: 'Medium',
    priority: 'Medium',
    emotion: 'angry',
    status: 'Open',
    citizenName: 'Emily Chen',
    citizenEmail: 'emily@example.com',
    citizenPhone: '5553334444',
    aiSummary: 'Environmental violation requiring enforcement action',
    aiPriority: 'Medium',
    aiCategory: 'Environment',
    aiImpactScore: 5,
    aiAnalyzedAt: new Date()
  },
  {
    id: 8,
    title: 'Power outage in residential area',
    description: 'Frequent power outages in our neighborhood for the past week. Need urgent fix.',
    location: 'Residential Area Block C',
    department: 'Electricity',
    urgency: 'High',
    priority: 'High',
    emotion: 'distress',
    status: 'Open',
    citizenName: 'Robert Martinez',
    citizenEmail: 'robert@example.com',
    citizenPhone: '5555556666',
    aiSummary: 'Electrical infrastructure issue causing service disruption',
    aiPriority: 'High',
    aiCategory: 'Electricity',
    aiImpactScore: 8,
    aiAnalyzedAt: new Date()
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
