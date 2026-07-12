import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';

// ── Static risk data ──────────────────────────────────────────────────────────
const ALL_ENTITIES = [
  {
    id: 1, score: 88, type: 'Driver', name: 'Mahesh Sharma', meta: 'ID: DR-MH-4402',
    tags: [{ text: 'License expires in 4 days', color: 'tag-red' }, { text: 'Safety score dropped 12pts', color: 'tag-amber' }],
    action: 'RENEW LICENSE', actionRoute: '/drivers', actionIcon: 'badge',
    strokeColor: '#ffb4ab', dashOffset: 15.83,
  },
  {
    id: 2, score: 82, type: 'Vehicle', name: 'MH-01-VX', meta: 'Heavy Transit',
    tags: [{ text: 'Overdue maintenance 18 days', color: 'tag-red' }, { text: 'Brake Pad Wear: 92%', color: 'tag-cyan' }],
    action: 'SCHEDULE MAINTENANCE', actionRoute: '/maintenance', actionIcon: 'build',
    strokeColor: '#ffb4ab', dashOffset: 23.75,
  },
  {
    id: 3, score: 54, type: 'Driver', name: 'Pooja Patil', meta: 'ID: DR-MH-9912',
    tags: [{ text: 'Excessive Idling Detected', color: 'tag-amber' }, { text: 'Route Variance Alert', color: 'tag-cyan' }],
    action: 'REASSIGN TRIP', actionRoute: '/trips', actionIcon: 'swap_horiz',
    strokeColor: '#ffb865', dashOffset: 60.69,
  },
  {
    id: 4, score: 50, type: 'Vehicle', name: 'MH-02-BX', meta: 'Logistics Van',
    tags: [{ text: 'Fuel Anomaly Detected (+15%)', color: 'tag-amber' }],
    action: 'INSPECT FUEL SYSTEM', actionRoute: null, actionIcon: 'local_gas_station',
    strokeColor: '#ffb865', dashOffset: 66.00,
  },
  {
    id: 5, score: 38, type: 'Vehicle', name: 'MH-03-KP', meta: 'City Bus',
    tags: [{ text: 'Tire pressure low', color: 'tag-amber' }],
    action: 'SCHEDULE MAINTENANCE', actionRoute: '/maintenance', actionIcon: 'build',
    strokeColor: '#3dd6d0', dashOffset: 81.81,
  },
  {
    id: 6, score: 25, type: 'Driver', name: 'Ravi Desai', meta: 'ID: DR-MH-1102',
    tags: [{ text: 'Safety score stable', color: 'tag-cyan' }],
    action: 'REASSIGN TRIP', actionRoute: '/trips', actionIcon: 'swap_horiz',
    strokeColor: '#3dd6d0', dashOffset: 98.96,
  },
];

