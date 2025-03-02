const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const app = express();

app.use(cors({
  origin: '*',
  methods: ['POST', 'GET'],
  credentials: true
}));
app.use(express.json());

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

// Test the email connection
transporter.verify(function (error, success) {
  if (error) {
    console.log('Error with email setup:', error);
  } else {
    console.log('Server is ready to send emails');
  }
});

// Route to handle issue report submission
app.post('/send-report', async (req, res) => {
  console.log('Received report request');
  
  const { csvData, fileName } = req.body;

  const mailOptions = {
    from: 'pathlabs99@gmail.com', // Replace with your Gmail
    to: 'pathlabs99@gmail.com',
    subject: 'TrackMate Issue Report',
    text: 'Please find attached the issue report.',
    attachments: [
      {
        filename: fileName,
        content: csvData,
        contentType: 'text/csv'
      }
    ]
  };

  try {
    await transporter.sendMail(mailOptions);
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

// Test endpoint to verify server is running
app.get('/test', (req, res) => {
  res.json({ message: 'Server is running!' });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
}); 