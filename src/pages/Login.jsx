import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();

  const handleLoginSuccess = async (credentialResponse) => {
    try {
      const res = await fetch('/api/auth/google-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ credential: credentialResponse.credential }),
      });
      
      if (res.status === 404) {
        alert("The backend returned a 404 error!\n\nThis means your terminal is still running the old code. Please STOP the 'node server/index.js' terminal (Ctrl+C) and RESTART IT so the new authentication route is loaded.");
        return;
      }
      
      const data = await res.json();
      
      if (res.ok && data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        navigate('/dashboard');
      } else {
        alert(`Login failed: ${data.error || 'Unknown error'}`);
        console.error("Login failed:", data.error);
      }
    } catch (error) {
      alert("Network error: Could not reach the backend API.");
      console.error("Error during authentication:", error);
    }
  };

  return (
    <div className="min-h-screen flex w-full font-body-md overflow-hidden">
      
      {/* Left Panel - Branding & Stats */}
      <div className="hidden lg:flex w-1/2 technical-bg relative flex-col justify-center items-center p-8">
        <div className="absolute inset-0 bg-gradient-to-br from-surface-dim/95 via-surface/90 to-surface-container-low/95 z-0"></div>
        
        <div className="relative z-10 w-full max-w-lg flex flex-col items-center">
          
          {/* Logo */}
          <div className="flex items-center space-x-4 mb-12">
            <svg width="64" height="64" viewBox="0 0 80 80" fill="none" stroke="var(--color-primary)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ filter: 'drop-shadow(0 0 10px rgba(61, 214, 208, 0.5))' }}>
              <path d="M14 46 V56 C14 62 18 66 24 66 H32" />
              <circle cx="38" cy="62" r="6" />
              <path d="M44 66 H56" />
              <circle cx="62" cy="62" r="6" />
              <path d="M68 62 V42 L58 30 H48 V20 C48 14 44 10 38 10 H24 C18 10 14 14 14 20 V34" />
              <path d="M48 30 V46 H68" />
              <circle cx="18" cy="40" r="4" />
              <path d="M22 40 H38 V62" />
            </svg>
            <span className="text-4xl md:text-[52px] font-headline-lg font-medium text-primary tracking-wide drop-shadow-[0_0_15px_rgba(61,214,208,0.4)]">
              TransitOps
            </span>
          </div>

          {/* Value Proposition */}
          <h2 className="text-2xl md:text-[32px] font-headline-lg text-primary font-medium mb-12 text-center drop-shadow-[0_0_8px_rgba(61,214,208,0.3)]">
            Command your fleet in real time
          </h2>

          {/* System KPIs */}
          <div className="flex justify-between items-center w-full max-w-[420px]">
            <div className="flex flex-col items-center">
              <span className="text-2xl md:text-[28px] font-bold text-on-surface mb-1">2.4k</span>
              <span className="text-[10px] md:text-[11px] font-label-caps tracking-[0.1em] text-on-surface-variant font-semibold text-center">ACTIVE ASSETS</span>
            </div>
            <div className="h-8 md:h-10 border-l border-outline-variant/30"></div>
            <div className="flex flex-col items-center">
              <span className="text-2xl md:text-[28px] font-bold text-on-surface mb-1">99.9%</span>
              <span className="text-[10px] md:text-[11px] font-label-caps tracking-[0.1em] text-on-surface-variant font-semibold text-center">UPTIME MONITOR</span>
            </div>
            <div className="h-8 md:h-10 border-l border-outline-variant/30"></div>
            <div className="flex flex-col items-center">
              <span className="text-2xl md:text-[28px] font-bold text-on-surface mb-1">14ms</span>
              <span className="text-[10px] md:text-[11px] font-label-caps tracking-[0.1em] text-on-surface-variant font-semibold text-center">DATA LATENCY</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="w-full lg:w-1/2 bg-[#0e1114] flex flex-col justify-center items-center p-8 relative min-h-screen">
        <div className="w-full max-w-[400px] flex flex-col justify-center my-auto">
          <h1 className="text-2xl font-headline-md font-bold text-on-surface mb-2">Operator Login</h1>
          <p className="text-on-surface-variant text-[15px] mb-8">Authenticate with your Google Workspace account to access the command center.</p>

          <div className="flex flex-col space-y-6">
            
            {/* Google Login integration */}
            <div className="w-full flex justify-center py-4 bg-[#151a1e] border border-outline-variant/30 rounded-lg shadow-sm hover:border-primary/50 transition-all duration-300">
              <GoogleLogin
                onSuccess={handleLoginSuccess}
                onError={() => {
                  console.log('Login Failed');
                }}
                theme="filled_black"
                size="large"
                shape="rectangular"
                width="350px"
              />
            </div>

            {/* Info Box */}
            <div className="mt-4 bg-[#151a1e] border border-outline-variant/20 rounded-lg p-4 flex items-start space-x-3">
              <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="material-symbols-outlined text-primary text-[14px]">info</span>
              </div>
              <p className="text-[13px] text-on-surface-variant leading-[1.6]">
                Your dashboard adapts to your role — <span className="text-on-surface font-medium">Fleet Manager, Driver, Safety Officer,</span> or <span className="text-on-surface font-medium">Financial Analyst.</span>
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="absolute bottom-6 w-full max-w-[400px] flex justify-center space-x-6 text-[10px] text-on-surface-variant/70 font-mono-technical tracking-widest uppercase">
          <span>SYSTEM ID: TOP-772-BX</span>
          <span>REGION: GLOBAL-NORTH</span>
        </div>
      </div>
    </div>
  );
}
