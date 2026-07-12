import React from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

export default function Maintenance() {
  return (
    <div className="flex min-h-screen overflow-x-hidden dark text-on-surface bg-background font-body-md">
      
{/*  Sidebar (Shared Component Style)  */}
<Sidebar />
{/*  Top App Bar (Shared Component Style)  */}
<header className="fixed top-0 right-0 h-[64px] z-40 flex items-center justify-between w-[calc(100%-260px)] px-container-margin ml-[260px] bg-surface-dim border-b border-outline-variant">
<div className="flex items-center gap-4">
<span className="font-headline-sm text-headline-sm font-black text-primary tracking-tight">Maintenance Command</span>
<div className="h-4 w-[1px] bg-outline-variant"></div>
<div className="flex items-center text-error gap-2">
<span className="material-symbols-outlined text-[16px]" style={{fontVariationSettings: "'FILL' 1", }}>warning</span>
<span className="font-label-caps text-[10px]">2 HIGH RISK VEHICLES DETECTED</span>
</div>
</div>
<div className="flex items-center gap-6">
<div className="flex items-center gap-2">
<button className="material-symbols-outlined p-2 text-on-surface-variant hover:text-primary transition-all active:scale-95">notifications</button>
<button className="material-symbols-outlined p-2 text-on-surface-variant hover:text-primary transition-all active:scale-95">settings</button>
</div>
<div className="flex items-center gap-3 pl-4 border-l border-outline-variant">
<div className="text-right">
<p className="font-label-caps text-[11px] text-on-surface">Alex Chen</p>
<p className="font-label-caps text-[9px] text-primary">OPERATIONAL LEAD</p>
</div>
<div className="w-8 h-8 rounded bg-primary-container/20 border border-primary/30 flex items-center justify-center overflow-hidden">
<img className="w-full h-full object-cover" data-alt="A portrait of a professional fleet operations manager in a dimly lit, high-tech command center. He is wearing a dark navy technical jacket. The background features blurred screens with glowing cyan data visualizations and maps. The lighting is cold and atmospheric with a cyan rim light across his features, conveying authority and focus." src="https://lh3.googleusercontent.com/aida-public/AB6AXuCMWLHIFa5-l-Cxq_VBU8GC3RSzX7RrOh2QB6ha135lNHZoHhR2mVfLvdH3edsC86qx08U3xNpqZu3oHAvzJQLIQ_YeVidADGeU9DT0PTwo3P5IanHFy0ZywC--V8RuNYZE-mCi4NKjYYI9Y6IAvnoC3ubmjIsppox4qOdb_xzLgVvacl-Gy1rwy5jEDcJJGfdBFzvkW91tPaBJHTa3uNvjwnBnmLzbuJIfpVoNS9_dXGo8wLQRsDWB3w"/>
</div>
</div>
</div>
</header>
{/*  Main Content Area  */}
<main className="ml-[260px] mt-[64px] p-container-margin h-[calc(100vh-64px)] overflow-y-auto">
{/*  Content Header / Filter Bar  */}
<div className="flex items-center justify-between mb-8">
<div className="flex items-center gap-4 flex-1 max-w-2xl">
<div className="relative flex-1">
<span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">search</span>
<input className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg py-2 pl-10 pr-4 text-body-md glow-cyan" placeholder="Search vehicle or record ID..." type="text"/>
</div>
<div className="flex items-center gap-2 bg-surface-container border border-outline-variant rounded-lg px-3 py-2 cursor-pointer hover:bg-surface-container-high transition-colors">
<span className="material-symbols-outlined text-on-surface-variant text-[18px]">calendar_today</span>
<span className="text-body-md text-on-surface-variant">Last 30 Days</span>
<span className="material-symbols-outlined text-on-surface-variant text-[18px]">expand_more</span>
</div>
</div>
<div className="flex items-center gap-3">
<button className="flex items-center gap-2 border border-outline-variant px-4 py-2 rounded-lg text-on-surface font-body-md hover:bg-surface-container transition-colors active:scale-95">
<span className="material-symbols-outlined text-[20px]">ios_share</span>
                    Export
                </button>
<button className="flex items-center gap-2 bg-primary text-on-primary px-4 py-2 rounded-lg font-headline-sm text-[14px] font-bold hover:brightness-110 transition-all active:scale-95" onclick="document.getElementById('side-drawer').classList.remove('translate-x-full')">
<span className="material-symbols-outlined">add</span>
                    New Maintenance Record
                </button>
</div>
</div>
{/*  Data Table Section  */}
<div className="glass-panel rounded-xl overflow-hidden">
<table className="w-full border-collapse">
<thead>
<tr className="bg-surface-container-high text-left">
<th className="px-6 py-4 font-label-caps text-[11px] text-on-surface-variant uppercase border-b border-outline-variant">Vehicle</th>
<th className="px-6 py-4 font-label-caps text-[11px] text-on-surface-variant uppercase border-b border-outline-variant">Type</th>
<th className="px-6 py-4 font-label-caps text-[11px] text-on-surface-variant uppercase border-b border-outline-variant">Date Opened</th>
<th className="px-6 py-4 font-label-caps text-[11px] text-on-surface-variant uppercase border-b border-outline-variant">Date Closed</th>
<th className="px-6 py-4 font-label-caps text-[11px] text-on-surface-variant uppercase border-b border-outline-variant text-right">Cost</th>
<th className="px-6 py-4 font-label-caps text-[11px] text-on-surface-variant uppercase border-b border-outline-variant">Status</th>
<th className="px-6 py-4 font-label-caps text-[11px] text-on-surface-variant uppercase border-b border-outline-variant text-right">Actions</th>
</tr>
</thead>
<tbody className="divide-y divide-outline-variant">
{/*  Active Row  */}
<tr className="hover:bg-primary-container/5 transition-colors group">
<td className="px-6 py-4 technical-id text-primary">VX-901</td>
<td className="px-6 py-4">
<div className="flex items-center gap-2">
<span className="material-symbols-outlined text-secondary text-[20px]">oil_barrel</span>
<span className="text-body-md">Oil Change</span>
</div>
</td>
<td className="px-6 py-4 text-body-md text-on-surface-variant">Oct 24, 2023</td>
<td className="px-6 py-4">
<span className="text-body-md text-secondary font-medium italic">In Progress</span>
</td>
<td className="px-6 py-4 text-body-md text-right technical-id">$185.00</td>
<td className="px-6 py-4">
<span className="status-pill bg-[#8B5CF6]/10 text-[#A78BFA] border border-[#8B5CF6]/30">
<span className="w-1 h-1 rounded-full bg-[#8B5CF6] mr-2"></span>
                                Active
                            </span>
</td>
<td className="px-6 py-4 text-right">
<div className="row-hover-actions flex items-center justify-end gap-2">
<button className="text-[11px] font-bold text-on-surface-variant hover:text-primary transition-colors">VIEW DETAILS</button>
<button className="text-[11px] font-bold text-error hover:brightness-125 transition-colors">CLOSE RECORD</button>
</div>
</td>
</tr>
{/*  Active Row  */}
<tr className="hover:bg-primary-container/5 transition-colors group">
<td className="px-6 py-4 technical-id text-primary">TL-400</td>
<td className="px-6 py-4">
<div className="flex items-center gap-2">
<span className="material-symbols-outlined text-secondary text-[20px]">build</span>
<span className="text-body-md">Repair</span>
</div>
</td>
<td className="px-6 py-4 text-body-md text-on-surface-variant">Oct 25, 2023</td>
<td className="px-6 py-4">
<span className="text-body-md text-secondary font-medium italic">In Progress</span>
</td>
<td className="px-6 py-4 text-body-md text-right technical-id">$1,240.00</td>
<td className="px-6 py-4">
<span className="status-pill bg-[#8B5CF6]/10 text-[#A78BFA] border border-[#8B5CF6]/30">
<span className="w-1 h-1 rounded-full bg-[#8B5CF6] mr-2"></span>
                                Active
                            </span>
</td>
<td className="px-6 py-4 text-right">
<div className="row-hover-actions flex items-center justify-end gap-2">
<button className="text-[11px] font-bold text-on-surface-variant hover:text-primary transition-colors">VIEW DETAILS</button>
<button className="text-[11px] font-bold text-error hover:brightness-125 transition-colors">CLOSE RECORD</button>
</div>
</td>
</tr>
{/*  Closed Row  */}
<tr className="hover:bg-primary-container/5 transition-colors group">
<td className="px-6 py-4 technical-id text-on-surface-variant">FR-672</td>
<td className="px-6 py-4">
<div className="flex items-center gap-2">
<span className="material-symbols-outlined text-secondary text-[20px]">tire_repair</span>
<span className="text-body-md">Tire Rotation</span>
</div>
</td>
<td className="px-6 py-4 text-body-md text-on-surface-variant">Oct 18, 2023</td>
<td className="px-6 py-4 text-body-md text-on-surface-variant">Oct 19, 2023</td>
<td className="px-6 py-4 text-body-md text-right technical-id">$85.00</td>
<td className="px-6 py-4">
<span className="status-pill bg-primary/10 text-primary border border-primary/30">
<span className="w-1 h-1 rounded-full bg-primary mr-2"></span>
                                Closed
                            </span>
</td>
<td className="px-6 py-4 text-right">
<div className="row-hover-actions flex items-center justify-end gap-2">
<button className="text-[11px] font-bold text-on-surface-variant hover:text-primary transition-colors">VIEW DETAILS</button>
</div>
</td>
</tr>
{/*  Closed Row  */}
<tr className="hover:bg-primary-container/5 transition-colors group">
<td className="px-6 py-4 technical-id text-on-surface-variant">MX-880</td>
<td className="px-6 py-4">
<div className="flex items-center gap-2">
<span className="material-symbols-outlined text-secondary text-[20px]">fact_check</span>
<span className="text-body-md">Inspection</span>
</div>
</td>
<td className="px-6 py-4 text-body-md text-on-surface-variant">Oct 15, 2023</td>
<td className="px-6 py-4 text-body-md text-on-surface-variant">Oct 15, 2023</td>
<td className="px-6 py-4 text-body-md text-right technical-id">$150.00</td>
<td className="px-6 py-4">
<span className="status-pill bg-primary/10 text-primary border border-primary/30">
<span className="w-1 h-1 rounded-full bg-primary mr-2"></span>
                                Closed
                            </span>
</td>
<td className="px-6 py-4 text-right">
<div className="row-hover-actions flex items-center justify-end gap-2">
<button className="text-[11px] font-bold text-on-surface-variant hover:text-primary transition-colors">VIEW DETAILS</button>
</div>
</td>
</tr>
</tbody>
</table>
</div>
{/*  Visual Background Decoration  */}
<div className="fixed bottom-0 right-0 w-1/3 h-1/3 pointer-events-none opacity-5">

</div>
</main>
{/*  Side Slide-In Drawer  */}
<div className="fixed inset-0 z-[60] flex justify-end transition-transform transform translate-x-0" id="side-drawer" style={{background: "rgba(0,0,0,0.4)", }}>
{/*  Click outside overlay  */}
<div className="flex-1" onclick="document.getElementById('side-drawer').classList.add('translate-x-full')"></div>
<div className="w-[450px] h-full glass-panel shadow-2xl p-8 flex flex-col border-l border-outline-variant translate-x-0 transition-transform">
<div className="flex items-center justify-between mb-8">
<div>
<h2 className="font-headline-md text-headline-md text-primary">New Maintenance Record</h2>
<p className="text-body-md text-on-surface-variant">Log operational service and fleet availability.</p>
</div>
<button className="material-symbols-outlined text-on-surface-variant hover:text-white transition-colors" onclick="document.getElementById('side-drawer').classList.add('translate-x-full')">close</button>
</div>
<form className="space-y-6 flex-1 overflow-y-auto pr-2">
<div>
<label className="block font-label-caps text-[11px] text-on-surface-variant mb-2 uppercase">Vehicle Selection</label>
<div className="relative">
<span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
<select className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg py-3 pl-10 pr-4 text-body-md text-on-surface appearance-none glow-cyan technical-id">
<option>Select Registration Number...</option>
<option>VX-901</option>
<option>TL-400</option>
<option>KR-212</option>
<option>MX-009</option>
<option>BJ-118</option>
</select>
<span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">expand_more</span>
</div>
</div>
<div>
<label className="block font-label-caps text-[11px] text-on-surface-variant mb-2 uppercase">Maintenance Type</label>
<div className="grid grid-cols-2 gap-3">
<label className="flex items-center gap-3 bg-surface-container-high p-3 rounded-lg border border-outline-variant cursor-pointer hover:border-primary transition-all">
<input className="hidden peer" name="m-type" type="radio"/>
<span className="material-symbols-outlined text-on-surface-variant">oil_barrel</span>
<span className="text-body-md text-on-surface-variant">Oil Change</span>
</label>
<label className="flex items-center gap-3 bg-surface-container-high p-3 rounded-lg border border-outline-variant cursor-pointer hover:border-primary transition-all">
<input className="hidden peer" name="m-type" type="radio"/>
<span className="material-symbols-outlined text-on-surface-variant">tire_repair</span>
<span className="text-body-md text-on-surface-variant">Tire Rotation</span>
</label>
<label className="flex items-center gap-3 bg-surface-container-high p-3 rounded-lg border border-outline-variant cursor-pointer hover:border-primary transition-all">
<input className="hidden peer" name="m-type" type="radio"/>
<span className="material-symbols-outlined text-on-surface-variant">fact_check</span>
<span className="text-body-md text-on-surface-variant">Inspection</span>
</label>
<label className="flex items-center gap-3 bg-surface-container-high p-3 rounded-lg border border-outline-variant cursor-pointer hover:border-primary transition-all">
<input className="hidden peer" name="m-type" type="radio"/>
<span className="material-symbols-outlined text-on-surface-variant">build</span>
<span className="text-body-md text-on-surface-variant">Repair</span>
</label>
</div>
</div>
<div>
<label className="block font-label-caps text-[11px] text-on-surface-variant mb-2 uppercase">Description</label>
<textarea className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg py-3 px-4 text-body-md text-on-surface glow-cyan resize-none" placeholder="Detail any specific issues or components being serviced..." rows="4"></textarea>
</div>
<div className="grid grid-cols-2 gap-4">
<div>
<label className="block font-label-caps text-[11px] text-on-surface-variant mb-2 uppercase">Estimated Cost</label>
<div className="relative">
<span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant font-bold">$</span>
<input className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg py-3 pl-8 pr-4 text-body-md text-on-surface technical-id glow-cyan" placeholder="0.00" type="text"/>
</div>
</div>
<div>
<label className="block font-label-caps text-[11px] text-on-surface-variant mb-2 uppercase">Start Date</label>
<input className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg py-3 px-4 text-body-md text-on-surface glow-cyan" type="date"/>
</div>
</div>
</form>
<div className="pt-6 mt-6 border-t border-outline-variant space-y-4">
{/*  Confirmation Toast (Implicitly near Save)  */}
<div className="flex items-start gap-3 bg-primary/10 border border-primary/20 p-3 rounded-lg animate-pulse" id="status-toast">
<span className="material-symbols-outlined text-primary text-[20px]">info</span>
<p className="text-[12px] leading-tight text-primary font-medium">Vehicle status will be updated to <span className="font-bold">In Shop</span> — removed from dispatch pool immediately upon saving.</p>
</div>
<div className="flex gap-4">
<button className="flex-1 py-3 border border-outline-variant rounded-lg text-on-surface font-bold hover:bg-surface-container transition-colors" onclick="document.getElementById('side-drawer').classList.add('translate-x-full')">Discard</button>
<button className="flex-1 py-3 bg-primary text-on-primary rounded-lg font-bold hover:brightness-110 shadow-lg shadow-primary/10 transition-all active:scale-95">Save Record</button>
</div>
</div>
</div>
</div>


    </div>
  );
}
