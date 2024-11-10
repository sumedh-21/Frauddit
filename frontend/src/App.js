import React, { useState } from "react";
import ReportForm from "./components/ReportForm";
import ReportsList from "./components/ReportsList";

function App() {
  const [viewAll, setViewAll] = useState(false);

  return (
    <div>
      <h1>Fraud Alert Network</h1>
      <ReportForm />
      <button onClick={() => setViewAll(!viewAll)}>
        {viewAll ? "View Recent Reports" : "View All Reports"}
      </button>
      <ReportsList viewAll={viewAll} />
    </div>
  );
}

export default App;
