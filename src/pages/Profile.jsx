import React, { useState, useEffect } from 'react';
import TopBar from '../components/TopBar';
import Sidebar from '../components/Sidebar';
import { getUserProfile, updateUserProfile } from '../services/userService';

export default function Profile() {
  const [profile, setProfile] = useState({ name: '', email: '', picture: '', role_name: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const data = await getUserProfile();
      setProfile(data);
    } catch (err) {
      console.error(err);
      setMessage('Failed to load profile.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      const updatedUser = await updateUserProfile({ name: profile.name, picture: profile.picture });
      
      // Update local storage so the TopBar reflects changes immediately
      const sessionUser = JSON.parse(localStorage.getItem('user') || '{}');
      sessionUser.name = updatedUser.name;
      sessionUser.picture = updatedUser.picture;
      localStorage.setItem('user', JSON.stringify(sessionUser));
      
      // Dispatch a custom event to force TopBar re-render (since it doesn't use Context API)
      window.dispatchEvent(new Event('storage')); // TopBar would need to listen, but for simplicity a full reload or state update is best. We will just reload the page for now to ensure TopBar picks it up if it doesn't listen to 'storage'.
      
      setMessage('Profile updated successfully!');
      setTimeout(() => window.location.reload(), 1000); // Quick hack to refresh TopBar
    } catch (err) {
      console.error(err);
      setMessage('Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex h-screen bg-background text-on-background font-sans selection:bg-primary/30">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <TopBar>
          <div className="flex items-center gap-4">
            <h2 className="font-headline-sm text-headline-sm text-on-surface">My Profile</h2>
          </div>
        </TopBar>
        
        <main className="ml-0 lg:ml-[var(--spacing-sidebar-width)] mt-topbar-height p-6 min-h-[calc(100vh-64px)] bg-[#0b0f14]">
          <div className="max-w-2xl mx-auto bg-surface-container border border-outline-variant rounded-xl p-8">
            <div className="flex items-center gap-6 mb-8 pb-8 border-b border-outline-variant">
              {profile.picture ? (
                <img src={profile.picture} alt="Profile" className="w-24 h-24 rounded-full border-2 border-primary object-cover" />
              ) : (
                <div className="w-24 h-24 rounded-full bg-primary/20 text-primary flex items-center justify-center text-3xl font-bold">
                  {profile.name ? profile.name.charAt(0) : 'U'}
                </div>
              )}
              <div>
                <h1 className="text-2xl font-bold text-on-surface">{profile.name}</h1>
                <p className="text-on-surface-variant uppercase tracking-widest text-sm mt-1">{profile.role_name}</p>
              </div>
            </div>

            {loading ? (
              <p>Loading...</p>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {message && (
                  <div className={`p-4 rounded ${message.includes('success') ? 'bg-primary/20 text-primary' : 'bg-error/20 text-error'}`}>
                    {message}
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-bold text-on-surface-variant mb-2 uppercase tracking-wider">Full Name</label>
                  <input 
                    type="text" 
                    name="name" 
                    value={profile.name} 
                    onChange={handleChange}
                    className="w-full bg-[#131A22] border border-[#1F2A35] rounded p-3 text-on-surface focus:outline-none focus:border-primary transition-colors"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-on-surface-variant mb-2 uppercase tracking-wider">Email Address</label>
                  <input 
                    type="email" 
                    value={profile.email} 
                    className="w-full bg-[#131A22]/50 border border-[#1F2A35]/50 rounded p-3 text-on-surface-variant cursor-not-allowed"
                    disabled
                  />
                  <p className="text-xs text-on-surface-variant mt-1">Email cannot be changed as it is linked to your Google Account.</p>
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-on-surface-variant mb-2 uppercase tracking-wider">Profile Picture URL</label>
                  <input 
                    type="text" 
                    name="picture" 
                    value={profile.picture || ''} 
                    onChange={handleChange}
                    className="w-full bg-[#131A22] border border-[#1F2A35] rounded p-3 text-on-surface focus:outline-none focus:border-primary transition-colors"
                  />
                </div>

                <div className="pt-4 flex justify-end">
                  <button 
                    type="submit" 
                    disabled={saving}
                    className="bg-primary text-on-primary font-bold px-8 py-3 rounded uppercase tracking-wider hover:opacity-90 active:scale-95 transition-all disabled:opacity-50"
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
