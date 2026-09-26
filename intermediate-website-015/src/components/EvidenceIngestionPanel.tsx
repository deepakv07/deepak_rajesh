import { useCallback, useEffect, useState } from 'react';

interface GPSCoords {
  lat: string;
  lng: string;
}

interface EvidenceIngestionPanelProps {
  onSubmit: (photo: string | null, gps: GPSCoords) => void;
  isLoading: boolean;
  prefillGps?: GPSCoords;
}

const BENCHMARK_LOCATIONS = [
  { name: 'Bangalore', icon: '🌿', lat: '12.9716', lng: '77.5946', desc: 'Hesaraghatta Catchment' },
  { name: 'Chambal / Kota', icon: '💧', lat: '25.1802', lng: '75.8310', desc: 'Ravine Restoration' },
  { name: 'Patna', icon: '🌾', lat: '25.5941', lng: '85.1376', desc: 'Gangetic Floodplain' },
  { name: 'Pune', icon: '⛰️', lat: '18.5204', lng: '73.8567', desc: 'Western Ghats Sub-basin' },
];

const EvidenceIngestionPanel = ({ onSubmit, isLoading, prefillGps }: EvidenceIngestionPanelProps) => {
  const [dragging, setDragging] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [gps, setGps] = useState<GPSCoords>({ lat: '', lng: '' });
  const [gpsLoading, setGpsLoading] = useState(false);
  const [activeLocation, setActiveLocation] = useState<string | null>(null);

  // Apply GPS prefill when coming from Verification Queue
  useEffect(() => {
    if (prefillGps) {
      setGps(prefillGps);
      setActiveLocation(null);
    }
  }, [prefillGps]);

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => setPhotoPreview(e.target?.result as string);
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleDeviceGPS = () => {
    setGpsLoading(true);
    navigator.geolocation?.getCurrentPosition(
      (pos) => {
        setGps({ lat: pos.coords.latitude.toFixed(6), lng: pos.coords.longitude.toFixed(6) });
        setGpsLoading(false);
      },
      () => {
        // Fallback to Delhi coords if denied
        setGps({ lat: '28.6139', lng: '77.2090' });
        setGpsLoading(false);
      }
    );
  };

  const handleBenchmark = (loc: typeof BENCHMARK_LOCATIONS[0]) => {
    setActiveLocation(loc.name);
    setGps({ lat: loc.lat, lng: loc.lng });
    // Load the default check dam photo
    setPhotoPreview('/check_dam.jpg');
    setFileName('field_photo_geo.jpg');
  };

  const handleSubmit = () => {
    if (!gps.lat || !gps.lng) return;
    const photo = photoPreview || '/check_dam.jpg';
    onSubmit(photo, gps);
  };

  const isReady = (gps.lat && gps.lng) || photoPreview;

  return (
    <div className="glass-card p-6 animate-fade-in">
      {/* Panel Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-green-500/15 border border-green-500/25 flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-4 h-4 text-green-400 fill-current">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
            </svg>
          </div>
          <div>
            <h2 className="text-white font-semibold text-base" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              Field Verification & Evidence Ingestion
            </h2>
            <p className="text-slate-500 text-xs">Upload geo-tagged field photographs for AI cross-validation</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/80 border border-white/5">
          <div className="status-dot status-dot-cyan" />
          <span className="text-cyan-400 text-xs font-mono">INTAKE OPEN</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* Drag & Drop Zone */}
        <div className="lg:col-span-3">
          <label
            className={`drag-zone rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer min-h-48 relative overflow-hidden transition-all duration-300 ${dragging ? 'dragging' : ''}`}
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
          >
            <input type="file" accept="image/*" className="hidden" onChange={handleFileInput} id="photo-upload" />
            
            {photoPreview ? (
              <div className="w-full h-full flex flex-col items-center gap-3">
                <div className="relative w-full max-h-32 overflow-hidden rounded-lg">
                  <img src={photoPreview} alt="Field photo preview" className="w-full h-32 object-cover rounded-lg" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-lg" />
                  <div className="absolute bottom-2 left-2 gps-overlay px-2 py-1 flex items-center gap-1.5">
                    <svg viewBox="0 0 24 24" className="w-3 h-3 fill-green-400"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
                    <span className="text-green-300 text-[10px] font-mono">GEO-TAGGED</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-green-400"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
                  <span className="text-green-400 text-sm font-medium">{fileName || 'Photo loaded'}</span>
                </div>
                <span className="text-slate-500 text-xs">Drop another to replace</span>
              </div>
            ) : (
              <>
                {/* Animated upload icon */}
                <div className={`relative mb-4 ${dragging ? 'animate-float' : ''}`}>
                  <div className="w-14 h-14 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                    <svg viewBox="0 0 24 24" className="w-7 h-7 fill-green-400">
                      <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z"/>
                    </svg>
                  </div>
                  {dragging && (
                    <>
                      <div className="absolute inset-0 rounded-full border-2 border-green-400 opacity-60 ripple-ring" />
                      <div className="absolute inset-0 rounded-full border-2 border-green-400 opacity-30 ripple-ring-2" />
                    </>
                  )}
                </div>
                <p className="text-white text-sm font-medium mb-1">
                  {dragging ? 'Release to upload' : 'Drag & Drop Field Photograph'}
                </p>
                <p className="text-slate-500 text-xs mb-3">Geo-tagged JPG, PNG, TIFF · Max 50MB</p>
                <span className="px-4 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-medium hover:bg-green-500/20 transition-colors">
                  Browse Files
                </span>
              </>
            )}
          </label>
        </div>

        {/* GPS + Benchmarks */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          {/* GPS Inputs */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-slate-400 text-xs font-medium uppercase tracking-wider">GPS Coordinates</label>
              <button
                onClick={handleDeviceGPS}
                disabled={gpsLoading}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-medium hover:bg-cyan-500/20 transition-all disabled:opacity-50"
              >
                {gpsLoading ? (
                  <div className="loading-dots"><span/><span/><span/></div>
                ) : (
                  <>
                    <svg viewBox="0 0 24 24" className="w-3 h-3 fill-current"><path d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm8.94 3A8.994 8.994 0 0 0 13 3.06V1h-2v2.06A8.994 8.994 0 0 0 3.06 11H1v2h2.06A8.994 8.994 0 0 0 11 20.94V23h2v-2.06A8.994 8.994 0 0 0 20.94 13H23v-2h-2.06zM12 19c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z"/></svg>
                    Use Device GPS
                  </>
                )}
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-slate-600 text-[10px] mb-1 block">LATITUDE (°N)</label>
                <input
                  type="text"
                  placeholder="e.g. 18.5204"
                  value={gps.lat}
                  onChange={(e) => setGps(g => ({ ...g, lat: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800/80 border border-white/8 text-white text-sm font-mono placeholder-slate-600 focus:outline-none focus:border-green-500/50 focus:ring-1 focus:ring-green-500/20 transition-all"
                />
              </div>
              <div>
                <label className="text-slate-600 text-[10px] mb-1 block">LONGITUDE (°E)</label>
                <input
                  type="text"
                  placeholder="e.g. 73.8567"
                  value={gps.lng}
                  onChange={(e) => setGps(g => ({ ...g, lng: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800/80 border border-white/8 text-white text-sm font-mono placeholder-slate-600 focus:outline-none focus:border-green-500/50 focus:ring-1 focus:ring-green-500/20 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Quick Benchmark Buttons */}
          <div>
            <label className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-2 block">
              Quick Sample Sites
            </label>
            <div className="grid grid-cols-2 gap-2">
              {BENCHMARK_LOCATIONS.map((loc) => (
                <button
                  key={loc.name}
                  onClick={() => handleBenchmark(loc)}
                  className={`text-left px-3 py-2 rounded-lg border transition-all duration-200 ${
                    activeLocation === loc.name
                      ? 'bg-green-500/15 border-green-500/40 shadow-[0_0_12px_rgba(34,197,94,0.15)]'
                      : 'bg-slate-800/60 border-white/6 hover:border-green-500/25 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="text-base">{loc.icon}</span>
                    <span className={`text-xs font-semibold ${activeLocation === loc.name ? 'text-green-400' : 'text-white'}`}>
                      {loc.name}
                    </span>
                    {activeLocation === loc.name && (
                      <div className="ml-auto w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                    )}
                  </div>
                  <p className="text-slate-500 text-[10px] leading-tight">{loc.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={!isReady || isLoading}
            className="btn-primary w-full py-3 px-5 rounded-xl text-sm flex items-center justify-center gap-2.5 disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none mt-auto"
          >
            {isLoading ? (
              <>
                <div className="loading-dots"><span/><span/><span/></div>
                <span>Processing Evidence...</span>
              </>
            ) : (
              <>
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                  <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 4.9l5 2.22V11c0 3.52-2.33 6.79-5 7.93-2.67-1.14-5-4.41-5-7.93V8.12l5-2.22z"/>
                </svg>
                Verify Field Evidence & Watershed
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EvidenceIngestionPanel;
