import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import { fetchApi } from '../services/api';
import ViewVehicleModal from '../components/ViewVehicleModal';
import EditVehicleModal from '../components/EditVehicleModal';
import MaintenanceModal from '../components/MaintenanceModal';

export default function Registry() {
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [maintenanceModalOpen, setMaintenanceModalOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchApi('/vehicles');
        setVehicles(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleAction = (action, vehicle) => {
    setSelectedVehicle(vehicle);
    if (action === 'view') setViewModalOpen(true);
    if (action === 'edit') setEditModalOpen(true);
    if (action === 'maintenance') setMaintenanceModalOpen(true);
  };

  const handleEditSave = (updatedVehicle) => {
    // Optimistic update
    setVehicles(vehicles.map(v => v.id === updatedVehicle.id ? updatedVehicle : v));
    // In a real app, you'd PATCH to /api/vehicles/:id here
  };

  const handleMaintenanceSave = () => {
    if (selectedVehicle) {
      setVehicles(vehicles.map(v => v.id === selectedVehicle.id ? { ...v, status: 'In Shop' } : v));
    }
  };

  return (
    <div className="min-h-screen overflow-x-hidden dark text-on-surface bg-background font-body-md">
      
{/*  Persistent SideNavBar  */}
<Sidebar />
{/*  Main Content Area  */}
<main className="ml-0 lg:ml-[260px] flex-grow flex flex-col relative h-full">
{/*  TopNavBar  */}
<TopBar rightContent={
  <>
    <button className="bg-error/10 text-error border border-error/30 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest hover:bg-error/20 transition-all active:scale-95 hidden sm:block">
      Emergency Stop
    </button>
    <div className="h-6 w-[1px] bg-outline-variant hidden sm:block mx-2"></div>
  </>
}>
  <div className="flex items-center gap-6">
    <h1 className="font-headline-sm text-headline-sm font-black text-primary tracking-tight">TransitOps</h1>
    <div className="hidden md:flex gap-4">
      <a className="text-on-surface-variant font-medium hover:text-primary transition-all" href="#" onClick={(e) => e.preventDefault()}>Live Alerts</a>
      <a className="text-on-surface-variant font-medium hover:text-primary transition-all" href="#" onClick={(e) => e.preventDefault()}>Active Missions</a>
    </div>
  </div>
</TopBar>
{/*  Viewport  */}
<div className="flex-grow p-container-margin overflow-y-auto overflow-x-hidden relative">
{/*  Header Section  */}
<div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
<div>
<h2 className="font-headline-lg text-headline-lg text-on-surface">Vehicle Registry</h2>
<p className="text-on-surface-variant font-body-md mt-1">Manage and track 248 mission-ready assets.</p>
</div>
<div className="flex items-center gap-3">
<div className="relative flex-grow md:w-64">
<span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline-variant text-sm">search</span>
<input className="w-full bg-background border border-outline-variant rounded-md pl-10 pr-4 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" placeholder="Search registry..." type="text"/>
</div>
<button className="p-2 border border-outline-variant rounded-md text-on-surface-variant hover:bg-surface-variant/30">
<span className="material-symbols-outlined">tune</span>
</button>
<button className="bg-primary text-background font-bold px-6 py-2 rounded-md hover:brightness-110 active:scale-95 transition-all" id="openDrawer" onClick={() => setIsDrawerOpen(true)}>
                        + Register Vehicle
                    </button>
</div>
</div>
{/*  Filters Bar  */}
<div className="flex flex-wrap gap-2 mb-6">
<div className="bg-surface-container rounded-md px-3 py-1.5 border border-outline-variant flex items-center gap-2">
<span className="text-[10px] font-bold uppercase text-outline-variant">Type</span>
<select className="bg-transparent border-none p-0 pr-6 text-sm focus:ring-0 text-on-surface cursor-pointer">
<option>All Types</option>
<option>Truck</option>
<option>Van</option>
<option>Bus</option>
</select>
</div>
<div className="bg-surface-container rounded-md px-3 py-1.5 border border-outline-variant flex items-center gap-2">
<span className="text-[10px] font-bold uppercase text-outline-variant">Status</span>
<select className="bg-transparent border-none p-0 pr-6 text-sm focus:ring-0 text-on-surface cursor-pointer">
<option>Any Status</option>
<option>Available</option>
<option>On Trip</option>
<option>In Shop</option>
</select>
</div>
<div className="bg-surface-container rounded-md px-3 py-1.5 border border-outline-variant flex items-center gap-2">
<span className="text-[10px] font-bold uppercase text-outline-variant">Region</span>
<select className="bg-transparent border-none p-0 pr-6 text-sm focus:ring-0 text-on-surface cursor-pointer">
<option>North Mumbai</option>
<option>South Mumbai</option>
<option>Global</option>
</select>
</div>
<button className="text-primary text-xs font-bold uppercase hover:underline ml-auto">Clear Filters</button>
</div>
{/*  Bulk Actions Toolbar (Conditional visibility)  */}
<div className="bg-primary/5 border border-primary/20 rounded-md p-3 mb-6 flex items-center justify-between animate-pulse" id="bulkToolbar">
<div className="flex items-center gap-3">
<span className="text-primary font-bold text-sm">3 assets selected</span>
<div className="h-4 w-[1px] bg-outline-variant mx-2"></div>
<button className="flex items-center gap-1.5 text-xs font-bold uppercase text-on-surface hover:text-primary">
<span className="material-symbols-outlined text-sm">download</span> Export CSV
                    </button>
<button className="flex items-center gap-1.5 text-xs font-bold uppercase text-error hover:text-red-400">
<span className="material-symbols-outlined text-sm">no_transfer</span> Retire
                    </button>
</div>
<button className="text-on-surface-variant hover:text-on-surface">
<span className="material-symbols-outlined">close</span>
</button>
</div>
{/*  Registry Table  */}
<div className="bg-surface-container-low border border-outline-variant rounded-lg overflow-x-auto">
<table className="w-full text-left border-collapse">
<thead className="bg-surface-container text-outline-variant">
<tr>
<th className="p-4 w-12"><input className="rounded border-outline-variant bg-background text-primary focus:ring-primary" type="checkbox"/></th>
<th className="p-4 font-label-caps text-label-caps uppercase tracking-widest">ID</th>
<th className="p-4 font-label-caps text-label-caps uppercase tracking-widest">Model / Name</th>
<th className="p-4 font-label-caps text-label-caps uppercase tracking-widest">Type</th>
<th className="p-4 font-label-caps text-label-caps uppercase tracking-widest">Max Load</th>
<th className="p-4 font-label-caps text-label-caps uppercase tracking-widest">Odometer</th>
<th className="p-4 font-label-caps text-label-caps uppercase tracking-widest">Cost (₹)</th>
<th className="p-4 font-label-caps text-label-caps uppercase tracking-widest">Status</th>
<th className="p-4 font-label-caps text-label-caps uppercase tracking-widest text-center">Risk</th>
<th className="p-4 w-20"></th>
</tr>
</thead>
<tbody className="divide-y divide-outline-variant">
{loading ? (
  <tr>
    <td colSpan="10" className="p-8 text-center text-on-surface-variant animate-pulse">Loading vehicles...</td>
  </tr>
) : vehicles.map((v, i) => {
  const typeIcons = { 'Truck': 'local_shipping', 'Van': 'airport_shuttle', 'Bus': 'directions_bus', 'Utility': 'local_shipping' };
  const statusColors = { 'Available': 'primary', 'On Trip': 'tertiary', 'In Shop': 'error', 'Retired': 'outline' };
  const statusBg = { 'Available': 'bg-primary/10', 'On Trip': 'bg-tertiary-container/10', 'In Shop': 'bg-error-container/20', 'Retired': 'bg-outline/10' };
  
  return (
    <tr key={v.id} className="hover:bg-surface-variant/20 transition-colors group">
      <td className="p-4"><input className="rounded border-outline-variant bg-background text-primary focus:ring-primary" type="checkbox" /></td>
      <td className="p-4 font-mono text-primary text-xs tracking-tighter">{v.registration_number}</td>
      <td className="p-4 font-bold text-on-surface">{v.name_model}</td>
      <td className="p-4 flex items-center gap-2 text-on-surface-variant">
        <span className="material-symbols-outlined text-lg">{typeIcons[v.type] || 'directions_car'}</span> {v.type}
      </td>
      <td className="p-4 text-on-surface">{v.max_load_capacity} <span className="text-[10px] text-outline-variant">kg</span></td>
      <td className="p-4 text-on-surface">{Number(v.odometer).toLocaleString()} <span className="text-[10px] text-outline-variant">km</span></td>
      <td className="p-4 text-on-surface">₹{Number(v.acquisition_cost).toLocaleString('en-IN')}</td>
      <td className="p-4">
        <span className={`inline-flex items-center gap-2 px-2 py-0.5 rounded ${statusBg[v.status] || 'bg-outline/10'} text-${statusColors[v.status] || 'outline'} text-[10px] font-bold uppercase tracking-widest`}>
          <span className={`w-1 h-1 rounded-full bg-${statusColors[v.status] || 'outline'}`}></span> {v.status}
        </span>
      </td>
      <td className="p-4 text-center">
        {i % 7 === 0 ? <span className="w-2 h-2 rounded-full bg-error inline-block" title="Risk Alert"></span> : <span className="w-2 h-2 rounded-full bg-transparent inline-block"></span>}
      </td>
      <td className="p-4 relative">
        <div className="row-action-hover absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2 bg-surface-container border border-outline-variant rounded-md px-2 py-1">
          <button className="p-1 hover:text-primary" title="View" onClick={() => handleAction('view', v)}><span className="material-symbols-outlined text-sm">visibility</span></button>
          <button className="p-1 hover:text-primary" title="Edit" onClick={() => handleAction('edit', v)}><span className="material-symbols-outlined text-sm">edit</span></button>
          <button className="p-1 hover:text-primary" title="Maintenance" onClick={() => handleAction('maintenance', v)}><span className="material-symbols-outlined text-sm">build</span></button>
        </div>
      </td>
    </tr>
  );
})}
</tbody>
</table>
{/*  Pagination / Footer  */}
<div className="bg-surface-container p-4 border-t border-outline-variant flex justify-between items-center text-xs font-bold text-outline-variant uppercase">
<span>Showing 1-4 of 248 vehicles</span>
<div className="flex gap-2">
<button className="px-3 py-1 bg-background border border-outline-variant rounded hover:text-primary transition-colors disabled:opacity-30" disabled>Previous</button>
<button className="px-3 py-1 bg-background border border-outline-variant rounded hover:text-primary transition-colors">Next</button>
</div>
</div>
</div>
</div>
{/*  Slide-In Drawer: Register Vehicle (State: Partially Open)  */}
<div className={`fixed inset-0 bg-background/60 backdrop-blur-sm z-[60] transition-opacity duration-300 ${isDrawerOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} id="drawerOverlay" onClick={() => setIsDrawerOpen(false)}></div>
<div className={`fixed top-0 right-0 h-full w-[400px] bg-surface-container-high border-l border-outline-variant z-[70] drawer-shadow flex flex-col transform transition-transform duration-500 ease-out ${isDrawerOpen ? 'translate-x-0' : 'translate-x-full'}`} id="registrationDrawer">
<div className="p-gutter border-b border-outline-variant flex justify-between items-center">
<h3 className="font-headline-sm text-headline-sm text-primary">Register Vehicle</h3>
<button className="p-1 hover:bg-surface-variant/30 rounded" id="closeDrawer" onClick={() => setIsDrawerOpen(false)}>
<span className="material-symbols-outlined">close</span>
</button>
</div>
<div className="flex-grow overflow-y-auto p-gutter space-y-6">
{/*  Registration Number  */}
<div className="space-y-2">
<label className="font-label-caps text-label-caps text-on-surface uppercase tracking-widest">Registration Number</label>
<input className="w-full bg-background border border-outline-variant rounded-md px-3 py-2 font-mono text-primary focus:ring-1 focus:ring-primary outline-none" type="text" value="MH-05-VX"/>
<p className="text-[10px] text-outline-variant italic">Must follow standard OPS format (e.g., XX-0000-X)</p>
</div>
{/*  Name/Model  */}
<div className="space-y-2">
<label className="font-label-caps text-label-caps text-on-surface uppercase tracking-widest">Model / Name</label>
<input className="w-full bg-background border border-outline-variant rounded-md px-3 py-2 focus:ring-1 focus:ring-primary outline-none" placeholder="e.g. Titan-X Heavy" type="text"/>
</div>
{/*  Type Dropdown  */}
<div className="space-y-2">
<label className="font-label-caps text-label-caps text-on-surface uppercase tracking-widest">Vehicle Type</label>
<div className="relative">
<select className="w-full appearance-none bg-background border border-outline-variant rounded-md px-3 py-2 pr-10 focus:ring-1 focus:ring-primary outline-none">
<option>Select type...</option>
<option>Truck</option>
<option>Van</option>
<option>Bus</option>
<option>Utility</option>
</select>
<span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">expand_more</span>
</div>
</div>
{/*  Max Load Capacity  */}
<div className="space-y-2">
<label className="font-label-caps text-label-caps text-on-surface uppercase tracking-widest">Max Load Capacity (KG)</label>
<div className="flex items-center">
<button className="bg-surface-container border border-outline-variant h-10 px-3 rounded-l hover:bg-surface-variant/50 transition-colors">-</button>
<input className="w-full h-10 bg-background border-y border-x-0 border-outline-variant px-3 py-2 text-center focus:ring-0 outline-none" type="number" value="1000"/>
<button className="bg-surface-container border border-outline-variant h-10 px-3 rounded-r hover:bg-surface-variant/50 transition-colors">+</button>
</div>
</div>
{/*  Odometer & Cost  */}
<div className="grid grid-cols-2 gap-4">
<div className="space-y-2">
<label className="font-label-caps text-label-caps text-on-surface uppercase tracking-widest">Odometer (KM)</label>
<input className="w-full bg-background border border-outline-variant rounded-md px-3 py-2 focus:ring-1 focus:ring-primary outline-none" placeholder="0" type="number"/>
</div>
<div className="space-y-2">
<label className="font-label-caps text-label-caps text-on-surface uppercase tracking-widest">Acq. Cost (₹)</label>
<input className="w-full bg-background border border-outline-variant rounded-md px-3 py-2 focus:ring-1 focus:ring-primary outline-none" placeholder="0.00" type="number"/>
</div>
</div>
{/*  Status Segmented Control  */}
<div className="space-y-2">
<label className="font-label-caps text-label-caps text-on-surface uppercase tracking-widest">Initial Status</label>
<div className="grid grid-cols-2 gap-1 p-1 bg-background border border-outline-variant rounded-md">
<button className="py-2 bg-primary text-background font-bold text-xs uppercase tracking-tighter rounded">Available</button>
<button className="py-2 text-on-surface-variant hover:text-on-surface font-bold text-xs uppercase tracking-tighter">Retired</button>
<button className="py-2 text-on-surface-variant/30 font-bold text-xs uppercase tracking-tighter cursor-not-allowed col-span-2 border-t border-outline-variant/30 mt-1" disabled>In Shop (Manual Only)</button>
<button className="py-2 text-on-surface-variant/30 font-bold text-xs uppercase tracking-tighter cursor-not-allowed col-span-2" disabled>On Trip (Auto Triggered)</button>
</div>
</div>
</div>
{/*  Pin to bottom  */}
<div className="p-gutter border-t border-outline-variant bg-surface-container-high">
<button className="w-full bg-primary-container text-on-primary-fixed py-3 rounded-md font-black uppercase tracking-widest hover:brightness-105 transition-all shadow-lg">
                    Save Vehicle
                </button>
<p className="text-center text-[10px] text-outline-variant mt-3 uppercase font-bold tracking-widest">Requires Supervisor Approval</p>
</div>
</div>
{/* Modals */}
<ViewVehicleModal isOpen={viewModalOpen} onClose={() => setViewModalOpen(false)} vehicle={selectedVehicle} />
<EditVehicleModal isOpen={editModalOpen} onClose={() => setEditModalOpen(false)} vehicle={selectedVehicle} onSave={handleEditSave} />
<MaintenanceModal isOpen={maintenanceModalOpen} onClose={() => setMaintenanceModalOpen(false)} vehicle={selectedVehicle} onSave={handleMaintenanceSave} />
</main>


    </div>
  );
}
