import React from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

export default function Risk() {
  return (
    <div className="flex min-h-screen overflow-x-hidden dark text-on-surface bg-background font-body-md">
      
{/*  SideNavBar (Authority: JSON & Style Guidance)  */}
<Sidebar />
{/*  Main Workspace  */}
<main className="flex-1 ml-0 lg:ml-[var(--spacing-sidebar-width)] min-h-screen flex flex-col technical-bg">
{/*  TopNavBar (Authority: JSON & Style Guidance)  */}
<header className="fixed top-0 right-0 left-sidebar-width h-[64px] z-50 bg-surface border-b border-outline-variant flex justify-between items-center px-container-margin">
<div className="flex items-center gap-6">
<span className="font-headline-md text-headline-md font-bold text-primary tracking-tight">TransitOps</span>
<div className="h-6 w-px bg-outline-variant"></div>
<div className="flex items-center bg-surface-container-high px-4 py-1.5 rounded border border-outline-variant gap-3 w-[400px]">
<span className="material-symbols-outlined text-outline text-sm">search</span>
<input className="bg-transparent border-none focus:ring-0 text-body-md font-body-md w-full placeholder:text-outline-variant" placeholder="Search Risk Nodes..." type="text"/>
</div>
</div>
<div className="flex items-center gap-4">
{/*  Risk Alert Ticker  */}
<div className="hidden xl:flex items-center gap-3 bg-error-container/20 px-4 py-1 rounded border border-error/30 animate-pulse">
<span className="material-symbols-outlined text-error text-[18px]">warning</span>
<span className="text-error font-label-caps text-label-caps uppercase">3 Critical Anomalies Detected</span>
</div>
<div className="flex items-center gap-2">
<button className="p-2 text-on-surface-variant hover:bg-surface-container-highest rounded transition-colors active:scale-95">
<span className="material-symbols-outlined">notifications</span>
</button>
<button className="p-2 text-on-surface-variant hover:bg-surface-container-highest rounded transition-colors active:scale-95">
<span className="material-symbols-outlined">emergency_home</span>
</button>
<button className="p-2 text-on-surface-variant hover:bg-surface-container-highest rounded transition-colors active:scale-95">
<span className="material-symbols-outlined">settings</span>
</button>
</div>
<div className="flex items-center gap-3 ml-2 pl-4 border-l border-outline-variant">
<div className="text-right">
<p className="text-body-md font-bold leading-none">Ops. Center</p>
<p className="text-label-caps text-[10px] text-primary">AUTHORIZED</p>
</div>
<div className="w-10 h-10 rounded-full bg-primary/20 border border-primary flex items-center justify-center overflow-hidden">
<img className="w-full h-full object-cover" data-alt="Close-up portrait of a professional transit operations manager in a high-tech command center. He is wearing a modern headset and dark apparel, with soft cyan lighting reflecting off his face from the dashboard monitors. The background is a blurred array of digital displays and glowing status indicators." src="https://lh3.googleusercontent.com/aida-public/AB6AXuAhty8NTj5XEtqFNZ1cWoAwLuSIEkOqw2sLlD9jJeV1GhjxVIp2Zaypz-zg2NEn1fe-jlI2xXbBWkn_bSoJdz8lw3W4v_99qeH26PBMcSPymuJQWaRUS9r8qfTKK8L_QVhPro-wlbl5mgp9YeIK7dlUwTq-6EqXTdjw_lZIPKNJ-_FZoXeP9DooHmecSEX3TaJ0neKA_4-R9idQofaG2040fVzcbk2JTYW8DVV748w6_fU-w0x0kvEOQg"/>
</div>
</div>
</div>
</header>
{/*  Content Area  */}
<div className="mt-[64px] p-container-margin min-h-[calc(100vh-64px)] overflow-x-hidden flex gap-gutter">
{/*  Left Column: Main List  */}
<div className="flex-1 flex flex-col gap-gutter overflow-hidden">
{/*  Header & Metric Bar  */}
<section className="flex flex-col gap-6">
<div>
<h1 className="font-headline-lg text-headline-lg text-white mb-1">Fleet Risk Radar</h1>
<p className="text-on-surface-variant font-body-md">Composite risk scoring across licenses, maintenance, safety, and fuel anomalies.</p>
</div>
{/*  Health Distribution Bar  */}
<div className="glass-panel p-6 rounded-lg">
<div className="flex justify-between items-end mb-3">
<span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">Fleet Health Distribution</span>
<div className="flex gap-4">
<span className="flex items-center gap-1.5 text-error font-label-caps text-[11px]"><span className="w-2 h-2 rounded-full bg-error"></span> 12% HIGH</span>
<span className="flex items-center gap-1.5 text-tertiary font-label-caps text-[11px]"><span className="w-2 h-2 rounded-full bg-tertiary"></span> 23% MEDIUM</span>
<span className="flex items-center gap-1.5 text-primary font-label-caps text-[11px]"><span className="w-2 h-2 rounded-full bg-primary"></span> 65% LOW</span>
</div>
</div>
<div className="h-3 w-full flex rounded-full overflow-hidden bg-surface-container-lowest">
<div className="h-full bg-error transition-all duration-1000" style={{width: "12%", }}></div>
<div className="h-full bg-tertiary transition-all duration-1000" style={{width: "23%", }}></div>
<div className="h-full bg-primary transition-all duration-1000" style={{width: "65%", }}></div>
</div>
</div>
</section>
{/*  Risk Entities List  */}
<section className="flex-1 glass-panel rounded-lg overflow-hidden flex flex-col">
<div className="p-4 border-b border-outline-variant bg-surface-container-low flex justify-between items-center">
<h3 className="font-label-caps text-label-caps text-white uppercase">Highest Risk Entities (Ranked)</h3>
<div className="flex gap-2">
<button className="p-1.5 hover:bg-surface-container-highest transition-colors rounded"><span className="material-symbols-outlined text-[20px]">sort</span></button>
<button className="p-1.5 hover:bg-surface-container-highest transition-colors rounded"><span className="material-symbols-outlined text-[20px]">more_vert</span></button>
</div>
</div>
<div className="flex-1 overflow-y-auto custom-scrollbar p-1">
{/*  List Item: Marcus Sterling  */}
<div className="flex items-center gap-6 p-4 border-b border-outline-variant hover:bg-surface-container-highest/50 transition-colors group">
<div className="risk-ring">
<svg className="w-full h-full">
<circle cx="24" cy="24" fill="none" r="21" stroke="#2a313a" strokeWidth="3"></circle>
<circle cx="24" cy="24" fill="none" r="21" stroke="#ffb4ab" strokeDasharray="131.95" strokeDashoffset="15.83" strokeWidth="3"></circle>
</svg>
<span className="text-error font-kpi-value text-body-md font-bold">88</span>
</div>
<div className="flex-1">
<div className="flex items-center gap-2 mb-1">
<span className="material-symbols-outlined text-outline text-[20px]">person</span>
<span className="font-headline-sm text-white">Marcus Sterling</span>
<span className="font-label-caps text-[10px] px-2 py-0.5 rounded border border-outline-variant text-outline bg-surface-container-lowest">ID: DR-4402</span>
</div>
<div className="flex gap-2">
<span className="tag-red font-label-caps text-[10px] px-2 py-0.5 rounded uppercase">License expires in 4 days</span>
<span className="tag-amber font-label-caps text-[10px] px-2 py-0.5 rounded uppercase">Safety score dropped 12pts</span>
</div>
</div>
<button className="bg-primary-container text-on-primary-container px-6 py-2 rounded-sm font-label-caps text-label-caps uppercase font-bold hover:brightness-110 active:scale-95 transition-all">
                                Renew License
                            </button>
</div>
{/*  List Item: VX-901  */}
<div className="flex items-center gap-6 p-4 border-b border-outline-variant hover:bg-surface-container-highest/50 transition-colors group">
<div className="risk-ring">
<svg className="w-full h-full">
<circle cx="24" cy="24" fill="none" r="21" stroke="#2a313a" strokeWidth="3"></circle>
<circle cx="24" cy="24" fill="none" r="21" stroke="#ffb4ab" strokeDasharray="131.95" strokeDashoffset="23.75" strokeWidth="3"></circle>
</svg>
<span className="text-error font-kpi-value text-body-md font-bold">82</span>
</div>
<div className="flex-1">
<div className="flex items-center gap-2 mb-1">
<span className="material-symbols-outlined text-outline text-[20px]">directions_bus</span>
<span className="font-headline-sm text-white">VX-901</span>
<span className="font-label-caps text-[10px] px-2 py-0.5 rounded border border-outline-variant text-outline bg-surface-container-lowest">Heavy Transit</span>
</div>
<div className="flex gap-2">
<span className="tag-red font-label-caps text-[10px] px-2 py-0.5 rounded uppercase">Overdue maintenance 18 days</span>
<span className="tag-cyan font-label-caps text-[10px] px-2 py-0.5 rounded uppercase">Brake Pad Wear: 92%</span>
</div>
</div>
<button className="bg-primary-container text-on-primary-container px-6 py-2 rounded-sm font-label-caps text-label-caps uppercase font-bold hover:brightness-110 active:scale-95 transition-all">
                                Schedule Maintenance
                            </button>
</div>
{/*  List Item: Elena Rodriguez  */}
<div className="flex items-center gap-6 p-4 border-b border-outline-variant hover:bg-surface-container-highest/50 transition-colors group">
<div className="risk-ring">
<svg className="w-full h-full">
<circle cx="24" cy="24" fill="none" r="21" stroke="#2a313a" strokeWidth="3"></circle>
<circle cx="24" cy="24" fill="none" r="21" stroke="#ffb865" strokeDasharray="131.95" strokeDashoffset="60.69" strokeWidth="3"></circle>
</svg>
<span className="text-tertiary font-kpi-value text-body-md font-bold">54</span>
</div>
<div className="flex-1">
<div className="flex items-center gap-2 mb-1">
<span className="material-symbols-outlined text-outline text-[20px]">person</span>
<span className="font-headline-sm text-white">Elena Rodriguez</span>
<span className="font-label-caps text-[10px] px-2 py-0.5 rounded border border-outline-variant text-outline bg-surface-container-lowest">ID: DR-9912</span>
</div>
<div className="flex gap-2">
<span className="tag-amber font-label-caps text-[10px] px-2 py-0.5 rounded uppercase">Excessive Idling Detected</span>
<span className="tag-cyan font-label-caps text-[10px] px-2 py-0.5 rounded uppercase">Route Variance Alert</span>
</div>
</div>
<button className="bg-primary-container text-on-primary-container px-6 py-2 rounded-sm font-label-caps text-label-caps uppercase font-bold hover:brightness-110 active:scale-95 transition-all">
                                Reassign Trip
                            </button>
</div>
{/*  List Item: BX-224  */}
<div className="flex items-center gap-6 p-4 border-b border-outline-variant hover:bg-surface-container-highest/50 transition-colors group">
<div className="risk-ring">
<svg className="w-full h-full">
<circle cx="24" cy="24" fill="none" r="21" stroke="#2a313a" strokeWidth="3"></circle>
<circle cx="24" cy="24" fill="none" r="21" stroke="#ffb865" strokeDasharray="131.95" strokeDashoffset="66.00" strokeWidth="3"></circle>
</svg>
<span className="text-tertiary font-kpi-value text-body-md font-bold">50</span>
</div>
<div className="flex-1">
<div className="flex items-center gap-2 mb-1">
<span className="material-symbols-outlined text-outline text-[20px]">directions_bus</span>
<span className="font-headline-sm text-white">BX-224</span>
<span className="font-label-caps text-[10px] px-2 py-0.5 rounded border border-outline-variant text-outline bg-surface-container-lowest">Logistics Van</span>
</div>
<div className="flex gap-2">
<span className="tag-amber font-label-caps text-[10px] px-2 py-0.5 rounded uppercase">Fuel Anomaly Detected (+15%)</span>
</div>
</div>
<button className="bg-primary-container text-on-primary-container px-6 py-2 rounded-sm font-label-caps text-label-caps uppercase font-bold hover:brightness-110 active:scale-95 transition-all">
                                Inspect Fuel System
                            </button>
</div>
</div>
</section>
</div>
{/*  Right Column: Sidebar Filter  */}
<aside className="w-[300px] flex flex-col gap-gutter">
{/*  Filter Panel  */}
<section className="glass-panel rounded-lg flex flex-col p-6">
<h3 className="font-headline-sm text-white mb-6 flex items-center gap-2">
<span className="material-symbols-outlined text-primary">filter_list</span>
                        Radar Controls
                    </h3>
<div className="space-y-8">
{/*  Entity Toggle  */}
<div>
<label className="font-label-caps text-label-caps text-on-surface-variant uppercase mb-3 block">Entity Filter</label>
<div className="flex bg-surface-container-lowest p-1 rounded border border-outline-variant">
<button className="flex-1 py-1.5 font-label-caps text-label-caps bg-primary text-on-primary rounded-sm transition-all">ALL</button>
<button className="flex-1 py-1.5 font-label-caps text-label-caps text-on-surface-variant hover:text-white transition-all">VEHICLES</button>
<button className="flex-1 py-1.5 font-label-caps text-label-caps text-on-surface-variant hover:text-white transition-all">DRIVERS</button>
</div>
</div>
{/*  Threshold Slider  */}
<div>
<div className="flex justify-between items-center mb-3">
<label className="font-label-caps text-label-caps text-on-surface-variant uppercase">Risk Threshold</label>
<span className="text-primary font-bold font-body-md">75+</span>
</div>
<input className="w-full h-1 bg-surface-container-highest rounded-lg appearance-none cursor-pointer accent-primary" max="100" min="0" type="range" value="75"/>
<div className="flex justify-between mt-2">
<span className="text-[10px] text-outline">Low</span>
<span className="text-[10px] text-outline">Extreme</span>
</div>
</div>
{/*  Contributing Factors  */}
<div>
<label className="font-label-caps text-label-caps text-on-surface-variant uppercase mb-3 block">Contributing Factors</label>
<div className="space-y-2">
<label className="flex items-center gap-3 group cursor-pointer">
<input defaultChecked className="rounded bg-surface-container-lowest border-outline-variant text-primary focus:ring-primary focus:ring-offset-0" type="checkbox"/>
<span className="text-body-md text-on-surface group-hover:text-primary transition-colors">Licensing Status</span>
</label>
<label className="flex items-center gap-3 group cursor-pointer">
<input defaultChecked className="rounded bg-surface-container-lowest border-outline-variant text-primary focus:ring-primary focus:ring-offset-0" type="checkbox"/>
<span className="text-body-md text-on-surface group-hover:text-primary transition-colors">Safety Violations</span>
</label>
<label className="flex items-center gap-3 group cursor-pointer">
<input defaultChecked className="rounded bg-surface-container-lowest border-outline-variant text-primary focus:ring-primary focus:ring-offset-0" type="checkbox"/>
<span className="text-body-md text-on-surface group-hover:text-primary transition-colors">Maintenance Delays</span>
</label>
<label className="flex items-center gap-3 group cursor-pointer">
<input className="rounded bg-surface-container-lowest border-outline-variant text-primary focus:ring-primary focus:ring-offset-0" type="checkbox"/>
<span className="text-body-md text-on-surface group-hover:text-primary transition-colors">Fuel Anomalies</span>
</label>
</div>
</div>
</div>
<button className="mt-8 w-full border border-outline-variant text-on-surface font-label-caps text-label-caps uppercase py-3 rounded hover:bg-surface-container-highest transition-all active:scale-95">
                        Apply System Filter
                    </button>
</section>
{/*  Mini Map / Insight Card  */}
<section className="flex-1 glass-panel rounded-lg overflow-hidden relative">
<div className="absolute inset-0 bg-cover bg-center opacity-40 grayscale group-hover:grayscale-0 transition-all duration-700" data-alt="A dark, stylized tactical map of a metropolitan city with glowing teal lines representing bus routes and vehicle traffic flow. The map has a high-contrast blueprint aesthetic with technical grid overlays and pinpoint markers showing current vehicle locations. The lighting is low-key, emphasizing the neon-cyan data points." style={{backgroundImage: "url('https", }}></div>
<div className="relative z-10 p-6 flex flex-col h-full">
<h4 className="font-label-caps text-label-caps text-white uppercase mb-1">Geospatial Risk Cluster</h4>
<p className="text-[10px] text-primary font-bold uppercase mb-4">Central District Hub</p>
<div className="mt-auto bg-surface/80 backdrop-blur-md p-4 rounded border border-outline-variant">
<p className="text-body-md leading-relaxed">
<span className="text-error font-bold">! CRITICAL:</span> Cluster of brake maintenance alerts identified in vehicles servicing the <span className="text-primary">North Ridge Line</span>. Potential systemic component failure.
                            </p>
</div>
</div>
</section>
</aside></div>
</main>


    </div>
  );
}
