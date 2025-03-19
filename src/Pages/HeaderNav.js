import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import "./HeaderNav.css"; 

const HeaderNav = () => {
  const navigate = useNavigate();

  const SignOut = (e) => {
    e.preventDefault();
    if (window.confirm("Are you sure you want to sign out?")) {
      alert("Signout Successfully");
      localStorage.clear();
      navigate("/");
    }
  };

  return (
    <nav className="navbar navbar-expand-lg shadow-sm custom-navbar">
      <div className="container">
        <NavLink className="navbar-brand fw-bold logo-text" to={"/dashboard"}>
          Finance Tracker
        </NavLink>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mynavbar"
          aria-controls="mynavbar"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="mynavbar">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <NavLink className="nav-link" to="/dashboard">
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/about">
                About
              </NavLink>
            </li>
          </ul>

          <div className="d-flex">
            <Link className="btn custom-btn me-2" onClick={SignOut}>
              Logout
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default HeaderNav;
