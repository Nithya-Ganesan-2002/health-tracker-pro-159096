import React, { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ThemeToggle() {
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  // PUBLIC_INTERFACE
  /** Toggle between light and dark themes. */
  const toggle = () => {
    setTheme(prev => prev === "light" ? "dark" : "light");
  };

  return (
    <button className="theme-toggle" onClick={toggle} aria-label="Toggle theme">
      {theme === "light" ? "🌙 Dark" : "☀️ Light"}
    </button>
  );
}

function Topbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const onLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="topbar">
      <div className="brand">
        <Link to="/">Health Tracker Pro</Link>
      </div>
      <div className="topbar-actions">
        <ThemeToggle />
        <div className="user-chip">
          <span className="avatar">{user?.name?.[0]?.toUpperCase() || "U"}</span>
          <span className="username">{user?.name || user?.email || "User"}</span>
          <button className="btn btn-secondary btn-sm" onClick={onLogout}>Logout</button>
        </div>
      </div>
    </div>
  );
}

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <span className="logo">HT</span>
        <span className="title">Health Tracker</span>
      </div>
      <nav className="nav">
        <NavLink end to="/" className="nav-link">Dashboard</NavLink>
        <NavLink to="/foods" className="nav-link">Foods</NavLink>
        <NavLink to="/exercises" className="nav-link">Exercises</NavLink>
        <NavLink to="/analytics" className="nav-link">Analytics</NavLink>
        <NavLink to="/profile" className="nav-link">Profile</NavLink>
        <NavLink to="/goals" className="nav-link">Goals</NavLink>
      </nav>
      <div className="sidebar-footer">
        <a className="small-link" href="https://reactjs.org" target="_blank" rel="noreferrer">Docs</a>
      </div>
    </aside>
  );
}

// PUBLIC_INTERFACE
/**
 * Dashboard shell layout with sidebar and topbar.
 */
export default function Layout() {
  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main">
        <Topbar />
        <div className="content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
