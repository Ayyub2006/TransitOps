import React, { useState, useEffect } from 'react';
import TopBar from '../components/TopBar';
import Sidebar from '../components/Sidebar';

export default function Settings() {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    smsAlerts: false,
    darkMode: true,
    autoDispatch: false
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('transitops_settings');
    if (saved) {
      setSettings(JSON.parse(saved));
    }
  }, []);

  const handleToggle = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    setSaving(true);
    setMessage('');
    try {
      localStorage.setItem('transitops_settings', JSON.stringify(settings));
      setMessage('Settings saved successfully.');
    } catch (e) {
      setMessage('Failed to save settings.');
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  return (
    <div className="flex h-screen bg-background text-on-background font-sans selection:bg-primary/30">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <TopBar>
          <div className="flex items-center gap-4">
            <h2 className="font-headline-sm text-headline-sm text-on-surface">System Settings</h2>
          </div>
        </TopBar>
        
        <main className="ml-0 lg:ml-[var(--spacing-sidebar-width)] mt-topbar-height p-6 min-h-[calc(100vh-64px)] bg-[#0b0f14]">
          <div className="max-w-2xl mx-auto bg-surface-container border border-outline-variant rounded-xl p-8">
            <h1 className="text-2xl font-bold text-on-surface mb-6 border-b border-outline-variant pb-4">Preferences</h1>

            {message && (
              <div className={`p-4 rounded mb-6 ${message.includes('success') ? 'bg-primary/20 text-primary' : 'bg-error/20 text-error'}`}>
                {message}
              </div>
            )}

            <div className="space-y-6">
              {/* Setting Item */}
              <div className="flex items-center justify-between p-4 bg-[#131A22] border border-[#1F2A35] rounded-lg">
                <div>
                  <h3 className="font-bold text-on-surface">Email Notifications</h3>
                  <p className="text-sm text-on-surface-variant mt-1">Receive daily reports and system alerts via email.</p>
                </div>
                <button 
                  onClick={() => handleToggle('emailNotifications')}
                  className={`w-12 h-6 rounded-full transition-colors relative ${settings.emailNotifications ? 'bg-primary' : 'bg-outline-variant'}`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${settings.emailNotifications ? 'translate-x-7' : 'translate-x-1'}`}></div>
                </button>
              </div>

              {/* Setting Item */}
              <div className="flex items-center justify-between p-4 bg-[#131A22] border border-[#1F2A35] rounded-lg">
                <div>
                  <h3 className="font-bold text-on-surface">SMS Critical Alerts</h3>
                  <p className="text-sm text-on-surface-variant mt-1">Get text messages for critical vehicle risk alerts and delays.</p>
                </div>
                <button 
                  onClick={() => handleToggle('smsAlerts')}
                  className={`w-12 h-6 rounded-full transition-colors relative ${settings.smsAlerts ? 'bg-primary' : 'bg-outline-variant'}`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${settings.smsAlerts ? 'translate-x-7' : 'translate-x-1'}`}></div>
                </button>
              </div>

              {/* Setting Item */}
              <div className="flex items-center justify-between p-4 bg-[#131A22] border border-[#1F2A35] rounded-lg opacity-50 cursor-not-allowed">
                <div>
                  <h3 className="font-bold text-on-surface">Dark Mode Theme</h3>
                  <p className="text-sm text-on-surface-variant mt-1">TransitOps is currently optimized strictly for dark mode environments.</p>
                </div>
                <button 
                  disabled
                  className="w-12 h-6 rounded-full transition-colors relative bg-primary"
                >
                  <div className="w-4 h-4 bg-white rounded-full absolute top-1 translate-x-7"></div>
                </button>
              </div>

              <div className="pt-6 flex justify-end">
                <button 
                  onClick={handleSave}
                  disabled={saving}
                  className="bg-primary text-on-primary font-bold px-8 py-3 rounded uppercase tracking-wider hover:opacity-90 active:scale-95 transition-all disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Settings'}
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
