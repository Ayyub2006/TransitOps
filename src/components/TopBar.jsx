import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function TopBar({ children, rightContent }) {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  
  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : null;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <header className="fixed top-0 right-0 h-[64px] left-0 lg:left-[260px] border-b border-outline-variant bg-surface flex justify-between items-center px-4 md:px-6 z-30 transition-all">
      <div className="flex items-center flex-1 min-w-0 mr-4">
        {children}
      </div>

      <div className="flex items-center gap-2 md:gap-4 relative shrink-0">
        {rightContent}
        <button className="hidden sm:block material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors cursor-pointer">notifications</button>
        <div 
          className="flex items-center gap-3 pl-2 sm:pl-4 sm:border-l border-outline-variant cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold leading-none truncate max-w-[150px]">{user ? user.name : 'Operator'}</p>
            <p className="text-[10px] text-on-surface-variant uppercase tracking-widest">{user ? user.role || 'OPERATOR' : 'OPERATOR'}</p>
          </div>
          {user && user.picture ? (
            <img className="w-8 h-8 rounded-full border border-primary/50 object-cover" src={user.picture} alt="Profile" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold">
              {user && user.name ? user.name.charAt(0) : 'U'}
            </div>
          )}
          <span className="material-symbols-outlined text-on-surface-variant text-sm">expand_more</span>
        </div>

        {/* Dropdown Menu */}
        {dropdownOpen && (
          <div className="absolute top-full right-0 mt-2 w-48 bg-surface-container border border-outline-variant rounded-lg shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
            <button className="w-full text-left px-4 py-2 text-sm text-on-surface hover:bg-surface-container-highest transition-colors flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">person</span>
              Profile
            </button>
            <button className="w-full text-left px-4 py-2 text-sm text-on-surface hover:bg-surface-container-highest transition-colors flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">settings</span>
              Settings
            </button>
            <div className="h-[1px] bg-outline-variant/30 my-1"></div>
            <button 
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 text-sm text-error hover:bg-error/10 transition-colors flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">logout</span>
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
