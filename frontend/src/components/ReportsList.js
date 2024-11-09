import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

// Connect to backend
const socket = io("http://localhost:5001");

function ReportsList() {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    // Listen for the 'newReport' event emitted from backend
    socket.on("newReport", (report) => {
      console.log("Received new report:", report);
      setReports((prev) => [...prev, report]); // Update the reports list
    });

    // Cleanup socket listener when component unmounts
    return () => socket.off("newReport");
  }, []);

  return (
    <div>
      <h2>Recent Fraud Reports</h2>
      <ul>
        {reports.map((report, index) => (
          <li key={index}>
            {report.fraudType}: {report.description} (Tx:{" "}
            {report.blockchainTxId})
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ReportsList;
