// mailer.js
const nodemailer = require("nodemailer");
const User = require("./models/Users"); // Import the User model

// Set up the nodemailer transporter (using Gmail as an example)
const transporter = nodemailer.createTransport({
  service: "gmail", // Or another email provider
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  debug: true, // Enable debugging
  logger: true, // Log more details
});
// Function to send email notifications
const sendEmailNotification = (fraudType, description) => {
  console.log("Sending email notifications...");

  // Find all users who have joined
  User.find({}).then((users) => {
    console.log(`Found ${users.length} users to notify.`); // Log the number of users

    users.forEach((user) => {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: user.email, // Send to the user's email
        subject: `New Fraud Report: ${fraudType}`,
        text: `A new fraud report has been submitted. Here are the details:\n\nType: ${fraudType}\nDescription: ${description}`,
      };

      // Log before sending the email
      console.log(`Sending email to ${user.email}...`);

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(`Error sending email to ${user.email}:`, error); // Log error if email fails
        } else {
          console.log(`Email sent to ${user.email}:`, info.response); // Log success if email is sent
        }
      });
    });
  });
};

module.exports = { sendEmailNotification };
