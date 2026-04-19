import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, LogOut, Bell, Home, Users, Building, DoorOpen, ListChecks, Settings } from 'lucide-react';

export const Sidebar = ({ collapsed = false, onToggle }) => {
  const { userType, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const studentNavItems = [
    { icon: Home, label: 'Dashboard', path: '/student/dashboard' },
    { icon: Building, label: 'Available Hostels', path: '/student/hostels' },
    { icon: DoorOpen, label: 'Available Rooms', path: '/student/rooms' },
    { icon: ListChecks, label: 'My Applications', path: '/student/applications' },
  ];

  const adminNavItems = [
    { icon: Home, label: 'Dashboard', path: '/admin/dashboard' },
    { icon: Users, label: 'Students', path: '/admin/students' },
    { icon: Building, label: 'Hostels', path: '/admin/hostels' },
    { icon: DoorOpen, label: 'Rooms', path: '/admin/rooms' },
    { icon: ListChecks, label: 'Allocations', path: '/admin/allocations' },
  ];

  const navItems = userType === 'admin' ? adminNavItems : studentNavItems;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <div className="sidebar-logo">
          {userType === 'admin' ? 'A' : 'S'}
        </div>
        <div className="sidebar-title">
          {userType === 'admin' ? 'Admin' : 'Student'}
        </div>
      </div>

      <ul className="nav-items">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <li key={item.path} className="nav-item">
              <a
                href={item.path}
                className={`nav-link ${isActive ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  navigate(item.path);
                }}
              >
                <span className="nav-link-icon">
                  <Icon size={20} />
                </span>
                <span className="nav-link-text">{item.label}</span>
              </a>
            </li>
          );
        })}
      </ul>

      <div className="sidebar-footer">
        <button
          onClick={handleLogout}
          style={{
            width: '100%',
            padding: '12px 16px',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(255, 107, 107, 0.1)',
            color: 'var(--color-primary)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            fontWeight: '600',
            transition: 'all var(--transition-md)',
          }}
          onMouseEnter={(e) => e.target.style.background = 'rgba(255, 107, 107, 0.2)'}
          onMouseLeave={(e) => e.target.style.background = 'rgba(255, 107, 107, 0.1)'}
        >
          <LogOut size={18} />
          <span className="nav-link-text">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export const Topbar = ({ onToggleSidebar, title }) => {
  const { user } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <div className="topbar">
      <div className="topbar-left">
        <button className="toggle-btn" onClick={onToggleSidebar}>
          <Menu size={20} />
        </button>
        <div className="topbar-title">{title || 'Dashboard'}</div>
      </div>

      <div className="topbar-right">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search..."
            className="search-input"
          />
          <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
        </div>

        <div className="user-menu">
          <button
            className="notification-bell"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <Bell size={20} />
            <span className="notification-dot"></span>
          </button>

          <div className="user-avatar" title={user?.name || 'User'}>
            {user?.name?.[0]?.toUpperCase() || 'U'}
          </div>
        </div>
      </div>
    </div>
  );
};

export const PageHeader = ({ title, description, actions }) => {
  return (
    <div className="page-header">
      <h1 className="page-title">{title}</h1>
      {description && <p className="page-description">{description}</p>}
      {actions && <div className="page-actions">{actions}</div>}
    </div>
  );
};
