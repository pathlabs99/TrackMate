const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const app = express();

// Use the more detailed CORS configuration
app.use(cors({
  origin: '*',
  methods: ['POST', 'GET'],
  credentials: true
}));
app.use(express.json({ limit: '50mb' })); // Increased limit for photo attachments

// Configure nodemailer with Gmail
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: 'pathlabs99@gmail.com', // Replace with your Gmail
    pass: 'xcgb ofay htnb ulim' // Replace with your App Password
  }
});

// Helper function to get color for issue type
const getIssueTypeColor = (issueType) => {
  const colorMap = {
    'Fallen Tree': '#8D6E63',
    'Damaged Trail/Erosion': '#795548',
    'Damaged/Missing Sign': '#FF9800',
    'Damaged Shelter/Facility': '#F57C00',
    'Water Source Issue': '#03A9F4',
    'Wildlife Concern': '#4CAF50',
    'Overgrown Vegetation': '#8BC34A',
    'Other': '#9E9E9E'
  };
  
  return colorMap[issueType] || '#9E9E9E';
};

// Helper function to get color for urgency level
const getUrgencyColor = (urgency) => {
  const colorMap = {
    'low': '#4CAF50',
    'medium': '#FF9800',
    'high': '#F44336'
  };
  
  return colorMap[urgency] || '#FF9800';
};

// Generate report ID function
const generateReportId = () => {
  const now = new Date();
  
  // Format date as YYYYMMDD
  const datePart = now.getFullYear().toString() +
    (now.getMonth() + 1).toString().padStart(2, '0') +
    now.getDate().toString().padStart(2, '0');
  
  // Format time as HHMMSS
  const timePart = now.getHours().toString().padStart(2, '0') + 
    now.getMinutes().toString().padStart(2, '0') +
    now.getSeconds().toString().padStart(2, '0');
  
  return `BTF-${datePart}-${timePart}`;
};

