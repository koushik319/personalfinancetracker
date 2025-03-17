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
      <div className="container-fluid">
        <NavLink className="navbar-brand fw-bold" to={"/dashboard"}>
          Finance Tracker
        </NavLink>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mynavbar"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="mynavbar">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <a className="nav-link active" href="#">
                Home
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">
                About
              </a>
            </li>
            <li className="nav-item">
              <Link className="btn btn-sm btn-danger ms-2" onClick={SignOut}>
                Logout
              </Link>
            </li>
          </ul>

          {/* <form className="d-flex">
            <input
              className="form-control me-2 rounded-pill"
              type="text"
              placeholder="Search"
            />
            <button className="btn btn-outline-light rounded-pill" type="button">
              Search
            </button>
          </form> */}
        </div>
      </div>
    </nav>
  );
};

export default HeaderNav;
