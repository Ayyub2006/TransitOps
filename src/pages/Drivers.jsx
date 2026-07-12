import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

import TopBar from '../components/TopBar';

const driversData = [
  { id: 1, initials: 'MS', name: 'Mahesh Sharma', status: 'Available', statusColor: 'emerald-400', license: 'MH-01-2015-X', category: 'HEAVY DUTY', expires: 'Oct 24, 2026', safety: 94, phone: '+91 98765-43210', isCritical: false },
  { id: 2, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBLjKwI4SI3dX1ZnRAev1qu-73os5s4NIVb0pndBiZdC-MJGlYUFYfakj57Hd9nCEqr_wo8nw54WWVUikFbM9V68xU17TDiaqf6OqwpeMHs3a7KcTOmpoSNM5b63zZVLk5Tk0XEd8vqVZB5FdLnUqAYBRhOEKosUHmslf8pjXgieOLRE2eGMVoRki0Z73u29XBF3gA-vPjyhzHOWkr4kyIlX8O226i4k1gP5HkAKzh9tv7fY0Ftu5R-dA', name: 'Anita Verma', status: 'On Trip', statusColor: 'amber-400', license: 'MH-02-2018-B', category: 'PASSENGER', expires: 'Oct 18, 2024', safety: 78, phone: '+91 87654-32109', isCritical: false, icon: 'warning' },
  { id: 3, initials: 'RK', name: 'Ravi Kumar', status: 'Suspended', statusColor: 'error', license: 'MH-03-2020-L', category: 'HAZMAT', expires: 'EXPIRED: Oct 02, 2024', safety: 52, phone: '+91 76543-21098', isCritical: true, icon: 'emergency' },
  { id: 4, initials: 'PS', name: 'Priya Singh', status: 'Off Duty', statusColor: 'secondary', license: 'MH-04-2022-M', category: 'STANDARD', expires: 'Jan 12, 2025', safety: 89, phone: '+91 91234-56780', isCritical: false }
];

export default function Drivers() {
  const [viewMode, setViewMode] = useState('grid');
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="min-h-screen overflow-x-hidden dark text-on-surface bg-background font-body-md">
      
      {/* SideNavBar */}
      <Sidebar />
      
      {/* TopNavBar */}
      <TopBar>
        <div className="flex items-center flex-1 max-w-xl">
          <div className="relative w-full hidden md:block">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline-variant">search</span>
            <input className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg pl-10 pr-4 py-2 text-sm" placeholder="Search drivers by name, license or status..." type="text"/>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-surface-container-high border border-outline-variant rounded-full ml-4">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
          <span className="text-xs font-label-caps text-on-surface">Role: Commander</span>
        </div>
      </TopBar>

      {/* Main Content */}
      <main className="ml-0 lg:ml-[260px] mt-[64px] min-h-[calc(100vh-64px)] bg-background p-4 md:p-6 pb-20">
        
        {/* Header Area */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">Driver Management</h2>
            <p className="text-outline text-sm">Monitor and manage 248 registered operators across the fleet network.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex border border-outline-variant rounded-lg overflow-x-auto mr-2">
              <button 
                onClick={() => setViewMode('grid')}
                className={`px-3 py-2 flex items-center transition-colors ${viewMode === 'grid' ? 'bg-surface-container-highest text-primary' : 'bg-surface text-on-surface-variant hover:bg-surface-container-high'}`}
              >
                <span className="material-symbols-outlined text-sm">grid_view</span>
              </button>
              <button 
                onClick={() => setViewMode('list')}
                className={`px-3 py-2 flex items-center transition-colors ${viewMode === 'list' ? 'bg-surface-container-highest text-primary' : 'bg-surface text-on-surface-variant hover:bg-surface-container-high'}`}
              >
                <span className="material-symbols-outlined text-sm">format_list_bulleted</span>
              </button>
            </div>
            <button 
              onClick={() => setDrawerOpen(true)}
              className="bg-primary-container text-on-primary-container font-label-caps px-4 py-2.5 rounded-lg flex items-center gap-2 hover:brightness-110 active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-[20px]">add</span>
              <span className="hidden sm:inline">ADD DRIVER</span>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 mb-8">
          <div className="flex items-center gap-2 px-3 py-1.5 border border-outline-variant rounded-full hover:bg-surface-container-high cursor-pointer transition-colors">
            <span className="text-xs font-label-caps">STATUS: ALL</span>
            <span className="material-symbols-outlined text-xs">keyboard_arrow_down</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 border border-outline-variant rounded-full hover:bg-surface-container-high cursor-pointer transition-colors">
            <span className="text-xs font-label-caps">LICENSE: ANY</span>
            <span className="material-symbols-outlined text-xs">keyboard_arrow_down</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 border border-error/50 bg-error/10 text-error rounded-full hover:bg-error/20 cursor-pointer transition-colors">
            <span className="material-symbols-outlined text-xs">warning</span>
            <span className="text-xs font-label-caps">EXPIRING SOON</span>
          </div>
          <div className="h-4 w-px bg-outline-variant mx-2 hidden sm:block"></div>
          <span className="text-xs font-label-caps text-outline hidden sm:block">SORT BY: LAST ACTIVE</span>
        </div>

        {/* Drivers Display */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {driversData.map((driver) => (
              <div key={driver.id} className={`lustrous-border bg-surface-container-low rounded-xl p-5 flex flex-col h-full group ${driver.isCritical ? 'border-l-2 border-l-error' : ''}`}>
                <div className="flex justify-between items-start mb-4">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-full border border-outline-variant bg-surface-container flex items-center justify-center overflow-hidden shrink-0">
                      {driver.image ? (
                        <img className="w-full h-full object-cover" src={driver.image} alt={driver.name} />
                      ) : (
                        <span className={`font-headline-sm ${driver.isCritical ? 'text-error' : driver.initials === 'PS' ? 'text-outline' : 'text-primary'}`}>{driver.initials}</span>
                      )}
                    </div>
                    <div>
                      <h3 className="font-headline-sm text-on-surface group-hover:text-primary transition-colors line-clamp-1">{driver.name}</h3>
                      <div className="flex items-center gap-1.5">
                        <div className={`w-1.5 h-1.5 rounded-full bg-${driver.statusColor}`}></div>
                        <span className={`text-[10px] font-label-caps text-${driver.statusColor} uppercase`}>{driver.status}</span>
                      </div>
                    </div>
                  </div>
                  <button className="text-outline-variant hover:text-on-surface shrink-0"><span className="material-symbols-outlined">more_vert</span></button>
                </div>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-[11px] font-mono text-outline">{driver.license}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded font-label-caps ${driver.isCritical ? 'bg-error/10 border border-error/20 text-error' : 'bg-outline-variant/30 text-on-surface-variant'}`}>{driver.category}</span>
                  </div>
                  <div className={`flex items-center gap-2 text-xs ${driver.isCritical ? 'text-error font-bold' : driver.icon ? 'text-amber-400 font-medium' : 'text-on-surface-variant'}`}>
                    <span className="material-symbols-outlined text-xs">{driver.icon || 'calendar_today'}</span>
                    <span>{driver.expires.includes('EXPIRED') ? driver.expires : `License Expires: ${driver.expires}`}</span>
                  </div>
                </div>
                
                <div className="mt-auto">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-[10px] font-label-caps text-outline uppercase">Safety Score</span>
                    <span className={`text-xs font-bold text-${driver.statusColor}`}>{driver.safety}/100</span>
                  </div>
                  <div className="h-1 w-full bg-surface-container-highest rounded-full overflow-hidden">
                    <div className={`h-full bg-${driver.statusColor}`} style={{ width: `${driver.safety}%` }}></div>
                  </div>
                  <div className="flex justify-between items-center mt-6 pt-4 border-t border-outline-variant/30">
                    <span className="text-xs text-outline">{driver.phone}</span>
                    <button className="text-xs text-primary font-label-caps hover:underline">VIEW PROFILE</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {driversData.map((driver) => (
              <div key={driver.id} className={`bg-surface-container-low border border-outline-variant rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 group hover:bg-surface-container transition-colors ${driver.isCritical ? 'border-l-4 border-l-error' : ''}`}>
                
                <div className="flex items-center gap-4 min-w-[250px]">
                  <div className="w-10 h-10 rounded-full border border-outline-variant bg-surface-container flex items-center justify-center overflow-hidden shrink-0">
                    {driver.image ? (
                      <img className="w-full h-full object-cover" src={driver.image} alt={driver.name} />
                    ) : (
                      <span className={`text-sm font-bold ${driver.isCritical ? 'text-error' : driver.initials === 'PS' ? 'text-outline' : 'text-primary'}`}>{driver.initials}</span>
                    )}
                  </div>
                  <div>
                    <h3 className="font-headline-sm text-on-surface group-hover:text-primary transition-colors">{driver.name}</h3>
                    <div className="flex items-center gap-1.5">
                      <div className={`w-1.5 h-1.5 rounded-full bg-${driver.statusColor}`}></div>
                      <span className={`text-[10px] font-label-caps text-${driver.statusColor} uppercase`}>{driver.status}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 flex-1 gap-4 items-center">
                  <div>
                    <p className="text-[10px] font-label-caps text-outline mb-1">LICENSE</p>
                    <p className="text-xs font-mono text-on-surface-variant">{driver.license}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-label-caps text-outline mb-1">CATEGORY</p>
                    <span className={`text-[10px] px-2 py-0.5 rounded font-label-caps inline-block ${driver.isCritical ? 'bg-error/10 border border-error/20 text-error' : 'bg-outline-variant/30 text-on-surface-variant'}`}>{driver.category}</span>
                  </div>
                  <div>
                    <p className="text-[10px] font-label-caps text-outline mb-1">SAFETY SCORE</p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1 bg-surface-container-highest rounded-full overflow-hidden max-w-[60px]">
                        <div className={`h-full bg-${driver.statusColor}`} style={{ width: `${driver.safety}%` }}></div>
                      </div>
                      <span className={`text-xs font-bold text-${driver.statusColor}`}>{driver.safety}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] font-label-caps text-outline mb-1">CONTACT</p>
                    <p className="text-xs text-on-surface-variant">{driver.phone}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 justify-end shrink-0 border-t md:border-t-0 border-outline-variant pt-3 md:pt-0">
                  <button className="px-4 py-1.5 bg-primary/10 text-primary hover:bg-primary/20 rounded font-label-caps text-xs transition-colors">
                    PROFILE
                  </button>
                  <button className="p-1.5 text-outline-variant hover:text-on-surface rounded transition-colors">
                    <span className="material-symbols-outlined text-lg">more_vert</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Registration Drawer Overlay */}
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity duration-300 ${drawerOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} 
        onClick={() => setDrawerOpen(false)}
      ></div>
      
      {/* Registration Drawer */}
      <div 
        className={`fixed top-0 right-0 h-full w-full max-w-[440px] bg-surface-container-high border-l border-outline-variant z-[60] transition-transform duration-500 ease-in-out flex flex-col shadow-2xl ${drawerOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="p-6 border-b border-outline-variant flex justify-between items-center bg-surface">
          <div>
            <h2 className="font-headline-sm text-headline-sm text-on-surface">Register New Driver</h2>
            <p className="text-xs text-outline uppercase font-label-caps tracking-wider">Operator Onboarding</p>
          </div>
          <button 
            className="text-outline-variant hover:text-error hover:bg-error/10 p-2 rounded-lg transition-colors" 
            onClick={() => setDrawerOpen(false)}
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8">
          {/* Form Section: Personal */}
          <div className="space-y-5">
            <h3 className="text-sm font-bold text-primary flex items-center gap-2 border-b border-outline-variant/30 pb-2">
              <span className="material-symbols-outlined text-sm">person</span>
              PERSONAL DETAILS
            </h3>
            
            <label className="block">
              <span className="text-xs font-label-caps text-outline uppercase mb-2 block">Full Legal Name</span>
              <input className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-4 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-outline-variant" placeholder="e.g. Ramesh Patel" type="text"/>
            </label>
            
            <label className="block">
              <span className="text-xs font-label-caps text-outline uppercase mb-2 block">Contact Number</span>
              <input className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-4 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-outline-variant" placeholder="+91 00000-00000" type="tel"/>
            </label>
          </div>
          
          {/* Form Section: Licensing */}
          <div className="space-y-5">
            <h3 className="text-sm font-bold text-primary flex items-center gap-2 border-b border-outline-variant/30 pb-2">
              <span className="material-symbols-outlined text-sm">badge</span>
              LICENSING & CREDENTIALS
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <label>
                <span className="text-xs font-label-caps text-outline uppercase mb-2 block">License Number</span>
                <input className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-4 py-3 text-sm font-mono focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-outline-variant" placeholder="MH-0000-X" type="text"/>
              </label>
              <label>
                <span className="text-xs font-label-caps text-outline uppercase mb-2 block">License Category</span>
                <select className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-4 py-3 text-sm appearance-none focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-on-surface">
                  <option>Heavy Duty</option>
                  <option>Passenger</option>
                  <option>Hazmat</option>
                  <option>Standard</option>
                </select>
              </label>
            </div>
            
            <label className="block">
              <span className="text-xs font-label-caps text-outline uppercase mb-2 block">Expiry Date</span>
              <input className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-4 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-on-surface" type="date"/>
            </label>
          </div>

          {/* Form Section: Operational */}
          <div className="space-y-5">
            <h3 className="text-sm font-bold text-primary flex items-center gap-2 border-b border-outline-variant/30 pb-2">
              <span className="material-symbols-outlined text-sm">assignment_turned_in</span>
              OPERATIONAL STATUS
            </h3>
            
            <div>
              <span className="text-xs font-label-caps text-outline uppercase mb-3 block">Initial Status</span>
              <div className="flex p-1 bg-surface-container-lowest border border-outline-variant rounded-lg">
                <button className="flex-1 py-2 text-[10px] font-label-caps rounded bg-primary-container text-on-primary-container font-bold shadow-sm">AVAILABLE</button>
                <button className="flex-1 py-2 text-[10px] font-label-caps text-outline hover:text-on-surface transition-colors">OFF DUTY</button>
                <button className="flex-1 py-2 text-[10px] font-label-caps text-outline hover:text-on-surface transition-colors">TRAINING</button>
              </div>
            </div>
          </div>
          
          {/* Safety Score Simulation */}
          <div className="p-4 bg-primary-container/10 rounded-lg border border-primary/30 mt-4 shadow-[inset_0_0_20px_rgba(98,243,236,0.05)]">
            <div className="flex items-center gap-2 mb-2">
              <span className="material-symbols-outlined text-primary text-sm">info</span>
              <span className="text-xs font-bold text-primary uppercase">Safety Benchmarking</span>
            </div>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              New drivers are initialized with a baseline safety score of <strong className="text-on-surface">85/100</strong>. Scores fluctuate automatically based on telemetry data, speed limits, and incident reports.
            </p>
          </div>
        </div>
        
        {/* Pinned Footer */}
        <div className="p-6 border-t border-outline-variant bg-surface">
          <button 
            className="w-full bg-primary-container text-on-primary-container font-label-caps py-4 rounded-xl flex justify-center items-center gap-2 hover:brightness-110 active:scale-[0.98] transition-all font-bold shadow-lg shadow-primary/20"
            onClick={() => setDrawerOpen(false)}
          >
            <span className="material-symbols-outlined text-[20px]">person_add</span>
            ENLIST DRIVER
          </button>
        </div>
      </div>

    </div>
  );
}
