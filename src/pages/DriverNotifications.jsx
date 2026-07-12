import React, { useState, useEffect } from 'react';
import DriverNav from '../components/DriverNav';
import { fetchApi } from '../services/api';

export default function DriverNotifications() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApi('/trips')
      .then(data => {
        setTrips(data);
        setLoading(false);
      })
      .catch(console.error);
  }, []);

  const pendingTrips = trips.filter(t => t.status === 'Draft');
  
  return (
    <div className="min-h-screen bg-background font-body-md pb-24">
      <div className="bg-surface border-b border-outline-variant p-4 sticky top-0 z-40 flex justify-between items-center">
        <h1 className="text-xl font-bold font-headline-md text-primary">Notifications</h1>
      </div>

      <main className="p-4 max-w-lg mx-auto space-y-6">
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-on-surface-variant mb-3">Order Requests</h2>
          {loading ? (
             <div className="text-on-surface-variant text-sm p-4 text-center">Loading...</div>
          ) : (
            <div className="space-y-3">
              {pendingTrips.length > 0 ? pendingTrips.map(t => (
                <div key={t.id} className="bg-surface border border-outline-variant rounded-xl p-4 flex gap-4 items-center shadow-sm">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-primary">assignment</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm text-on-surface truncate">New Assignment: {t.source}</p>
                    <p className="text-xs text-on-surface-variant mt-0.5">Please check your trips to start.</p>
                  </div>
                </div>
              )) : (
                <div className="bg-surface-container border border-outline-variant border-dashed rounded-xl p-8 text-center flex flex-col items-center justify-center">
                  <span className="material-symbols-outlined text-4xl text-on-surface-variant mb-3">notifications_paused</span>
                  <p className="text-on-surface font-bold">You're all caught up!</p>
                  <p className="text-xs text-on-surface-variant mt-1">No new requests or assignments right now.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <DriverNav />
    </div>
  );
}
