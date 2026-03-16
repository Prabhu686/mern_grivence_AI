/**
 * Notification Service for Escalations
 */

const sendEscalationNotification = (grievance, escalationData) => {
  const notification = {
    grievanceId: grievance.id,
    title: grievance.title,
    department: grievance.department,
    priority: grievance.priority,
    escalationLevel: escalationData.level,
    escalatedTo: escalationData.to,
    reason: escalationData.reason,
    citizenEmail: grievance.citizenEmail,
    timestamp: new Date()
  };

  console.log('=== ESCALATION NOTIFICATION ===');
  console.log(`Grievance #${notification.grievanceId} has been escalated!`);
  console.log(`Title: ${notification.title}`);
  console.log(`Department: ${notification.department}`);
  console.log(`Priority: ${notification.priority}`);
  console.log(`Escalation Level: ${notification.escalationLevel}`);
  console.log(`Escalated To: ${notification.escalatedTo}`);
  console.log(`Reason: ${notification.reason}`);
  console.log(`Citizen Email: ${notification.citizenEmail}`);
  console.log('================================');

  // In production, send actual emails/SMS here
  // For now, just log to console
  
  return notification;
};

module.exports = { sendEscalationNotification };
