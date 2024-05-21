import React from "react";
import { Link } from "react-router-dom";

const Navigation = () => {
  return (
    <div id="wrapper">
      <ul
        className="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion"
        id="accordionSidebar"
      >
        <a className="sidebar-brand d-flex align-items-center justify-content-center">
          <div className="sidebar-brand-text mx-3"></div>
        </a>
        <hr className="sidebar-divider my-0" />
        <li className="nav-item active">
          <Link to="/dashboard" className="nav-link">
            <i className="fas fa-fw fa-tachometer-alt" />
            <span>Dashboard</span>
          </Link>
        </li>
        <hr className="sidebar-divider" />
        <div className="sidebar-heading">Interface</div>
        <li className="nav-item">
          <a
            className="nav-link collapsed"
            href="#"
            data-toggle="collapse"
            data-target="#collapseTwo"
            aria-expanded="true"
            aria-controls="collapseTwo"
          >
            <i className="fas fa-fw fa-cog" />
            <span>Transactions</span>
          </a>
          <div
            id="collapseTwo"
            className="collapse"
            aria-labelledby="headingTwo"
            data-parent="#accordionSidebar"
          >
            <div className="bg-white py-2 collapse-inner rounded">
              <h6 className="collapse-header">Transactions:</h6>
              <Link to="/request-handler">
                <a className="collapse-item">TokenRequestHandler</a>
              </Link>
            </div>
          </div>
        </li>
      </ul>
    </div>
  );
};

export default Navigation;
