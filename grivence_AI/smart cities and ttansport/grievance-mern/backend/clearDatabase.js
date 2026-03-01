const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/grievance_system', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(async () => {
  console.log('MongoDB connected');
  
  // Drop the database
  await mongoose.connection.dropDatabase();
  console.log('✅ Database cleared successfully!');
  
  console.log('\nDatabase is now empty and ready to use.');
  console.log('Run "node seedData.js" to add sample data.');
  
  process.exit(0);
}).catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
