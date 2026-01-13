const nodemailer = require('nodemailer');

(async () => {
  try {
    const transporter = nodemailer.createTransport({
      host: 'ssl0.ovh.net',
      port: 465,
      secure: true,
      auth: {
        user: 'contact@wizi-learn.com',
        pass: 'Mbl2025*00'
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    const info = await transporter.sendMail({
      from: 'contact@wizi-learn.com',
      to: 'contact@wizi-learn.com',
      subject: 'SMTP test from nodemailer script',
      text: 'This is a test message from smtp_test.js'
    });

    console.log('Email sent:', info);
  } catch (err) {
    console.error('SMTP test error:', err);
    process.exit(1);
  }
})();
