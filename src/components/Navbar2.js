import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import logo from "../logo.png";

function Navbar() {
  return (
    <nav className="navbar">
      {/* Logo on the left */}
      <div className="navbar-logo">
        <Link to="/">
          <img src={logo} alt="Logo" />
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;