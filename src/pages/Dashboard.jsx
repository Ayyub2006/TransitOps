import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { getKPIs } from '../services/dashboardService';
import { getVehicleStatus, getTripsData, getFuelTrend, getExpenseDistribution } from '../services/analyticsService';
import {
  PieChart, Pie, Cell, Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  LineChart, Line
} from 'recharts';

export default function Dashboard() {
  const [kpis, setKpis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [analytics, setAnalytics] = useState({
    vehicleStatus: [], tripsData: [], fuelTrend: [], expenseDistribution: []
  });
  const [analyticsLoading, setAnalyticsLoading] = useState(true);

  useEffect(() => {
    const fetchKPIs = async () => {
      try {
        setLoading(true);
        const data = await getKPIs();
        setKpis(data);
      } catch (err) {
        setError(err.message || 'Failed to fetch KPIs');
      } finally {
        setLoading(false);
      }
    };

    const fetchAnalyticsData = async () => {
      try {
        setAnalyticsLoading(true);
        const [vs, td, ft, ed] = await Promise.all([
          getVehicleStatus(), getTripsData(), getFuelTrend(), getExpenseDistribution()
        ]);
        setAnalytics({ vehicleStatus: vs, tripsData: td, fuelTrend: ft, expenseDistribution: ed });
      } catch (err) {
        console.error("Failed to fetch analytics:", err);
      } finally {
        setAnalyticsLoading(false);
      }
    };

    fetchKPIs();
    fetchAnalyticsData();
  }, []);

  return (
    <div className="min-h-screen overflow-x-hidden dark text-on-surface bg-background font-body-md">
      
{/*  SIDEBAR  */}
<Sidebar />
{/*  MAIN WRAPPER  */}
<div className="ml-0 lg:ml-[var(--spacing-sidebar-width)] flex flex-col">
{/*  TOP APP BAR  */}
<header className="fixed top-0 right-0 h-topbar-height w-full lg:w-[calc(100%-var(--spacing-sidebar-width))] bg-surface border-b border-outline-variant z-40 flex justify-between items-center px-gutter">
<div className="flex items-center gap-4 flex-wrap">
<div className="flex items-center gap-2">
<span className="font-headline-sm text-headline-sm font-bold text-primary">TransitOps Fleet</span>
</div>
<div className="flex items-center gap-6">
<a className="font-label-caps text-label-caps text-primary border-b-2 border-primary pb-1" href="#" onClick={(e) => e.preventDefault()}>Live Tracking</a>
<a className="font-label-caps text-label-caps text-on-surface-variant hover:text-primary transition-colors" href="#" onClick={(e) => e.preventDefault()}>Schedules</a>
</div>
</div>
<div className="flex items-center gap-6">
<div className="px-3 py-1 bg-surface-container-high border border-outline-variant rounded-full flex items-center gap-2">
<div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
<span className="font-label-caps text-label-caps text-on-surface">Clearance: L3</span>
</div>
<div className="flex items-center gap-4">
<button className="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors cursor-pointer">notifications</button>
<div className="flex items-center gap-3 pl-4 border-l border-outline-variant">
<div className="text-right">
<p className="text-xs font-bold leading-none">A. VANCE</p>
<p className="text-[10px] text-on-surface-variant uppercase tracking-widest">Chief Operator</p>
</div>
<img className="w-8 h-8 rounded-full border border-primary/50 object-cover" data-alt="A portrait of a professional transit operations manager wearing a modern technical headset, sitting in a dimly lit control room with blue accent lighting, high-contrast cinematic photography style." src="https://lh3.googleusercontent.com/aida-public/AB6AXuBImUdIJ2cbWxmgbwjGu7ZcZYQ8Ks_TS0XeJzWE8ATcaGY_N0idqDs1T13SG_jXZFjQ7aRR6j74AsL5LNKK0nyp94BiLwqK83ywZcmMDH9l8Rd5Zo076oAvvGKrWy5mN5ti_qu66uY72pu51hpK5mIC_ODdPiC4LNL6IvAh6CuFkZ00MpK3tuW8gAFxYKkrVCip6VxI6iGcW5EH-i8xHD438ceI9D2UQXPzIGjhDYE2xg2-xm_qbkm6Ww"/>
</div>
</div>
</div>
</header>
{/*  CONTENT CANVAS  */}
<main className="mt-topbar-height p-gutter pb-20 space-y-6">
{/*  KPI STRIP  */}
<section className="flex gap-4 overflow-x-auto pb-2 custom-scrollbar min-h-[120px]">
{loading ? (
  <div className="w-full flex items-center justify-center font-bold text-primary">
    Loading KPIs...
  </div>
) : error ? (
  <div className="w-full flex items-center justify-center font-bold text-error">
    {error}
  </div>
) : kpis && (
  <>
  {/*  Card 1  */}
  <div className="min-w-[180px] bg-surface-container border border-outline-variant p-4 rounded-lg flex flex-col justify-between glow-cyan transition-all">
  <p className="font-label-caps text-label-caps text-on-surface-variant">Active Vehicles</p>
  <div className="flex items-baseline gap-2 mt-2">
  <span className="font-kpi-value text-kpi-value">{kpis.activeVehicles}</span>
  <span className="text-xs text-primary flex items-center"><span className="material-symbols-outlined text-xs">trending_up</span>4%</span>
  </div>
  <div className="w-full h-1 bg-primary/10 mt-3 rounded-full overflow-hidden">
  <div className="h-full bg-primary w-[85%]"></div>
  </div>
  </div>
  {/*  Card 2  */}
  <div className="min-w-[180px] bg-surface-container border border-outline-variant p-4 rounded-lg flex flex-col justify-between glow-cyan transition-all">
  <p className="font-label-caps text-label-caps text-on-surface-variant">Available (Green)</p>
  <div className="flex items-baseline gap-2 mt-2">
  <span className="font-kpi-value text-kpi-value text-emerald-400">{kpis.availableVehicles}</span>
  <span className="text-xs text-emerald-400 flex items-center"><span className="material-symbols-outlined text-xs">check_circle</span>STABLE</span>
  </div>
  <div className="w-full h-1 bg-emerald-400/10 mt-3 rounded-full overflow-hidden">
  <div className="h-full bg-emerald-400 w-[20%]"></div>
  </div>
  </div>
  {/*  Card 3  */}
  <div className="min-w-[180px] bg-surface-container border border-outline-variant p-4 rounded-lg flex flex-col justify-between glow-cyan transition-all">
  <p className="font-label-caps text-label-caps text-on-surface-variant">In Maintenance</p>
  <div className="flex items-baseline gap-2 mt-2">
  <span className="font-kpi-value text-kpi-value text-purple-400">{kpis.inMaintenance}</span>
  <span className="text-xs text-purple-400 flex items-center"><span className="material-symbols-outlined text-xs">build</span>+2</span>
  </div>
  <div className="w-full h-1 bg-purple-400/10 mt-3 rounded-full overflow-hidden">
  <div className="h-full bg-purple-400 w-[45%]"></div>
  </div>
  </div>
  {/*  Card 4  */}
  <div className="min-w-[180px] bg-surface-container border border-outline-variant p-4 rounded-lg flex flex-col justify-between glow-cyan transition-all">
  <p className="font-label-caps text-label-caps text-on-surface-variant">Active Trips</p>
  <div className="flex items-baseline gap-2 mt-2">
  <span className="font-kpi-value text-kpi-value text-amber-400">{kpis.activeTrips}</span>
  <span className="text-xs text-amber-400 flex items-center"><span className="material-symbols-outlined text-xs">schedule</span>LIVE</span>
  </div>
  <div className="w-full h-1 bg-amber-400/10 mt-3 rounded-full overflow-hidden">
  <div className="h-full bg-amber-400 w-[65%]"></div>
  </div>
  </div>
  {/*  Card 5  */}
  <div className="min-w-[180px] bg-surface-container border border-outline-variant p-4 rounded-lg flex flex-col justify-between glow-cyan transition-all">
  <p className="font-label-caps text-label-caps text-on-surface-variant">Pending Trips</p>
  <div className="flex items-baseline gap-2 mt-2">
  <span className="font-kpi-value text-kpi-value text-slate-400">{kpis.pendingTrips}</span>
  <span className="text-xs text-slate-400 flex items-center"><span className="material-symbols-outlined text-xs">pause_circle</span>HOLD</span>
  </div>
  <div className="w-full h-1 bg-slate-400/10 mt-3 rounded-full overflow-hidden">
  <div className="h-full bg-slate-400 w-[15%]"></div>
  </div>
  </div>
  {/*  Card 6  */}
  <div className="min-w-[180px] bg-surface-container border border-outline-variant p-4 rounded-lg flex flex-col justify-between glow-cyan transition-all">
  <p className="font-label-caps text-label-caps text-on-surface-variant">Drivers On Duty</p>
  <div className="flex items-baseline gap-2 mt-2">
  <span className="font-kpi-value text-kpi-value">{kpis.driversOnDuty}</span>
  <span className="text-xs text-primary flex items-center"><span className="material-symbols-outlined text-xs">group</span>FULL</span>
  </div>
  <div className="w-full h-1 bg-primary/10 mt-3 rounded-full overflow-hidden">
  <div className="h-full bg-primary w-[98%]"></div>
  </div>
  </div>
  {/*  Card 7  */}
  <div className="min-w-[180px] bg-surface-container border border-outline-variant p-4 rounded-lg flex items-center justify-between glow-cyan transition-all">
  <div>
  <p className="font-label-caps text-label-caps text-on-surface-variant">Utilization %</p>
  <span className="font-kpi-value text-kpi-value">{kpis.fleetUtilization}</span>
  </div>
  <div className="relative w-12 h-12 flex items-center justify-center">
  <svg className="w-full h-full -rotate-90">
  <circle className="text-outline-variant" cx="24" cy="24" fill="transparent" r="20" stroke="currentColor" strokeWidth="4"></circle>
  <circle className="text-primary" cx="24" cy="24" fill="transparent" r="20" stroke="currentColor" strokeDasharray="125.6" strokeDashoffset={`${125.6 - (125.6 * kpis.fleetUtilization) / 100}`} strokeWidth="4"></circle>
  </svg>
  </div>
  </div>
  </>
)}
</section>
{/*  MIDDLE SECTION: MAP & RISK RADAR  */}
<div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
{/*  FLEET MAP  */}
<div className="col-span-12 col-span-1 lg:col-span-8 flex flex-col space-y-4">
<div className="flex items-center justify-between">
<div className="flex gap-2">
<button className="px-4 py-1.5 rounded-full text-xs font-bold bg-primary text-on-primary-container">All Units</button>
<button className="px-4 py-1.5 rounded-full text-xs font-bold bg-surface-container border border-outline-variant text-on-surface-variant hover:border-primary transition-colors">Bus</button>
<button className="px-4 py-1.5 rounded-full text-xs font-bold bg-surface-container border border-outline-variant text-on-surface-variant hover:border-primary transition-colors">Van</button>
<button className="px-4 py-1.5 rounded-full text-xs font-bold bg-surface-container border border-outline-variant text-on-surface-variant hover:border-primary transition-colors">Region: Central</button>
</div>
<div className="text-[10px] text-on-surface-variant flex items-center gap-4">
<span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-400"></span> Online</span>
<span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400"></span> Delayed</span>
<span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-400"></span> Warning</span>
</div>
</div>
<div className="relative rounded-xl border border-outline-variant bg-surface-container-lowest overflow-hidden h-[480px]">
<img className="w-full h-full object-cover opacity-60 grayscale brightness-50" data-location="San Francisco" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDY3zWgvBh1JLumrrlnObGHvruJ8uJIdEEF2wezrkxJC8T8PQplZBNqt3MCAl2EtE9Um19rYMunMDwmKg7Rvryvc0Cr8Hvq9taU9_z669ntpsZHLuE_0a91H85PnFPU1AFfV1aO_1EAg9Jc98d5tbQFBFtvosnTcEZmzqMxD2_Q0XFAM8f-BK5uT5fdtQvUzuo4-4r5b6g69GP9HHE__WXeVf32Pvl5bIbgq0ILXqjKQqg8xpHH_XYhzg"/>
{/*  Overlay Markers  */}
<div className="absolute top-1/4 left-1/3 w-3 h-3 bg-emerald-400 rounded-full border-2 border-surface map-marker shadow-[0_0_10px_rgba(52,211,153,0.8)]"></div>
<div className="absolute top-1/2 left-1/2 w-3 h-3 bg-amber-400 rounded-full border-2 border-surface map-marker shadow-[0_0_10px_rgba(251,191,36,0.8)]"></div>
<div className="absolute bottom-1/3 right-1/4 w-3 h-3 bg-red-400 rounded-full border-2 border-surface map-marker shadow-[0_0_10px_rgba(248,113,113,0.8)]"></div>
<div className="absolute top-1/3 right-1/2 w-3 h-3 bg-primary rounded-full border-2 border-surface map-marker shadow-[0_0_10px_rgba(98,243,236,0.8)]"></div>
<div className="absolute bottom-1/4 left-1/4 w-3 h-3 bg-purple-400 rounded-full border-2 border-surface map-marker shadow-[0_0_10px_rgba(167,139,250,0.8)]"></div>
{/*  Legend  */}
<div className="absolute bottom-4 right-4 p-3 bg-surface/80 backdrop-blur-md border border-outline-variant rounded-lg">
<div className="text-[10px] font-label-caps text-on-surface-variant mb-2">COORD: 37.7749° N, 122.4194° W</div>
<div className="h-24 w-32 rounded bg-surface-container-lowest border border-outline-variant/30 flex items-center justify-center">
<span className="text-[10px] opacity-20">GRID DATA LOADED</span>
</div>
</div>
{/*  Map Controls  */}
<div className="absolute top-4 right-4 flex flex-col gap-1">
<button className="w-8 h-8 bg-surface border border-outline-variant rounded flex items-center justify-center hover:bg-surface-variant transition-colors"><span className="material-symbols-outlined text-sm">add</span></button>
<button className="w-8 h-8 bg-surface border border-outline-variant rounded flex items-center justify-center hover:bg-surface-variant transition-colors"><span className="material-symbols-outlined text-sm">remove</span></button>
<button className="w-8 h-8 bg-surface border border-outline-variant mt-2 rounded flex items-center justify-center hover:bg-surface-variant transition-colors"><span className="material-symbols-outlined text-sm">my_location</span></button>
</div>
</div>
</div>
{/*  FLEET RISK RADAR  */}
<div className="col-span-12 col-span-1 lg:col-span-4 bg-surface-container border border-outline-variant rounded-xl flex flex-col">
<div className="p-4 border-b border-outline-variant flex items-center justify-between">
<div className="flex items-center gap-2">
<div className="w-2 h-2 rounded-full bg-red-500 animate-ping"></div>
<h2 className="font-headline-sm text-headline-sm">Fleet Risk Radar</h2>
</div>
<span className="text-[10px] font-label-caps px-2 py-0.5 bg-error-container/20 text-error rounded border border-error/30">5 CRITICAL</span>
</div>
<div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
{/*  Risk Item 1  */}
<div className="risk-row group p-3 bg-surface-container-low border border-outline-variant rounded-lg relative overflow-hidden transition-all hover:bg-surface-container-highest cursor-pointer">
<div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500 risk-bar transition-all duration-300"></div>
<div className="flex justify-between items-start mb-2">
<div>
<p className="text-sm font-bold">Ramesh K.</p>
<p className="text-[10px] text-on-surface-variant">Fatigue Indicator: High</p>
</div>
<div className="text-right">
<p className="text-lg font-bold text-red-400">82</p>
<p className="text-[10px] uppercase font-bold text-red-500/70">RISK SCORE</p>
</div>
</div>
<div className="flex justify-between items-center mt-3">
<span className="text-[10px] bg-red-500/10 text-red-400 px-2 py-0.5 rounded border border-red-500/20">Route #402</span>
<a className="text-[10px] font-bold text-primary flex items-center gap-1 hover:underline" href="#" onClick={(e) => e.preventDefault()}>REVIEW <span className="material-symbols-outlined text-[10px]">arrow_forward</span></a>
</div>
</div>
{/*  Risk Item 2  */}
<div className="risk-row group p-3 bg-surface-container-low border border-outline-variant rounded-lg relative overflow-hidden transition-all hover:bg-surface-container-highest cursor-pointer">
<div className="absolute left-0 top-0 bottom-0 w-1 bg-red-400 risk-bar transition-all duration-300"></div>
<div className="flex justify-between items-start mb-2">
<div>
<p className="text-sm font-bold">Vehicle B-229</p>
<p className="text-[10px] text-on-surface-variant">Brake Pressure Anomaly</p>
</div>
<div className="text-right">
<p className="text-lg font-bold text-red-400">76</p>
<p className="text-[10px] uppercase font-bold text-red-400/70">RISK SCORE</p>
</div>
</div>
<div className="flex justify-between items-center mt-3">
<span className="text-[10px] bg-red-500/10 text-red-400 px-2 py-0.5 rounded border border-red-500/20">Maintenance Req</span>
<a className="text-[10px] font-bold text-primary flex items-center gap-1 hover:underline" href="#" onClick={(e) => e.preventDefault()}>REVIEW <span className="material-symbols-outlined text-[10px]">arrow_forward</span></a>
</div>
</div>
{/*  Risk Item 3  */}
<div className="risk-row group p-3 bg-surface-container-low border border-outline-variant rounded-lg relative overflow-hidden transition-all hover:bg-surface-container-highest cursor-pointer">
<div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-500 risk-bar transition-all duration-300"></div>
<div className="flex justify-between items-start mb-2">
<div>
<p className="text-sm font-bold">Sara J.</p>
<p className="text-[10px] text-on-surface-variant">Route Deviation Warning</p>
</div>
<div className="text-right">
<p className="text-lg font-bold text-amber-400">58</p>
<p className="text-[10px] uppercase font-bold text-amber-400/70">RISK SCORE</p>
</div>
</div>
<div className="flex justify-between items-center mt-3">
<span className="text-[10px] bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded border border-amber-500/20">Shuttle X-1</span>
<a className="text-[10px] font-bold text-primary flex items-center gap-1 hover:underline" href="#" onClick={(e) => e.preventDefault()}>REVIEW <span className="material-symbols-outlined text-[10px]">arrow_forward</span></a>
</div>
</div>
{/*  Risk Item 4  */}
<div className="risk-row group p-3 bg-surface-container-low border border-outline-variant rounded-lg relative overflow-hidden transition-all hover:bg-surface-container-highest cursor-pointer">
<div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-400 risk-bar transition-all duration-300"></div>
<div className="flex justify-between items-start mb-2">
<div>
<p className="text-sm font-bold">Station C-Prime</p>
<p className="text-[10px] text-on-surface-variant">Congestion Threshold Exceeded</p>
</div>
<div className="text-right">
<p className="text-lg font-bold text-amber-400">44</p>
<p className="text-[10px] uppercase font-bold text-amber-400/70">RISK SCORE</p>
</div>
</div>
<div className="flex justify-between items-center mt-3">
<span className="text-[10px] bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded border border-amber-500/20">Hub Capacity</span>
<a className="text-[10px] font-bold text-primary flex items-center gap-1 hover:underline" href="#" onClick={(e) => e.preventDefault()}>REVIEW <span className="material-symbols-outlined text-[10px]">arrow_forward</span></a>
</div>
</div>
</div>
</div>
</div>
{/*  BOTTOM CHARTS SECTION  */}
<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
  
  {/* Chart 1: Vehicle Status Pie Chart */}
  <div className="bg-surface-container border border-outline-variant p-6 rounded-xl h-[360px] flex flex-col">
    <h3 className="font-headline-sm text-headline-sm mb-4">Vehicle Status</h3>
    <div className="flex-1 w-full min-h-0">
      {analyticsLoading ? (
        <div className="w-full h-full flex items-center justify-center text-primary animate-pulse font-bold">Loading Chart...</div>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={analytics.vehicleStatus} cx="50%" cy="50%" innerRadius={70} outerRadius={100} paddingAngle={5} dataKey="value">
              {analytics.vehicleStatus.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <RechartsTooltip contentStyle={{ backgroundColor: '#1a2120', borderColor: '#3c4948', color: '#dde4e2', borderRadius: '8px' }} itemStyle={{ color: '#dde4e2' }} />
            <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '12px', color: '#dde4e2', paddingTop: '10px' }} />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  </div>

  {/* Chart 2: Trips Bar Chart */}
  <div className="bg-surface-container border border-outline-variant p-6 rounded-xl h-[360px] flex flex-col">
    <h3 className="font-headline-sm text-headline-sm mb-4">Trips per Day</h3>
    <div className="flex-1 w-full min-h-0">
      {analyticsLoading ? (
        <div className="w-full h-full flex items-center justify-center text-primary animate-pulse font-bold">Loading Chart...</div>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={analytics.tripsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#3c4948" vertical={false} />
            <XAxis dataKey="day" stroke="#859492" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#859492" fontSize={12} tickLine={false} axisLine={false} />
            <RechartsTooltip contentStyle={{ backgroundColor: '#1a2120', borderColor: '#3c4948', color: '#dde4e2', borderRadius: '8px' }} cursor={{ fill: '#2f3635' }} />
            <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
            <Bar dataKey="completed" name="Completed" fill="#62f3ec" radius={[4, 4, 0, 0]} />
            <Bar dataKey="cancelled" name="Cancelled" fill="#f87171" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  </div>

  {/* Chart 3: Fuel Trend Line Chart */}
  <div className="bg-surface-container border border-outline-variant p-6 rounded-xl h-[360px] flex flex-col">
    <h3 className="font-headline-sm text-headline-sm mb-4">Fuel Consumption Trend</h3>
    <div className="flex-1 w-full min-h-0">
      {analyticsLoading ? (
        <div className="w-full h-full flex items-center justify-center text-primary animate-pulse font-bold">Loading Chart...</div>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={analytics.fuelTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#3c4948" vertical={false} />
            <XAxis dataKey="time" stroke="#859492" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#859492" fontSize={12} tickLine={false} axisLine={false} />
            <RechartsTooltip contentStyle={{ backgroundColor: '#1a2120', borderColor: '#3c4948', color: '#dde4e2', borderRadius: '8px' }} />
            <Line type="monotone" dataKey="consumption" name="Consumption (L)" stroke="#fbbf24" strokeWidth={3} dot={{ r: 4, fill: '#fbbf24', strokeWidth: 0 }} activeDot={{ r: 6 }} />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  </div>

  {/* Chart 4: Expense Distribution Bar Chart */}
  <div className="bg-surface-container border border-outline-variant p-6 rounded-xl h-[360px] flex flex-col">
    <h3 className="font-headline-sm text-headline-sm mb-4">Expense Distribution</h3>
    <div className="flex-1 w-full min-h-0">
      {analyticsLoading ? (
        <div className="w-full h-full flex items-center justify-center text-primary animate-pulse font-bold">Loading Chart...</div>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart layout="vertical" data={analytics.expenseDistribution} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#3c4948" horizontal={false} />
            <XAxis type="number" stroke="#859492" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis dataKey="category" type="category" stroke="#859492" fontSize={12} tickLine={false} axisLine={false} width={80} />
            <RechartsTooltip contentStyle={{ backgroundColor: '#1a2120', borderColor: '#3c4948', color: '#dde4e2', borderRadius: '8px' }} cursor={{ fill: '#2f3635' }} />
            <Bar dataKey="amount" name="Amount ($)" radius={[0, 4, 4, 0]}>
              {analytics.expenseDistribution.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  </div>

</div>
</main>
</div>


    </div>
  );
}
