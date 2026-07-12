import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchApi } from '../services/api';

export default function Join() {
  const { code } = useParams();
  const navigate = useNavigate();
  const [invite, setInvite] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    license_number: '',
    license_category: 'STANDARD',
    license_expiry_date: '',
    contact_number: ''
  });

  useEffect(() => {
    fetchApi(`/invites/${code}`)
      .then(data => {
        setInvite(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [code]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetchApi(`/invites/${code}/accept`, {
        method: 'POST',
        body: JSON.stringify(formData)
      });
      // Once accepted, they are a driver now, go to login so they can refresh token
      navigate('/login');
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-[#0e1114] text-white">Loading...</div>;
  }

  if (error && !invite) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0e1114] p-6">
        <div className="bg-surface border border-error/30 p-8 rounded-xl max-w-md w-full text-center">
          <span className="material-symbols-outlined text-error text-5xl mb-4">error</span>
          <h2 className="text-xl font-bold text-on-surface mb-2">Invalid Invite</h2>
          <p className="text-on-surface-variant text-sm mb-6">{error}</p>
          <button onClick={() => navigate('/login')} className="px-6 py-2 bg-primary text-on-primary rounded-lg font-medium hover:bg-primary/90 transition-colors">Go to Login</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0e1114] p-6 text-on-surface font-body-md">
      <div className="bg-surface border border-outline-variant p-8 rounded-xl max-w-md w-full relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary"></div>
        
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary/10 border border-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-primary text-3xl">handshake</span>
          </div>
          <h1 className="text-2xl font-bold font-headline-md">Join {invite.fleet_name}</h1>
          <p className="text-sm text-on-surface-variant mt-2">You've been invited to join this fleet as a Driver.</p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-error/10 border border-error/30 rounded-lg text-error text-[13px] flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px]">error</span>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">Full Name</label>
            <input required type="text" name="name" value={formData.name} onChange={handleChange} className="w-full bg-surface-container border border-outline-variant rounded-md px-3 py-2 text-sm focus:border-primary focus:outline-none transition-colors" placeholder="e.g. John Doe" />
          </div>
          
          <div>
            <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">Contact Number</label>
            <input required type="text" name="contact_number" value={formData.contact_number} onChange={handleChange} className="w-full bg-surface-container border border-outline-variant rounded-md px-3 py-2 text-sm focus:border-primary focus:outline-none transition-colors" placeholder="e.g. +1 234 567 8900" />
          </div>

          <div>
            <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">License Number</label>
            <input required type="text" name="license_number" value={formData.license_number} onChange={handleChange} className="w-full bg-surface-container border border-outline-variant rounded-md px-3 py-2 text-sm focus:border-primary focus:outline-none transition-colors" placeholder="e.g. DL-123456" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">Category</label>
              <select required name="license_category" value={formData.license_category} onChange={handleChange} className="w-full bg-surface-container border border-outline-variant rounded-md px-3 py-2 text-sm focus:border-primary focus:outline-none transition-colors">
                <option value="STANDARD">Standard</option>
                <option value="COMMERCIAL">Commercial</option>
                <option value="HEAVY DUTY">Heavy Duty</option>
                <option value="HAZMAT">Hazmat</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">Expiry Date</label>
              <input required type="date" name="license_expiry_date" value={formData.license_expiry_date} onChange={handleChange} className="w-full bg-surface-container border border-outline-variant rounded-md px-3 py-2 text-sm focus:border-primary focus:outline-none transition-colors" />
            </div>
          </div>

          <button type="submit" className="w-full py-3 bg-primary text-on-primary rounded-lg font-bold text-sm hover:bg-primary/90 transition-all shadow-[0_0_15px_rgba(61,214,208,0.3)] mt-6">
            Accept Invitation & Join
          </button>
        </form>
      </div>
    </div>
  );
}
