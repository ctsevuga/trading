import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import { FaHome, FaBox, FaEnvelope, FaListAlt } from "react-icons/fa";
import "../css/SideNav.css";

const SideNav = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get("/api/products/summary");
        setProducts(data);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };
    fetchProducts();
  }, []);

  return (
    <aside className="side-nav">
      <div className="side-nav-inner">

        <h2 className="side-nav-title">IwSoft</h2>

        <ul className="side-nav-menu">

          {/* Home */}
          <li>
            <Link to="/" className="side-nav-link">
              <FaHome className="side-icon" /> Home
            </Link>
          </li>

          {/* All Products */}
          <li>
            <Link to="/products" className="side-nav-link">
              <FaBox className="side-icon" /> All Products
            </Link>
          </li>

          {/* Product List (auto-generated) */}
          {products.map((product) => (
            <li key={product.slug}>
              <Link to={`/product/${product.slug}`} className="side-nav-link">
                <FaBox className="side-icon" /> {product.name}
              </Link>
            </li>
          ))}

          {/* NEW: Contact Form */}
          <li>
            <Link to="/contact" className="side-nav-link">
              <FaEnvelope className="side-icon" /> Contact
            </Link>
          </li>

          {/* NEW: Contact List */}
          <li>
            <Link to="/contactList" className="side-nav-link">
              <FaListAlt className="side-icon" /> Contact List
            </Link>
          </li>

        </ul>

      </div>
    </aside>
  );
};

export default SideNav;
