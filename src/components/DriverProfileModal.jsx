import React from 'react';

export default function DriverProfileModal({ isOpen, onClose, driver }) {
  if (!isOpen || !driver) return null;

  const initials = driver.name.split(' ').map(n => n[0]).join('');
  
  // Format the date
  const expiryDate = new Date(driver.license_expiry_date);
  const isExpired = expiryDate < new Date();
  
  const statusColors = {
    'Available': 'primary',
    'On Trip': 'tertiary',
    'Suspended': 'error',
    'Off Duty': 'outline'
  };
  const color = statusColors[driver.status] || 'outline';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 backdrop-blur-sm bg-background/80 transition-opacity">
      <div className="bg-surface-container-high w-full max-w-2xl rounded-2xl border border-outline-variant shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        
        {/* Header section with background tint */}
        <div className={`p-6 border-b border-outline-variant flex justify-between items-start relative bg-${color}/5`}>
          <div className="flex gap-4 items-center relative z-10">
            <div className={`w-16 h-16 rounded-full border-2 border-${color} bg-surface-container flex items-center justify-center overflow-hidden shrink-0`}>
              {driver.image ? (
                <img className="w-full h-full object-cover" src={driver.image} alt={driver.name} />
              ) : (
                <span className={`font-headline-lg text-${color}`}>{initials}</span>
              )}
            </div>
            <div>
              <h2 className="text-headline-sm font-black text-on-surface tracking-tight">{driver.name}</h2>
              <div className="flex items-center gap-2 mt-1">
                <div className={`w-2 h-2 rounded-full bg-${color}`}></div>
                <span className={`text-xs font-label-caps text-${color} uppercase`}>{driver.status}</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-surface-variant/30 rounded-full transition-colors text-on-surface-variant hover:text-on-surface relative z-10">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-8 flex-grow">
          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-surface-container rounded-xl p-4 border border-outline-variant">
              <p className="text-[10px] font-label-caps text-outline-variant mb-1 uppercase">Safety Score</p>
              <div className="flex items-end gap-2">
                <span className={`text-xl font-bold text-${color}`}>{driver.safety_score}</span>
                <span className="text-xs text-outline mb-1">/100</span>
              </div>
            </div>
            <div className="bg-surface-container rounded-xl p-4 border border-outline-variant">
              <p className="text-[10px] font-label-caps text-outline-variant mb-1 uppercase">License Category</p>
              <span className="text-sm font-bold text-on-surface">{driver.license_category || 'STANDARD'}</span>
            </div>
            <div className="bg-surface-container rounded-xl p-4 border border-outline-variant">
              <p className="text-[10px] font-label-caps text-outline-variant mb-1 uppercase">Region</p>
              <span className="text-sm font-bold text-on-surface">Global</span>
            </div>
          </div>

          {/* Contact & License Info */}
          <div className="space-y-4">
            <h3 className="font-label-caps text-xs text-outline-variant uppercase tracking-widest border-b border-outline-variant pb-2">Driver Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] text-outline mb-1 font-label-caps uppercase">License Number</p>
                <p className="font-mono text-sm text-on-surface-variant">{driver.license_number}</p>
              </div>
              <div>
                <p className="text-[10px] text-outline mb-1 font-label-caps uppercase">Contact Phone</p>
                <p className="text-sm text-on-surface-variant">{driver.contact_number}</p>
              </div>
              <div>
                <p className="text-[10px] text-outline mb-1 font-label-caps uppercase">Expiry Date</p>
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm text-on-surface-variant">calendar_today</span>
                  <span className={`text-sm ${isExpired ? 'text-error font-bold' : 'text-on-surface-variant'}`}>
                    {expiryDate.toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent History (Mocked for Demo) */}
          <div className="space-y-4">
            <h3 className="font-label-caps text-xs text-outline-variant uppercase tracking-widest border-b border-outline-variant pb-2">Recent History</h3>
            <div className="space-y-3">
              {[1, 2, 3].map((_, i) => (
                <div key={i} className="flex gap-4 items-start p-3 bg-surface-container-highest rounded-lg border border-outline-variant/50">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-primary text-sm">route</span>
                  </div>
                  <div>
                    <p className="text-sm text-on-surface">Completed Route {['Mumbai - Pune', 'Delhi - Jaipur', 'Bangalore - Chennai'][i]}</p>
                    <p className="text-xs text-on-surface-variant mt-0.5">{i + 1} days ago • Delivered safely</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
