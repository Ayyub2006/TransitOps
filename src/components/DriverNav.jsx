import React from 'react';
import { NavLink } from 'react-router-dom';

export default function DriverNav() {
  const items = [
    { path: '/driver/dashboard', icon: 'home', label: 'Home' },
    { path: '/driver/notifications', icon: 'notifications', label: 'Alerts' },
    { path: '/driver/trips', icon: 'local_shipping', label: 'My Trips' },
    { path: '/driver/profile', icon: 'person', label: 'Profile' }
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-surface border-t border-outline-variant z-50 flex justify-around items-center h-[72px] px-2 pb-safe">
      {items.map(item => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) =>
            `flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${isActive ? 'text-primary' : 'text-on-surface-variant hover:text-on-surface'}`
          }
        >
          <span className="material-symbols-outlined text-[24px]">{item.icon}</span>
          <span className="text-[10px] font-bold uppercase tracking-wider">{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
