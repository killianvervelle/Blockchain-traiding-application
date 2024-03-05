import React from "react";
import { Link } from 'react-router-dom';

const Navigation = () => {
  return (
    <div id="wrapper">
      {/* Sidebar */}
      <ul
        className="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion"
        id="accordionSidebar"
      >
        {/* Sidebar - Brand */}
        <a
          className="sidebar-brand d-flex align-items-center justify-content-center"
        >
          <div className="sidebar-brand-text mx-3">
            Sealify <sup>2</sup>
          </div>
        </a>
        {/* Divider */}
        <hr className="sidebar-divider my-0" />
        {/* Nav Item - Dashboard */} 
        <li className="nav-item active">
            <Link to="/dashboard" className="nav-link"> 
            <i className="fas fa-fw fa-tachometer-alt" />
            <span>Dashboard</span>
            </Link> 
        </li>
        {/* Divider */}
        <hr className="sidebar-divider" />
        {/* Heading */}
        <div className="sidebar-heading">Interface</div>
        {/* Nav Item - Pages Collapse Menu */}
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
            <span>Components</span>
          </a>
          <div
            id="collapseTwo"
            className="collapse"
            aria-labelledby="headingTwo"
            data-parent="#accordionSidebar"
          >
            <div className="bg-white py-2 collapse-inner rounded">
              <h6 className="collapse-header">Components:</h6>
              <Link to="/signature-registration">
              <a className="collapse-item">
                Signature registration
              </a>
              </Link>
              <Link to="/transaction-status">
              <a className="collapse-item">
                Transaction Status 
              </a>
              </Link>
            </div>
          </div>
        </li>
        {/* Nav Item - Utilities Collapse Menu */}
        <li className="nav-item">
          <a
            className="nav-link collapsed"
            href="#"
            data-toggle="collapse"
            data-target="#collapseUtilities"
            aria-expanded="true"
            aria-controls="collapseUtilities"
          >
            <i className="fas fa-fw fa-wrench" />
            <span>Utilities</span>
          </a>
          <div
            id="collapseUtilities"
            className="collapse"
            aria-labelledby="headingUtilities"
            data-parent="#accordionSidebar"
          >
            <div className="bg-white py-2 collapse-inner rounded">
              <h6 className="collapse-header">Utilities:</h6>
              <Link to="/wallet-integration" >
              <a className="collapse-item">
                Wallet Integration
              </a>
              </Link>
              <Link to="/database-integration" >
              <a className="collapse-item">
                Database Integration
              </a>
              </Link>
            </div>
          </div>
        </li>
        {/* Divider */}
        <hr className="sidebar-divider" />
        {/* Heading */}
        <div className="sidebar-heading">Addons</div>
        {/* Nav Item - Pages Collapse Menu */}
        <li className="nav-item">
          <a
            className="nav-link collapsed"
            href="#"
            data-toggle="collapse"
            data-target="#collapsePages"
            aria-expanded="true"
            aria-controls="collapsePages"
          >
            <i className="fas fa-fw fa-folder" />
            <span>Pages</span>
          </a>
          <div
            id="collapsePages"
            className="collapse"
            aria-labelledby="headingPages"
            data-parent="#accordionSidebar"
          >
            <div className="bg-white py-2 collapse-inner rounded">
              <h6 className="collapse-header">Login Screens:</h6>
              <Link to="/login">
              <a className="collapse-item">
                Login
              </a>
              </Link>
              <Link to="/register">
              <a className="collapse-item">
                Register
              </a>
              </Link>
              <Link to="/lostpassword">
              <a className="collapse-item">
                Forgot Password
              </a>
              </Link>
            </div>
          </div>
        </li>
        {/* Nav Item - Charts */}
        <li className="nav-item">
          <Link to="/charts">
          <a className="nav-link">
            <i className="fas fa-fw fa-chart-area" />
            <span>Charts</span>
          </a>
          </Link>
        </li>
        {/* Nav Item - Tables */}
        <li className="nav-item">
          <Link to="/tables">
          <a className="nav-link">
            <i className="fas fa-fw fa-table" />
            <span>Tables</span>
          </a>
          </Link>
        </li>
        {/* Divider */}
        <hr className="sidebar-divider d-none d-md-block" />
        {/* Sidebar Toggler (Sidebar) */}
        <div className="text-center d-none d-md-inline">
          <button className="rounded-circle border-0" id="sidebarToggle" />
        </div>
        {/* Sidebar Message */}
        <div className="sidebar-card d-none d-lg-flex">
          <img
            className="sidebar-card-illustration mb-2"
            src="img/undraw_rocket.svg"
            alt="..."
          />
          <p className="text-center mb-2">
            <strong>SEALIFY Pro</strong> is packed with premium features,
            components, and more!
          </p>
          <a
            className="btn btn-success btn-sm"
            href="tbd"
          >
            Upgrade to Pro!
          </a>
        </div>
      </ul>
      {/* End of Sidebar */}
    </div>
  );
};

export default Navigation;
