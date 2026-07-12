import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';

const TruckIcon = () => (
  <svg width="56" height="56" viewBox="0 0 80 80" fill="none" stroke="var(--color-primary)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ filter: 'drop-shadow(0 0 10px rgba(61, 214, 208, 0.5))' }}>
    <path d="M14 46 V56 C14 62 18 66 24 66 H32" />
    <circle cx="38" cy="62" r="6" />
    <path d="M44 66 H56" />
    <circle cx="62" cy="62" r="6" />
    <path d="M68 62 V42 L58 30 H48 V20 C48 14 44 10 38 10 H24 C18 10 14 14 14 20 V34" />
    <path d="M48 30 V46 H68" />
    <circle cx="18" cy="40" r="4" />
    <path d="M22 40 H38 V62" />
  </svg>
);

const ROLE_CONFIG = {
  'Fleet Manager': {
    label: 'Fleet Manager',
    subtitle: 'Command Center Access',
    description: 'Full access to fleet analytics, dispatch management, risk monitoring, and reporting.',
    icon: 'admin_panel_settings',
    accentColor: '#3dd6d0',
    redirectTo: '/dashboard',
  },
  'Driver': {
    label: 'Driver',
    subtitle: 'Driver Portal Access',
    description: 'View assigned trips, update delivery status, and access vehicle information.',
    icon: 'local_shipping',
    accentColor: '#fbbf24',
    redirectTo: '/trips',
  },
};

