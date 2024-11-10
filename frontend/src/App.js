import React, { useState } from "react";
import axios from "axios";
import ReportForm from "./components/ReportForm";
import ReportsList from "./components/ReportsList";
import "./App.css"; // Import the CSS file

function App() {
  const [viewAll, setViewAll] = useState(false);
  const [email, setEmail] = useState(""); // State to store email
  const [message, setMessage] = useState(""); // State for success/failure message
  const [emailError, setEmailError] = useState(""); // Error handling for email form

  // Function to handle email submission
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setEmailError(""); // Reset error message
    try {
      const response = await axios.post("http://localhost:5001/api/join", {
        email,
      });
      setMessage(response.data.message); // Set success message
      setEmail(""); // Clear the email input field
    } catch (error) {
      setEmailError(
        error.response?.data?.message || "Error joining the community"
      ); // Set error message
    }
  };

  return (
    <div className="App">
      <div className="container">
        {/* Left column: Sign up and submit report */}
        <div className="left-column">
          <h1>Frauddit</h1>

          {/* Email Collection Form */}
          <form onSubmit={handleEmailSubmit}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email to join the community"
              required
            />
            <button type="submit">Join Community</button>
          </form>

          {/* Display message (Success/Failure) */}
          {message && <p>{message}</p>}
          {emailError && <p className="error-message">{emailError}</p>}

          <hr />

          {/* Report Submission Form */}
          <ReportForm />
        </div>

        {/* Right column: Display Reports */}
        <div className="right-column">
          <button onClick={() => setViewAll(!viewAll)}>
            {viewAll ? "View Recent Reports" : "View All Reports"}
          </button>
          <ReportsList viewAll={viewAll} />
        </div>
      </div>
    </div>
  );
}

export default App;
