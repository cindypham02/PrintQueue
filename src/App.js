import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import CreateTicket from "./pages/Create";

function App() {
  return (
    <Router>
      <div style={{ paddingTop: "0px" }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create" element={<CreateTicket />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;