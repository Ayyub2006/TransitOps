import React from 'react';
import { NavLink } from 'react-router-dom';

const navItems = [
  { path: '/dashboard', icon: 'dashboard', label: 'Command Center' },
  { path: '/trips', icon: 'settings_input_component', label: 'Operations' },
  { path: '/risk', icon: 'security', label: 'Safety' },
  { path: '/maintenance', icon: 'build', label: 'Maintenance' },
  { path: '/registry', icon: 'directions_bus', label: 'Vehicles' },
  { path: '/drivers', icon: 'person', label: 'Drivers' },
  { path: '/expenses', icon: 'account_balance_wallet', label: 'Expenses' },
  { path: '/reports', icon: 'assessment', label: 'Reports' },
];

export default function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 h-screen w-sidebar-width bg-surface border-r border-outline-variant z-50 flex flex-col py-gutter px-4 -translate-x-full lg:translate-x-0 transition-transform overflow-y-auto custom-scrollbar">
      <div className="mb-10 px-2 mt-4 shrink-0">
        <h1 className="font-headline-md text-headline-md font-bold text-primary tracking-widest uppercase">TransitOps</h1>
        <p className="font-label-caps text-label-caps text-on-surface-variant opacity-70">Command Center</p>
      </div>
      
      <nav className="flex-1 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              isActive
                ? "flex items-center px-4 py-3 text-primary bg-primary/10 border-l-4 border-primary font-bold"
                : "flex items-center px-4 py-3 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest transition-all duration-200"
            }
          >
            <span className="material-symbols-outlined mr-4">{item.icon}</span>
            <span className="font-label-caps text-label-caps uppercase">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto pt-6 border-t border-outline-variant pb-4 shrink-0">
        <button className="w-full bg-primary-container text-on-primary-container py-3 rounded-lg font-bold flex items-center justify-center gap-2 hover:brightness-110 active:scale-95 transition-all">
          <span className="material-symbols-outlined text-sm">add</span>
          <span className="font-label-caps uppercase">New Mission</span>
        </button>
      </div>
    </aside>
  );
}
