require('dotenv').config();
const multer = require('multer');
const express = require('express');
const app = express();
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');

app.set('view engine', 'ejs');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

const upload = multer();

app.get('/', (req, res) => {
  res.render('index');
});

app.post('/feedback', upload.none(), (req, res) => {
  const { name, phone, email, message } = req.body;

  // Log the received data for debugging
  console.log('Received Data:', { name, phone, email, message });

  if (!name || !phone || !email || !message) {
    return res.status(400).json({ ok: false, message: 'All fields are required.' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^\+?[1-9]\d{1,14}$/; // E.164 format

  if (!emailRegex.test(email)) {
    return res.status(400).json({ ok: false, message: 'Invalid email format.' });
  }

  if (!phoneRegex.test(phone)) {
    return res.status(400).json({ ok: false, message: 'Invalid phone number format.' });
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const mailOptions = {
    from: email,
    to: 'weahjrdanielk@gmail.com',
    subject: 'Contact from ' + name,
    text: `You have received a new message from ${name} (${email}):\n\n${message} \n\n Contact On: ${phone}`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      return res.status(500).json({ ok: false, message: 'Error sending email.' });
    } else {
      console.log('Email sent: ' + info.response);
      return res.status(200).json({ ok: true, message: 'Contact Message sent successfully!' });
    }
  });
});

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
