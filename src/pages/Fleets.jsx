import React, { useState, useEffect } from 'react';
import { fetchApi } from '../services/api';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';

export default function Fleets() {
  const [fleets, setFleets] = useState([]);
  const [selectedFleet, setSelectedFleet] = useState(null);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteLink, setInviteLink] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchApi('/fleets')
      .then(setFleets)
      .catch(console.error);
  }, []);

  const handleCreateFleet = async (e) => {
    e.preventDefault();
    const name = e.target.name.value;
    const region = e.target.region.value;
    try {
      const newFleet = await fetchApi('/fleets', {
        method: 'POST',
        body: JSON.stringify({ name, region })
      });
      setFleets([...fleets, newFleet]);
      e.target.reset();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleGenerateInvite = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const invite = await fetchApi(`/fleets/${selectedFleet.id}/invites`, {
        method: 'POST',
        body: JSON.stringify({ email: inviteEmail })
      });
      setInviteLink(`${window.location.origin}/join/${invite.code}`);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background font-body-md flex">
      <Sidebar />
      <main className="flex-1 lg:ml-[260px] flex flex-col pt-[64px] min-h-screen relative z-10 transition-all duration-300">
        <TopBar />
        
        <div className="p-4 md:p-8 flex-1 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-[1200px] mx-auto w-full">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold font-headline-lg text-on-surface">Fleet Management</h1>
              <p className="text-on-surface-variant text-sm mt-1">Manage multiple fleets and invite drivers to join specific operations.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Col: Fleets List */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-surface-container border border-outline-variant rounded-xl p-4">
                <h3 className="font-bold text-on-surface mb-4 font-headline-sm">Create New Fleet</h3>
                <form onSubmit={handleCreateFleet} className="space-y-4">
                  <input required type="text" name="name" placeholder="Fleet Name" className="w-full bg-surface border border-outline-variant rounded-md px-3 py-2 text-sm focus:border-primary focus:outline-none" />
                  <input required type="text" name="region" placeholder="Region" className="w-full bg-surface border border-outline-variant rounded-md px-3 py-2 text-sm focus:border-primary focus:outline-none" />
                  <button type="submit" className="w-full py-2 bg-primary/10 text-primary border border-primary/20 hover:bg-primary hover:text-on-primary rounded-md text-sm font-bold transition-colors">
                    Create Fleet
                  </button>
                </form>
              </div>

              <div className="bg-surface border border-outline-variant rounded-xl overflow-hidden">
                <div className="p-4 border-b border-outline-variant bg-surface-container-low">
                  <h3 className="font-bold text-on-surface font-headline-sm">Your Fleets</h3>
                </div>
                <div className="divide-y divide-outline-variant">
                  {fleets.map(f => (
                    <div 
                      key={f.id} 
                      onClick={() => { setSelectedFleet(f); setInviteLink(''); }}
                      className={`p-4 cursor-pointer hover:bg-surface-container transition-colors flex items-center justify-between ${selectedFleet?.id === f.id ? 'bg-primary/5 border-l-4 border-l-primary' : ''}`}
                    >
                      <div>
                        <div className="font-bold text-on-surface">{f.name}</div>
                        <div className="text-xs text-on-surface-variant mt-1">{f.region}</div>
                      </div>
                      <span className="material-symbols-outlined text-on-surface-variant">chevron_right</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Col: Details & Invites */}
            <div className="lg:col-span-2">
              {selectedFleet ? (
                <div className="bg-surface border border-outline-variant rounded-xl p-6 h-full shadow-lg">
                  <div className="flex items-center gap-4 mb-6 pb-6 border-b border-outline-variant">
                    <div className="w-16 h-16 bg-primary/10 border border-primary/30 rounded-lg flex items-center justify-center">
                      <span className="material-symbols-outlined text-primary text-3xl">local_shipping</span>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold font-headline-md text-on-surface">{selectedFleet.name}</h2>
                      <p className="text-on-surface-variant text-sm mt-1">ID: {selectedFleet.id} &bull; Region: {selectedFleet.region}</p>
                    </div>
                  </div>

                  <div className="mt-8 bg-surface-container rounded-xl p-6 border border-outline-variant/50">
                    <h3 className="text-lg font-bold font-headline-sm mb-2 text-on-surface flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary">person_add</span>
                      Invite Driver to {selectedFleet.name}
                    </h3>
                    <p className="text-sm text-on-surface-variant mb-6">Generate an invite link to onboard a new driver directly into this fleet.</p>
                    
                    <form onSubmit={handleGenerateInvite} className="flex gap-4 items-end">
                      <div className="flex-1">
                        <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Driver's Email (Optional)</label>
                        <input 
                          type="email" 
                          value={inviteEmail} 
                          onChange={(e) => setInviteEmail(e.target.value)} 
                          className="w-full bg-surface border border-outline-variant rounded-md px-3 py-2 text-sm focus:border-primary focus:outline-none transition-colors" 
                          placeholder="driver@example.com"
                        />
                      </div>
                      <button 
                        type="submit" 
                        disabled={loading}
                        className="py-2 px-6 bg-primary text-on-primary rounded-md font-bold text-sm shadow-md hover:bg-primary/90 transition-all disabled:opacity-50"
                      >
                        {loading ? 'Generating...' : 'Generate Link'}
                      </button>
                    </form>

                    {inviteLink && (
                      <div className="mt-6 p-4 bg-primary/10 border border-primary/30 rounded-lg animate-in fade-in zoom-in duration-300">
                        <p className="text-xs font-bold text-primary uppercase tracking-wider mb-2 flex items-center gap-2">
                          <span className="material-symbols-outlined text-[16px]">link</span>
                          Unique Invite Link
                        </p>
                        <div className="flex items-center gap-2 bg-surface p-2 rounded border border-primary/20">
                          <input readOnly value={inviteLink} className="flex-1 bg-transparent border-none outline-none text-sm font-mono text-on-surface px-2" />
                          <button 
                            onClick={() => { navigator.clipboard.writeText(inviteLink); alert('Copied!'); }}
                            className="p-2 hover:bg-primary/10 text-primary rounded transition-colors"
                          >
                            <span className="material-symbols-outlined text-[18px]">content_copy</span>
                          </button>
                        </div>
                        <p className="text-xs text-on-surface-variant mt-3 text-center">Share this link with the driver. It is valid for a single use.</p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-surface-container border border-outline-variant border-dashed rounded-xl p-12 h-full flex flex-col items-center justify-center text-center">
                  <div className="w-20 h-20 bg-surface rounded-full flex items-center justify-center shadow-inner mb-4">
                    <span className="material-symbols-outlined text-on-surface-variant text-4xl">touch_app</span>
                  </div>
                  <h3 className="text-lg font-bold text-on-surface mb-2">Select a Fleet</h3>
                  <p className="text-sm text-on-surface-variant max-w-sm">Choose a fleet from the list to view details and generate driver invitations.</p>
                </div>
              )}
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
