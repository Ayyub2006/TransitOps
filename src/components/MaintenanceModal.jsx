import React, { useState } from 'react';

export default function MaintenanceModal({ isOpen, onClose, vehicle, onSave }) {
  const [maintenanceType, setMaintenanceType] = useState('Oil Change');
  const [description, setDescription] = useState('');
  const [cost, setCost] = useState('');
  const [startDate, setStartDate] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 backdrop-blur-sm bg-background/80 transition-opacity">
      <div className="bg-surface-container-high w-full max-w-lg rounded-2xl border border-outline-variant shadow-2xl flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-outline-variant flex justify-between items-start">
          <div>
            <h2 className="text-headline-sm font-black text-on-surface tracking-tight">Schedule Maintenance</h2>
            <p className="text-body-md text-on-surface-variant mt-1">Log operational service and fleet availability.</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-surface-variant/30 rounded-full transition-colors text-on-surface-variant hover:text-on-surface">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6 flex-grow">
          {/* Vehicle Selection */}
          <div className="space-y-2">
            <label className="font-label-caps text-[11px] text-on-surface-variant uppercase tracking-widest block">Vehicle Selection</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline-variant">search</span>
              <select className="w-full appearance-none bg-surface-container border border-outline-variant rounded-md pl-10 pr-4 py-3 text-body-md text-on-surface focus:ring-1 focus:ring-primary outline-none" disabled>
                <option>{vehicle ? vehicle.registration_number : 'Select Registration Number...'}</option>
              </select>
              <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-outline-variant">expand_more</span>
            </div>
          </div>

          {/* Maintenance Type */}
          <div className="space-y-2">
            <label className="font-label-caps text-[11px] text-on-surface-variant uppercase tracking-widest block">Maintenance Type</label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { name: 'Oil Change', icon: 'oil_barrel' },
                { name: 'Tire Rotation', icon: 'tire_repair' },
                { name: 'Inspection', icon: 'fact_check' },
                { name: 'Repair', icon: 'build' }
              ].map((type) => (
                <label key={type.name} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${maintenanceType === type.name ? 'bg-primary/10 border-primary text-primary' : 'bg-surface-container-highest border-outline-variant hover:border-outline-variant/60 text-on-surface-variant'}`}>
                  <input type="radio" name="m-type" className="hidden" checked={maintenanceType === type.name} onChange={() => setMaintenanceType(type.name)} />
                  <span className="material-symbols-outlined text-[20px]">{type.icon}</span>
                  <span className="text-sm font-medium">{type.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="font-label-caps text-[11px] text-on-surface-variant uppercase tracking-widest block">Description</label>
            <textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-surface-container border border-outline-variant rounded-lg py-3 px-4 text-body-md text-on-surface focus:ring-1 focus:ring-primary outline-none resize-none" 
              placeholder="Detail any specific issues or components being serviced..." 
              rows="4"
            ></textarea>
          </div>

          {/* Cost & Date */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="font-label-caps text-[11px] text-on-surface-variant uppercase tracking-widest block">Estimated Cost</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant font-bold">₹</span>
                <input 
                  type="number" 
                  value={cost}
                  onChange={(e) => setCost(e.target.value)}
                  className="w-full bg-surface-container border border-outline-variant rounded-lg py-3 pl-8 pr-4 text-body-md text-on-surface focus:ring-1 focus:ring-primary outline-none" 
                  placeholder="0.00"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="font-label-caps text-[11px] text-on-surface-variant uppercase tracking-widest block">Start Date</label>
              <input 
                type="date" 
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-surface-container border border-outline-variant rounded-lg py-3 px-4 text-body-md text-on-surface focus:ring-1 focus:ring-primary outline-none"
              />
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-outline-variant bg-surface-container-highest rounded-b-2xl space-y-4">
          <div className="flex items-start gap-3 bg-[#0A2E35] border border-[#145C6A] p-3 rounded-lg text-primary">
            <span className="material-symbols-outlined text-[20px]">info</span>
            <p className="text-[12px] leading-tight font-medium">Vehicle status will be updated to <span className="font-bold">In Shop</span> — removed from dispatch pool immediately upon saving.</p>
          </div>
          <div className="flex gap-4">
            <button type="button" onClick={onClose} className="flex-1 py-3 border border-outline-variant rounded-lg text-on-surface font-bold hover:bg-surface-variant transition-colors">Discard</button>
            <button onClick={() => { onSave(); onClose(); }} className="flex-1 py-3 bg-[#5AE2D0] text-[#003730] rounded-lg font-bold hover:brightness-110 shadow-lg shadow-primary/10 transition-all active:scale-95">Save Record</button>
          </div>
        </div>
      </div>
    </div>
  );
}
