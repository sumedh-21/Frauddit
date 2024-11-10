import React, { useState, useEffect } from "react";
import axios from "axios";

function Reports({ viewAll, setViewAll, isNewReport, setIsNewReport }) {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    // Determine which URL to use based on the viewAll state
    const url = viewAll
      ? "http://localhost:5001/reports/all"
      : "http://localhost:5001/reports/recent";

    // Fetch the reports when the component mounts or when `viewAll` or `isNewReport` changes
    axios
      .get(url)
      .then((response) => {
        setReports(response.data); // Set the reports in the state
      })
      .catch((error) => {
        console.error("Error fetching reports:", error);
      });
  }, [viewAll, isNewReport]); // Re-fetch when the view mode or new report flag changes

  return (
    <div>
      <h2>{viewAll ? "All Fraud Reports" : "Recent Fraud Reports"}</h2>
      <button onClick={() => setViewAll(!viewAll)}>
        {viewAll ? "View Recent Reports" : "View All Reports"}
      </button>
      <ul>
        {reports.length === 0 ? (
          <li>No reports available.</li>
        ) : (
          reports.map((report, index) => (
            <li key={index}>
              {report.fraudType}: {report.description} (Tx:{" "}
              {report.blockchainTxId})
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

export default Reports;
