const express = require("express");
const { sendEmailNotification } = require("./mailer"); // Import the email function from mailer.js
const router = express.Router();
const User = require("./models/Users");

router.post("/join", async (req, res) => {
  const { email } = req.body; // Get email from request body

  try {
    // Check if the email already exists in the database
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already added." }); // Return error if email exists
    }

    // Save the new user's email to the database
    const newUser = new User({ email });
    await newUser.save(); // Save the user

    res
      .status(201)
      .json({ message: "Email added successfully to the community!" }); // Success response
  } catch (error) {
    console.error("Error adding email to the community:", error);
    res.status(500).json({ message: "Error adding email to the community" }); // Server error
  }
});
// POST route to submit a fraud report and send email notifications
router.post("/report", async (req, res) => {
  const { fraudType, description } = req.body;
  console.log("Received Report:", fraudType, description); // Log the incoming report

  try {
    // Simulate saving the report
    console.log("Report saved:", { fraudType, description });

    // Send email notifications to all users in the community
    await sendEmailNotification(fraudType, description); // Using the mailer.js function

    res.status(201).json({ message: "Report submitted successfully" });
  } catch (error) {
    console.error("Error submitting report:", error);
    res.status(500).json({ error: "Report submission failed" });
  }
});

module.exports = router;
