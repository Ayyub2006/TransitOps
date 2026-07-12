import React, { useState, useEffect } from 'react';
import { fetchApi } from '../services/api';
import DriverNav from '../components/DriverNav';

export default function DriverTrips() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadTrips = () => {
    fetchApi('/trips')
      .then(setTrips)
      .catch(console.error);
  };

  useEffect(() => {
    loadTrips();
  }, []);

  const handleCompleteTrip = async (tripId) => {
    setLoading(true);
    try {
      await fetchApi(`/trips/${tripId}/complete`, { method: 'PATCH' });
      loadTrips();
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDispatchTrip = async (tripId) => {
    setLoading(true);
    try {
      await fetchApi(`/trips/${tripId}/dispatch`, { method: 'PATCH' });
      loadTrips();
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const activeTrip = trips.find(t => t.status === 'Dispatched');
  const pendingTrips = trips.filter(t => t.status === 'Draft');
  const pastTrips = trips.filter(t => ['Completed', 'Cancelled'].includes(t.status));

  return (
    <div className="min-h-screen bg-background font-body-md pb-24">
      <div className="bg-surface border-b border-outline-variant p-4 sticky top-0 z-40 flex justify-between items-center">
        <h1 className="text-xl font-bold font-headline-md text-primary">My Trips</h1>
      </div>

      <main className="p-4 max-w-lg mx-auto space-y-6">
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-on-surface-variant mb-3">Current Mission</h2>
          {activeTrip ? (
            <div className="bg-primary/10 border border-primary/30 rounded-xl p-5 shadow-[0_0_15px_rgba(61,214,208,0.15)] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-16 h-16 bg-primary/20 rounded-bl-full -z-10"></div>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="text-xs text-primary font-bold tracking-widest uppercase mb-1">IN PROGRESS</div>
                  <h3 className="font-bold text-on-surface text-lg">{activeTrip.source} &rarr; {activeTrip.destination}</h3>
                </div>
                <span className="material-symbols-outlined text-primary text-3xl">local_shipping</span>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-on-surface-variant mb-6 bg-surface/50 p-3 rounded-lg border border-primary/10">
                <div>
                  <span className="block text-[10px] uppercase font-bold text-primary">Vehicle</span>
                  <span className="font-mono text-on-surface font-bold">{activeTrip.registration_number}</span>
                </div>
                <div className="h-8 w-[1px] bg-primary/20"></div>
                <div>
                  <span className="block text-[10px] uppercase font-bold text-primary">Cargo</span>
                  <span className="text-on-surface">{activeTrip.cargo_weight} kg</span>
                </div>
              </div>

              <button 
                onClick={() => handleCompleteTrip(activeTrip.id)}
                disabled={loading}
                className="w-full py-3 bg-primary text-on-primary rounded-lg font-bold text-sm hover:bg-primary/90 transition-all shadow-md disabled:opacity-50"
              >
                {loading ? 'Processing...' : 'Complete Trip'}
              </button>
            </div>
          ) : (
            <div className="bg-surface-container border border-outline-variant border-dashed rounded-xl p-8 text-center flex flex-col items-center justify-center">
              <span className="material-symbols-outlined text-4xl text-on-surface-variant mb-3">done_all</span>
              <p className="text-on-surface font-bold">No Active Trips</p>
              <p className="text-xs text-on-surface-variant mt-1">You are currently on standby.</p>
            </div>
          )}
        </div>

        <div>
          <div className="flex justify-between items-end mb-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-on-surface-variant">Upcoming Assigned Trips</h2>
            <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">{pendingTrips.length}</span>
          </div>
          <div className="space-y-3">
            {pendingTrips.length > 0 ? pendingTrips.map(t => (
              <div key={t.id} className="bg-surface border border-outline-variant rounded-xl p-4 flex gap-4 items-center shadow-sm">
                <div className="w-10 h-10 bg-surface-container-highest rounded-full flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-on-surface-variant">schedule</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm text-on-surface truncate">{t.source}</p>
                  <p className="text-xs text-on-surface-variant mt-0.5">To: {t.destination}</p>
                </div>
                {!activeTrip && (
                  <button 
                    onClick={() => handleDispatchTrip(t.id)}
                    disabled={loading}
                    className="text-primary text-sm font-bold bg-primary/10 px-3 py-1.5 rounded-md hover:bg-primary/20 disabled:opacity-50"
                  >
                    Start
                  </button>
                )}
              </div>
            )) : (
              <p className="text-sm text-on-surface-variant p-4 bg-surface-container rounded-lg text-center">No upcoming trips assigned.</p>
            )}
          </div>
        </div>
      </main>

      <DriverNav />
    </div>
  );
}