export default function Login() {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState(null); // null = role chooser screen
  const [error, setError] = useState('');

  const handleLoginSuccess = async (credentialResponse) => {
    setError('');
    try {
      const res = await fetch('/api/auth/google-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          credential: credentialResponse.credential,
          intended_role: selectedRole,
        }),
      });

      const data = await res.json();

      if (res.ok && data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        // Redirect based on the actual role returned from the server
        const config = ROLE_CONFIG[data.user.role] || ROLE_CONFIG['Fleet Manager'];
        navigate(config.redirectTo);
      } else {
        setError(data.error || 'Authentication failed. Please try again.');
      }
    } catch (err) {
      setError('Network error. Could not reach the server.');
    }
  };

  const roleConfig = selectedRole ? ROLE_CONFIG[selectedRole] : null;

  return (
    <div className="min-h-screen flex w-full font-body-md overflow-hidden">

      {/* ── Left Branding Panel ── */}
      <div className="hidden lg:flex w-1/2 technical-bg relative flex-col justify-center items-center p-8">
        <div className="absolute inset-0 bg-gradient-to-br from-surface-dim/95 via-surface/90 to-surface-container-low/95 z-0" />
        <div className="relative z-10 w-full max-w-lg flex flex-col items-center">
          {/* Logo */}
          <div className="flex items-center space-x-4 mb-12">
            <TruckIcon />
            <span className="text-4xl md:text-[52px] font-headline-lg font-medium text-primary tracking-wide drop-shadow-[0_0_15px_rgba(61,214,208,0.4)]">
              TransitOps
            </span>
          </div>
          <h2 className="text-2xl md:text-[32px] font-headline-lg text-primary font-medium mb-12 text-center drop-shadow-[0_0_8px_rgba(61,214,208,0.3)]">
            Command your fleet in real time
          </h2>
          {/* KPIs */}
          <div className="flex justify-between items-center w-full max-w-[420px]">
            {[['2.4k','ACTIVE ASSETS'],['99.9%','UPTIME MONITOR'],['14ms','DATA LATENCY']].map(([val, label], i, arr) => (
              <React.Fragment key={label}>
                <div className="flex flex-col items-center">
                  <span className="text-2xl md:text-[28px] font-bold text-on-surface mb-1">{val}</span>
                  <span className="text-[10px] md:text-[11px] font-label-caps tracking-[0.1em] text-on-surface-variant font-semibold text-center">{label}</span>
                </div>
                {i < arr.length - 1 && <div className="h-8 md:h-10 border-l border-outline-variant/30" />}
              </React.Fragment>
            ))}
          </div>

          {/* Role indicators */}
          <div className="mt-16 grid grid-cols-2 gap-4 w-full max-w-[380px]">
            {Object.entries(ROLE_CONFIG).map(([role, cfg]) => (
              <div key={role} className={`p-4 rounded-lg border transition-all duration-300 ${selectedRole === role ? 'border-primary/60 bg-primary/10' : 'border-outline-variant/20 bg-surface-container/40'}`}>
                <span className="material-symbols-outlined text-primary text-[20px] mb-2 block">{cfg.icon}</span>
                <p className="text-sm font-bold text-on-surface">{cfg.label}</p>
                <p className="text-[11px] text-on-surface-variant mt-1">{cfg.subtitle}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right Auth Panel ── */}
      <div className="w-full lg:w-1/2 bg-[#0e1114] flex flex-col justify-center items-center p-8 relative min-h-screen">
        <div className="w-full max-w-[400px] flex flex-col justify-center my-auto">

          {!selectedRole ? (
            /* ── STEP 1: Role Selector ── */
            <>
              <div className="flex items-center gap-3 mb-2 lg:hidden">
                <TruckIcon />
                <span className="text-2xl font-bold text-primary">TransitOps</span>
              </div>
              <h1 className="text-2xl font-headline-md font-bold text-on-surface mb-2">Welcome Back</h1>
              <p className="text-on-surface-variant text-[15px] mb-8">Select your role to continue to the appropriate portal.</p>

              <div className="space-y-4">
                {Object.entries(ROLE_CONFIG).map(([role, cfg]) => (
                  <button
                    key={role}
                    onClick={() => setSelectedRole(role)}
                    className="w-full text-left p-5 rounded-xl border border-outline-variant/30 bg-[#151a1e] hover:border-primary/60 hover:bg-primary/5 transition-all duration-300 group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                        <span className="material-symbols-outlined text-primary text-[24px]">{cfg.icon}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-on-surface text-[15px]">{cfg.label}</p>
                        <p className="text-[12px] text-on-surface-variant mt-0.5">{cfg.description}</p>
                      </div>
                      <span className="material-symbols-outlined text-on-surface-variant text-[20px] group-hover:text-primary transition-colors flex-shrink-0">chevron_right</span>
                    </div>
                  </button>
                ))}
              </div>

              <div className="mt-6 bg-[#151a1e] border border-outline-variant/20 rounded-lg p-4 flex items-start space-x-3">
                <span className="material-symbols-outlined text-primary text-[16px] mt-0.5 flex-shrink-0">info</span>
                <p className="text-[13px] text-on-surface-variant leading-[1.6]">
                  Existing users will always be redirected to their <span className="text-on-surface font-medium">pre-assigned role</span>, regardless of which portal they select.
                </p>
              </div>
            </>
          ) : (
            /* ── STEP 2: Google Login for selected role ── */
            <>
              <button
                onClick={() => { setSelectedRole(null); setError(''); }}
                className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors mb-8 group text-[13px]"
              >
                <span className="material-symbols-outlined text-[18px] group-hover:-translate-x-1 transition-transform">arrow_back</span>
                Back to role selection
              </button>

              {/* Role badge */}
              <div className="flex items-center gap-3 mb-6 p-3 rounded-lg border border-outline-variant/30 bg-[#151a1e] w-fit">
                <div className="w-8 h-8 rounded bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-[18px]">{roleConfig.icon}</span>
                </div>
                <div>
                  <p className="text-[11px] text-on-surface-variant uppercase tracking-widest">Signing in as</p>
                  <p className="text-[14px] font-bold text-on-surface">{roleConfig.label}</p>
                </div>
              </div>

              <h1 className="text-2xl font-headline-md font-bold text-on-surface mb-2">{roleConfig.label} Login</h1>
              <p className="text-on-surface-variant text-[15px] mb-8">
                Authenticate with your Google Workspace account to access the {roleConfig.label.toLowerCase()} portal.
              </p>

              {error && (
                <div className="mb-6 p-4 bg-error/10 border border-error/30 rounded-lg text-error text-[13px] flex items-start gap-2">
                  <span className="material-symbols-outlined text-[16px] flex-shrink-0 mt-0.5">error</span>
                  {error}
                </div>
              )}

              <div className="w-full flex justify-center py-4 bg-[#151a1e] border border-outline-variant/30 rounded-lg shadow-sm hover:border-primary/50 transition-all duration-300">
                <GoogleLogin
                  onSuccess={handleLoginSuccess}
                  onError={() => setError('Google sign-in failed. Please try again.')}
                  theme="filled_black"
                  size="large"
                  shape="rectangular"
                  width="350px"
                />
              </div>

              <div className="mt-4 bg-[#151a1e] border border-outline-variant/20 rounded-lg p-4 flex items-start space-x-3">
                <span className="material-symbols-outlined text-primary text-[16px] mt-0.5 flex-shrink-0">shield</span>
                <p className="text-[13px] text-on-surface-variant leading-[1.6]">
                  Access is scoped to your <span className="text-on-surface font-medium">{roleConfig.label}</span> permissions. Contact your admin to change your assigned role.
                </p>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="absolute bottom-6 w-full max-w-[400px] flex justify-center space-x-6 text-[10px] text-on-surface-variant/70 font-mono tracking-widest uppercase">
          <span>SYSTEM ID: TOP-772-BX</span>
          <span>REGION: GLOBAL-NORTH</span>
        </div>
      </div>
    </div>
  );
}
