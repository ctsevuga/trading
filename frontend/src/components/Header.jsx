import { useState } from "react";
import { Link } from "react-router-dom";

import {
  FaBars,
  FaTimes,
  FaHome,
  FaEnvelope,
  FaListAlt,
  FaChartLine,
} from "react-icons/fa";

import "../css/App.css";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  /* -------- Stock Navigation (Extendable) -------- */
  const stockNavItems = [
    {
      label: "Stock Performance",
      path: "/StockPerformanceList",
      icon: <FaChartLine className="icon" />,
    },
    {
      label: "Stock Gainer Loser",
      path: "/StockGainerLoser",
      icon: <FaChartLine className="icon" />,
    },
    {
      label: "Stock Market News",
      path: "/StockMarketNews",
      icon: <FaListAlt className="icon" />,
    },
    {
      label: "India Stock Market Today News",
      path: "/TodayMarketNews",
      icon: <FaListAlt className="icon" />,
    },
    {
      label: "India Stock Market News",
      path: "/MarketNews",
      icon: <FaListAlt className="icon" />,
    },
    {
      label: "India Stock Market High Impact News",
      path: "/HighImpactMarketNews",
      icon: <FaListAlt className="icon" />,
    },
    {
      label: "Know Metrics",
      path: "/MetricsList",
      icon: <FaListAlt className="icon" />,
    },
    {
      label: "Know Metrics By Category",
      path: "/MetricsCategory",
      icon: <FaEnvelope className="icon" />,
    },
    // 🔮 Add more stock-related routes here later
  ];

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="header shadow">
      <nav className="navbar">

        {/* Brand */}
<a
  href="https://infowisdom.in"
  target="_blank"
  rel="noopener noreferrer"
  className="nav-brand"
  onClick={closeMenu}
  style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}
>
  <span className="brand-text" style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#f1f5fbff" }}>
    IwSoft
  </span>
  <span
    style={{
      fontSize: "1rem",
      fontWeight: "bold",
      color: "#f4f1efff", // brighter blue for visibility
      marginTop: "2px",
    }}
  >
    (Click to go to My official web application)
  </span>
</a>


        {/* Mobile Menu Toggle */}
        <button
          className="menu-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
        </button>

        {/* Navigation Links */}
        <ul className={`nav-menu ${menuOpen ? "active" : ""}`}>

          {/* Home */}
          <li>
            <Link to="/" className="nav-link" onClick={closeMenu}>
              <FaHome className="icon" /> Home
            </Link>
          </li>

          {/* Stock Section */}
          {stockNavItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className="nav-link"
                onClick={closeMenu}
              >
                {item.icon} {item.label}
              </Link>
            </li>
          ))}

        </ul>
      </nav>
    </header>
  );
};

export default Header;
