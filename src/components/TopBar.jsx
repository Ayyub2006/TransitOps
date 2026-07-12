import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchApi } from '../services/api';

export default function TopBar({ children, rightContent }) {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [fleetDropdownOpen, setFleetDropdownOpen] = useState(false);
  const [fleets, setFleets] = useState([]);
  const [activeFleetId, setActiveFleetId] = useState(localStorage.getItem('active_fleet_id') || 'all');
  
  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : null;
  const isManager = user && user.role === 'Fleet Manager';

  useEffect(() => {
    if (isManager) {
      fetchApi('/fleets')
        .then(data => {
          setFleets(data);
          if (!localStorage.getItem('active_fleet_id') && data.length > 0) {
            localStorage.setItem('active_fleet_id', 'all');
            setActiveFleetId('all');
          }
        })
        .catch(console.error);
    }
  }, [isManager]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('active_fleet_id');
    navigate('/login');
  };

  const handleFleetChange = (id) => {
    localStorage.setItem('active_fleet_id', id);
    setActiveFleetId(id);
    setFleetDropdownOpen(false);
    window.location.reload(); // Refresh data for the new fleet context
  };

  const activeFleetName = activeFleetId === 'all' ? 'All My Fleets' : fleets.find(f => f.id.toString() === activeFleetId)?.name || 'Select Fleet';

  return (
    <header className="fixed top-0 right-0 h-[64px] left-0 lg:left-[260px] border-b border-outline-variant bg-surface flex justify-between items-center px-4 md:px-6 z-30 transition-all">
      <div className="flex items-center flex-1 min-w-0 mr-4">
        {children}
      </div>

      <div className="flex items-center gap-2 md:gap-4 relative shrink-0">
        {rightContent}
        
        {isManager && fleets.length > 0 && (
          <div className="relative">
            <button 
              onClick={() => setFleetDropdownOpen(!fleetDropdownOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-outline-variant bg-surface-container hover:bg-surface-container-highest transition-colors text-sm font-medium text-on-surface"
            >
              <span className="material-symbols-outlined text-[16px] text-primary">directions_car</span>
              {activeFleetName}
              <span className="material-symbols-outlined text-[16px]">expand_more</span>
            </button>
            
            {fleetDropdownOpen && (
              <div className="absolute top-full right-0 mt-1 w-56 bg-surface-container border border-outline-variant rounded-lg shadow-xl py-2 z-50">
                <button 
                  onClick={() => handleFleetChange('all')}
                  className={`w-full text-left px-4 py-2 text-sm transition-colors flex items-center justify-between ${activeFleetId === 'all' ? 'bg-primary/10 text-primary font-bold' : 'text-on-surface hover:bg-surface-container-highest'}`}
                >
                  All My Fleets
                  {activeFleetId === 'all' && <span className="material-symbols-outlined text-[18px]">check</span>}
                </button>
                <div className="h-[1px] bg-outline-variant/30 my-1"></div>
                {fleets.map(f => (
                  <button 
                    key={f.id}
                    onClick={() => handleFleetChange(f.id.toString())}
                    className={`w-full text-left px-4 py-2 text-sm transition-colors flex items-center justify-between ${activeFleetId === f.id.toString() ? 'bg-primary/10 text-primary font-bold' : 'text-on-surface hover:bg-surface-container-highest'}`}
                  >
                    {f.name}
                    {activeFleetId === f.id.toString() && <span className="material-symbols-outlined text-[18px]">check</span>}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

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
            <button 
              onClick={() => { navigate('/manager/profile'); setDropdownOpen(false); }}
              className="w-full text-left px-4 py-2 text-sm text-on-surface hover:bg-surface-container-highest transition-colors flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">person</span>
              Profile
            </button>
            <button 
              onClick={() => { navigate('/manager/settings'); setDropdownOpen(false); }}
              className="w-full text-left px-4 py-2 text-sm text-on-surface hover:bg-surface-container-highest transition-colors flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">settings</span>
              Settings
            </button>
            <button 
              onClick={() => { navigate('/manager/trips'); setDropdownOpen(false); }}
              className="w-full text-left px-4 py-2 text-sm text-on-surface hover:bg-surface-container-highest transition-colors flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">calendar_today</span>
              Schedule
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
