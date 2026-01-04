import React from "react";
import { FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa";
import { motion } from "framer-motion";
import "../css/Footer.css";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer-container">
      <motion.div
        className="footer-content"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        {/* Brand Name */}
        <div
          className="footer-brand"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
          }}
        >
          <a
            href="https://infowisdom.in"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              textDecoration: "underline", // underline visible on load
              color: "#1a2601ff",
              fontSize: "1.5rem",
              fontWeight: "bold",
              transition: "color 0.3s, text-decoration 0.3s",
              cursor: "pointer", // shows clickable hand
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "#003513ff"; // darker green on hover
              e.currentTarget.style.textDecoration = "underline"; // keep underline
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "#1a2601ff"; // revert color
              e.currentTarget.style.textDecoration = "underline"; // keep underline
            }}
          >
            IwSoft
          </a>
          <span
            style={{
              fontSize: "1rem",
              fontWeight: "bold",
              color: "#003513ff",
              marginTop: "2px",
            }}
          >
            (Click to go to My official web application)
          </span>
          <p
            className="brand-subtitle"
            style={{ margin: "4px 0 0 0", color: "#555" }}
          >
            Innovating with Wisdom
          </p>
        </div>

        {/* Social Icons */}
        <div className="footer-socials">
          <motion.a whileHover={{ scale: 1.2 }} href="#">
            <FaFacebookF />
          </motion.a>
          <motion.a whileHover={{ scale: 1.2 }} href="#">
            <FaInstagram />
          </motion.a>
          <motion.a whileHover={{ scale: 1.2 }} href="#">
            <FaTwitter />
          </motion.a>
        </div>

        {/* Footer bottom */}
        <div className="footer-bottom">
          <p>© {currentYear} IwSoft. All rights reserved.</p>
        </div>
      </motion.div>
    </footer>
  );
};

export default Footer;
