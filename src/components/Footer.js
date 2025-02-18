import React from "react";
import "../styles/Footer.css";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <p>&copy; {currentYear} Your Company Name. All rights reserved.</p>
    </footer>
  );
}

export default Footer;
