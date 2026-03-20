import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusSquare } from "@fortawesome/free-solid-svg-icons";
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

      {/* Links */}
      <div className="navbar-links">
        <Link to="/create">
          Create Ticket <FontAwesomeIcon icon={faPlusSquare} />
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;