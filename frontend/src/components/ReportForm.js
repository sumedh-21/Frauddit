import React, { useState } from "react";
import axios from "axios";
import "../App.css"; // Ensure CSS is imported for styling

function ReportForm() {
  const [fraudType, setFraudType] = useState("");
  const [description, setDescription] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // State for error messages

  const submitReport = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5001/report", {
        fraudType,
        description,
      });
      console.log(response.data); // Handle success response
      setFraudType("");
      setDescription("");
      setErrorMessage(""); // Clear previous error messages
    } catch (error) {
      if (error.response && error.response.data.error === "duplicate_report") {
        setErrorMessage(error.response.data.message); // Set error message for duplicates
      } else {
        setErrorMessage("Report submission failed, please try again.");
      }
    }
  };

  return (
    <div>
      <form onSubmit={submitReport}>
        <input
          value={fraudType}
          onChange={(e) => setFraudType(e.target.value)}
          placeholder="Fraud Type"
          required
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          required
        />
        <button type="submit">Submit</button>
      </form>

      {/* Display error message */}
      {errorMessage && <p className="error-message">{errorMessage}</p>}
    </div>
  );
}

export default ReportForm;
