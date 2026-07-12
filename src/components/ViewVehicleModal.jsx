import React from 'react';

export default function ViewVehicleModal({ isOpen, onClose, vehicle }) {
  if (!isOpen || !vehicle) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 backdrop-blur-sm bg-background/80 transition-opacity">
      <div className="bg-surface-container-high w-full max-w-md rounded-2xl border border-outline-variant shadow-2xl flex flex-col">
        <div className="p-6 border-b border-outline-variant flex justify-between items-center">
          <div>
            <h2 className="text-headline-sm font-black text-on-surface tracking-tight">Vehicle Details</h2>
            <p className="text-body-md text-on-surface-variant font-mono mt-1">{vehicle.registration_number}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-surface-variant/30 rounded-full transition-colors text-on-surface-variant hover:text-on-surface">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="flex justify-between py-2 border-b border-outline-variant/50">
            <span className="text-on-surface-variant font-bold text-xs uppercase tracking-wider">Model / Name</span>
            <span className="text-on-surface font-medium">{vehicle.name_model}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-outline-variant/50">
            <span className="text-on-surface-variant font-bold text-xs uppercase tracking-wider">Type</span>
            <span className="text-on-surface font-medium">{vehicle.type}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-outline-variant/50">
            <span className="text-on-surface-variant font-bold text-xs uppercase tracking-wider">Max Load Capacity</span>
            <span className="text-on-surface font-medium">{vehicle.max_load_capacity} kg</span>
          </div>
          <div className="flex justify-between py-2 border-b border-outline-variant/50">
            <span className="text-on-surface-variant font-bold text-xs uppercase tracking-wider">Odometer</span>
            <span className="text-on-surface font-medium">{Number(vehicle.odometer).toLocaleString()} km</span>
          </div>
          <div className="flex justify-between py-2 border-b border-outline-variant/50">
            <span className="text-on-surface-variant font-bold text-xs uppercase tracking-wider">Acquisition Cost</span>
            <span className="text-on-surface font-medium">₹{Number(vehicle.acquisition_cost).toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-outline-variant/50">
            <span className="text-on-surface-variant font-bold text-xs uppercase tracking-wider">Region</span>
            <span className="text-on-surface font-medium">{vehicle.region}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-outline-variant/50">
            <span className="text-on-surface-variant font-bold text-xs uppercase tracking-wider">Status</span>
            <span className="text-primary font-bold uppercase">{vehicle.status}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
