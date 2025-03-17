import React from "react";
import { NavLink } from "react-router-dom";
import '../LoginAndSignUp/PageNotFound.css';

const PageNotFound = () => {
  return (
    <div class="not-found">
      <div>
        <h1 class="display-1">Page Not Found</h1>
        
        <NavLink className="navbar-brand"  to="/dashboard">
           DashBoard
          </NavLink>
      </div>
    </div>
  );
};

export default PageNotFound;