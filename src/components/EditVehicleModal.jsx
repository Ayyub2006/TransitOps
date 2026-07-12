import React, { useState, useEffect } from 'react';

export default function EditVehicleModal({ isOpen, onClose, vehicle, onSave }) {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (vehicle) setFormData(vehicle);
  }, [vehicle]);

  if (!isOpen || !vehicle) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 backdrop-blur-sm bg-background/80 transition-opacity">
      <div className="bg-surface-container-high w-full max-w-lg rounded-2xl border border-outline-variant shadow-2xl flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-outline-variant flex justify-between items-center">
          <div>
            <h2 className="text-headline-sm font-black text-on-surface tracking-tight">Edit Vehicle</h2>
            <p className="text-body-md text-on-surface-variant font-mono mt-1">{vehicle.registration_number}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-surface-variant/30 rounded-full transition-colors text-on-surface-variant hover:text-on-surface">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-4 flex-grow">
          <div className="space-y-2">
            <label className="font-label-caps text-[11px] text-on-surface-variant uppercase tracking-widest block">Model / Name</label>
            <input name="name_model" value={formData.name_model || ''} onChange={handleChange} className="w-full bg-surface-container border border-outline-variant rounded-md px-4 py-2 text-on-surface focus:ring-1 focus:ring-primary outline-none" />
          </div>
          
          <div className="space-y-2">
            <label className="font-label-caps text-[11px] text-on-surface-variant uppercase tracking-widest block">Type</label>
            <select name="type" value={formData.type || ''} onChange={handleChange} className="w-full bg-surface-container border border-outline-variant rounded-md px-4 py-2 text-on-surface focus:ring-1 focus:ring-primary outline-none">
              <option value="Truck">Truck</option>
              <option value="Van">Van</option>
              <option value="Bus">Bus</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="font-label-caps text-[11px] text-on-surface-variant uppercase tracking-widest block">Max Load Capacity (kg)</label>
            <input type="number" name="max_load_capacity" value={formData.max_load_capacity || ''} onChange={handleChange} className="w-full bg-surface-container border border-outline-variant rounded-md px-4 py-2 text-on-surface focus:ring-1 focus:ring-primary outline-none" />
          </div>

          <div className="space-y-2">
            <label className="font-label-caps text-[11px] text-on-surface-variant uppercase tracking-widest block">Odometer (km)</label>
            <input type="number" name="odometer" value={formData.odometer || ''} onChange={handleChange} className="w-full bg-surface-container border border-outline-variant rounded-md px-4 py-2 text-on-surface focus:ring-1 focus:ring-primary outline-none" />
          </div>

          <div className="space-y-2">
            <label className="font-label-caps text-[11px] text-on-surface-variant uppercase tracking-widest block">Acquisition Cost (₹)</label>
            <input type="number" name="acquisition_cost" value={formData.acquisition_cost || ''} onChange={handleChange} className="w-full bg-surface-container border border-outline-variant rounded-md px-4 py-2 text-on-surface focus:ring-1 focus:ring-primary outline-none" />
          </div>
          
          <div className="space-y-2">
            <label className="font-label-caps text-[11px] text-on-surface-variant uppercase tracking-widest block">Region</label>
            <input name="region" value={formData.region || ''} onChange={handleChange} className="w-full bg-surface-container border border-outline-variant rounded-md px-4 py-2 text-on-surface focus:ring-1 focus:ring-primary outline-none" />
          </div>
        </div>
        
        <div className="p-6 border-t border-outline-variant bg-surface-container-highest rounded-b-2xl">
          <div className="flex gap-4">
            <button type="button" onClick={onClose} className="flex-1 py-3 border border-outline-variant rounded-lg text-on-surface font-bold hover:bg-surface-variant transition-colors">Cancel</button>
            <button onClick={() => { onSave(formData); onClose(); }} className="flex-1 py-3 bg-[#5AE2D0] text-[#003730] rounded-lg font-bold hover:brightness-110 shadow-lg shadow-primary/10 transition-all active:scale-95">Save Changes</button>
          </div>
        </div>
      </div>
    </div>
  );
}
