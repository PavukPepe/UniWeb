"use client";

import { useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

import AdminNav from "./AmdinNav";
import UsersTable from "./UserTable";
import CoursesTable from "./CourseTable";
import CategoriesTable from "./CategoryTable";
import CommentsTable from "./CommentsTable";

function AdminDashboard() {
    const [activeSection, setActiveSection] = useState("users");
  
    // Проверяем роль admin
    const roles = JSON.parse(localStorage.getItem("roles") || "[]");
    const isAdmin = roles.includes("admin");
  
    // Если пользователь не админ, перенаправляем на главную страницу
    if (!isAdmin) {
      return <Navigate to="/profile" replace />;
    }
  
    const renderSection = () => {
      switch (activeSection) {
        case "users":
          return <UsersTable />;
        case "courses":
          return <CoursesTable />;
        case "categories":
          return <CategoriesTable />;
        case "comments":
          return <CommentsTable />;
        default:
          return <UsersTable />;
      }
    };
  
    return (
      <div className="d-flex min-vh-100">
        <AdminNav activeSection={activeSection} setActiveSection={setActiveSection} />
  
        <main className="flex-grow-1 p-4 bg-light" style={{ width: "80%" }}>
          <h2 className="mb-4 text-dark fs-4 fw-bold mb-4">
            Панель управления: {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}
          </h2>
          {renderSection()}
        </main>
      </div>
    );
  }
  
  export default AdminDashboard;