import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import { getKPIs } from '../services/dashboardService';
import { getVehicleStatus, getTripsData, getFuelTrend, getExpenseDistribution } from '../services/analyticsService';
import { getInsights } from '../services/aiService';
import {
  PieChart, Pie, Cell, Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  LineChart, Line
} from 'recharts';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const createMarkerIcon = (colorClass, shadowColor) => {
  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `<div class="w-3 h-3 ${colorClass} rounded-full border-2 border-[var(--color-surface)] shadow-[0_0_10px_${shadowColor}]"></div>`,
    iconSize: [12, 12],
    iconAnchor: [6, 6]
  });
};

const markersData = [
  { id: 1, pos: [19.0760, 72.8777], color: 'bg-emerald-400', shadow: 'rgba(52,211,153,0.8)', label: 'Vehicle MH-01 (Online)' },
  { id: 2, pos: [19.0522, 72.9005], color: 'bg-amber-400', shadow: 'rgba(251,191,36,0.8)', label: 'Vehicle MH-02 (Delayed)' },
  { id: 3, pos: [19.0176, 72.8562], color: 'bg-red-400', shadow: 'rgba(248,113,113,0.8)', label: 'Vehicle MH-03 (Warning)' },
  { id: 4, pos: [19.1136, 72.8697], color: 'bg-primary', shadow: 'rgba(98,243,236,0.8)', label: 'Vehicle MH-04 (Active)' },
  { id: 5, pos: [18.9220, 72.8347], color: 'bg-purple-400', shadow: 'rgba(167,139,250,0.8)', label: 'Vehicle MH-05 (Maintenance)' }
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [kpis, setKpis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mapView, setMapView] = useState('satellite');

  const [analytics, setAnalytics] = useState({
    vehicleStatus: [], tripsData: [], fuelTrend: [], expenseDistribution: []
  });
  const [analyticsLoading, setAnalyticsLoading] = useState(true);

  const [insights, setInsights] = useState([]);
  const [insightsLoading, setInsightsLoading] = useState(true);

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

    const fetchInsightsData = async () => {
      try {
        setInsightsLoading(true);
        const data = await getInsights();
        setInsights(data);
      } catch (err) {
        console.error("Failed to fetch insights:", err);
      } finally {
        setInsightsLoading(false);
      }
    };

    fetchKPIs();
    fetchAnalyticsData();
    fetchInsightsData();
  }, []);

  return (
    <div className="min-h-screen overflow-x-hidden dark text-on-surface bg-background font-body-md">
      
{/*  SIDEBAR  */}
<Sidebar />
{/*  MAIN WRAPPER  */}
<div className="ml-0 lg:ml-[var(--spacing-sidebar-width)] flex flex-col">
{/*  TOP APP BAR  */}
<TopBar>
  <div className="flex items-center gap-4 flex-wrap">
    <div className="flex items-center gap-2">
      <span className="font-headline-sm text-headline-sm font-bold text-primary">TransitOps Fleet</span>
    </div>
    <div className="flex items-center gap-6 hidden md:flex">
      <a className="font-label-caps text-label-caps text-primary border-b-2 border-primary pb-1" href="#" onClick={(e) => e.preventDefault()}>Live Tracking</a>
      <a className="font-label-caps text-label-caps text-on-surface-variant hover:text-primary transition-colors" href="#" onClick={(e) => e.preventDefault()}>Schedules</a>
    </div>
  </div>
  <div className="flex items-center gap-6 hidden sm:flex ml-4">
    <div className="px-3 py-1 bg-surface-container-high border border-outline-variant rounded-full flex items-center gap-2">
      <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
      <span className="font-label-caps text-label-caps text-on-surface">Clearance: L3</span>
    </div>
  </div>
</TopBar>
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
  <span className={`font-kpi-value text-kpi-value ${kpis.fleetUtilization >= 75 ? 'text-emerald-400' : (kpis.fleetUtilization < 50 ? 'text-red-400' : 'text-primary')}`}>{kpis.fleetUtilization}%</span>
  </div>
  <div className="relative w-12 h-12 flex items-center justify-center">
  <svg className="w-full h-full -rotate-90">
  <circle className="text-outline-variant" cx="24" cy="24" fill="transparent" r="20" stroke="currentColor" strokeWidth="4"></circle>
  <circle className="text-primary" cx="24" cy="24" fill="transparent" r="20" stroke="currentColor" strokeDasharray="125.6" strokeDashoffset={`${125.6 - (125.6 * kpis.fleetUtilization) / 100}`} strokeWidth="4"></circle>
  </svg>
  </div>
  </div>
  {/*  Card 8: Total Operational Cost  */}
  <div className="min-w-[180px] bg-surface-container border border-outline-variant p-4 rounded-lg flex items-center justify-between glow-cyan transition-all">
    <div>
      <p className="font-label-caps text-label-caps text-on-surface-variant">Operational Cost</p>
      <span className="font-kpi-value text-kpi-value text-primary">₹{(kpis.totalOperationalCost || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
    </div>
  </div>
  {/*  Card 9: Fuel Efficiency  */}
  <div className="min-w-[180px] bg-surface-container border border-outline-variant p-4 rounded-lg flex items-center justify-between glow-cyan transition-all">
    <div>
      <p className="font-label-caps text-label-caps text-on-surface-variant">Fuel Efficiency</p>
      <span className={`font-kpi-value text-kpi-value ${kpis.fuelEfficiency >= 10 ? 'text-emerald-400' : (kpis.fuelEfficiency < 5 ? 'text-red-400' : 'text-primary')}`}>
        {kpis.fuelEfficiency} <span className="text-sm font-bold opacity-60">km/L</span>
      </span>
    </div>
  </div>
  {/*  Card 10: ROI  */}
  <div className="min-w-[180px] bg-surface-container border border-outline-variant p-4 rounded-lg flex items-center justify-between glow-cyan transition-all">
    <div>
      <p className="font-label-caps text-label-caps text-on-surface-variant">Fleet ROI</p>
      <span className={`font-kpi-value text-kpi-value ${kpis.roi >= 15 ? 'text-emerald-400' : (kpis.roi < 5 ? 'text-red-400' : 'text-primary')}`}>
        {kpis.roi}%
      </span>
    </div>
  </div>
  </>
)}
</section>

{/*  AI INSIGHTS SECTION  */}
<section className="mt-2 mb-6">
  <div className="flex items-center gap-2 mb-4">
    <span className="material-symbols-outlined text-primary text-xl">auto_awesome</span>
    <h2 className="font-headline-sm text-headline-sm">AI Insights</h2>
  </div>
  
  {insightsLoading ? (
    <div className="flex gap-4 overflow-x-auto pb-2 custom-scrollbar">
      <div className="min-w-[280px] h-[80px] bg-surface-container border border-outline-variant rounded-xl animate-pulse"></div>
      <div className="min-w-[280px] h-[80px] bg-surface-container border border-outline-variant rounded-xl animate-pulse"></div>
      <div className="min-w-[280px] h-[80px] bg-surface-container border border-outline-variant rounded-xl animate-pulse"></div>
    </div>
  ) : (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {insights.map((insight) => {
        const colorMap = {
          warning: 'text-amber-400 bg-amber-400/10 border-amber-400/30 glow-amber',
          success: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30 glow-emerald',
          danger: 'text-red-400 bg-red-400/10 border-red-400/30 glow-red',
          info: 'text-primary bg-primary/10 border-primary/30 glow-cyan',
        };
        const iconColorMap = {
          warning: 'text-amber-400',
          success: 'text-emerald-400',
          danger: 'text-red-400',
          info: 'text-primary',
        };
        
        const parts = insight.text.split(insight.highlight);
        
        return (
          <div key={insight.id} className={`p-4 rounded-xl border flex items-start gap-4 transition-all hover:scale-[1.02] cursor-pointer ${colorMap[insight.type]}`}>
            <div className={`p-2 rounded-lg bg-surface-container-highest ${iconColorMap[insight.type]}`}>
              <span className="material-symbols-outlined">{insight.icon}</span>
            </div>
            <div>
              <p className="text-sm text-on-surface leading-snug">
                {parts[0]}
                <span className={`font-bold ${iconColorMap[insight.type]}`}>{insight.highlight}</span>
                {parts[1]}
              </p>
            </div>
          </div>
        );
      })}
    </div>
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
<div className="flex items-center gap-1 bg-surface-container border border-outline-variant rounded p-1 mr-2">
<button onClick={() => setMapView('satellite')} className={`px-3 py-1 rounded text-xs font-bold transition-colors ${mapView === 'satellite' ? 'bg-primary text-on-primary-container' : 'text-on-surface-variant hover:text-primary'}`}>Satellite</button>
<button onClick={() => setMapView('street')} className={`px-3 py-1 rounded text-xs font-bold transition-colors ${mapView === 'street' ? 'bg-primary text-on-primary-container' : 'text-on-surface-variant hover:text-primary'}`}>Street</button>
</div>
<span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-400"></span> Online</span>
<span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400"></span> Delayed</span>
<span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-400"></span> Warning</span>
</div>
</div>
<div className="relative rounded-xl border border-outline-variant bg-surface-container-lowest overflow-hidden h-[480px] z-0">
  <MapContainer center={[19.0760, 72.8777]} zoom={12} style={{ height: '100%', width: '100%', background: '#0e1514' }} zoomControl={false}>
    {mapView === 'satellite' ? (
      <TileLayer
        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
        attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
      />
    ) : (
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; OpenStreetMap contributors &copy; CARTO'
      />
    )}
    {markersData.map(m => (
      <Marker key={m.id} position={m.pos} icon={createMarkerIcon(m.color, m.shadow)}>
        <Popup>
          <div className="font-body-md text-on-surface bg-surface-container px-2 py-1 rounded">
            <strong>{m.label}</strong>
          </div>
        </Popup>
      </Marker>
    ))}
  </MapContainer>
  
  {/* Legend Overlay */}
  <div className="absolute bottom-4 right-4 p-3 bg-surface/80 backdrop-blur-md border border-outline-variant rounded-lg z-[1000] pointer-events-none">
    <div className="text-[10px] font-label-caps text-on-surface-variant mb-2">COORD: 19.0760° N, 72.8777° E</div>
    <div className="h-10 w-32 rounded bg-surface-container-lowest border border-outline-variant/30 flex items-center justify-center">
      <span className="text-[10px] opacity-50">LIVE TRACKING (MUMBAI)</span>
    </div>
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
<span className="text-[10px] bg-red-500/10 text-red-400 px-2 py-0.5 rounded border border-red-500/20">Route #402 (Andheri)</span>
<a className="text-[10px] font-bold text-primary flex items-center gap-1 hover:underline" href="#" onClick={(e) => e.preventDefault()}>REVIEW <span className="material-symbols-outlined text-[10px]">arrow_forward</span></a>
</div>
</div>
{/*  Risk Item 2  */}
<div className="risk-row group p-3 bg-surface-container-low border border-outline-variant rounded-lg relative overflow-hidden transition-all hover:bg-surface-container-highest cursor-pointer">
<div className="absolute left-0 top-0 bottom-0 w-1 bg-red-400 risk-bar transition-all duration-300"></div>
<div className="flex justify-between items-start mb-2">
<div>
<p className="text-sm font-bold">Vehicle MH-229</p>
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
<p className="text-sm font-bold">Priya S.</p>
<p className="text-[10px] text-on-surface-variant">Route Deviation Warning</p>
</div>
<div className="text-right">
<p className="text-lg font-bold text-amber-400">58</p>
<p className="text-[10px] uppercase font-bold text-amber-400/70">RISK SCORE</p>
</div>
</div>
<div className="flex justify-between items-center mt-3">
<span className="text-[10px] bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded border border-amber-500/20">Shuttle X-1 (Bandra)</span>
<a className="text-[10px] font-bold text-primary flex items-center gap-1 hover:underline" href="#" onClick={(e) => e.preventDefault()}>REVIEW <span className="material-symbols-outlined text-[10px]">arrow_forward</span></a>
</div>
</div>
{/*  Risk Item 4  */}
<div className="risk-row group p-3 bg-surface-container-low border border-outline-variant rounded-lg relative overflow-hidden transition-all hover:bg-surface-container-highest cursor-pointer">
<div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-400 risk-bar transition-all duration-300"></div>
<div className="flex justify-between items-start mb-2">
<div>
<p className="text-sm font-bold">Dadar Hub</p>
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
        <div className="w-full h-full flex flex-col justify-end space-y-2 p-4 animate-pulse">
          <div className="w-full h-4/5 bg-surface-container-high rounded-lg"></div>
          <div className="w-full h-4 bg-surface-container-high rounded mx-auto w-1/2"></div>
        </div>
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
        <div className="w-full h-full flex flex-col justify-end space-y-2 p-4 animate-pulse">
          <div className="w-full h-4/5 bg-surface-container-high rounded-lg"></div>
          <div className="w-full h-4 bg-surface-container-high rounded mx-auto w-1/2"></div>
        </div>
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
        <div className="w-full h-full flex flex-col justify-end space-y-2 p-4 animate-pulse">
          <div className="w-full h-4/5 bg-surface-container-high rounded-lg"></div>
          <div className="w-full h-4 bg-surface-container-high rounded mx-auto w-1/2"></div>
        </div>
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
        <div className="w-full h-full flex flex-col justify-end space-y-2 p-4 animate-pulse">
          <div className="w-full h-4/5 bg-surface-container-high rounded-lg"></div>
          <div className="w-full h-4 bg-surface-container-high rounded mx-auto w-1/2"></div>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart layout="vertical" data={analytics.expenseDistribution} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#3c4948" horizontal={false} />
            <XAxis type="number" stroke="#859492" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis dataKey="category" type="category" stroke="#859492" fontSize={12} tickLine={false} axisLine={false} width={80} />
            <RechartsTooltip contentStyle={{ backgroundColor: '#1a2120', borderColor: '#3c4948', color: '#dde4e2', borderRadius: '8px' }} cursor={{ fill: '#2f3635' }} />
            <Bar dataKey="amount" name="Amount (₹)" radius={[0, 4, 4, 0]}>
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
