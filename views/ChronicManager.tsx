
import React from 'react';
import { Activity, Droplets, Thermometer, ShieldCheck, Plus, ChevronRight, ClipboardList, TrendingUp, Sparkles, PieChart as PieIcon, BarChart, Package } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, LineChart, Line, CartesianGrid } from 'recharts';
import { UserData } from '../types';

interface ChronicManagerProps {
  user: UserData;
  onLogVitals: () => void;
}

const ChronicManager: React.FC<ChronicManagerProps> = ({ user, onLogVitals }) => {
  const chronicMeds = user.medications.filter(m => m.isChronic);
  const activeDiseases = user.diseases.filter(d => d !== 'None');

  // Adherence Calculation (Strictly for today)
  const totalMedsToday = user.medications.length;
  const takenMedsToday = user.medications.filter(m => m.taken).length;
  const missedMedsToday = user.medications.filter(m => m.missed).length;
  const pendingMedsToday = Math.max(0, totalMedsToday - takenMedsToday - missedMedsToday);
  
  const adherenceRate = totalMedsToday > 0 ? (takenMedsToday / totalMedsToday) * 100 : 100;

  const adherenceData = [
    { name: 'Taken', value: takenMedsToday, color: '#3b82f6' },
    { name: 'Missed', value: missedMedsToday, color: '#ef4444' },
    { name: 'Pending', value: pendingMedsToday, color: '#1e293b' }
  ];

  // Map exact values for plotting
  const vitalsChartData = [...user.vitals].reverse().map(v => ({
    date: v.date.split('-').slice(1).join('/'),
    bp_sys: v.bp_systolic,
    bp_dia: v.bp_diastolic,
    sugar: v.sugar,
    tsh: v.tsh
  }));

  const lastVital = user.vitals[0];

  const getSpecificSuggestions = () => {
    const s = [];
    if (user.diseases.includes('Diabetes')) s.push("Diabetes: Monitor Fasting Sugar strictly every morning. Aim for 70-130 mg/dL.");
    if (user.diseases.includes('BP')) s.push("BP: Reduce salt and caffeine. Ideal BP is below 120/80 mmHg.");
    if (user.diseases.includes('Thyroid')) s.push("Thyroid: Take your dose on an empty stomach immediately after waking.");
    if (s.length === 0) s.push("Consistency is the foundation of long-term health management.");
    return s;
  };

  return (
    <div className="space-y-6 pt-2 pb-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black text-white">Chronic Care 🩺</h1>
        <button onClick={onLogVitals} className="p-2 bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-500/20 active:scale-95 transition-all">
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {/* Strict Adherence Chart */}
      <div className="p-6 bg-gray-900 border border-gray-800 rounded-[32px] flex items-center gap-6">
        <div className="w-24 h-24 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={adherenceData} innerRadius={32} outerRadius={42} paddingAngle={2} dataKey="value" startAngle={90} endAngle={-270}>
                {adherenceData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />)}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex-1">
          <h4 className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Dose Adherence</h4>
          <p className="text-3xl font-black text-white">{Math.round(adherenceRate)}%</p>
          <div className="flex flex-wrap gap-2 mt-2">
             <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                <span className="text-[8px] font-bold text-gray-500 uppercase">{takenMedsToday} Taken</span>
             </div>
             <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                <span className="text-[8px] font-bold text-gray-500 uppercase">{missedMedsToday} Missed</span>
             </div>
          </div>
        </div>
      </div>

      {/* Disease-Specific Curves - Strictly Filtered */}
      <div className="space-y-6">
        {user.diseases.includes('BP') && (
           <div className="bg-[#141A23] border border-gray-800 rounded-3xl p-5">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h4 className="text-[10px] font-black text-gray-500 uppercase flex items-center gap-2"><Activity className="w-3 h-3 text-red-500" /> BP Curve</h4>
                  {lastVital && <p className="text-xl font-black text-white mt-1">{lastVital.bp_systolic}/{lastVital.bp_diastolic} <span className="text-[10px] text-gray-500 font-medium">mmHg</span></p>}
                </div>
                <span className="text-[8px] font-bold text-red-400 bg-red-500/10 px-2 py-0.5 rounded-full uppercase">Hypertension</span>
              </div>
              <div className="h-40 w-full">
                {vitalsChartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={vitalsChartData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                      <XAxis dataKey="date" hide />
                      <YAxis width={30} fontSize={8} stroke="#475569" domain={['auto', 'auto']} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{ background: '#0B0E14', border: 'none', borderRadius: '12px', fontSize: '10px' }} />
                      <Line type="monotone" dataKey="bp_sys" stroke="#ef4444" strokeWidth={3} dot={{ r: 4, fill: '#ef4444', strokeWidth: 0 }} name="Systolic" />
                      <Line type="monotone" dataKey="bp_dia" stroke="#f87171" strokeWidth={3} dot={{ r: 4, fill: '#f87171', strokeWidth: 0 }} name="Diastolic" />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-[10px] text-gray-600 uppercase font-black">No BP Data Found</div>
                )}
              </div>
            </div>
        )}

        {user.diseases.includes('Diabetes') && (
           <div className="bg-[#141A23] border border-gray-800 rounded-3xl p-5">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h4 className="text-[10px] font-black text-gray-500 uppercase flex items-center gap-2"><Droplets className="w-3 h-3 text-blue-500" /> Fasting Glucose</h4>
                  {lastVital && <p className="text-xl font-black text-white mt-1">{lastVital.sugar} <span className="text-[10px] text-gray-500 font-medium">mg/dL</span></p>}
                </div>
                <span className="text-[8px] font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full uppercase">Diabetes</span>
              </div>
              <div className="h-40 w-full">
                {vitalsChartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={vitalsChartData}>
                      <defs>
                        <linearGradient id="colorSugarChronic" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                      <XAxis dataKey="date" hide />
                      <YAxis width={30} fontSize={8} stroke="#475569" domain={['auto', 'auto']} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{ background: '#0B0E14', border: 'none', borderRadius: '12px', fontSize: '10px' }} />
                      <Area type="monotone" dataKey="sugar" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorSugarChronic)" name="mg/dL" dot={{ r: 4, fill: '#3b82f6' }} />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-[10px] text-gray-600 uppercase font-black">No Sugar Data Found</div>
                )}
              </div>
            </div>
        )}

        {user.diseases.includes('Thyroid') && (
           <div className="bg-[#141A23] border border-gray-800 rounded-3xl p-5">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h4 className="text-[10px] font-black text-gray-500 uppercase flex items-center gap-2"><TrendingUp className="w-3 h-3 text-purple-500" /> TSH Balance</h4>
                  {lastVital && <p className="text-xl font-black text-white mt-1">{lastVital.tsh} <span className="text-[10px] text-gray-500 font-medium">mIU/L</span></p>}
                </div>
                <span className="text-[8px] font-bold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-full uppercase">Thyroid</span>
              </div>
              <div className="h-40 w-full">
                {vitalsChartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={vitalsChartData}>
                      <defs>
                        <linearGradient id="colorTshChronic" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                      <XAxis dataKey="date" hide />
                      <YAxis width={30} fontSize={8} stroke="#475569" domain={['auto', 'auto']} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{ background: '#0B0E14', border: 'none', borderRadius: '12px', fontSize: '10px' }} />
                      <Area type="monotone" dataKey="tsh" stroke="#a855f7" strokeWidth={3} fillOpacity={1} fill="url(#colorTshChronic)" name="mIU/L" dot={{ r: 4, fill: '#a855f7' }} />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-[10px] text-gray-600 uppercase font-black">No TSH Data Found</div>
                )}
              </div>
            </div>
        )}
      </div>

      {/* Disease-Specific Health Insights */}
      <div className="p-6 bg-blue-600/5 border border-blue-500/10 rounded-[32px] space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-blue-500" />
          <h4 className="text-xs font-black text-blue-400 uppercase tracking-widest">Expert Care Suggestions</h4>
        </div>
        {getSpecificSuggestions().map((s, i) => (
          <div key={i} className="flex gap-3">
             <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
             <p className="text-[11px] text-gray-300 font-medium leading-relaxed uppercase">{s}</p>
          </div>
        ))}
      </div>

      {/* Lifelong Medication Ledger */}
      <section className="space-y-3">
        <h3 className="text-[10px] font-black uppercase text-gray-500 px-1 flex items-center gap-2">
          <ClipboardList className="w-3.5 h-3.5 text-blue-500" /> Chronic Medication Ledger
        </h3>
        {chronicMeds.length === 0 ? (
          <div className="p-8 text-center bg-gray-900/20 border border-dashed border-gray-800 rounded-3xl">
            <p className="text-xs text-gray-600 font-medium uppercase">No permanent medications found.</p>
          </div>
        ) : (
          chronicMeds.map(med => (
            <div key={med.id} className="p-4 bg-gray-900 border border-gray-800 rounded-3xl flex items-center justify-between group hover:border-blue-500/30 transition-all">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">💊</div>
                <div>
                  <h4 className="text-sm font-bold text-white uppercase">{med.name}</h4>
                  <div className="flex items-center gap-2">
                    <p className="text-[10px] text-gray-500 font-bold uppercase">{med.dosage} • {med.time}</p>
                    <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-gray-800 text-[8px] font-black text-gray-400 border border-gray-700">
                      <Package className="w-2 h-2" /> {med.count} LEFT
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-[8px] font-black text-blue-500 bg-blue-500/10 px-2 py-1 rounded uppercase tracking-widest">Active Care</div>
            </div>
          ))
        )}
      </section>
    </div>
  );
};

export default ChronicManager;
