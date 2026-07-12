import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DriverNav from '../components/DriverNav';
import { fetchApi } from '../services/api';

export default function DriverDashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showNotifications, setShowNotifications] = useState(true);

  useEffect(() => {
    fetchApi('/driver/my-dashboard')
      .then(res => {
        setData(res);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background font-body-md pb-24 flex items-center justify-center">
        <p className="text-on-surface-variant">Loading dashboard...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-background font-body-md pb-24 flex items-center justify-center flex-col gap-4 text-center px-4">
        <div className="w-16 h-16 bg-surface-container rounded-full flex items-center justify-center mb-2">
          <span className="material-symbols-outlined text-error text-3xl">no_accounts</span>
        </div>
        <p className="text-on-surface font-bold text-lg">
          {error === 'Driver profile not found' ? 'Not Assigned to a Fleet' : 'Failed to Load Dashboard'}
        </p>
        <p className="text-on-surface-variant text-sm max-w-[300px] mb-4">
          {error === 'Driver profile not found' 
            ? "Your account is not linked to any active fleet. Please ask your Fleet Manager to send you a Driver Invite Link." 
            : error}
        </p>
        <div className="flex gap-4">
          <button onClick={() => window.location.reload()} className="px-4 py-2 bg-primary text-on-primary rounded font-bold uppercase tracking-wider text-sm hover:opacity-90 transition-all">
            Retry
          </button>
          <button onClick={handleLogout} className="px-4 py-2 bg-surface-container border border-outline-variant text-on-surface rounded font-bold uppercase tracking-wider text-sm hover:bg-surface-container-high transition-all">
            Log Out
          </button>
        </div>
      </div>
    );
  }

  const { driver, current_trip, notifications, recent_trips } = data;

  // License Expiry Chip Logic
  let licenseChip = null;
  if (driver.license_status_flag === 'action_needed') {
    licenseChip = (
      <span className="px-2 py-1 rounded bg-error/20 text-error text-[10px] font-bold uppercase tracking-wider ml-2">
        Action Needed
      </span>
    );
  } else if (driver.license_status_flag === 'expiring_soon') {
    licenseChip = (
      <span className="px-2 py-1 rounded bg-tertiary-container/20 text-tertiary-container text-[10px] font-bold uppercase tracking-wider ml-2">
        Expiring Soon
      </span>
    );
  }

  const handleAction = async (action, tripId) => {
    try {
      await fetchApi(`/trips/${tripId}/${action}`, { method: 'PATCH' });
      // Refresh
      const res = await fetchApi('/driver/my-dashboard');
      setData(res);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-background font-body-md pb-24">
      {/* Top Header */}
      <div className="bg-surface border-b border-outline-variant p-4 sticky top-0 z-40 flex justify-between items-start">
        <div>
          <div className="flex items-center">
            <h1 className="text-2xl font-bold font-headline-md text-on-surface">{driver.name}</h1>
            {licenseChip}
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${driver.status === 'Suspended' ? 'bg-error/20 text-error' : 'bg-primary/20 text-primary'}`}>
              {driver.status}
            </span>
            <span className="text-xs text-on-surface-variant">&bull; {driver.fleet_name}</span>
          </div>
        </div>
        <button onClick={handleLogout} className="p-2 bg-error/10 text-error rounded-full hover:bg-error/20 transition-colors">
          <span className="material-symbols-outlined text-[20px]">logout</span>
        </button>
      </div>

      <main className="p-4 max-w-lg mx-auto space-y-6">
        
        {/* Current Trip Card */}
        <section>
          <h2 className="text-sm font-bold uppercase tracking-wider text-on-surface-variant mb-3">Current Mission</h2>
          
          {current_trip ? (
            <div className="bg-surface border border-outline-variant rounded-xl p-5 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-16 h-16 bg-primary/10 rounded-bl-full -z-10"></div>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className={`text-xs font-bold tracking-widest uppercase mb-1 ${current_trip.status === 'Dispatched' ? 'text-primary' : 'text-tertiary'}`}>
                    {current_trip.status}
                  </div>
                  <h3 className="font-bold text-on-surface text-lg">{current_trip.source} &rarr; {current_trip.destination}</h3>
                </div>
                <span className="material-symbols-outlined text-on-surface-variant text-3xl">route</span>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-on-surface-variant mb-6 bg-surface-container p-3 rounded-lg border border-outline-variant/50">
                <div>
                  <span className="block text-[10px] uppercase font-bold text-primary">Vehicle</span>
                  <span className="font-mono text-on-surface font-bold">{current_trip.vehicle.registration_number}</span>
                </div>
                <div className="h-8 w-[1px] bg-outline-variant"></div>
                <div>
                  <span className="block text-[10px] uppercase font-bold text-primary">Cargo</span>
                  <span className="text-on-surface tabular-nums">{current_trip.cargo_weight} kg</span>
                </div>
                <div className="h-8 w-[1px] bg-outline-variant"></div>
                <div>
                  <span className="block text-[10px] uppercase font-bold text-primary">Distance</span>
                  <span className="text-on-surface tabular-nums">{current_trip.planned_distance} km</span>
                </div>
              </div>

              <div className="flex gap-3">
                {current_trip.can_dispatch && (
                  <button onClick={() => handleAction('dispatch', current_trip.id)} className="flex-1 py-3 bg-primary text-on-primary rounded-lg font-bold text-sm hover:bg-primary/90 transition-all">
                    Start Trip
                  </button>
                )}
                {current_trip.can_complete && (
                  <button onClick={() => handleAction('complete', current_trip.id)} className="flex-1 py-3 bg-primary text-on-primary rounded-lg font-bold text-sm hover:bg-primary/90 transition-all">
                    Complete Trip
                  </button>
                )}
                {current_trip.can_cancel && (
                  <button onClick={() => handleAction('cancel', current_trip.id)} className="px-4 py-3 bg-error/10 text-error rounded-lg font-bold text-sm hover:bg-error/20 transition-all">
                    Cancel
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-surface-container border border-outline-variant border-dashed rounded-xl p-8 text-center flex flex-col items-center justify-center">
              <div className="w-16 h-16 bg-surface rounded-full flex items-center justify-center shadow-inner mb-4">
                <span className="material-symbols-outlined text-primary text-3xl">directions_car</span>
              </div>
              <p className="text-on-surface font-bold text-lg mb-1">Ready for Dispatch</p>
              <p className="text-xs text-on-surface-variant mb-6">You are currently on standby. Start a new trip or await assignment.</p>
              <button onClick={() => navigate('/driver/trips')} className="px-6 py-2 bg-primary text-on-primary rounded-lg font-bold text-sm hover:bg-primary/90 transition-all shadow-md">
                Start a New Trip
              </button>
            </div>
          )}
        </section>

        {/* Quick Actions Row */}
        <section className="grid grid-cols-3 gap-3">
          <button 
            disabled={!current_trip}
            title={!current_trip ? "You need an active trip to log fuel" : "Log Fuel"}
            onClick={() => {/* Go to Log Fuel */}} 
            className="bg-surface border border-outline-variant rounded-xl p-4 flex flex-col items-center justify-center gap-2 hover:bg-surface-container transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="material-symbols-outlined text-primary">local_gas_station</span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface">Log Fuel</span>
          </button>
          <button onClick={() => navigate('/driver/trips')} className="bg-surface border border-outline-variant rounded-xl p-4 flex flex-col items-center justify-center gap-2 hover:bg-surface-container transition-colors">
            <span className="material-symbols-outlined text-tertiary-container">history</span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface">Trip History</span>
          </button>
          <button onClick={() => navigate('/driver/profile')} className="bg-surface border border-outline-variant rounded-xl p-4 flex flex-col items-center justify-center gap-2 hover:bg-surface-container transition-colors">
            <span className="material-symbols-outlined text-secondary">person</span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface">My Profile</span>
          </button>
        </section>

        {/* Notifications Panel */}
        <section className="bg-surface border border-outline-variant rounded-xl overflow-hidden">
          <div 
            className="p-4 border-b border-outline-variant flex justify-between items-center cursor-pointer bg-surface-container-low hover:bg-surface-container transition-colors"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <h2 className="text-sm font-bold uppercase tracking-wider text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">notifications</span>
              Alerts
              {notifications.some(n => !n.read) && <span className="w-2 h-2 rounded-full bg-[#C9A227]"></span>}
            </h2>
            <span className="material-symbols-outlined text-on-surface-variant transition-transform" style={{ transform: showNotifications ? 'rotate(180deg)' : 'rotate(0deg)' }}>
              expand_more
            </span>
          </div>
          
          {showNotifications && (
            <div className="divide-y divide-outline-variant">
              {notifications.length > 0 ? (
                notifications.slice(0, 5).map(n => (
                  <div key={n.id} className="p-4 flex gap-3 items-start">
                    {!n.read && <div className="w-2 h-2 rounded-full bg-[#C9A227] mt-1.5 shrink-0"></div>}
                    <div>
                      <p className={`text-sm ${n.read ? 'text-on-surface-variant' : 'text-on-surface font-medium'}`}>{n.message}</p>
                      <p className="text-[10px] text-on-surface-variant mt-1 uppercase">{new Date(n.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center text-on-surface-variant text-sm">No new notifications</div>
              )}
              <div className="p-3 bg-surface-container-lowest text-center">
                <button onClick={() => navigate('/driver/notifications')} className="text-primary text-xs font-bold uppercase tracking-wider hover:underline">
                  View All Alerts
                </button>
              </div>
            </div>
          )}
        </section>

        {/* Recent Trips Strip */}
        <section>
          <div className="flex justify-between items-end mb-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-on-surface-variant">Recent Trips</h2>
            <button onClick={() => navigate('/driver/trips')} className="text-primary text-xs font-bold hover:underline">View All</button>
          </div>
          <div className="space-y-3">
            {recent_trips.length > 0 ? recent_trips.map(t => (
              <div key={t.id} className="bg-surface border border-outline-variant rounded-xl p-3 flex gap-4 items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${t.status === 'Completed' ? 'bg-primary/10 text-primary' : 'bg-error/10 text-error'}`}>
                  <span className="material-symbols-outlined text-[16px]">{t.status === 'Completed' ? 'check' : 'close'}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm text-on-surface truncate">{t.source} &rarr; {t.destination}</p>
                  <p className="text-[10px] text-on-surface-variant mt-0.5 uppercase tabular-nums">
                    {t.completed_at ? new Date(t.completed_at).toLocaleDateString() : 'N/A'} &bull; {t.actual_distance} km
                  </p>
                </div>
              </div>
            )) : (
              <p className="text-sm text-on-surface-variant p-4 bg-surface-container rounded-lg text-center">No recent trips.</p>
            )}
          </div>
        </section>

      </main>

      <DriverNav />
    </div>
  );
}
