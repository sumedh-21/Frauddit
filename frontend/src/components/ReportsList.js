import React, { useEffect, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";

const socket = io("http://localhost:5001");

function ReportsList({ viewAll }) {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    // Fetch reports based on the viewAll flag
    const endpoint = viewAll
      ? "http://localhost:5001/reports/all"
      : "http://localhost:5001/reports/recent";

    axios
      .get(endpoint)
      .then((response) => {
        setReports(response.data); // Set the reports state with the fetched reports
      })
      .catch((error) => {
        console.error("Error fetching reports:", error);
      });

    // Listen for the 'newReport' event emitted from the backend
    socket.on("newReport", (report) => {
      setReports((prev) => [
        report,
        ...prev.slice(0, viewAll ? prev.length : 9),
      ]); // Update the list
    });

    // Cleanup socket listener when the component unmounts
    return () => socket.off("newReport");
  }, [viewAll]); // Re-run when viewAll changes

  return (
    <div>
      <h2>{viewAll ? "All Fraud Reports" : "Recent Fraud Reports"}</h2>
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
