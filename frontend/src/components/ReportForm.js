import React, { useState } from "react";
import axios from "axios";

function ReportForm() {
  const [fraudType, setFraudType] = useState("");
  const [description, setDescription] = useState("");

  const submitReport = async (e) => {
    e.preventDefault();

    // Send the report data to the backend
    try {
      const response = await axios.post("http://localhost:5001/report", {
        fraudType,
        description,
      });

      console.log("Report submitted successfully:", response.data);
      setFraudType("");
      setDescription("");
    } catch (error) {
      console.error("Error submitting report:", error);
    }
  };

  return (
    <form onSubmit={submitReport}>
      <input
        type="text"
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
  );
}

export default ReportForm;
