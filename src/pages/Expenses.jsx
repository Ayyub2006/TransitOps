import React from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

export default function Expenses() {
  return (
    <div className="min-h-screen overflow-x-hidden dark text-on-surface bg-background font-body-md">
      
{/*  SideNavBar  */}
<Sidebar />
{/*  TopNavBar  */}
<header className="h-topbar-height fixed top-0 right-0 left-[260px] bg-surface-dim border-b border-outline-variant flex items-center justify-between px-gutter z-40">
<div className="flex items-center flex-1 max-w-xl">
<div className="relative w-full">
<span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
<input className="w-full bg-surface-container-lowest border border-outline-variant rounded-full py-1.5 pl-10 pr-4 text-body-md focus:outline-none focus:border-primary/50 transition-colors" placeholder="Search mission, driver or vehicle..." type="text"/>
</div>
</div>
<div className="flex items-center gap-6">
<div className="flex items-center gap-2 px-3 py-1 bg-surface-container-high border border-outline-variant rounded-full">
<span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
<span className="text-[11px] font-bold uppercase tracking-wider text-primary">Operator Status: Active</span>
</div>
<div className="flex items-center gap-4 text-on-surface-variant">
<button className="hover:text-primary transition-colors relative">
<span className="material-symbols-outlined">notifications</span>
<span className="absolute -top-1 -right-1 w-2 h-2 bg-error rounded-full"></span>
</button>
<button className="hover:text-primary transition-colors">
<span className="material-symbols-outlined">admin_panel_settings</span>
</button>
<div className="w-[1px] h-6 bg-outline-variant"></div>
<div className="flex items-center gap-3">
<div className="text-right">
<p className="text-body-md font-bold text-on-surface leading-none">J. Sharma</p>
<p className="text-[10px] text-on-surface-variant uppercase tracking-tighter">Senior Controller</p>
</div>
<div className="w-8 h-8 rounded-lg bg-primary-container/20 border border-primary/30 overflow-hidden">
<img className="w-full h-full object-cover" data-alt="A professional headshot of a senior logistics operator in a dark blue technical uniform, set against a blurred background of a high-tech command center with glowing turquoise monitors and data displays. The lighting is crisp and modern with a cinematic quality." src="https://lh3.googleusercontent.com/aida-public/AB6AXuDQH1n1ZPVLbYKb5hdlHJahY8Tr4vYv0jVQWs2SLArp5DHVbDd6u30je5GGOMqm615d1QfGiRcdlWQBpQUmWG16kuHfRx0bM5wvLt-FOuwF_n00vqz7R-UmsNiwkn8AYfW4vOA81V4D--Ipx5Q06t-4dh68OlVIqPuxy8cj9ax8NN9JdwGt6WCqpaU05merPuSwvfG1DiYGS7PgpSSfWKzyl7m9661kQxMPszpPEfNbUTRXN0FyizZ4QQ"/>
</div>
</div>
</div>
</div>
</header>
{/*  Main Content Canvas  */}
<main className="ml-[260px] pt-[64px] min-h-screen p-gutter bg-background relative overflow-hidden">
{/*  Atmospheric Background Element  */}
<div className="absolute top-0 right-0 -mr-32 -mt-32 w-[600px] h-[600px] bg-primary/5 blur-[120px] rounded-full pointer-events-none"></div>
<div className="relative z-10 max-w-[1600px] mx-auto">
{/*  Header Section  */}
<div className="flex items-end justify-between mb-8">
<div>
<h2 className="font-headline-lg text-headline-lg text-on-surface mb-1">Fuel &amp; Expense Management</h2>
<p className="text-on-surface-variant font-body-lg">Financial overview and efficiency auditing for the current mission cycle.</p>
</div>
<div className="flex gap-3">
<button className="px-6 py-2 border border-outline-variant text-on-surface font-bold rounded hover:bg-surface-container-highest transition-colors flex items-center gap-2">
<span className="material-symbols-outlined text-[18px]">receipt_long</span>
                        + Add Expense
                    </button>
<button className="px-6 py-2 bg-primary text-on-primary font-bold rounded hover:opacity-90 transition-opacity flex items-center gap-2">
<span className="material-symbols-outlined text-[18px]">local_gas_station</span>
                        + Add Fuel Log
                    </button>
</div>
</div>
{/*  Summary KPI Row  */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
{/*  KPI 1  */}
<div className="bg-surface-container p-5 border border-outline-variant rounded-lg relative overflow-hidden group hover:border-primary/30 transition-all">
<div className="flex justify-between items-start mb-4">
<span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest">Total Fuel Cost</span>
<span className="material-symbols-outlined text-primary/40">local_gas_station</span>
</div>
<div className="font-kpi-value text-kpi-value text-on-surface tracking-tight mb-2">₹42,39,042</div>
<div className="flex items-center gap-2 text-[12px]">
<span className="text-primary">+2.4%</span>
<span className="text-on-surface-variant opacity-50">vs previous period</span>
</div>
<div className="absolute bottom-0 right-0 w-24 h-12 opacity-20">
{/*  Tiny Sparkline Simulation  */}
<svg className="w-full h-full stroke-primary fill-none stroke-2" viewbox="0 0 100 40">
<path d="M0 35 L10 32 L20 38 L30 25 L40 28 L50 15 L60 22 L70 10 L80 18 L90 5 L100 8"></path>
</svg>
</div>
</div>
{/*  KPI 2  */}
<div className="bg-surface-container p-5 border border-outline-variant rounded-lg group hover:border-primary/30 transition-all">
<div className="flex justify-between items-start mb-4">
<span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest">Other Expenses</span>
<span className="material-symbols-outlined text-primary/40">payments</span>
</div>
<div className="font-kpi-value text-kpi-value text-on-surface tracking-tight mb-2">₹8,12,000</div>
<div className="flex items-center gap-2 text-[12px]">
<span className="text-error-container text-error">-1.1%</span>
<span className="text-on-surface-variant opacity-50">optimization gain</span>
</div>
</div>
{/*  KPI 3  */}
<div className="bg-surface-container p-5 border border-outline-variant rounded-lg group hover:border-primary/30 transition-all">
<div className="flex justify-between items-start mb-4">
<span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest">Combined Cost</span>
<span className="material-symbols-outlined text-primary/40">account_balance_wallet</span>
</div>
<div className="font-kpi-value text-kpi-value text-primary tracking-tight mb-2">₹50,51,042</div>
<div className="flex items-center gap-2 text-[12px]">
<span className="px-2 py-0.5 bg-primary/10 border border-primary/20 text-primary rounded-full">In Budget</span>
</div>
</div>
{/*  KPI 4  */}
<div className="bg-surface-container p-5 border border-outline-variant rounded-lg animate-glow cursor-pointer group">
<div className="flex justify-between items-start mb-4">
<span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest">Efficiency Anomalies</span>
<span className="material-symbols-outlined text-tertiary">warning</span>
</div>
<div className="flex items-center gap-3">
<div className="font-kpi-value text-kpi-value text-tertiary tracking-tight">12 Active</div>
<span className="material-symbols-outlined text-tertiary animate-pulse">flag</span>
</div>
<div className="text-[12px] text-tertiary-container mt-2 flex items-center gap-1">
                        Review high-deviation logs
                        <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
</div>
</div>
</div>
{/*  Main Data Section  */}
<div className="bg-surface-container-low border border-outline-variant rounded-xl overflow-x-auto flex flex-col min-h-[600px]">
{/*  Tabs  */}
<div className="flex border-b border-outline-variant bg-surface-container-low/50">
<button className="px-8 py-4 font-headline-sm text-primary border-b-2 border-primary bg-primary/5 transition-all" id="tab-fuel" onclick="switchTab('fuel')">
                        Fuel Logs
                    </button>
<button className="px-8 py-4 font-headline-sm text-on-surface-variant hover:text-on-surface transition-all border-b-2 border-transparent" id="tab-expenses" onclick="switchTab('expenses')">
                        Other Expenses
                    </button>
<div className="flex-1"></div>
<div className="flex items-center px-gutter gap-3">
<button className="p-2 text-on-surface-variant hover:text-primary transition-colors">
<span className="material-symbols-outlined">filter_list</span>
</button>
<button className="p-2 text-on-surface-variant hover:text-primary transition-colors">
<span className="material-symbols-outlined">download</span>
</button>
</div>
</div>
{/*  Fuel Logs Table (Active)  */}
<div className="flex-1 flex flex-col" id="content-fuel">
<table className="w-full text-left border-collapse">
<thead>
<tr className="bg-surface-container-lowest/50 border-b border-outline-variant">
<th className="px-gutter py-4 font-label-caps text-on-surface-variant uppercase tracking-widest">Vehicle</th>
<th className="px-gutter py-4 font-label-caps text-on-surface-variant uppercase tracking-widest">Date</th>
<th className="px-gutter py-4 font-label-caps text-on-surface-variant uppercase tracking-widest">Liters</th>
<th className="px-gutter py-4 font-label-caps text-on-surface-variant uppercase tracking-widest">Cost</th>
<th className="px-gutter py-4 font-label-caps text-on-surface-variant uppercase tracking-widest">Odometer</th>
<th className="px-gutter py-4 font-label-caps text-on-surface-variant uppercase tracking-widest">Efficiency</th>
<th className="px-gutter py-4 font-label-caps text-on-surface-variant uppercase tracking-widest">Anomaly</th>
<th className="px-gutter py-4 font-label-caps text-on-surface-variant uppercase tracking-widest text-right">Actions</th>
</tr>
</thead>
<tbody className="divide-y divide-outline-variant/30">
{/*  Row 1: The Anomaly Row  */}
<tr className="group hover:bg-surface-container-highest/30 transition-colors">
<td className="px-gutter py-4 font-mono text-primary">TX-9920-A</td>
<td className="px-gutter py-4">Oct 24, 2023</td>
<td className="px-gutter py-4">124.5 L</td>
<td className="px-gutter py-4">₹18,675</td>
<td className="px-gutter py-4">42,910 km</td>
<td className="px-gutter py-4 text-error font-bold">5.4 km/L</td>
<td className="px-gutter py-4 relative">
<div className="relative group/tooltip">
<span className="material-symbols-outlined text-error cursor-help" data-weight="fill" style={{fontVariationSettings: "'FILL' 1", }}>flag</span>
{/*  Tooltip (Visible on Hover/State)  */}
<div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-surface-container-highest border border-error/50 rounded shadow-2xl z-50 pointer-events-none opacity-0 group-hover/tooltip:opacity-100 transition-opacity translate-y-1 group-hover/tooltip:translate-y-0">
<p className="text-[11px] text-error font-bold uppercase tracking-wider mb-1">Alert: Efficiency Drop</p>
<p className="text-[13px] text-on-surface leading-tight">34% below average efficiency — possible leak or data entry error</p>
<div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-surface-container-highest"></div>
</div>
</div>
</td>
<td className="px-gutter py-4 text-right">
<button className="text-on-surface-variant hover:text-primary transition-colors"><span className="material-symbols-outlined">more_vert</span></button>
</td>
</tr>
<tr className="group hover:bg-surface-container-highest/30 transition-colors">
<td className="px-gutter py-4 font-mono text-primary">TX-1044-B</td>
<td className="px-gutter py-4">Oct 24, 2023</td>
<td className="px-gutter py-4">98.0 L</td>
<td className="px-gutter py-4">₹14,700</td>
<td className="px-gutter py-4">18,332 km</td>
<td className="px-gutter py-4 text-on-surface">8.4 km/L</td>
<td className="px-gutter py-4">
<span className="material-symbols-outlined text-on-surface-variant opacity-20">flag</span>
</td>
<td className="px-gutter py-4 text-right">
<button className="text-on-surface-variant hover:text-primary transition-colors"><span className="material-symbols-outlined">more_vert</span></button>
</td>
</tr>
<tr className="group hover:bg-surface-container-highest/30 transition-colors">
<td className="px-gutter py-4 font-mono text-primary">TX-5512-C</td>
<td className="px-gutter py-4">Oct 23, 2023</td>
<td className="px-gutter py-4">150.2 L</td>
<td className="px-gutter py-4">₹22,530</td>
<td className="px-gutter py-4">89,122 km</td>
<td className="px-gutter py-4 text-on-surface">8.2 km/L</td>
<td className="px-gutter py-4">
<span className="material-symbols-outlined text-on-surface-variant opacity-20">flag</span>
</td>
<td className="px-gutter py-4 text-right">
<button className="text-on-surface-variant hover:text-primary transition-colors"><span className="material-symbols-outlined">more_vert</span></button>
</td>
</tr>
<tr className="group hover:bg-surface-container-highest/30 transition-colors">
<td className="px-gutter py-4 font-mono text-primary">TX-9110-D</td>
<td className="px-gutter py-4">Oct 23, 2023</td>
<td className="px-gutter py-4">45.0 L</td>
<td className="px-gutter py-4">₹6,750</td>
<td className="px-gutter py-4">12,400 km</td>
<td className="px-gutter py-4 text-tertiary">7.1 km/L</td>
<td className="px-gutter py-4">
<span className="material-symbols-outlined text-tertiary">flag</span>
</td>
<td className="px-gutter py-4 text-right">
<button className="text-on-surface-variant hover:text-primary transition-colors"><span className="material-symbols-outlined">more_vert</span></button>
</td>
</tr>
<tr className="group hover:bg-surface-container-highest/30 transition-colors">
<td className="px-gutter py-4 font-mono text-primary">TX-2283-K</td>
<td className="px-gutter py-4">Oct 22, 2023</td>
<td className="px-gutter py-4">112.5 L</td>
<td className="px-gutter py-4">₹16,875</td>
<td className="px-gutter py-4">55,109 km</td>
<td className="px-gutter py-4 text-on-surface">8.5 km/L</td>
<td className="px-gutter py-4">
<span className="material-symbols-outlined text-on-surface-variant opacity-20">flag</span>
</td>
<td className="px-gutter py-4 text-right">
<button className="text-on-surface-variant hover:text-primary transition-colors"><span className="material-symbols-outlined">more_vert</span></button>
</td>
</tr>
</tbody>
</table>
<div className="mt-auto p-4 flex items-center justify-between bg-surface-container-lowest/30 border-t border-outline-variant">
<span className="text-on-surface-variant text-[12px]">Showing 5 of 1,248 logs</span>
<div className="flex gap-1">
<button className="px-3 py-1 border border-outline-variant rounded hover:bg-surface-container-highest">Previous</button>
<button className="px-3 py-1 bg-primary text-on-primary rounded">1</button>
<button className="px-3 py-1 border border-outline-variant rounded hover:bg-surface-container-highest">2</button>
<button className="px-3 py-1 border border-outline-variant rounded hover:bg-surface-container-highest">3</button>
<button className="px-3 py-1 border border-outline-variant rounded hover:bg-surface-container-highest">Next</button>
</div>
</div>
</div>
{/*  Other Expenses Table (Hidden)  */}
<div className="hidden flex-1 flex flex-col" id="content-expenses">
<table className="w-full text-left border-collapse">
<thead>
<tr className="bg-surface-container-lowest/50 border-b border-outline-variant">
<th className="px-gutter py-4 font-label-caps text-on-surface-variant uppercase tracking-widest">Vehicle</th>
<th className="px-gutter py-4 font-label-caps text-on-surface-variant uppercase tracking-widest">Category</th>
<th className="px-gutter py-4 font-label-caps text-on-surface-variant uppercase tracking-widest">Date</th>
<th className="px-gutter py-4 font-label-caps text-on-surface-variant uppercase tracking-widest">Amount</th>
<th className="px-gutter py-4 font-label-caps text-on-surface-variant uppercase tracking-widest">Notes</th>
<th className="px-gutter py-4 font-label-caps text-on-surface-variant uppercase tracking-widest text-right">Actions</th>
</tr>
</thead>
<tbody className="divide-y divide-outline-variant/30">
<tr className="group hover:bg-surface-container-highest/30 transition-colors">
<td className="px-gutter py-4 font-mono text-primary">TX-1044-B</td>
<td className="px-gutter py-4">
<span className="px-2 py-0.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full text-[11px] font-bold uppercase">Toll</span>
</td>
<td className="px-gutter py-4 text-on-surface-variant">Oct 24, 2023</td>
<td className="px-gutter py-4 font-bold text-on-surface">₹1,250</td>
<td className="px-gutter py-4 text-on-surface-variant italic">Bandra Worli Sea Link</td>
<td className="px-gutter py-4 text-right">
<button className="text-on-surface-variant hover:text-primary transition-colors"><span className="material-symbols-outlined">more_vert</span></button>
</td>
</tr>
<tr className="group hover:bg-surface-container-highest/30 transition-colors">
<td className="px-gutter py-4 font-mono text-primary">TX-9920-A</td>
<td className="px-gutter py-4">
<span className="px-2 py-0.5 bg-error/10 text-error border border-error/20 rounded-full text-[11px] font-bold uppercase">Repair</span>
</td>
<td className="px-gutter py-4 text-on-surface-variant">Oct 23, 2023</td>
<td className="px-gutter py-4 font-bold text-on-surface">₹45,000</td>
<td className="px-gutter py-4 text-on-surface-variant italic">Alternator replacement (Emergency)</td>
<td className="px-gutter py-4 text-right">
<button className="text-on-surface-variant hover:text-primary transition-colors"><span className="material-symbols-outlined">more_vert</span></button>
</td>
</tr>
<tr className="group hover:bg-surface-container-highest/30 transition-colors">
<td className="px-gutter py-4 font-mono text-primary">Fleet Wide</td>
<td className="px-gutter py-4">
<span className="px-2 py-0.5 bg-primary/10 text-primary border border-primary/20 rounded-full text-[11px] font-bold uppercase">Other</span>
</td>
<td className="px-gutter py-4 text-on-surface-variant">Oct 22, 2023</td>
<td className="px-gutter py-4 font-bold text-on-surface">₹1,20,000</td>
<td className="px-gutter py-4 text-on-surface-variant italic">Software Subscription - FleetControl Pro</td>
<td className="px-gutter py-4 text-right">
<button className="text-on-surface-variant hover:text-primary transition-colors"><span className="material-symbols-outlined">more_vert</span></button>
</td>
</tr>
</tbody>
</table>
<div className="mt-auto p-4 bg-surface-container-lowest/30 border-t border-outline-variant">
<span className="text-on-surface-variant text-[12px]">Showing 3 of 42 expenses</span>
</div>
</div>
</div>
{/*  Optimization Insights Area  */}
<div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
<div className="lg:col-span-2 glass-panel p-6 rounded-xl border-l-4 border-l-primary relative overflow-hidden">
<div className="flex items-center gap-3 mb-4">
<span className="material-symbols-outlined text-primary">lightbulb</span>
<h3 className="font-headline-sm text-headline-sm text-on-surface">Efficiency Intelligence Report</h3>
</div>
<div className="grid grid-cols-2 gap-4">
<div className="p-4 bg-surface-container rounded-lg border border-outline-variant">
<p className="text-[11px] text-on-surface-variant uppercase tracking-widest mb-1">Route Impact</p>
<p className="text-on-surface font-body-md">Urban stop-and-go routes are increasing fuel burn by <span className="text-error">18.4%</span>. Recommend rerouting TX-9920 series.</p>
</div>
<div className="p-4 bg-surface-container rounded-lg border border-outline-variant">
<p className="text-[11px] text-on-surface-variant uppercase tracking-widest mb-1">Idle Analysis</p>
<p className="text-on-surface font-body-md">Excessive idling detected in <span className="text-primary">4 drivers</span>. Potential savings: <span className="text-primary">₹1,24,000/mo</span>.</p>
</div>
</div>

</div>
<div className="bg-surface-container p-6 rounded-xl border border-outline-variant flex flex-col items-center justify-center text-center">
<div className="w-16 h-16 rounded-full border-4 border-primary border-t-transparent animate-spin mb-4 flex items-center justify-center">
<span className="material-symbols-outlined text-primary">monitoring</span>
</div>
<h3 className="font-headline-sm text-headline-sm text-on-surface mb-2">Generating Audit...</h3>
<p className="text-on-surface-variant text-body-md px-4">Our AI is currently cross-referencing fuel logs with GPS mission paths for precision verification.</p>
</div>
</div>
</div>
</main>


    </div>
  );
}
