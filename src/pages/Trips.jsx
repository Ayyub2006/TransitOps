import React from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

import TopBar from '../components/TopBar';

export default function Trips() {
  return (
    <div className="min-h-screen overflow-x-hidden dark text-on-surface bg-background font-body-md">
      
{/*  Sidebar Navigation  */}
<Sidebar />
{/*  Top App Bar  */}
<TopBar rightContent={
  <div className="px-3 py-1 bg-surface-container-highest border border-outline-variant rounded text-[11px] font-bold tracking-tighter hidden sm:block mr-2">
    CLEARANCE: L3
  </div>
}>
  <div className="flex items-center gap-4 flex-wrap">
    <div className="relative">
      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
      <input className="bg-surface-container border border-outline-variant rounded-full pl-10 pr-4 py-1.5 w-64 md:w-80 text-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" placeholder="Search mission, driver, or tag..." type="text"/>
    </div>
    <nav className="hidden lg:flex gap-6">
      <a className="font-label-caps text-label-caps text-primary border-b-2 border-primary pb-1" href="#" onClick={(e) => e.preventDefault()}>Live Tracking</a>
      <a className="font-label-caps text-label-caps text-on-surface-variant hover:text-primary transition-colors" href="#" onClick={(e) => e.preventDefault()}>Schedules</a>
    </nav>
  </div>
</TopBar>
{/*  Main Content Canvas  */}
<main className="ml-0 lg:ml-[var(--spacing-sidebar-width)] mt-topbar-height p-6 min-h-[calc(100vh-64px)] overflow-x-auto bg-[#0b0f14]">
{/*  Dashboard Header  */}
<div className="mb-8 flex justify-between items-end">
<div>
<h1 className="font-headline-lg text-headline-lg text-on-surface">Trip Management</h1>
<p className="text-on-surface-variant mt-1">Real-time dispatch board for mission-critical logistics.</p>
</div>
<div className="flex gap-2">
<div className="bg-surface-container px-4 py-2 border border-outline-variant rounded flex items-center gap-3">
<span className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Efficiency</span>
<span className="font-kpi-value text-kpi-value text-primary">94.2%</span>
</div>
</div>
</div>
{/*  Kanban Board  */}
<div className="flex gap-6 pb-6 overflow-x-auto h-full items-start">
{/*  COLUMN: Draft  */}
<div className="kanban-column flex-shrink-0 w-80">
<div className="flex items-center justify-between mb-4 px-2">
<div className="flex items-center gap-2">
<div className="w-2 h-2 rounded-full bg-[#94A3B8]"></div>
<h2 className="font-headline-sm text-headline-sm uppercase tracking-widest text-[14px]">Draft</h2>
</div>
<span className="bg-surface-container-highest text-on-surface px-2 py-0.5 rounded text-[10px] font-bold">12 Trips</span>
</div>
<div className="space-y-4">
{/*  Card 1  */}
<div className="trip-card relative group bg-[#131A22] border border-[#1F2A35] p-4 rounded-lg hover:border-primary/40 transition-all cursor-pointer">
<div className="flex justify-between items-start mb-3">
<span className="text-[10px] font-bold text-on-surface-variant">TRP-MH-01</span>
<span className="material-symbols-outlined text-[16px] text-on-surface-variant">more_vert</span>
</div>
<div className="flex items-center gap-3 mb-4">
<div className="flex flex-col items-center gap-1">
<span className="w-2 h-2 rounded-full border border-primary"></span>
<div className="w-0.5 h-6 bg-outline-variant"></div>
<span className="w-2 h-2 bg-primary rounded-full"></span>
</div>
<div className="flex-1 space-y-2">
<p className="text-xs font-bold truncate">JNPT Port, Navi Mumbai</p>
<p className="text-xs font-bold truncate">Andheri East MIDC</p>
</div>
</div>
<div className="grid grid-cols-2 gap-3 mb-4">
<div className="flex items-center gap-2">
<span className="material-symbols-outlined text-[14px] text-primary">local_shipping</span>
<span className="text-[11px] font-medium">MH-01-VX</span>
</div>
<div className="flex items-center gap-2">
<img className="w-4 h-4 rounded-full border border-outline-variant" data-alt="A small circular professional headshot avatar of a truck driver in a dark uniform with soft blue lighting." src="https://lh3.googleusercontent.com/aida-public/AB6AXuDrjgxGlexN77L7yb-9lYYbUepX6pJiF6Boj5u2FwyOJFOKPiSCPzFbiZRwKxGlUV3o5kf7y58G-0OQimEegXMHArtFs6PGGBHA1w5AmCkK9u7YZyqmf7cqT8CoM5PbMEIPKx0m0v45yv7hUBVx75tSgYNq0jfXhEFTST3T1ZCP8We9-nLZEBG_cnBnasijuSR3MtVUQfhUvTlES_2BqLzEl7SfBxeB85Q-VVK4PdwbD4upyaYm8OEpOQ"/>
<span className="text-[11px] font-medium">Eshan Thakkar</span>
</div>
</div>
<div className="space-y-1">
<div className="flex justify-between text-[10px] font-bold">
<span className="text-on-surface-variant uppercase">Cargo Load</span>
<span className="text-primary">82%</span>
</div>
<div className="w-full h-1.5 bg-surface-container rounded-full overflow-hidden">
<div className="h-full bg-primary" style={{width: "82%", }}></div>
</div>
</div>
<div className="mt-4 flex justify-between items-center text-[11px]">
<span className="text-on-surface-variant">Est: 420km</span>
<span className="text-on-surface-variant font-mono">14:00 Today</span>
</div>
{/*  Dispatch Hover Button  */}
<div className="dispatch-overlay absolute inset-0 bg-[#0B0F14]/80 opacity-0 transition-opacity flex items-center justify-center rounded-lg backdrop-blur-[2px]">
<button className="bg-primary text-on-primary font-bold px-6 py-2 rounded uppercase text-[12px] tracking-wider active:scale-95 transition-transform">Dispatch Mission</button>
</div>
</div>
{/*  Card 2  */}
<div className="trip-card relative group bg-[#131A22] border border-[#1F2A35] p-4 rounded-lg hover:border-primary/40 transition-all cursor-pointer">
<div className="flex justify-between items-start mb-3">
<span className="text-[10px] font-bold text-on-surface-variant">TRP-MH-02</span>
<span className="material-symbols-outlined text-[16px] text-on-surface-variant">more_vert</span>
</div>
<div className="flex items-center gap-3 mb-4">
<div className="flex flex-col items-center gap-1">
<span className="w-2 h-2 rounded-full border border-primary"></span>
<div className="w-0.5 h-6 bg-outline-variant"></div>
<span className="w-2 h-2 bg-primary rounded-full"></span>
</div>
<div className="flex-1 space-y-2">
<p className="text-xs font-bold truncate">Bhiwandi Hub</p>
<p className="text-xs font-bold truncate">Thane West Terminal</p>
</div>
</div>
<div className="grid grid-cols-2 gap-3 mb-4">
<div className="flex items-center gap-2">
<span className="material-symbols-outlined text-[14px] text-primary">airport_shuttle</span>
<span className="text-[11px] font-medium">MH-02-VN</span>
</div>
<div className="flex items-center gap-2">
<img className="w-4 h-4 rounded-full border border-outline-variant" data-alt="Close-up professional avatar of a female logistics driver with a focused expression, neon green secondary lighting in a futuristic tech setting." src="https://lh3.googleusercontent.com/aida-public/AB6AXuDp9qkHqnp6h1iV_xTzZm2mMsgJC24RSp_kLMxXbLESgBRdIvb1s20caPVSNp7bzS_hey_00iJF6YzRxy3_cuKxUPXDqNb0TxnxpvGaiIREyPVkciXDUPbk3n0Tsy2s_usFbp0kOUlB-0Tx-yk67le11Y0B_w4wgriCyEEFIVMV5eT7V4WYH6P7cpz7B7XqZM9kHts0_cYPI0XYRGpIMlhuPADRIKtUz6H53eMHAX9vTG7HPSa4u-MJig"/>
<span className="text-[11px] font-medium">Smita Jadhav</span>
</div>
</div>
<div className="space-y-1">
<div className="flex justify-between text-[10px] font-bold">
<span className="text-on-surface-variant uppercase">Cargo Load</span>
<span className="text-error font-bold">95%</span>
</div>
<div className="w-full h-1.5 bg-surface-container rounded-full overflow-hidden">
<div className="h-full bg-error" style={{width: "95%", }}></div>
</div>
</div>
<div className="mt-4 flex justify-between items-center text-[11px]">
<span className="text-on-surface-variant">Est: 180km</span>
<span className="text-on-surface-variant font-mono">ASAP</span>
</div>
<div className="dispatch-overlay absolute inset-0 bg-[#0B0F14]/80 opacity-0 transition-opacity flex items-center justify-center rounded-lg backdrop-blur-[2px]">
<button className="bg-primary text-on-primary font-bold px-6 py-2 rounded uppercase text-[12px] tracking-wider">Dispatch Mission</button>
</div>
</div>
</div>
</div>
{/*  COLUMN: Dispatched  */}
<div className="kanban-column flex-shrink-0 w-80">
<div className="flex items-center justify-between mb-4 px-2">
<div className="flex items-center gap-2">
<div className="w-2 h-2 rounded-full bg-[#FBBF24]"></div>
<h2 className="font-headline-sm text-headline-sm uppercase tracking-widest text-[14px]">Dispatched</h2>
</div>
<span className="bg-surface-container-highest text-on-surface px-2 py-0.5 rounded text-[10px] font-bold">8 Trips</span>
</div>
<div className="space-y-4">
{/*  Active Card  */}
<div className="bg-[#131A22] border-l-2 border-[#FBBF24] border-t border-r border-b border-[#1F2A35] p-4 rounded-lg relative overflow-hidden">
<div className="absolute top-0 right-0 p-2">
<span className="animate-pulse w-2 h-2 rounded-full bg-[#FBBF24] inline-block"></span>
</div>
<div className="flex justify-between items-start mb-3">
<span className="text-[10px] font-bold text-[#FBBF24]">EN ROUTE</span>
<span className="material-symbols-outlined text-[16px] text-on-surface-variant">map</span>
</div>
<div className="flex items-center gap-3 mb-4">
<div className="flex-1 space-y-1">
<p className="text-xs font-bold truncate">JNPT Port</p>
<div className="flex items-center gap-2">
<div className="flex-1 h-[1px] bg-outline-variant relative">
<span className="material-symbols-outlined text-[10px] absolute left-1/2 -top-1.5 -translate-x-1/2 text-primary" style={{fontVariationSettings: "'FILL' 1", }}>local_shipping</span>
</div>
</div>
<p className="text-xs font-bold truncate">Pune Station</p>
</div>
</div>
<div className="grid grid-cols-2 gap-3 mb-4">
<div className="flex items-center gap-2">
<span className="material-symbols-outlined text-[14px] text-primary">local_shipping</span>
<span className="text-[11px] font-medium">MH-03-VX</span>
</div>
<div className="flex items-center gap-2">
<img className="w-4 h-4 rounded-full" data-alt="Avatar headshot of a male driver, tactical fleet uniform, sharp cinematic lighting, technical background." src="https://lh3.googleusercontent.com/aida-public/AB6AXuDjqYczdzUaC1MkdfXloGhm-Owa5NCWXmB_pVGpL_6kTbQXeu7qSNbOwnxbIk1s20zhqJNWERAyNwhT1DxrMUm0i_MK1w5McURfGdIv8sKHuKkm7hkOiEWeLDH5j8sOCJ2k18xLpsqa9e1QTnC5PF0pDzyZMEL-qT38a_agC4J4D4slk8tlymvbIO20idpmIDfo5rJIVaZEbHsWrx-v5l88J6zcrDVO3KKpk60q2vIHKI6_RpY20OuQUg"/>
<span className="text-[11px] font-medium">Manish Varma</span>
</div>
</div>
<div className="flex justify-between items-center pt-3 border-t border-outline-variant/30">
<div className="text-[10px]">
<p className="text-on-surface-variant uppercase">Remaining</p>
<p className="text-on-surface font-mono">112km / 1.5h</p>
</div>
<button className="text-[10px] font-bold text-primary uppercase hover:underline" onclick="openCompleteModal()">Complete</button>
</div>
</div>
</div>
</div>
{/*  COLUMN: Completed  */}
<div className="kanban-column flex-shrink-0 w-80">
<div className="flex items-center justify-between mb-4 px-2">
<div className="flex items-center gap-2">
<div className="w-2 h-2 rounded-full bg-[#34D399]"></div>
<h2 className="font-headline-sm text-headline-sm uppercase tracking-widest text-[14px]">Completed</h2>
</div>
<span className="bg-surface-container-highest text-on-surface px-2 py-0.5 rounded text-[10px] font-bold">45 Trips</span>
</div>
<div className="space-y-4 opacity-70 hover:opacity-100 transition-opacity">
<div className="bg-[#131A22] border border-[#1F2A35] p-4 rounded-lg">
<div className="flex justify-between items-start mb-2">
<span className="text-[10px] font-bold text-[#34D399]">LOGGED</span>
<span className="text-[10px] text-on-surface-variant">2h ago</span>
</div>
<p className="text-xs font-bold mb-3">Bhiwandi Hub → JNPT Port</p>
<div className="flex items-center justify-between text-[11px] text-on-surface-variant">
<div className="flex items-center gap-1">
<span className="material-symbols-outlined text-[14px]">history</span>
<span>340km</span>
</div>
<span>Driver: Thakkar</span>
</div>
</div>
</div>
</div>
{/*  COLUMN: Cancelled  */}
<div className="kanban-column flex-shrink-0 w-80">
<div className="flex items-center justify-between mb-4 px-2">
<div className="flex items-center gap-2">
<div className="w-2 h-2 rounded-full bg-[#F87171]"></div>
<h2 className="font-headline-sm text-headline-sm uppercase tracking-widest text-[14px]">Cancelled</h2>
</div>
<span className="bg-surface-container-highest text-on-surface px-2 py-0.5 rounded text-[10px] font-bold">3 Trips</span>
</div>
<div className="space-y-4">
<div className="bg-[#131A22]/40 border border-[#F87171]/30 p-4 rounded-lg grayscale">
<div className="flex justify-between items-start mb-2">
<span className="text-[10px] font-bold text-[#F87171]">CANCELLED</span>
<span className="material-symbols-outlined text-[16px] text-[#F87171]">error_outline</span>
</div>
<p className="text-xs font-bold mb-1">Andheri MIDC → JNPT Port</p>
<p className="text-[10px] text-[#F87171]/70 italic">Reason: Vehicle Maintenance Required</p>
</div>
</div>
</div>
{/*  Column Placeholder  */}
<div className="flex-shrink-0 w-80 border-2 border-dashed border-outline-variant rounded-lg h-64 flex flex-col items-center justify-center text-on-surface-variant">
<span className="material-symbols-outlined text-[48px] mb-2">add</span>
<p className="font-label-caps text-label-caps">Add Custom Stage</p>
</div>
</div>
</main>
{/*  RIGHT DRAWER: Plan New Trip  */}
<div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 hidden opacity-0 transition-opacity duration-300" id="drawer-overlay" onclick="toggleDrawer(false)"></div>
<aside className="fixed top-0 right-0 h-screen w-[420px] bg-surface border-l border-outline-variant z-[60] translate-x-full drawer-transition flex flex-col shadow-2xl" id="plan-drawer">
<div className="p-6 border-b border-outline-variant flex justify-between items-center">
<h2 className="font-headline-md text-headline-md text-primary">Plan New Trip</h2>
<button className="material-symbols-outlined hover:text-primary transition-colors cursor-pointer" onclick="toggleDrawer(false)">close</button>
</div>
<div className="flex-1 p-6 space-y-6 overflow-y-auto custom-scrollbar">
{/*  Alert Banner (Initially Hidden)  */}
<div className="bg-error-container text-on-error-container p-3 rounded flex items-start gap-3 border border-error/20 hidden" id="weight-alert">
<span className="material-symbols-outlined text-[20px]">warning</span>
<p className="text-[12px] font-bold">CRITICAL: Cargo weight exceeds vehicle maximum capacity rating (VX-901 limit: 12,000kg).</p>
</div>
<div className="space-y-4">
<div>
<label className="font-label-caps text-label-caps block mb-1.5 text-on-surface-variant">Source Location</label>
<input className="w-full bg-surface-container border border-outline-variant rounded px-3 py-2 text-body-md focus:border-primary focus:ring-0 outline-none" type="text" value="Warehouse A-01"/>
</div>
<div>
<label className="font-label-caps text-label-caps block mb-1.5 text-on-surface-variant">Destination Location</label>
<input className="w-full bg-surface-container border border-outline-variant rounded px-3 py-2 text-body-md focus:border-primary focus:ring-0 outline-none" placeholder="Enter target terminal..." type="text"/>
</div>
<div className="grid grid-cols-2 gap-4">
<div>
<label className="font-label-caps text-label-caps block mb-1.5 text-on-surface-variant">Vehicle Assignment</label>
<select className="w-full bg-surface-container border border-outline-variant rounded px-3 py-2 text-body-md focus:border-primary outline-none">
<option>VX-901 (Heavy)</option>
<option>VX-902 (Heavy)</option>
<option>VN-404 (Light)</option>
</select>
</div>
<div>
<label className="font-label-caps text-label-caps block mb-1.5 text-on-surface-variant">Primary Driver</label>
<select className="w-full bg-surface-container border border-outline-variant rounded px-3 py-2 text-body-md focus:border-primary outline-none">
<option>Elias Thorne</option>
<option>Sarah Jenkins</option>
<option>Marcus Vane</option>
</select>
</div>
</div>
<div>
<label className="font-label-caps text-label-caps block mb-1.5 text-on-surface-variant">Cargo Weight (kg)</label>
<div className="relative">
<input className="w-full bg-surface-container border border-outline-variant rounded px-3 py-2 text-body-md focus:border-primary outline-none" id="weight-input" oninput="checkWeight(this.value)" type="number" value="8500"/>
<span className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[10px] font-bold">KG</span>
</div>
</div>
<div>
<label className="font-label-caps text-label-caps block mb-1.5 text-on-surface-variant">Planned Distance (km)</label>
<div className="relative">
<input className="w-full bg-surface-container border border-outline-variant rounded px-3 py-2 text-body-md focus:border-primary outline-none" type="number" value="320"/>
<span className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[10px] font-bold">KM</span>
</div>
</div>
</div>
{/*  Visual Simulation of Route (Mini-map)  */}
<div className="h-32 rounded bg-surface-container-lowest border border-outline-variant overflow-hidden relative group">
<div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent"></div>
<div className="flex items-center justify-center h-full gap-4">
<span className="material-symbols-outlined text-primary">trip_origin</span>
<div className="flex-1 border-t border-dashed border-outline-variant max-w-[120px]"></div>
<span className="material-symbols-outlined text-primary">location_on</span>
</div>
<p className="absolute bottom-2 left-2 text-[9px] font-bold text-on-surface-variant uppercase tracking-widest">Route Simulation Active</p>
</div>
</div>
<div className="p-6 border-t border-outline-variant bg-surface-container-low">
<button className="w-full py-4 bg-primary text-on-primary font-bold rounded uppercase tracking-widest text-[14px] hover:brightness-110 active:scale-[0.98] transition-all">Create Trip Mission</button>
</div>
</aside>
{/*  MODAL: Complete Trip  */}
<div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[70] hidden items-center justify-center p-4" id="modal-overlay">
<div className="bg-surface-container border border-outline-variant rounded-xl max-w-md w-full p-8 shadow-2xl scale-90 opacity-0 transition-all duration-300" id="modal-content">
<div className="mb-6 text-center">
<div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-primary/20">
<span className="material-symbols-outlined text-primary text-[32px]">task_alt</span>
</div>
<h3 className="font-headline-md text-headline-md">Complete Trip</h3>
<p className="text-on-surface-variant text-sm">Finalizing TRP-0909-V mission details.</p>
</div>
<div className="space-y-4 mb-8">
<div>
<label className="font-label-caps text-label-caps block mb-1.5 text-on-surface-variant">Final Odometer Reading</label>
<input className="w-full bg-surface border border-outline-variant rounded px-4 py-3 text-body-md focus:border-primary outline-none" placeholder="000,000" type="number"/>
</div>
<div>
<label className="font-label-caps text-label-caps block mb-1.5 text-on-surface-variant">Fuel Consumed (L)</label>
<input className="w-full bg-surface border border-outline-variant rounded px-4 py-3 text-body-md focus:border-primary outline-none" placeholder="0.00" type="number"/>
</div>
</div>
<div className="flex flex-col gap-3">
<button className="w-full py-3 bg-primary text-on-primary font-bold rounded uppercase text-[12px] tracking-widest" onclick="closeCompleteModal()">Confirm Completion</button>
<button className="w-full py-3 text-on-surface-variant font-bold hover:text-on-surface transition-colors uppercase text-[10px]" onclick="closeCompleteModal()">Cancel</button>
</div>
</div>
</div>
{/*  Micro-interactions Script  */}


    </div>
  );
}
