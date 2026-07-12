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
      
      const data = await res.json();
      
      if (res.ok && data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        navigate('/dashboard');
      } else {
        console.error("Login failed:", data.error);
      }
    } catch (error) {
      console.error("Error during authentication:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center technical-bg relative">
      <div className="absolute inset-0 bg-gradient-to-br from-surface-dim/90 via-surface/80 to-surface-container-low/90 z-0"></div>
      
      <div className="glass-panel relative z-10 w-full max-w-md p-10 rounded-2xl flex flex-col items-center justify-center transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/20 transition-all duration-300">
        
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6 border border-primary/30">
          <span className="material-symbols-outlined text-4xl text-primary">directions_bus</span>
        </div>
        
        <h1 className="font-headline-lg text-headline-lg font-bold text-on-surface mb-2 tracking-wide uppercase">
          Transit<span className="text-primary">Ops</span>
        </h1>
        <p className="font-body-md text-on-surface-variant mb-10 text-center">
          Authenticate to access the Command Center and manage transit operations securely.
        </p>

        <div className="w-full flex justify-center py-2">
          <GoogleLogin
            onSuccess={handleLoginSuccess}
            onError={() => {
              console.log('Login Failed');
            }}
            theme="filled_black"
            size="large"
            shape="rectangular"
            width="300"
          />
        </div>

        <div className="mt-10 pt-6 border-t border-outline-variant/30 w-full text-center">
          <p className="font-label-caps text-label-caps text-on-surface-variant opacity-70">
            SECURE ACCESS REQUIRED
          </p>
        </div>
      </div>
    </div>
  );
}
