import React from 'react';
import './Navbar.css';

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        Santa's Sleigh
      </div>
      <ul className="navbar-links">
        <li><a href="/">Home</a></li>
        <li><a href="/login">Login</a></li>
      </ul>
    </nav>
  );
}

export default Navbar;
