import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import "./Navbar.css";



export default function Navbar() {
  const { isLoggedIn, logout, username } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    // Lock body scroll when mobile menu is open
    if (menuOpen) {
      document.body.classList.add("nav-open");
    } else {
      document.body.classList.remove("nav-open");
    }
    return () => document.body.classList.remove("nav-open");
  }, [menuOpen]);

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
    setMenuOpen(false);
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="navbar">
      <NavLink to="/" className="nav-brand" onClick={closeMenu}>
        <img src="/bme-favicon.png" alt="BME Logo" className="brand-logo" />  <span>Bharat Metal</span> Exchange Ltd.
      </NavLink>

      <button
        className="menu-toggle"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle Menu"
        aria-expanded={menuOpen}
      >
        ☰
      </button>

      <div className={`nav-links ${menuOpen ? "open" : ""}`}>
        <NavLink
          to="/"
          onClick={closeMenu}
          className={({ isActive }) =>
            "nav-link" + (isActive ? " active" : "")
          }
        >
          Register
        </NavLink>

        {isLoggedIn ? (
          <>
            <NavLink
              to="/admin/dashboard"
              onClick={closeMenu}
              className={({ isActive }) =>
                "nav-link" + (isActive ? " active" : "")
              }
            >
              Dashboard
            </NavLink>

            <NavLink
              to="/admin/checkin"
              onClick={closeMenu}
              className={({ isActive }) =>
                "nav-link" + (isActive ? " active" : "")
              }
            >
              Check-in
            </NavLink>

            <span className="user-name">{username}</span>

            <button
              className="btn btn-ghost btn-sm"
              onClick={handleLogout}
            >
              Sign Out
            </button>
          </>
        ) : (
          <NavLink
            to="/admin/login"
            onClick={closeMenu}
            className={({ isActive }) =>
              "nav-link" + (isActive ? " active" : "")
            }
          >
            Admin
          </NavLink>
        )}
      </div>
    </nav>
  );
}