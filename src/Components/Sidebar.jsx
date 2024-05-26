import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import '../Styles/Sidebar.css';
import 'boxicons/css/boxicons.min.css';

function Sidebar({ children }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`container ${isOpen ? 'sidebar-open' : ''}`}>
      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="logo_details">
          <i className="bx bxl-audible icon"></i>
          <div className="logo_name">Musify</div>
          <i className="bx bx-menu" id="btn" onClick={toggleSidebar}></i>
        </div>
        <ul className="nav-list">
          <li>
            <i className="bx bx-search"></i>
            <input type="text" placeholder="Search..." />
            <span className="tooltip">Search</span>
          </li>
          <li>
            <NavLink to="/dashboard" activeclassname="active">
              <i className="bx bx-grid-alt"></i>
              <span className="link_name">Dashboard</span>
            </NavLink>
            <span className="tooltip">Dashboard</span>
          </li>
          <li>
            <NavLink to="/user" activeclassname="active">
              <i className="bx bx-user"></i>
              <span className="link_name">User</span>
            </NavLink>
            <span className="tooltip">User</span>
          </li>
          <li>
            <NavLink to="/contact" activeclassname="active">
              <i className="bx bx-chat"></i>
              <span className="link_name">Message</span>
            </NavLink>
            <span className="tooltip">Message</span>
          </li>
          <li>
            <NavLink to="/login" activeclassname="active">
              <i className="bx bx-pie-chart-alt-2"></i>
              <span className="link_name">Analytics</span>
            </NavLink>
            <span className="tooltip">Analytics</span>
          </li>
          <li>
            <NavLink to="/about" activeclassname="active">
              <i className="bx bx-folder"></i>
              <span className="link_name">File Manager</span>
            </NavLink>
            <span className="tooltip">File Manager</span>
          </li>
          <li>
            <NavLink to="/login" activeclassname="active">
              <i className="bx bx-cart-alt"></i>
              <span className="link_name">Order</span>
            </NavLink>
            <span className="tooltip">Order</span>
          </li>
          <li>
            <NavLink to="/settings" activeclassname="active">
              <i className="bx bx-cog"></i>
              <span className="link_name">Settings</span>
            </NavLink>
            <span className="tooltip">Settings</span>
          </li>
          <li className="profile">
            <div className="profile_details">
              <img src="profile.jpeg" alt="profile image" />
              <div className="profile_content">
                <div className="name">Anna Jhon</div>
                <div className="designation">Admin</div>
              </div>
            </div>
            <i className="bx bx-log-out" id="log_out"></i>
          </li>
        </ul>
      </div>
      <div className="main-content">
        {children}
      </div>
    </div>
  );
}

export default Sidebar;