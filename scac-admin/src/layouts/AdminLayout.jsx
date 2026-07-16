import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminHeader from '../components/AdminHeader';
import AdminSidebar from '../components/AdminSidebar';
import '../pages/Main/css/Admin.css';

export default function AdminLayout() {
  return (
    <div className="admin_layout">
      <AdminSidebar />

      <div className="admin_content_wrap">
        <AdminHeader />

        <main className="admin_content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
