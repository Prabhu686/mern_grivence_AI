/**
 * SMS Notification Service
 * Sends SMS to citizens for grievance updates
 */

// For production, use Twilio:
// const twilio = require('twilio');
// const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

const sendSMS = async (phoneNumber, message) => {
  try {
    // DEMO MODE: Log to console instead of sending real SMS
    console.log('\n📱 ===== SMS NOTIFICATION =====');
    console.log(`To: ${phoneNumber}`);
    console.log(`Message: ${message}`);
    console.log('==============================\n');

    // For production with Twilio, uncomment:
    /*
    const result = await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phoneNumber
    });
    return { success: true, sid: result.sid };
    */

    return { success: true, demo: true };
  } catch (error) {
    console.error('SMS Error:', error.message);
    return { success: false, error: error.message };
  }
};

const sendGrievanceSubmittedSMS = (phone, trackingId, department) => {
  const message = `Your grievance #${trackingId} has been submitted successfully to ${department}. Track status at: http://localhost:3000/track`;
  return sendSMS(phone, message);
};

const sendGrievanceEscalatedSMS = (phone, trackingId, level) => {
  const message = `URGENT: Your grievance #${trackingId} has been escalated to Level ${level}. We are prioritizing your case.`;
  return sendSMS(phone, message);
};

const sendGrievanceResolvedSMS = (phone, trackingId) => {
  const message = `Good news! Your grievance #${trackingId} has been resolved. Thank you for using our service.`;
  return sendSMS(phone, message);
};

const sendGrievanceStatusUpdateSMS = (phone, trackingId, status) => {
  const message = `Update: Your grievance #${trackingId} status changed to "${status}". Check details at: http://localhost:3000/track`;
  return sendSMS(phone, message);
};

module.exports = {
  sendSMS,
  sendGrievanceSubmittedSMS,
  sendGrievanceEscalatedSMS,
  sendGrievanceResolvedSMS,
  sendGrievanceStatusUpdateSMS
};
