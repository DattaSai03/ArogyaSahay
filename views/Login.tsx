
import React, { useState, useEffect } from 'react';
// Added ShieldCheck to imports to fix the "Cannot find name 'ShieldCheck'" error on line 206
import { Lock, User, Check, AlertCircle, Sparkles, ChevronRight, Fingerprint, ShieldCheck } from 'lucide-react';
import { UserData } from '../types';
import { APP_NAME, LOGO_URL } from '../constants';

interface LoginProps {
  onAuthSuccess: (user: UserData, isNew: boolean) => void;
}

const Login: React.FC<LoginProps> = ({ onAuthSuccess }) => {
  const [existingUser, setExistingUser] = useState<UserData | null>(null);
  const [username, setUsername] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('arogya_active_user');
    if (saved) {
      try {
        setExistingUser(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved user", e);
      }
    }
  }, []);

  const handleAuth = () => {
    setError('');
    if (!existingUser) {
      // Registration flow
      if (!username || !pin) {
        setError('Username and PIN required');
        return;
      }
      if (!/^\d{4,6}$/.test(pin)) {
        setError('PIN must be 4-6 digits');
        return;
      }

      setLoading(true);
      const newUser: UserData = {
        username: username,
        password: pin,
        phoneNumber: '',
        email: '',
        age: '',
        gender: 'Prefer not to say',
        bloodGroup: '',
        allergies: [],
        diseases: [],
        medications: [],
        coins: 100,
        streak: 0,
        onboarded: false,
        vitals: [],
        history: [],
        notifications: [],
        settings: {
          remindersEnabled: true,
          biometricLock: false,
          language: 'English',
          theme: 'dark',
          privacy: {
            aiPersonalization: true,
            voiceProcessing: true,
            analyticsSharing: false
          },
          notificationRules: {
            medicationReminders: true,
            labReportAlerts: true,
            appointmentReminders: true,
            emergencyAlerts: true,
            wellnessNudges: true
          }
        },
        emergencyContact: { name: '', phone: '' }
      };

      setTimeout(() => {
        onAuthSuccess(newUser, true);
        setLoading(false);
      }, 1000);
    } else {
      // Unlock flow
      if (pin === existingUser.password) {
        setLoading(true);
        setTimeout(() => {
          onAuthSuccess(existingUser, false);
          setLoading(false);
        }, 800);
      } else {
        setError('Incorrect PIN. Security lockdown active.');
      }
    }
  };

  const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, ''); // Digits only
    if (val.length <= 6) {
      setPin(val);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0E14] flex flex-col items-center justify-center p-8 max-w-md mx-auto relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-10">
        <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-blue-500 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-64 h-64 bg-emerald-500 rounded-full blur-[100px]"></div>
      </div>

      <div className="w-full space-y-12 relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="text-center space-y-6">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-blue-500/20 rounded-full animate-ping scale-150 duration-[3000ms]"></div>
            <div className="w-24 h-24 rounded-full border-2 border-blue-500/30 overflow-hidden bg-gray-900 flex items-center justify-center relative shadow-2xl">
               <img src={LOGO_URL} alt="ArogyaSahay" className="w-full h-full object-cover" />
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-black text-white uppercase tracking-tight">{APP_NAME}</h1>
            <p className="text-[10px] text-blue-400 font-black uppercase tracking-[0.3em]">{existingUser ? 'Clinical Vault Locked' : 'Secure Vault Setup'}</p>
          </div>
        </div>

        <div className="bg-gray-900/40 border border-gray-800 p-8 rounded-[40px] space-y-6 shadow-2xl">
          {error && (
            <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl animate-in shake duration-500">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
              <p className="text-[10px] font-black text-red-400 uppercase tracking-tight">{error}</p>
            </div>
          )}

          <div className="space-y-4">
            {!existingUser && (
              <div className="space-y-1">
                <label className="text-[8px] font-black text-gray-500 uppercase tracking-widest px-2">Vault Identifier</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                  <input 
                    type="text" 
                    placeholder="E.G. JOHN DOE" 
                    value={username} 
                    onChange={e => setUsername(e.target.value.toUpperCase())}
                    className="w-full bg-gray-800/50 border border-gray-700 p-4 pl-12 rounded-2xl text-xs font-black text-white focus:border-blue-500 focus:bg-gray-800 outline-none transition-all uppercase"
                  />
                </div>
              </div>
            )}

            {existingUser && (
               <div className="flex items-center gap-4 p-4 bg-blue-600/5 border border-blue-500/10 rounded-2xl mb-4">
                  <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-black">
                    {existingUser.username.substring(0, 1)}
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-white uppercase">{existingUser.username}</h4>
                    <p className="text-[8px] text-gray-500 font-black uppercase">Identity Verified</p>
                  </div>
               </div>
            )}

            <div className="space-y-1">
              <label className="text-[8px] font-black text-gray-500 uppercase tracking-widest px-2">Secure PIN</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                <input 
                  type="password" 
                  inputMode="numeric"
                  placeholder="DIGITS ONLY" 
                  value={pin} 
                  onChange={handlePinChange}
                  className="w-full bg-gray-800/50 border border-gray-700 p-4 pl-12 rounded-2xl text-center text-lg font-black text-white tracking-[0.5em] focus:border-blue-500 focus:bg-gray-800 outline-none transition-all"
                />
              </div>
              <p className="text-[8px] text-gray-600 font-black uppercase text-center mt-2 px-2">
                {existingUser ? 'Enter PIN to unlock your health history' : 'Choose a 4-6 digit numeric password'}
              </p>
            </div>
          </div>

          <button 
            onClick={handleAuth}
            disabled={loading}
            className={`w-full py-5 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 transition-all transform active:scale-95 shadow-xl ${
              loading 
                ? 'bg-gray-800 text-gray-600 grayscale' 
                : 'bg-blue-600 text-white shadow-blue-500/20 hover:bg-blue-500'
            }`}
          >
            {loading ? (
              <Sparkles className="w-5 h-5 animate-spin" />
            ) : (
              <>
                {existingUser ? 'Unlock Vault' : 'Initialize Setup'} 
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

        <div className="flex flex-col items-center gap-4">
           <div className="flex items-center gap-2 px-4 py-2 bg-gray-900/50 rounded-full border border-gray-800">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest">End-to-End Clinical Encryption</span>
           </div>
           {existingUser && (
             <button onClick={() => { localStorage.removeItem('arogya_active_user'); window.location.reload(); }} className="text-[10px] font-black text-gray-600 uppercase hover:text-red-500 transition-colors">
               Not {existingUser.username}? Switch Vault
             </button>
           )}
        </div>
      </div>
    </div>
  );
};

export default Login;
