import React from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

import TopBar from '../components/TopBar';

export default function Reports() {
  return (
    <div className="min-h-screen overflow-x-hidden dark text-on-surface bg-background font-body-md">
      
{/*  SideNavBar  */}
<Sidebar />
{/*  Main Content Area  */}
<main className="ml-0 lg:ml-[260px] flex-1 flex flex-col overflow-hidden relative mt-[64px]">
{/*  TopNavBar  */}
<TopBar rightContent={
  <>
    <button className="hidden lg:flex items-center gap-2 border border-outline px-4 py-1.5 rounded font-label-caps hover:bg-surface-variant/30 transition-colors whitespace-nowrap">
      <span className="material-symbols-outlined text-sm">picture_as_pdf</span>
      EXPORT PDF
    </button>
    <button className="hidden md:flex items-center gap-2 bg-primary-container text-on-primary-container px-4 py-1.5 rounded font-label-caps font-bold hover:opacity-90 transition-opacity whitespace-nowrap">
      <span className="material-symbols-outlined text-sm">table_view</span>
      EXPORT CSV
    </button>
    <div className="h-6 w-[1px] bg-outline-variant mx-2 hidden sm:block"></div>
  </>
}>
  <div className="flex items-center gap-6">
    <h1 className="font-headline-md text-headline-md font-bold text-primary tracking-tighter">REPORTS &amp; ANALYTICS</h1>
    <div className="hidden xl:flex items-center gap-2 bg-surface-container border border-outline-variant px-3 py-1.5 rounded">
      <span className="material-symbols-outlined text-on-surface-variant text-sm">calendar_month</span>
      <span className="font-label-caps text-on-surface-variant whitespace-nowrap">OCT 1, 2023 - OCT 31, 2023</span>
      <span className="material-symbols-outlined text-on-surface-variant text-sm">expand_more</span>
    </div>
    <div className="hidden xl:flex items-center gap-2 bg-surface-container border border-outline-variant px-3 py-1.5 rounded">
      <span className="material-symbols-outlined text-on-surface-variant text-sm">filter_alt</span>
      <span className="font-label-caps text-on-surface-variant whitespace-nowrap">ALL VEHICLES</span>
      <span className="material-symbols-outlined text-on-surface-variant text-sm">expand_more</span>
    </div>
  </div>
</TopBar>
{/*  Risk Alert Ticker (Top Bar Integration)  */}
<div className="w-full h-8 bg-surface-container-low border-b border-outline-variant/30 flex items-center px-gutter overflow-hidden z-20 shrink-0">
<div className="flex items-center gap-2 text-error mr-6 whitespace-nowrap">
<span className="material-symbols-outlined text-sm" style={{fontVariationSettings: "'FILL' 1", }}>warning</span>
<span className="font-label-caps text-[10px] font-bold">RISK ALERT:</span>
</div>
<div className="flex-1 whitespace-nowrap">
<p className="font-mono-technical text-[10px] text-on-surface-variant animate-marquee inline-block">
                    UNIT_881-M reporting terminal engine degradation. ROI potential dropping. Scheduled maintenance bypass detected. Global fuel index rising +1.2%. Strategic re-routing required for Fleet Segment C.
                </p>
</div>
</div>
{/*  Scrollable Dashboard  */}
<div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
<div className="max-w-[1600px] mx-auto space-y-6">
{/*  Main Grid  */}
<div className="bento-grid">
{/*  Fuel Efficiency Trend (6 Columns)  */}
<div className="col-span-12 lg:col-span-7 bg-surface-container border border-outline-variant rounded p-5 flex flex-col card-glow transition-all overflow-hidden">
<div className="flex justify-between items-center mb-6">
<div>
<h3 className="font-headline-sm text-headline-sm text-on-surface uppercase tracking-wider">Fuel Efficiency Trend</h3>
<p className="text-xs text-on-surface-variant font-label-caps opacity-60">DISTANCE VS CONSUMPTION METRICS</p>
</div>
<select className="bg-surface border border-outline-variant text-on-surface text-xs font-label-caps rounded px-3 py-1.5 focus:ring-1 focus:ring-primary outline-none">
<option>Vehicle: ALL_SEGMENTS</option>
<option>Vehicle: HEAVY_DUTY_A</option>
<option>Vehicle: ELECTRIC_FLEET</option>
</select>
</div>
<div className="flex-1 min-h-[280px] relative flex items-end justify-between px-2 pb-8 pt-4">
{/*  Background Grid Lines  */}
<div className="absolute inset-0 flex flex-col justify-between py-8 px-2 pointer-events-none">
<div className="w-full h-[1px] bg-outline-variant/10"></div>
<div className="w-full h-[1px] bg-outline-variant/10"></div>
<div className="w-full h-[1px] bg-outline-variant/10"></div>
<div className="w-full h-[1px] bg-outline-variant/10"></div>
<div className="w-full h-[1px] bg-outline-variant/20"></div>
</div>
{/*  Simple Line Chart Representation  */}
<div className="absolute inset-0 p-8 flex items-center">
<svg className="w-full h-full overflow-hidden" preserveAspectRatio="none" viewBox="0 0 1000 200">
<path d="M0,150 L100,140 L200,160 L300,110 L400,120 L500,80 L600,90 L700,50 L800,60 L900,30 L1000,40" fill="none" stroke="#3dd6d0" strokeLinecap="round" strokeWidth="3"></path>
<path d="M0,150 L100,140 L200,160 L300,110 L400,120 L500,80 L600,90 L700,50 L800,60 L900,30 L1000,40 L1000,200 L0,200 Z" fill="url(#cyan-gradient)" opacity="0.1"></path>
<defs>
<linearGradient id="cyan-gradient" x1="0" x2="0" y1="0" y2="1">
<stop offset="0%" stopColor="#3dd6d0"></stop>
<stop offset="100%" stopColor="#3dd6d0" stopOpacity="0"></stop>
</linearGradient>
</defs>
</svg>
</div>
{/*  X-Axis Labels  */}
<div className="absolute bottom-0 left-0 w-full flex justify-between px-8 text-[10px] font-mono-technical text-on-surface-variant opacity-50 uppercase">
<span>Wk 40</span><span>Wk 41</span><span>Wk 42</span><span>Wk 43</span><span>Wk 44</span>
</div>
</div>
<div className="mt-4 pt-4 border-t border-outline-variant/30 flex gap-8">
<div>
<p className="font-label-caps text-[10px] text-on-surface-variant">AVG EFFICIENCY</p>
<p className="font-mono-technical text-xl text-primary">8.42<span className="text-xs ml-1 text-on-surface-variant">km/L</span></p>
</div>
<div>
<p className="font-label-caps text-[10px] text-on-surface-variant">TOTAL DISTANCE</p>
<p className="font-mono-technical text-xl text-on-surface">14,204<span className="text-xs ml-1 text-on-surface-variant">km</span></p>
</div>
</div>
</div>
{/*  Fleet Utilization (5 Columns)  */}
<div className="col-span-12 lg:col-span-5 bg-surface-container border border-outline-variant rounded p-5 flex flex-col card-glow transition-all">
<div className="flex justify-between items-start mb-6">
<div>
<h3 className="font-headline-sm text-headline-sm text-on-surface uppercase tracking-wider">Fleet Utilization</h3>
<p className="text-xs text-on-surface-variant font-label-caps opacity-60">ACTIVE SERVICE PERCENTAGE BY UNIT</p>
</div>
<span className="material-symbols-outlined text-on-surface-variant cursor-pointer">more_vert</span>
</div>
<div className="flex-1 space-y-4">
{/*  Utilization Bar 1 (Green)  */}
<div className="space-y-1">
<div className="flex justify-between font-mono-technical text-xs mb-1">
<span className="text-on-surface">UNIT_742 (Heavy)</span>
<span className="text-primary">92%</span>
</div>
<div className="h-2 bg-surface-variant rounded-full overflow-hidden">
<div className="h-full bg-primary-container" style={{width: "92%", }}></div>
</div>
</div>
{/*  Utilization Bar 2 (Amber)  */}
<div className="space-y-1">
<div className="flex justify-between font-mono-technical text-xs mb-1">
<span className="text-on-surface">UNIT_218 (Medium)</span>
<span className="text-tertiary-container">64%</span>
</div>
<div className="h-2 bg-surface-variant rounded-full overflow-hidden">
<div className="h-full bg-tertiary-container" style={{width: "64%", }}></div>
</div>
</div>
{/*  Utilization Bar 3 (Red)  */}
<div className="space-y-1">
<div className="flex justify-between font-mono-technical text-xs mb-1">
<span className="text-on-surface">UNIT_903 (Heavy)</span>
<span className="text-error">32%</span>
</div>
<div className="h-2 bg-surface-variant rounded-full overflow-hidden">
<div className="h-full bg-error" style={{width: "32%", }}></div>
</div>
</div>
{/*  Utilization Bar 4 (Green)  */}
<div className="space-y-1">
<div className="flex justify-between font-mono-technical text-xs mb-1">
<span className="text-on-surface">UNIT_411 (Light)</span>
<span className="text-primary">88%</span>
</div>
<div className="h-2 bg-surface-variant rounded-full overflow-hidden">
<div className="h-full bg-primary-container" style={{width: "88%", }}></div>
</div>
</div>
{/*  Utilization Bar 5 (Amber)  */}
<div className="space-y-1">
<div className="flex justify-between font-mono-technical text-xs mb-1">
<span className="text-on-surface">UNIT_055 (Medium)</span>
<span className="text-tertiary-container">52%</span>
</div>
<div className="h-2 bg-surface-variant rounded-full overflow-hidden">
<div className="h-full bg-tertiary-container" style={{width: "52%", }}></div>
</div>
</div>
</div>
<div className="mt-6 flex justify-between items-center text-[10px] font-label-caps text-on-surface-variant">
<div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-error"></div> &lt;40% Critical</div>
<div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-tertiary-container"></div> 40-70% Marginal</div>
<div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-primary-container"></div> &gt;70% Optimal</div>
</div>
</div>
{/*  Operational Cost Breakdown (5 Columns)  */}
<div className="col-span-12 col-span-1 lg:col-span-4 bg-surface-container border border-outline-variant rounded p-5 flex flex-col card-glow transition-all">
<div className="flex justify-between items-start mb-6">
<div>
<h3 className="font-headline-sm text-headline-sm text-on-surface uppercase tracking-wider">Operational Cost</h3>
<p className="text-xs text-on-surface-variant font-label-caps opacity-60">FUEL VS MAINTENANCE RATIO</p>
</div>
<div className="flex bg-surface border border-outline-variant rounded p-0.5">
<button className="px-2 py-1 text-[10px] font-label-caps rounded bg-primary text-on-primary">FLEET</button>
<button className="px-2 py-1 text-[10px] font-label-caps rounded text-on-surface-variant hover:text-on-surface">UNIT</button>
</div>
</div>
<div className="flex-1 flex flex-col items-center justify-center py-4">
<div className="relative w-48 h-48">
{/*  Donut Chart SVG  */}
<svg className="w-full h-full transform -rotate-90" viewbox="0 0 36 36">
<circle cx="18" cy="18" fill="transparent" r="15.9" stroke="#1f2a35" strokeWidth="4"></circle>
<circle cx="18" cy="18" fill="transparent" r="15.9" stroke="#3dd6d0" strokeDasharray="65 100" strokeDashoffset="0" strokeWidth="4"></circle>
<circle cx="18" cy="18" fill="transparent" r="15.9" stroke="#ffb254" strokeDasharray="35 100" strokeDashoffset="-65" strokeWidth="4"></circle>
</svg>
<div className="absolute inset-0 flex flex-col items-center justify-center">
<p className="font-label-caps text-[10px] text-on-surface-variant">TOTAL OPEX</p>
<p className="font-mono-technical text-2xl text-on-surface">₹1.2Cr</p>
</div>
</div>
<div className="mt-8 grid grid-cols-2 gap-8 w-full">
<div className="text-center">
<div className="flex items-center justify-center gap-2 mb-1">
<div className="w-2 h-2 rounded-full bg-primary-container"></div>
<span className="font-label-caps text-[10px] text-on-surface-variant">FUEL</span>
</div>
<p className="font-mono-technical text-lg">₹78L</p>
<p className="text-[10px] font-label-caps text-primary">65%</p>
</div>
<div className="text-center border-l border-outline-variant/30">
<div className="flex items-center justify-center gap-2 mb-1">
<div className="w-2 h-2 rounded-full bg-tertiary-container"></div>
<span className="font-label-caps text-[10px] text-on-surface-variant">MAINT</span>
</div>
<p className="font-mono-technical text-lg">₹42L</p>
<p className="text-[10px] font-label-caps text-tertiary-container">35%</p>
</div>
</div>
</div>
</div>
{/*  Vehicle ROI Ranking (The Most Prominent - 8 Columns)  */}
<div className="col-span-12 col-span-1 lg:col-span-8 bg-surface-container border border-outline-variant rounded p-5 flex flex-col card-glow transition-all relative overflow-hidden">
{/*  Technical Overlay Pattern  */}
<div className="absolute top-0 right-0 w-32 h-32 opacity-5 pointer-events-none">
<svg fill="none" stroke="currentColor" viewbox="0 0 100 100">
<path d="M0 0 L100 100 M100 0 L0 100" strokeWidth="0.5"></path>
<circle cx="50" cy="50" r="40" strokeWidth="0.5"></circle>
<circle cx="50" cy="50" r="20" strokeWidth="0.5"></circle>
</svg>
</div>
<div className="flex justify-between items-start mb-6">
<div>
<h3 className="font-headline-sm text-headline-sm text-on-surface uppercase tracking-wider">Vehicle ROI Ranking</h3>
<p className="text-xs text-on-surface-variant font-label-caps opacity-60">PERFORMANCE INDEX: (REVENUE - OPEX) / ACQUISITION</p>
</div>
<div className="flex items-center gap-4">
<div className="flex items-center gap-2">
<span className="font-label-caps text-[10px] text-on-surface-variant">SORT BY:</span>
<button className="flex items-center gap-1 font-label-caps text-xs text-primary">ROI % <span className="material-symbols-outlined text-sm">arrow_downward</span></button>
</div>
</div>
</div>
<div className="flex-1">
<table className="w-full text-left border-collapse">
<thead>
<tr className="border-b border-outline-variant">
<th className="py-3 font-label-caps text-[10px] text-on-surface-variant font-medium">VEHICLE ID</th>
<th className="py-3 font-label-caps text-[10px] text-on-surface-variant font-medium">SEGMENT</th>
<th className="py-3 font-label-caps text-[10px] text-on-surface-variant font-medium text-right">NET REVENUE</th>
<th className="py-3 font-label-caps text-[10px] text-on-surface-variant font-medium text-right">TOTAL COSTS</th>
<th className="py-3 font-label-caps text-[10px] text-on-surface-variant font-medium text-right">ROI INDEX</th>
</tr>
</thead>
<tbody className="font-mono-technical text-sm">
{/*  Row 1: Healthy  */}
<tr className="border-b border-outline-variant/30 hover:bg-primary/5 transition-colors group">
<td className="py-4">
<div className="flex items-center gap-3">
<div className="w-1.5 h-6 bg-primary-container rounded-full"></div>
<span className="text-on-surface">UNIT_982-A</span>
</div>
</td>
<td className="py-4 text-on-surface-variant">LONG_HAUL</td>
<td className="py-4 text-right text-on-surface">₹14,200</td>
<td className="py-4 text-right text-on-surface-variant">₹4,120</td>
<td className="py-4 text-right text-primary font-bold">+18.4%</td>
</tr>
{/*  Row 2: Healthy  */}
<tr className="border-b border-outline-variant/30 hover:bg-primary/5 transition-colors">
<td className="py-4">
<div className="flex items-center gap-3">
<div className="w-1.5 h-6 bg-primary-container rounded-full"></div>
<span className="text-on-surface">UNIT_104-E</span>
</div>
</td>
<td className="py-4 text-on-surface-variant">CITY_GRID</td>
<td className="py-4 text-right text-on-surface">₹11,500</td>
<td className="py-4 text-right text-on-surface-variant">₹2,800</td>
<td className="py-4 text-right text-primary font-bold">+16.2%</td>
</tr>
{/*  Row 3: Marginal  */}
<tr className="border-b border-outline-variant/30 hover:bg-tertiary-container/5 transition-colors">
<td className="py-4">
<div className="flex items-center gap-3">
<div className="w-1.5 h-6 bg-tertiary-container rounded-full"></div>
<span className="text-on-surface">UNIT_552-C</span>
</div>
</td>
<td className="py-4 text-on-surface-variant">HEAVY_LOAD</td>
<td className="py-4 text-right text-on-surface">₹22,800</td>
<td className="py-4 text-right text-on-surface-variant">₹16,400</td>
<td className="py-4 text-right text-tertiary-container font-bold">+4.1%</td>
</tr>
{/*  Row 4: Negative  */}
<tr className="border-b border-outline-variant/30 hover:bg-error/5 transition-colors">
<td className="py-4">
<div className="flex items-center gap-3">
<div className="w-1.5 h-6 bg-error rounded-full"></div>
<span className="text-on-surface">UNIT_881-M</span>
</div>
</td>
<td className="py-4 text-on-surface-variant">SUPPORT</td>
<td className="py-4 text-right text-on-surface">₹4,200</td>
<td className="py-4 text-right text-on-surface-variant">₹5,100</td>
<td className="py-4 text-right text-error font-bold">-2.4%</td>
</tr>
</tbody>
</table>
</div>
<div className="mt-4 flex items-center justify-between">
<button className="text-xs font-label-caps text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1">
                                VIEW FULL RANKING DATA <span className="material-symbols-outlined text-sm">open_in_new</span>
</button>
<div className="flex gap-4">
<div className="flex items-center gap-2"><span className="w-2 h-2 bg-primary-container rounded-full"></span> <span className="font-label-caps text-[10px] text-on-surface-variant">HEALTHY (&gt;8%)</span></div>
<div className="flex items-center gap-2"><span className="w-2 h-2 bg-tertiary-container rounded-full"></span> <span className="font-label-caps text-[10px] text-on-surface-variant">MARGINAL (0-8%)</span></div>
<div className="flex items-center gap-2"><span className="w-2 h-2 bg-error rounded-full"></span> <span className="font-label-caps text-[10px] text-on-surface-variant">NEGATIVE (&lt;0%)</span></div>
</div>
</div>
</div>
</div>
{/*  Footer Section  */}
<footer className="mt-12 py-8 border-t border-outline-variant/30 flex flex-col md:flex-row justify-between items-center gap-4">
<p className="text-[10px] font-label-caps text-on-surface-variant tracking-widest uppercase opacity-50 text-center md:text-left">
                        ROI calculations exclude non-fuel/maintenance overheads and personnel costs. 
                        Data synced at: 2023-11-01 04:00 UTC. 
                        Operational clearance verified.
                    </p>
<div className="flex gap-6 opacity-60">
<span className="font-label-caps text-[10px] text-on-surface-variant">TRANSITOPS v4.2.1-STABLE</span>
<span className="font-label-caps text-[10px] text-on-surface-variant">COMMAND_CORE_7</span>
</div>
</footer>
</div>
</div>

</main>
<style dangerouslySetInnerHTML={{ __html: `\n@keyframes marquee {
            0% { transform: translateX(100%); }
            100% { transform: translateX(-100%); }
        }
        .animate-marquee {
            animation: marquee 30s linear infinite;
        }\n` }} />


    </div>
  );
}