// ── Fuel Inspect Modal ────────────────────────────────────────────────────────
function FuelInspectModal({ entity, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-surface-container border border-outline-variant rounded-xl p-8 w-full max-w-md shadow-2xl animate-in slide-in-from-bottom-4 duration-200">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-tertiary/20 border border-tertiary/30 flex items-center justify-center">
              <span className="material-symbols-outlined text-tertiary text-[20px]">local_gas_station</span>
            </div>
            <div>
              <h2 className="font-bold text-on-surface text-[16px]">Fuel System Inspection</h2>
              <p className="text-[12px] text-on-surface-variant">{entity.name} · {entity.meta}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded flex items-center justify-center hover:bg-surface-container-highest transition-colors">
            <span className="material-symbols-outlined text-on-surface-variant text-[20px]">close</span>
          </button>
        </div>

        <div className="space-y-4 mb-6">
          <div className="p-4 bg-tertiary/10 border border-tertiary/20 rounded-lg">
            <p className="text-[12px] text-tertiary font-bold uppercase tracking-wider mb-2">Anomaly Detected</p>
            {entity.tags.map(t => (
              <p key={t.text} className="text-on-surface text-[14px]">{t.text}</p>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Fuel Consumption', value: '+15% above avg', icon: 'trending_up' },
              { label: 'Last Inspection', value: '18 days ago', icon: 'schedule' },
              { label: 'Avg Litres/100km', value: '14.8 L', icon: 'speed' },
              { label: 'Tank Integrity', value: 'No leaks found', icon: 'check_circle' },
            ].map(item => (
              <div key={item.label} className="p-3 bg-[#131A22] border border-[#1F2A35] rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <span className="material-symbols-outlined text-primary text-[14px]">{item.icon}</span>
                  <p className="text-[10px] text-on-surface-variant uppercase tracking-wider">{item.label}</p>
                </div>
                <p className="text-[13px] font-bold text-on-surface">{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 border border-outline-variant text-on-surface font-bold text-[12px] uppercase tracking-wider rounded hover:bg-surface-container-highest transition-colors"
          >
            Dismiss
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-3 bg-primary text-on-primary font-bold text-[12px] uppercase tracking-wider rounded hover:opacity-90 active:scale-95 transition-all"
          >
            Flag for Service
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function Risk() {
  const navigate = useNavigate();

  // Radar Controls state
  const [entityFilter, setEntityFilter] = useState('ALL'); // ALL | Vehicle | Driver
  const [threshold, setThreshold] = useState(75);
  const [factors, setFactors] = useState({
    licensing: true,
    safety: true,
    maintenance: true,
    fuel: false,
  });

  // Modal state
  const [fuelModal, setFuelModal] = useState(null); // entity or null

  const toggleFactor = (key) => setFactors(prev => ({ ...prev, [key]: !prev[key] }));

  // Filter entities based on controls
  const filtered = ALL_ENTITIES.filter(e => {
    const typeOk = entityFilter === 'ALL' || e.type === entityFilter;
    const scoreOk = e.score >= threshold;
    return typeOk && scoreOk;
  });

  const handleAction = (entity) => {
    if (entity.actionRoute) {
      navigate(entity.actionRoute);
    } else {
      // Fuel system inspect – show modal
      setFuelModal(entity);
    }
  };

  const scoreColor = (s) => s >= 75 ? 'text-error' : s >= 50 ? 'text-tertiary' : 'text-primary';

  return (
    <div className="min-h-screen overflow-x-hidden dark text-on-surface bg-background font-body-md">
      <Sidebar />
      <main className="flex-1 ml-0 lg:ml-[260px] min-h-screen flex flex-col technical-bg">
        <TopBar rightContent={
          <>
            <div className="hidden xl:flex items-center gap-3 bg-error-container/20 px-4 py-1 rounded border border-error/30 animate-pulse mr-2">
              <span className="material-symbols-outlined text-error text-[18px]">warning</span>
              <span className="text-error font-label-caps text-label-caps uppercase">3 Critical Anomalies Detected</span>
            </div>
            <button className="p-2 text-on-surface-variant hover:bg-surface-container-highest rounded transition-colors active:scale-95 hidden sm:block">
              <span className="material-symbols-outlined">emergency_home</span>
            </button>
            <div className="h-6 w-[1px] bg-outline-variant mx-2 hidden sm:block"></div>
          </>
        }>
          <div className="flex items-center gap-6">
            <span className="font-headline-md text-headline-md font-bold text-primary tracking-tight hidden sm:block">TransitOps</span>
            <div className="h-6 w-px bg-outline-variant hidden sm:block"></div>
            <div className="flex items-center bg-surface-container-high px-4 py-1.5 rounded border border-outline-variant gap-3 w-full max-w-[400px]">
              <span className="material-symbols-outlined text-outline text-sm">search</span>
              <input className="bg-transparent border-none focus:ring-0 text-body-md font-body-md w-full placeholder:text-outline-variant" placeholder="Search Risk Nodes..." type="text" />
            </div>
          </div>
        </TopBar>

        <div className="mt-[64px] p-container-margin min-h-[calc(100vh-64px)] overflow-x-hidden flex gap-gutter">

          {/* ── Left Column ── */}
          <div className="flex-1 flex flex-col gap-gutter overflow-hidden">
            <section className="flex flex-col gap-6">
              <div>
                <h1 className="font-headline-lg text-headline-lg text-white mb-1">Fleet Risk Radar</h1>
                <p className="text-on-surface-variant font-body-md">Composite risk scoring across licenses, maintenance, safety, and fuel anomalies.</p>
              </div>
              {/* Health Distribution Bar */}
              <div className="glass-panel p-6 rounded-lg">
                <div className="flex justify-between items-end mb-3">
                  <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">Fleet Health Distribution</span>
                  <div className="flex gap-4">
                    <span className="flex items-center gap-1.5 text-error font-label-caps text-[11px]"><span className="w-2 h-2 rounded-full bg-error"></span> 12% HIGH</span>
                    <span className="flex items-center gap-1.5 text-tertiary font-label-caps text-[11px]"><span className="w-2 h-2 rounded-full bg-tertiary"></span> 23% MEDIUM</span>
                    <span className="flex items-center gap-1.5 text-primary font-label-caps text-[11px]"><span className="w-2 h-2 rounded-full bg-primary"></span> 65% LOW</span>
                  </div>
                </div>
                <div className="h-3 w-full flex rounded-full overflow-hidden bg-surface-container-lowest">
                  <div className="h-full bg-error transition-all duration-1000" style={{ width: '12%' }}></div>
                  <div className="h-full bg-tertiary transition-all duration-1000" style={{ width: '23%' }}></div>
                  <div className="h-full bg-primary transition-all duration-1000" style={{ width: '65%' }}></div>
                </div>
              </div>
            </section>

            {/* Risk Entities List */}
            <section className="flex-1 glass-panel rounded-lg overflow-x-auto flex flex-col">
              <div className="p-4 border-b border-outline-variant bg-surface-container-low flex justify-between items-center">
                <h3 className="font-label-caps text-label-caps text-white uppercase">
                  Highest Risk Entities (Ranked)
                  {threshold > 0 && <span className="ml-2 text-on-surface-variant normal-case font-normal">· score ≥ {threshold}</span>}
                </h3>
                <div className="flex gap-2">
                  <button className="p-1.5 hover:bg-surface-container-highest transition-colors rounded">
                    <span className="material-symbols-outlined text-[20px]">sort</span>
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto custom-scrollbar p-1">
                {filtered.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-on-surface-variant gap-3">
                    <span className="material-symbols-outlined text-[48px]">check_circle</span>
                    <p className="text-[14px]">No entities meet the current filter criteria.</p>
                  </div>
                ) : (
                  filtered.map(entity => (
                    <div key={entity.id} className="flex items-center gap-6 p-4 border-b border-outline-variant hover:bg-surface-container-highest/50 transition-colors group">
                      {/* Score Ring */}
                      <div className="risk-ring flex-shrink-0">
                        <svg className="w-full h-full">
                          <circle cx="24" cy="24" fill="none" r="21" stroke="#2a313a" strokeWidth="3"></circle>
                          <circle cx="24" cy="24" fill="none" r="21" stroke={entity.strokeColor} strokeDasharray="131.95" strokeDashoffset={entity.dashOffset} strokeWidth="3"></circle>
                        </svg>
                        <span className={`${scoreColor(entity.score)} font-kpi-value text-body-md font-bold`}>{entity.score}</span>
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="material-symbols-outlined text-outline text-[20px]">
                            {entity.type === 'Driver' ? 'person' : 'directions_bus'}
                          </span>
                          <span className="font-headline-sm text-white truncate">{entity.name}</span>
                          <span className="font-label-caps text-[10px] px-2 py-0.5 rounded border border-outline-variant text-outline bg-surface-container-lowest flex-shrink-0">{entity.meta}</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {entity.tags.map(tag => (
                            <span key={tag.text} className={`${tag.color} font-label-caps text-[10px] px-2 py-0.5 rounded uppercase`}>{tag.text}</span>
                          ))}
                        </div>
                      </div>

                      {/* Action Button */}
                      <button
                        onClick={() => handleAction(entity)}
                        className="bg-primary-container text-on-primary-container px-6 py-2 rounded-sm font-label-caps text-label-caps uppercase font-bold hover:brightness-110 active:scale-95 transition-all flex items-center gap-2 flex-shrink-0"
                      >
                        <span className="material-symbols-outlined text-[16px]">{entity.actionIcon}</span>
                        {entity.action}
                      </button>
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>

          {/* ── Right Sidebar ── */}
          <aside className="w-[300px] flex flex-col gap-gutter">
            {/* Filter Panel */}
            <section className="glass-panel rounded-lg flex flex-col p-6">
              <h3 className="font-headline-sm text-white mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">filter_list</span>
                Radar Controls
              </h3>

              <div className="space-y-8">
                {/* Entity Filter */}
                <div>
                  <label className="font-label-caps text-label-caps text-on-surface-variant uppercase mb-3 block">Entity Filter</label>
                  <div className="flex bg-surface-container-lowest p-1 rounded border border-outline-variant">
                    {['ALL', 'Vehicle', 'Driver'].map(opt => (
                      <button
                        key={opt}
                        onClick={() => setEntityFilter(opt)}
                        className={`flex-1 py-1.5 font-label-caps text-label-caps rounded-sm transition-all ${entityFilter === opt ? 'bg-primary text-on-primary' : 'text-on-surface-variant hover:text-white'}`}
                      >
                        {opt.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Threshold Slider */}
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <label className="font-label-caps text-label-caps text-on-surface-variant uppercase">Risk Threshold</label>
                    <span className="text-primary font-bold font-body-md">{threshold}+</span>
                  </div>
                  <input
                    className="w-full h-1 bg-surface-container-highest rounded-lg appearance-none cursor-pointer accent-primary"
                    max="100" min="0" type="range"
                    value={threshold}
                    onChange={(e) => setThreshold(Number(e.target.value))}
                  />
                  <div className="flex justify-between mt-2">
                    <span className="text-[10px] text-outline">Low</span>
                    <span className="text-[10px] text-outline">Extreme</span>
                  </div>
                </div>

                {/* Contributing Factors */}
                <div>
                  <label className="font-label-caps text-label-caps text-on-surface-variant uppercase mb-3 block">Contributing Factors</label>
                  <div className="space-y-2">
                    {[
                      { key: 'licensing', label: 'Licensing Status' },
                      { key: 'safety', label: 'Safety Violations' },
                      { key: 'maintenance', label: 'Maintenance Delays' },
                      { key: 'fuel', label: 'Fuel Anomalies' },
                    ].map(({ key, label }) => (
                      <label key={key} className="flex items-center gap-3 group cursor-pointer">
                        <input
                          type="checkbox"
                          checked={factors[key]}
                          onChange={() => toggleFactor(key)}
                          className="rounded bg-surface-container-lowest border-outline-variant text-primary focus:ring-primary focus:ring-offset-0"
                        />
                        <span className="text-body-md text-on-surface group-hover:text-primary transition-colors">{label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <button
                onClick={() => { setEntityFilter('ALL'); setThreshold(0); setFactors({ licensing: true, safety: true, maintenance: true, fuel: true }); }}
                className="mt-8 w-full border border-outline-variant text-on-surface font-label-caps text-label-caps uppercase py-3 rounded hover:bg-surface-container-highest transition-all active:scale-95"
              >
                Apply System Filter
              </button>
            </section>

            {/* Geospatial Insight */}
            <section className="flex-1 glass-panel rounded-lg overflow-x-auto relative">
              <div className="absolute inset-0 bg-cover bg-center opacity-40 grayscale" style={{ backgroundImage: "url('https://i.imgur.com/zqXcUJA.png')" }}></div>
              <div className="relative z-10 p-6 flex flex-col h-full">
                <h4 className="font-label-caps text-label-caps text-white uppercase mb-1">Geospatial Risk Cluster</h4>
                <p className="text-[10px] text-primary font-bold uppercase mb-4">Andheri East Hub</p>
                <div className="mt-auto bg-surface/80 backdrop-blur-md p-4 rounded border border-outline-variant">
                  <p className="text-body-md leading-relaxed">
                    <span className="text-error font-bold">! CRITICAL:</span> Cluster of brake maintenance alerts identified in vehicles servicing the <span className="text-primary">Western Express Highway</span>. Potential systemic component failure.
                  </p>
                </div>
              </div>
            </section>
          </aside>
        </div>
      </main>

      {/* Fuel Inspect Modal */}
      {fuelModal && <FuelInspectModal entity={fuelModal} onClose={() => setFuelModal(null)} />}
    </div>
  );
}
