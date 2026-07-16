import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import adminMenuData from '../data/admin_sidebar.json';

export default function AdminSidebar() {
  return (
    <aside className="admin_sidebar">
      <div className="admin_sidebar_logo">
        <span className="admin_sidebar_logo_mark">
          <img src="/logo/logo.png" alt="SCAC" className="sidebar_logo_img" />
        </span>
        <span className="admin_sidebar_logo_text">
          Study Cafe
          <br />
          Access Control
        </span>
      </div>

      <nav className="admin_navigation">
        {adminMenuData.map((menu) => (
          <NavLink
            key={menu.path}
            to={menu.path}
            end={menu.end}
            className={({ isActive }) =>
              `admin_navigation_item${isActive ? ' is_active' : ''}`
            }
          >
            {/* <span className="admin_navigation_icon" aria-hidden="true">
              {menu.icon}
            </span> */}

            <span>{menu.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="admin_sidebar_footer">
        <p>SCAC Admin</p>
        <span>Frontend v1.0</span>
      </div>
    </aside>
  );
}
