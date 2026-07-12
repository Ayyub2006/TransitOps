import React from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

export default function Drivers() {
  return (
    <div className="min-h-screen overflow-x-hidden dark text-on-surface bg-background font-body-md">
      
{/*  SideNavBar Anchor  */}
<Sidebar />
{/*  TopNavBar Anchor  */}
<header className="fixed top-0 right-0 h-[64px] left-[260px] border-b border-outline-variant bg-surface flex justify-between items-center px-6 z-30">
<div className="flex items-center flex-1 max-w-xl">
<div className="relative w-full">
<span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline-variant">search</span>
<input className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg pl-10 pr-4 py-2 text-sm" placeholder="Search drivers by name, license or status..." type="text"/>
</div>
</div>
<div className="flex items-center gap-4">
<div className="flex items-center gap-2 px-3 py-1 bg-surface-container-high border border-outline-variant rounded-full">
<div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
<span className="text-xs font-label-caps text-on-surface">Role: Commander</span>
</div>
<button className="text-on-surface-variant hover:text-primary transition-colors">
<span className="material-symbols-outlined">notifications</span>
</button>
<button className="text-on-surface-variant hover:text-primary transition-colors">
<span className="material-symbols-outlined">settings</span>
</button>
<div className="w-8 h-8 rounded-full border border-primary bg-primary-container/20 flex items-center justify-center overflow-hidden">
<img className="w-full h-full object-cover" data-alt="A professional headshot of a corporate fleet commander in a dark navy uniform, styled as a minimalist avatar, soft studio lighting on a dark slate background, high-end enterprise aesthetic." src="https://lh3.googleusercontent.com/aida-public/AB6AXuC9Ljeu_VPLOJifehtsW-cYapehsY1ditc4KgL5mjvL209H9bjdA5yERJQAGioioYZFArlW_rKOVgWJEV-RLFwibwOvxahyRlNFYcUuH-0PAWnifAcIOQpt6JoAfsrfjgN2OxkU_1enU2Zyu76lFUi5K0_igJfCD-9V8wIbJVLgmk9mSz6XCvkjPIz4lYsVUT8eFr7gNu9Zod6QNmO_Tp8R7DobEXa1ZJQ3rGWRpJKXx3JdY1MBJFCyyA"/>
</div>
</div>
</header>
{/*  Main Content Canvas  */}
<main className="ml-[260px] mt-[64px] h-[calc(100vh-64px)] overflow-y-auto custom-scrollbar bg-background p-6">
{/*  Header Area  */}
<div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
<div>
<h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">Driver Management</h2>
<p className="text-outline text-sm">Monitor and manage 248 registered operators across the fleet network.</p>
</div>
<div className="flex items-center gap-3">
<div className="flex border border-outline-variant rounded-lg overflow-x-auto mr-2">
<button className="px-3 py-2 bg-surface-container-highest text-primary flex items-center">
<span className="material-symbols-outlined text-sm">grid_view</span>
</button>
<button className="px-3 py-2 bg-surface text-on-surface-variant hover:bg-surface-container-high flex items-center">
<span className="material-symbols-outlined text-sm">format_list_bulleted</span>
</button>
</div>
<button className="bg-primary-container text-on-primary-container font-label-caps px-6 py-2.5 rounded-lg flex items-center gap-2 active:scale-95 transition-transform" onclick="toggleDrawer()">
<span className="material-symbols-outlined text-[20px]">add</span>
          ADD DRIVER
        </button>
</div>
</div>
{/*  Filters Section  */}
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
<div className="h-4 w-px bg-outline-variant mx-2"></div>
<span className="text-xs font-label-caps text-outline">SORT BY: LAST ACTIVE</span>
</div>
{/*  Driver Card Grid  */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
{/*  Driver Card 1 (Normal)  */}
<div className="lustrous-border bg-surface-container-low rounded-xl p-5 flex flex-col h-full group">
<div className="flex justify-between items-start mb-4">
<div className="flex gap-4">
<div className="w-12 h-12 rounded-full border border-outline-variant bg-surface-container flex items-center justify-center overflow-hidden">
<span className="font-headline-sm text-primary">MS</span>
</div>
<div>
<h3 className="font-headline-sm text-on-surface group-hover:text-primary transition-colors">Marcus Sterling</h3>
<div className="flex items-center gap-1.5">
<div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>
<span className="text-[10px] font-label-caps text-emerald-400 uppercase">Available</span>
</div>
</div>
</div>
<button className="text-outline-variant hover:text-on-surface"><span className="material-symbols-outlined">more_vert</span></button>
</div>
<div className="space-y-3 mb-6">
<div className="flex justify-between items-center">
<span className="text-[11px] font-mono text-outline">TX-9921-X</span>
<span className="text-[10px] bg-outline-variant/30 px-2 py-0.5 rounded text-on-surface-variant font-label-caps">HEAVY DUTY</span>
</div>
<div className="flex items-center gap-2 text-xs text-on-surface-variant">
<span className="material-symbols-outlined text-xs">calendar_today</span>
<span>License Expires: Oct 24, 2026</span>
</div>
</div>
<div className="mt-auto">
<div className="flex justify-between items-center mb-1.5">
<span className="text-[10px] font-label-caps text-outline uppercase">Safety Score</span>
<span className="text-xs font-bold text-emerald-400">94/100</span>
</div>
<div className="h-1 w-full bg-surface-container-highest rounded-full overflow-hidden">
<div className="h-full bg-emerald-400 w-[94%]"></div>
</div>
<div className="flex justify-between items-center mt-6 pt-4 border-t border-outline-variant/30">
<span className="text-xs text-outline">+1 555-0129</span>
<a className="text-xs text-primary font-label-caps hover:underline" href="#" onClick={(e) => e.preventDefault()}>VIEW PROFILE</a>
</div>
</div>
</div>
{/*  Driver Card 2 (Warning)  */}
<div className="lustrous-border bg-surface-container-low rounded-xl p-5 flex flex-col h-full group">
<div className="flex justify-between items-start mb-4">
<div className="flex gap-4">
<div className="w-12 h-12 rounded-full border border-outline-variant bg-surface-container flex items-center justify-center overflow-hidden">
<img className="w-full h-full object-cover" data-alt="A professional portrait of a delivery driver with short hair and a focused expression, wearing a high-tech logistics uniform, soft volumetric lighting in a command center setting, dark slate tones with subtle cyan highlights." src="https://lh3.googleusercontent.com/aida-public/AB6AXuBLjKwI4SI3dX1ZnRAev1qu-73os5s4NIVb0pndBiZdC-MJGlYUFYfakj57Hd9nCEqr_wo8nw54WWVUikFbM9V68xU17TDiaqf6OqwpeMHs3a7KcTOmpoSNM5b63zZVLk5Tk0XEd8vqVZB5FdLnUqAYBRhOEKosUHmslf8pjXgieOLRE2eGMVoRki0Z73u29XBF3gA-vPjyhzHOWkr4kyIlX8O226i4k1gP5HkAKzh9tv7fY0Ftu5R-dA"/>
</div>
<div>
<h3 className="font-headline-sm text-on-surface group-hover:text-primary transition-colors">Elena Vance</h3>
<div className="flex items-center gap-1.5">
<div className="w-1.5 h-1.5 rounded-full bg-amber-400"></div>
<span className="text-[10px] font-label-caps text-amber-400 uppercase">On Trip</span>
</div>
</div>
</div>
<button className="text-outline-variant hover:text-on-surface"><span className="material-symbols-outlined">more_vert</span></button>
</div>
<div className="space-y-3 mb-6">
<div className="flex justify-between items-center">
<span className="text-[11px] font-mono text-outline">NY-4481-B</span>
<span className="text-[10px] bg-outline-variant/30 px-2 py-0.5 rounded text-on-surface-variant font-label-caps">PASSENGER</span>
</div>
<div className="flex items-center gap-2 text-xs text-amber-400 font-medium">
<span className="material-symbols-outlined text-xs">warning</span>
<span>License Expires: Oct 18, 2024</span>
</div>
</div>
<div className="mt-auto">
<div className="flex justify-between items-center mb-1.5">
<span className="text-[10px] font-label-caps text-outline uppercase">Safety Score</span>
<span className="text-xs font-bold text-amber-400">78/100</span>
</div>
<div className="h-1 w-full bg-surface-container-highest rounded-full overflow-hidden">
<div className="h-full bg-amber-400 w-[78%]"></div>
</div>
<div className="flex justify-between items-center mt-6 pt-4 border-t border-outline-variant/30">
<span className="text-xs text-outline">+1 555-8821</span>
<a className="text-xs text-primary font-label-caps hover:underline" href="#" onClick={(e) => e.preventDefault()}>VIEW PROFILE</a>
</div>
</div>
</div>
{/*  Driver Card 3 (Critical)  */}
<div className="lustrous-border bg-surface-container-low rounded-xl p-5 flex flex-col h-full group border-l-2 border-l-error">
<div className="flex justify-between items-start mb-4">
<div className="flex gap-4">
<div className="w-12 h-12 rounded-full border border-outline-variant bg-surface-container flex items-center justify-center overflow-hidden">
<span className="font-headline-sm text-error">JR</span>
</div>
<div>
<h3 className="font-headline-sm text-on-surface group-hover:text-primary transition-colors">Jaxson Reed</h3>
<div className="flex items-center gap-1.5">
<div className="w-1.5 h-1.5 rounded-full bg-error"></div>
<span className="text-[10px] font-label-caps text-error uppercase">Suspended</span>
</div>
</div>
</div>
<button className="text-outline-variant hover:text-on-surface"><span className="material-symbols-outlined">more_vert</span></button>
</div>
<div className="space-y-3 mb-6">
<div className="flex justify-between items-center">
<span className="text-[11px] font-mono text-outline">CA-0012-L</span>
<span className="text-[10px] bg-error/10 border border-error/20 px-2 py-0.5 rounded text-error font-label-caps">HAZMAT</span>
</div>
<div className="flex items-center gap-2 text-xs text-error font-bold">
<span className="material-symbols-outlined text-xs">emergency</span>
<span>EXPIRED: Oct 02, 2024</span>
</div>
</div>
<div className="mt-auto">
<div className="flex justify-between items-center mb-1.5">
<span className="text-[10px] font-label-caps text-outline uppercase">Safety Score</span>
<span className="text-xs font-bold text-error">52/100</span>
</div>
<div className="h-1 w-full bg-surface-container-highest rounded-full overflow-hidden">
<div className="h-full bg-error w-[52%]"></div>
</div>
<div className="flex justify-between items-center mt-6 pt-4 border-t border-outline-variant/30">
<span className="text-xs text-outline">+1 555-4002</span>
<a className="text-xs text-primary font-label-caps hover:underline" href="#" onClick={(e) => e.preventDefault()}>VIEW PROFILE</a>
</div>
</div>
</div>
{/*  Driver Card 4 (Off Duty)  */}
<div className="lustrous-border bg-surface-container-low rounded-xl p-5 flex flex-col h-full group">
<div className="flex justify-between items-start mb-4">
<div className="flex gap-4">
<div className="w-12 h-12 rounded-full border border-outline-variant bg-surface-container flex items-center justify-center overflow-hidden">
<span className="font-headline-sm text-outline">SM</span>
</div>
<div>
<h3 className="font-headline-sm text-on-surface group-hover:text-primary transition-colors">Sarah Moss</h3>
<div className="flex items-center gap-1.5">
<div className="w-1.5 h-1.5 rounded-full bg-secondary"></div>
<span className="text-[10px] font-label-caps text-secondary uppercase">Off Duty</span>
</div>
</div>
</div>
<button className="text-outline-variant hover:text-on-surface"><span className="material-symbols-outlined">more_vert</span></button>
</div>
<div className="space-y-3 mb-6">
<div className="flex justify-between items-center">
<span className="text-[11px] font-mono text-outline">OR-5520-M</span>
<span className="text-[10px] bg-outline-variant/30 px-2 py-0.5 rounded text-on-surface-variant font-label-caps">STANDARD</span>
</div>
<div className="flex items-center gap-2 text-xs text-on-surface-variant">
<span className="material-symbols-outlined text-xs">calendar_today</span>
<span>License Expires: Jan 12, 2025</span>
</div>
</div>
<div className="mt-auto">
<div className="flex justify-between items-center mb-1.5">
<span className="text-[10px] font-label-caps text-outline uppercase">Safety Score</span>
<span className="text-xs font-bold text-primary">89/100</span>
</div>
<div className="h-1 w-full bg-surface-container-highest rounded-full overflow-hidden">
<div className="h-full bg-primary w-[89%]"></div>
</div>
<div className="flex justify-between items-center mt-6 pt-4 border-t border-outline-variant/30">
<span className="text-xs text-outline">+1 555-7733</span>
<a className="text-xs text-primary font-label-caps hover:underline" href="#" onClick={(e) => e.preventDefault()}>VIEW PROFILE</a>
</div>
</div>
</div>
</div>
</main>
{/*  Registration Drawer Overlay  */}
<div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 opacity-0 pointer-events-none transition-opacity duration-300" id="drawerOverlay" onclick="toggleDrawer()"></div>
{/*  Registration Drawer  */}
<div className="fixed top-0 right-0 h-full w-full max-w-[440px] bg-surface-container-high border-l border-outline-variant z-[60] translate-x-full transition-transform duration-500 ease-in-out flex flex-col" id="registrationDrawer">
<div className="p-6 border-b border-outline-variant flex justify-between items-center">
<div>
<h2 className="font-headline-sm text-headline-sm text-on-surface">Register New Driver</h2>
<p className="text-xs text-outline uppercase font-label-caps tracking-wider">Operator Onboarding</p>
</div>
<button className="text-outline-variant hover:text-on-surface p-2 bg-surface-container rounded-lg" onclick="toggleDrawer()">
<span className="material-symbols-outlined">close</span>
</button>
</div>
<div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
{/*  Form Section: Personal  */}
<div className="space-y-4">
<label className="block">
<span className="text-xs font-label-caps text-outline uppercase mb-2 block">Full Legal Name</span>
<input className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-4 py-3 text-sm focus:ring-0 transition-all" placeholder="e.g. Jonathan Doe" type="text"/>
</label>
<div className="grid grid-cols-2 gap-4">
<label>
<span className="text-xs font-label-caps text-outline uppercase mb-2 block">License Number</span>
<input className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-4 py-3 text-sm font-mono" placeholder="TX-0000-X" type="text"/>
</label>
<label>
<span className="text-xs font-label-caps text-outline uppercase mb-2 block">License Category</span>
<select className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-4 py-3 text-sm appearance-none">
<option>Heavy Duty</option>
<option>Passenger</option>
<option>Hazmat</option>
<option>Standard</option>
</select>
</label>
</div>
<label className="block">
<span className="text-xs font-label-caps text-outline uppercase mb-2 block">Expiry Date</span>
<input className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-4 py-3 text-sm" type="date"/>
</label>
</div>
<div className="h-px bg-outline-variant/30"></div>
{/*  Form Section: Operational  */}
<div className="space-y-4">
<div>
<span className="text-xs font-label-caps text-outline uppercase mb-3 block">Initial Status</span>
<div className="flex p-1 bg-surface-container-lowest border border-outline-variant rounded-lg">
<button className="flex-1 py-2 text-[10px] font-label-caps rounded bg-primary-container text-on-primary-container">AVAILABLE</button>
<button className="flex-1 py-2 text-[10px] font-label-caps text-outline hover:text-on-surface">OFF DUTY</button>
<button className="flex-1 py-2 text-[10px] font-label-caps text-outline hover:text-on-surface">TRAINING</button>
</div>
</div>
<label className="block">
<span className="text-xs font-label-caps text-outline uppercase mb-2 block">Contact Number</span>
<input className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-4 py-3 text-sm" placeholder="+1 (000) 000-0000" type="tel"/>
</label>
</div>
{/*  Safety Score Simulation  */}
<div className="p-4 bg-primary-container/5 rounded-lg border border-primary/20">
<div className="flex items-center gap-2 mb-2">
<span className="material-symbols-outlined text-primary text-sm">info</span>
<span className="text-xs font-medium text-primary uppercase">Safety Benchmarking</span>
</div>
<p className="text-[11px] text-on-surface-variant leading-relaxed">
          New drivers are initialized with a baseline safety score of 85. Scores fluctuate based on telemetry data and incident reports.
        </p>
</div>
</div>
{/*  Pinned Footer  */}
<div className="p-6 border-t border-outline-variant bg-surface-container-high">
<button className="w-full bg-primary-container text-on-primary-container font-label-caps py-4 rounded-xl flex justify-center items-center gap-2 hover:brightness-110 active:scale-[0.98] transition-all">
<span className="material-symbols-outlined text-[20px]">save</span>
        SAVE DRIVER PROFILE
      </button>
</div>
</div>


    </div>
  );
}
