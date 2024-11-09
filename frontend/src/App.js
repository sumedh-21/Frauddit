import React from "react";
import ReportForm from "./components/ReportForm";
import ReportsList from "./components/ReportsList";

function App() {
  return (
    <div>
      <h1>Fraud Alert Network</h1>
      <ReportForm />
      <ReportsList />
    </div>
  );
}

export default App;
