import React from "react";
import ReportForm from "./components/ReportForm";
import ReportsList from "./components/ReportsList";
import AuthForm from "./components/AuthForm";

function App() {
  return (
    <div>
      <h1>Fraud Alert Network</h1>
      <AuthForm/>
      <ReportForm />
      <ReportsList />
    </div>
  );
}

export default App;