// Function to convert issue report data to CSV
const convertReportToCSV = (reportData, coordinates = null) => {
  // Define all possible headers - remove photo as it's handled separately
  const headers = [
    "ReportID",
    "Name",
    "Email",
    "Telephone",
    "DateObserved",
    "IssueType", 
    "Urgency",
    "Latitude",
    "Longitude",
    "Accuracy",
    "LocationDescription",
    "Comments",
    "SubmissionDate",
    "HasPhoto"
  ];
  
  // Create values array matching the headers
  const values = [
    reportData.reportId || "",
    reportData.name || "",
    reportData.email || "",
    reportData.telephone || "",
    reportData.dateObserved || "",
    reportData.issueType || "",
    reportData.urgency || "",
    coordinates ? coordinates.latitude : "",
    coordinates ? coordinates.longitude : "",
    coordinates ? coordinates.accuracy : "",
    reportData.location || "",
    reportData.comments || "",
    new Date().toISOString(),
    reportData.photo ? "Yes" : "No"
  ];
  
  // Escape commas, quotes, and newlines in CSV values
  const escapedValues = values.map((value) => {
    // Convert to string first
    let str = String(value);

    // Check if value needs to be quoted
    if (str.includes(",") || str.includes('"') || str.includes("\n")) {
      // Replace quotes with double quotes for escaping
      str = str.replace(/"/g, '""');
      // Enclose in quotes
      return `"${str}"`;
    }

    return str;
  });
  
  // Combine into CSV
  return `${headers.join(",")}\n${escapedValues.join(",")}`;
};

// Email formatting
const createHTMLContent = (reportData, coordinates = null) => {
  const issueTypeColor = getIssueTypeColor(reportData.issueType);
  const urgencyColor = getUrgencyColor(reportData.urgency);
  
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <style>
      body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
      .container { max-width: 600px; margin: 0 auto; padding: 20px; }
      .header { background-color: #f57c00; color: white; padding: 10px 20px; border-radius: 5px 5px 0 0; }
      .content { padding: 20px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 5px 5px; }
      .footer { margin-top: 20px; font-size: 12px; color: #666; text-align: center; }
      .issue-type { display: inline-block; padding: 5px 10px; border-radius: 15px; font-weight: bold; }
      .urgency { display: inline-block; padding: 5px 10px; border-radius: 15px; color: white; font-weight: bold; }
      .info-row { margin-bottom: 10px; }
      .label { font-weight: bold; width: 150px; display: inline-block; }
      .coordinates { font-family: monospace; background-color: #f5f5f5; padding: 5px; border-radius: 3px; }
      .has-photo { color: green; font-weight: bold; }
      .no-photo { color: #666; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h2 style="margin: 0;">TrackMate Issue Report</h2>
        <div>Report ID: ${reportData.reportId}</div>
      </div>
      <div class="content">
        <div class="info-row">
          <span class="label">Issue Type:</span>
          <span class="issue-type" style="background-color: ${issueTypeColor};">${reportData.issueType || 'Not specified'}</span>
        </div>
        <div class="info-row">
          <span class="label">Urgency:</span>
          <span class="urgency" style="background-color: ${urgencyColor};">${reportData.urgency || 'Medium'}</span>
        </div>
        <div class="info-row">
          <span class="label">Reporter:</span>
          <span>${reportData.name} (${reportData.email})</span>
        </div>
        <div class="info-row">
          <span class="label">Phone:</span>
          <span>${reportData.telephone || 'Not provided'}</span>
        </div>
        <div class="info-row">
          <span class="label">Date Observed:</span>
          <span>${reportData.dateObserved || 'Not specified'}</span>
        </div>
        
        <h3>Location Details</h3>
        ${coordinates ? `
        <div class="info-row">
          <span class="label">GPS Coordinates:</span>
          <span class="coordinates">${coordinates.latitude.toFixed(6)}, ${coordinates.longitude.toFixed(6)}</span>
        </div>
        <div class="info-row">
          <span class="label">GPS Accuracy:</span>
          <span>±${Math.round(coordinates.accuracy)}m</span>
        </div>
        ` : '<div class="info-row">No GPS coordinates provided</div>'}
        
        <div class="info-row">
          <span class="label">Location Description:</span>
          <span>${reportData.location || 'Not provided'}</span>
        </div>
        
        <h3>Issue Description</h3>
        <div style="white-space: pre-wrap;">${reportData.comments}</div>
        
        <div class="info-row" style="margin-top: 20px;">
          <span class="label">Photo:</span>
          <span class="${reportData.photo ? 'has-photo' : 'no-photo'}">${reportData.photo ? 'Included as attachment' : 'No photo provided'}</span>
        </div>
        
        <div class="info-row">
          <span class="label">Submission Date:</span>
          <span>${new Date().toLocaleString()}</span>
        </div>
      </div>
      <div class="footer">
        <p>This report was generated automatically by the TrackMate app.</p>
        <p>© ${new Date().getFullYear()} Bibbulmun Track Foundation</p>
      </div>
    </div>
  </body>
  </html>`;
};

// Function to create HTML content for survey email
const createSurveyHTMLContent = (surveyData) => {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <style>
      body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
      .container { max-width: 600px; margin: 0 auto; padding: 20px; }
      .header { background-color: #4CAF50; color: white; padding: 10px 20px; border-radius: 5px 5px 0 0; }
      .content { padding: 20px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 5px 5px; }
      .footer { margin-top: 20px; font-size: 12px; color: #666; text-align: center; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h2 style="margin: 0;">TrackMate Survey Submission</h2>
        <div>Survey ID: ${surveyData.reportId || 'Not specified'}</div>
      </div>
      <div class="content">
        <p>A new survey has been submitted via the TrackMate app on ${new Date().toLocaleString()}.</p>
        <p>The full survey data is available in the attached CSV file.</p>
      </div>
      <div class="footer">
        <p>This survey was generated automatically by the TrackMate app.</p>
        <p>© ${new Date().getFullYear()} Bibbulmun Track Foundation</p>
      </div>
    </div>
  </body>
  </html>
  `;
};

// Test the email connection
transporter.verify(function (error, success) {
  if (error) {
    console.log('Error with email setup:', error);
  } else {
    console.log('Server is ready to send emails');
  }
});

// Handle issue report submission
app.post('/send-report', async (req, res) => {
  console.log('Received report request');
  
  try {
    // Check if it's the old format (CSV) or new format (JSON object)
    if (req.body.csvData && req.body.fileName) {
      // Old CSV format
      const { csvData, fileName } = req.body;
      
      // Generate a report ID for old-format submissions
      const reportId = generateReportId();
      
      const mailOptions = {
        from: 'pathlabs99@gmail.com',
        to: 'pathlabs99@gmail.com',
        subject: `${reportId} - TrackMate Issue Report`,
        text: 'Please find attached the issue report.',
        attachments: [
          {
            filename: fileName,
            content: csvData,
            contentType: 'text/csv'
          }
        ]
      };
      
      // Add photo if available (old format)
      if (req.body.photo) {
        const matches = req.body.photo.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
        
        if (matches && matches.length === 3) {
          const type = matches[1];
          const data = matches[2];
          const buffer = Buffer.from(data, 'base64');
          
          mailOptions.attachments.push({
            filename: `${reportId}_photo.${type.split('/')[1] || 'jpg'}`,
            content: buffer,
            contentType: type
          });
        }
      }
      
      await transporter.sendMail(mailOptions);
    } else {
      // New JSON format - convert to CSV
      const reportData = req.body;
      
      // Get or generate report ID
      const reportId = reportData.reportId || generateReportId();
      reportData.reportId = reportId; // Ensure reportId is set
      
      // Convert to CSV
      const coordinates = reportData.coordinates || null;
      const csvData = convertReportToCSV(reportData, coordinates);
      
      // Create HTML content for email body
      const htmlContent = createHTMLContent(reportData, coordinates);
      
      // Create mail options with report ID at the start of the subject
      const mailOptions = {
        from: 'pathlabs99@gmail.com',
        to: 'pathlabs99@gmail.com',
        subject: `${reportId} - TrackMate Issue Report`,
        text: `Issue report submitted via TrackMate app on ${new Date().toLocaleString()}.`,
        html: htmlContent,
        attachments: [
          {
            filename: `${reportId}_issue_report.csv`,
            content: csvData,
            contentType: 'text/csv'
          }
        ]
      };

      // Add photo if available
      if (reportData.photo) {
        // Extract base64 data
        const matches = reportData.photo.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
        
        if (matches && matches.length === 3) {
          const type = matches[1];
          const data = matches[2];
          const buffer = Buffer.from(data, 'base64');
          
          mailOptions.attachments.push({
            filename: `${reportId}_photo.${type.split('/')[1] || 'jpg'}`,
            content: buffer,
            contentType: type
          });
        }
      }
      
      await transporter.sendMail(mailOptions);
    }
    
    console.log('Email sent successfully');
    res.status(200).json({ message: 'Report sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ 
      message: 'Failed to send report', 
      error: error.message 
    });
  }
});

// Route to handle survey submission
app.post('/send-survey', async (req, res) => {
  console.log('Received survey submission request');
  
  try {
    // Check if it's the new format with reportId field
    if (req.body.reportId) {
      const surveyData = req.body;
      const reportId = surveyData.reportId;
      
      // Get CSV data if it exists
      const csvData = surveyData.csvData || '';
      
      // Create HTML content for email
      const htmlContent = createSurveyHTMLContent(surveyData);
      
      const mailOptions = {
        from: 'pathlabs99@gmail.com',
        to: 'pathlabs99@gmail.com',
        subject: `${reportId} - TrackMate Survey Submission`,
        text: `Survey submission from TrackMate app on ${new Date().toLocaleString()}.`,
        html: htmlContent,
        attachments: [
          {
            filename: `${reportId}_survey.csv`,
            content: csvData,
            contentType: 'text/csv'
          }
        ]
      };
      
      await transporter.sendMail(mailOptions);
    } else {
      // Legacy format
      const { csvData, fileName } = req.body;
      const reportId = generateReportId();
      
      // Create basic HTML content
      const htmlContent = createSurveyHTMLContent({ reportId });
      
      const mailOptions = {
        from: 'pathlabs99@gmail.com',
        to: 'pathlabs99@gmail.com',
        subject: `${reportId} - TrackMate Survey Submission`,
        text: `Survey submission from TrackMate app on ${new Date().toLocaleString()}.`,
        html: htmlContent,
        attachments: [
          {
            filename: fileName || `${reportId}_survey.csv`,
            content: csvData,
            contentType: 'text/csv'
          }
        ]
      };
      
      await transporter.sendMail(mailOptions);
    }
    
    console.log('Survey email sent successfully');
    res.status(200).json({ message: 'Survey sent successfully' });
  } catch (error) {
    console.error('Error sending survey email:', error);
    res.status(500).json({ 
      message: 'Failed to send survey', 
      error: error.message 
    });
  }
});

// Test endpoint to verify server is running
app.get('/test', (req, res) => {
  res.json({ message: 'Server is running!' });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
