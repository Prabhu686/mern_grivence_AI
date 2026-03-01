const nodemailer = require('nodemailer');

// Mock mode for testing (set to true to use mock OTP)
const MOCK_MODE = true;

// Store OTPs in memory for mock mode
const mockOTPs = {};

// Configure email service
let transporter = null;

if (!MOCK_MODE) {
  transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
      user: process.env.EMAIL_USER || 'your-email@gmail.com',
      pass: process.env.EMAIL_PASSWORD || 'your-app-password'
    }
  });
}

// Generate OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP Email
const sendOTPEmail = async (email, name, otp) => {
  try {
    // Mock mode - return OTP in response
    if (MOCK_MODE) {
      console.log(`\n🔐 MOCK OTP for ${email}: ${otp}\n`);
      mockOTPs[email] = otp;
      return { 
        success: true, 
        message: `OTP: ${otp}`,
        otp: otp,
        isMock: true 
      };
    }

    // Real mode - send via email
    const mailOptions = {
      from: process.env.EMAIL_USER || 'noreply@grievancesystem.com',
      to: email,
      subject: 'Your One-Time Password (OTP) for Grievance System',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #667eea; margin: 0;">Grievance Management System</h1>
          </div>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <p style="color: #333; font-size: 16px; margin: 0 0 15px 0;">Hello <strong>${name}</strong>,</p>
            
            <p style="color: #555; margin-bottom: 20px;">
              You have requested to log in to the Grievance Management System. 
              Please use the following One-Time Password (OTP) to verify your identity:
            </p>
            
            <div style="background-color: white; border: 2px solid #667eea; padding: 20px; border-radius: 8px; text-align: center; margin: 30px 0;">
              <p style="color: #667eea; font-size: 32px; font-weight: bold; margin: 0; letter-spacing: 5px;">${otp}</p>
            </div>
            
            <p style="color: #999; font-size: 12px; margin-top: 20px;">
              ⚠️ This OTP will expire in 10 minutes. Do not share this code with anyone.
            </p>
          </div>
          
          <div style="background-color: #fff3e0; border-left: 4px solid #ff9800; padding: 15px; border-radius: 4px; margin-bottom: 20px;">
            <p style="color: #ff6f00; margin: 0; font-size: 14px;">
              <strong>Security Tip:</strong> Never share your OTP with anyone. Our support team will never ask for your OTP.
            </p>
          </div>
          
          <div style="border-top: 1px solid #e0e0e0; padding-top: 20px; text-align: center;">
            <p style="color: #999; font-size: 12px; margin: 0;">
              If you didn't request this, please ignore this email.<br>
              © 2026 Grievance Management System. All rights reserved.
            </p>
          </div>
        </div>
      `
    };

    if (!transporter) {
      throw new Error('Email service not configured. Please set EMAIL_USER and EMAIL_PASSWORD in .env');
    }

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return { success: true, message: 'OTP sent successfully', isMock: false };
  } catch (error) {
    console.error('Email send error:', error.message);
    return { 
      success: false, 
      message: error.message,
      isMock: false
    };
  }
};

// Send Grievance Update Email
const sendGrievanceUpdateEmail = async (email, grievanceId, status, message) => {
  try {
    if (MOCK_MODE) {
      console.log(`\n📧 MOCK EMAIL: Grievance ${grievanceId} status updated to ${status}`);
      return { success: true, isMock: true };
    }

    if (!transporter) {
      throw new Error('Email service not configured');
    }

    const statusColor = {
      'Open': '#ff6b6b',
      'In Progress': '#ffa500',
      'Resolved': '#51cf66',
      'Escalated': '#ff4757'
    };

    const mailOptions = {
      from: process.env.EMAIL_USER || 'noreply@grievancesystem.com',
      to: email,
      subject: `Grievance #${grievanceId.substring(0, 8)} Status Update`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
          <h2 style="color: #667eea;">Your Grievance Status has been Updated</h2>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Grievance ID:</strong> ${grievanceId.substring(0, 8)}</p>
            <p><strong>Current Status:</strong> <span style="color: ${statusColor[status] || '#333'}; font-weight: bold;">${status}</span></p>
            <p><strong>Latest Update:</strong> ${message}</p>
          </div>
          
          <p>Thank you for using the Grievance Management System.</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    return { success: true, isMock: false };
  } catch (error) {
    console.error('Email sending error:', error);
    return { success: false, error: error.message, isMock: false };
  }
};

module.exports = {
  generateOTP,
  sendOTPEmail,
  sendGrievanceUpdateEmail,
  mockOTPs
};
