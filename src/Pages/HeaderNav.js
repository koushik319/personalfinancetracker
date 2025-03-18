import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";

const HeaderNav = () => {
  const navigate = useNavigate();

  const SignOut = (e) => {
    e.preventDefault();
    alert("Signout Successfully");
    localStorage.clear();
    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
      <div className="container">
        <NavLink className="navbar-brand fw-bold" to={"/dashboard"}>
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
              <NavLink className="nav-link active" to="/dashboard">
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
            <Link
              className="btn btn-sm btn-warning me-2 px-4"
              onClick={SignOut}
            >
              Logout
            </Link>
            {/* <Link
              className="btn btn-sm btn-warning px-4"
              to="/profile"
            >
              Profile
            </Link> */}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default HeaderNav;
