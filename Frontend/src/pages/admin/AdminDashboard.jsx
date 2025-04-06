import React from "react";
import { Outlet } from "react-router-dom";
import AdminLayout from "../../components/admin/layout/Layout";

const AdminDashboard = () => {
  return (
    <AdminLayout>
      <Outlet />
    </AdminLayout>
  );
};

export default AdminDashboard; 