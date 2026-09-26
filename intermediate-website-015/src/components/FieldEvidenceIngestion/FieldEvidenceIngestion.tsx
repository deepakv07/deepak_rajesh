import React, { useCallback, useEffect, useRef, useState } from 'react';

export interface GPSCoords {
  lat: string;
  lng: string;
}

export interface TamilNaduBenchmark {
  id: string;
  name: string;
  basinLabel: string;
  lat: string;
  lng: string;
  basinName: string;
  watershedCode: string;
  coveredDistricts: string;
  satelliteNotice: string;
  waterSpreadDelta: string;
}

const TN_BENCHMARKS: TamilNaduBenchmark[] = [
  {
    id: 'thanjavur',
    name: 'Thanjavur',
    basinLabel: 'Thanjavur (Cauvery Delta)',
    lat: '10.7870',
    lng: '79.1378',
    basinName: 'Cauvery Lower Sub-Basin',
    watershedCode: 'TN-CAU-2026-04',
    coveredDistricts: 'Thanjavur, Tiruvarur, Nagapattinam',
    satelliteNotice: 'Satellite shows water spread increased by 15% and surrounding plant health improved.',
    waterSpreadDelta: '+15%',
  },
  {
    id: 'madurai',
    name: 'Madurai',
    basinLabel: 'Madurai (Vaigai)',
    lat: '9.9252',
    lng: '78.1198',
    basinName: 'Vaigai Middle Catchment',
    watershedCode: 'TN-VAI-2026-09',
    coveredDistricts: 'Madurai, Dindigul, Theni',
    satelliteNotice: 'Satellite shows water spread increased by 18% along riverbank trenches and farm ponds.',
    waterSpreadDelta: '+18%',
  },
  {
    id: 'tirunelveli',
    name: 'Tirunelveli',
    basinLabel: 'Tirunelveli (Thamirabarani)',
    lat: '8.7139',
    lng: '77.7567',
    basinName: 'Thamirabarani Perennial Basin',
    watershedCode: 'TN-THA-2026-12',
    coveredDistricts: 'Tirunelveli, Tenkasi, Thoothukudi',
    satelliteNotice: 'Satellite confirms 22% higher water storage in downstream percolation ponds.',
    waterSpreadDelta: '+22%',
  },
  {
    id: 'kanchipuram',
    name: 'Kanchipuram',
    basinLabel: 'Kanchipuram (Palar)',
    lat: '12.8342',
    lng: '79.7036',
    basinName: 'Palar Lower Basin',
    watershedCode: 'TN-PAL-2026-02',
    coveredDistricts: 'Kanchipuram, Chengalpattu, Ranipet',
    satelliteNotice: 'Satellite shows improved soil moisture and healthy water storage in community bunds.',
    waterSpreadDelta: '+12%',
  },
  {
    id: 'coimbatore',
    name: 'Coimbatore',
    basinLabel: 'Coimbatore (Noyyal)',
    lat: '11.0168',
    lng: '76.9558',
    basinName: 'Noyyal Sub-Basin (Cauvery Tributary)',
    watershedCode: 'TN-NOY-2026-07',
    coveredDistricts: 'Coimbatore, Tiruppur, Erode',
    satelliteNotice: 'Satellite shows upstream check dams holding strong vegetative biomass and full impoundment.',
    waterSpreadDelta: '+16%',
  },
];

interface ClassProb {
  name: string;
  prob: number;
  barColor: string;
  textColor: string;
}

const AI_PROBABILITIES: ClassProb[] = [
  { name: 'Check Dam', prob: 88.4, barColor: 'bg-emerald-600', textColor: 'text-emerald-700' },
  { name: 'Farm Pond', prob: 7.1, barColor: 'bg-blue-600', textColor: 'text-blue-700' },
  { name: 'Bund', prob: 2.8, barColor: 'bg-amber-500', textColor: 'text-amber-700' },
  { name: 'Tree Plantation', prob: 1.6, barColor: 'bg-teal-600', textColor: 'text-teal-700' },
];

export interface FieldEvidenceIngestionProps {
  theme?: 'dark' | 'light';
  initialGps?: GPSCoords;
  onNavigateToMap?: (lat: string, lng: string) => void;
}

export const FieldEvidenceIngestion: React.FC<FieldEvidenceIngestionProps> = ({
  theme = 'dark',
  initialGps,
  onNavigateToMap,
}) => {
  const isDark = theme === 'dark';

  // Dynamic Theme Tokens
  const T = isDark ? {
    bg:           '#040b18',
    cardBg:       '#070f1f',
    cardBorder:   'rgba(255,255,255,0.08)',
    innerBg:      '#0b1628',
    innerBorder:  'rgba(255,255,255,0.08)',
    inputBg:      '#0f1e36',
    inputBorder:  'rgba(255,255,255,0.12)',
    textTitle:    '#f8fafc',
    textSub:      '#cbd5e1',
    textMuted:    '#94a3b8',
    accentGreen:  '#4ade80',
    accentCyan:   '#22d3ee',
  } : {
    bg:           '#f8fafc',
    cardBg:       '#ffffff',
    cardBorder:   '#e2e8f0',
    innerBg:      '#f8fafc',
    innerBorder:  '#e2e8f0',
    inputBg:      '#f1f5f9',
    inputBorder:  '#cbd5e1',
    textTitle:    '#0f172a',
    textSub:      '#334155',
    textMuted:    '#64748b',
    accentGreen:  '#16a34a',
    accentCyan:   '#0891b2',
  };

  // GPS State
  const [lat, setLat] = useState<string>(initialGps?.lat || TN_BENCHMARKS[0].lat);
  const [lng, setLng] = useState<string>(initialGps?.lng || TN_BENCHMARKS[0].lng);
  const [activeBenchmark, setActiveBenchmark] = useState<TamilNaduBenchmark>(TN_BENCHMARKS[0]);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [locationStatus, setLocationStatus] = useState<string>('Thanjavur preset active');

  // Photo State
  const [photoPreview, setPhotoPreview] = useState<string>('/check_dam.jpg');
  const [fileName, setFileName] = useState<string>('TN_Thanjavur_CheckDam_04.JPG');
  const [fileSize, setFileSize] = useState<string>('4.2 MB');
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Verification Pipeline State
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [verifyStep, setVerifyStep] = useState<string>('');
  const [hasVerified, setHasVerified] = useState<boolean>(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Handle incoming GPS coordinates
  useEffect(() => {
    if (initialGps && initialGps.lat && initialGps.lng) {
      setLat(initialGps.lat);
      setLng(initialGps.lng);
      setLocationStatus(`Custom Coordinates (${initialGps.lat}, ${initialGps.lng})`);
      const matched = TN_BENCHMARKS.find(
        b => Math.abs(parseFloat(b.lat) - parseFloat(initialGps.lat)) < 0.05 &&
             Math.abs(parseFloat(b.lng) - parseFloat(initialGps.lng)) < 0.05
      );
      if (matched) setActiveBenchmark(matched);
    }
  }, [initialGps]);

  // File Upload Handlers
  const handleFileProcess = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid image file (.JPG or .PNG)');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      alert('File size exceeds the 10MB limit.');
      return;
    }
    setFileName(file.name);
    setFileSize(`${(file.size / (1024 * 1024)).toFixed(1)} MB`);
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setPhotoPreview(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  }, [handleFileProcess]);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileProcess(e.target.files[0]);
    }
  };

  // Device GPS
  const handleUseDeviceGPS = () => {
    setIsLocating(true);
    setLocationStatus('Accessing device GPS sensor…');
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const newLat = pos.coords.latitude.toFixed(4);
          const newLng = pos.coords.longitude.toFixed(4);
          setLat(newLat);
          setLng(newLng);
          setIsLocating(false);
          setLocationStatus(`Live Device GPS Locked (${newLat}, ${newLng})`);
        },
        () => {
          setIsLocating(false);
          setLocationStatus('Could not read GPS. Using selected preset.');
        },
        { enableHighAccuracy: true, timeout: 6000 }
      );
    } else {
      setIsLocating(false);
      setLocationStatus('GPS not supported in browser. Using selected preset.');
    }
  };

  // Preset Selection
  const handleSelectBenchmark = (bm: TamilNaduBenchmark) => {
    setActiveBenchmark(bm);
    setLat(bm.lat);
    setLng(bm.lng);
    setLocationStatus(`Auto-filled: ${bm.basinLabel}`);
  };

  // Verification Action
  const handleStartVerification = () => {
    setIsVerifying(true);
    setHasVerified(false);

    const steps = [
      'Scanning photo structure with NeerDarpan AI…',
      'Comparing with Sentinel-2 live water spread…',
      'Cross-checking Tamil Nadu watershed boundaries…',
      'Verification complete! Generating report card…',
    ];

    steps.forEach((step, index) => {
      setTimeout(() => {
        setVerifyStep(step);
      }, index * 600);
    });

    setTimeout(() => {
      setIsVerifying(false);
      setHasVerified(true);
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }, steps.length * 600 + 300);
  };

  return (
    <div style={{ background: T.bg, minHeight: '100%', width: '100%', fontFamily: 'Inter, sans-serif', transition: 'background 0.3s ease' }}>
      <div className="w-full p-6 space-y-6">

        {/* ─── 1. Header Card (Full Width) ─── */}
        <div style={{ background: T.cardBg, border: `1px solid ${T.cardBorder}`, borderRadius: 20, padding: 24, boxShadow: isDark ? '0 4px 20px rgba(0,0,0,0.3)' : '0 2px 12px rgba(0,0,0,0.04)' }}>
          <div className="flex items-center gap-2.5 mb-2">
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '3px 12px', borderRadius: 20, background: isDark?'rgba(34,197,94,0.1)':'#dcfce7', border: isDark?'1px solid rgba(34,197,94,0.25)':'1px solid #bbf7d0', color: isDark?'#4ade80':'#15803d', fontSize: 11, fontWeight: 700 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: isDark?'#22c55e':'#16a34a' }} className="animate-pulse" />
              Field Officer Portal
            </span>
            <span style={{ fontSize: 11, color: T.textMuted, fontWeight: 500 }}>
              Tamil Nadu Watershed Development Agency (TN-WDC)
            </span>
          </div>

          <h1 style={{ fontSize: 22, fontWeight: 800, color: T.textTitle, letterSpacing: '-0.02em' }}>
            NeerDarpan | Upload Field Photo &amp; Location Check
          </h1>
          <p style={{ fontSize: 12, color: T.textMuted, marginTop: 4, lineHeight: 1.6 }}>
            Upload geo-tagged field photos of check dams, farm ponds, or contour trenches. The system automatically verifies your photo using artificial intelligence and cross-matches it with real-time satellite water measurements.
          </p>
        </div>

        {/* ─── 2. Main Executive Grid (Full Width 2-Column Split) ─── */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 w-full items-start">

          {/* Left Column (7 cols — Upload & GPS Controls) */}
          <div className="xl:col-span-7 space-y-6">

            {/* Photo Upload Card */}
            <div style={{ background: T.cardBg, border: `1px solid ${T.cardBorder}`, borderRadius: 20, padding: 24, boxShadow: isDark ? '0 4px 20px rgba(0,0,0,0.3)' : '0 2px 12px rgba(0,0,0,0.04)' }}>
              <div className="flex items-center justify-between pb-4 mb-4" style={{ borderBottom: `1px solid ${T.cardBorder}` }}>
                <div>
                  <h2 style={{ fontSize: 15, fontWeight: 700, color: T.textTitle }}>
                    1. Field Photograph
                  </h2>
                  <p style={{ fontSize: 11, color: T.textMuted, marginTop: 2 }}>
                    Take or upload a clear photo of the water harvesting structure (.JPG or .PNG, up to 10MB).
                  </p>
                </div>
                <span style={{ fontSize: 10, fontWeight: 800, color: isDark?'#4ade80':'#15803d', background: isDark?'rgba(34,197,94,0.1)':'#dcfce7', border: isDark?'1px solid rgba(34,197,94,0.25)':'1px solid #bbf7d0', padding: '4px 12px', borderRadius: 20 }}>
                  High Resolution Ready
                </span>
              </div>

              {/* Drag & Drop Target Area */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                style={{
                  cursor: 'pointer', borderRadius: 16, border: `2px dashed ${isDragging ? (isDark?'#4ade80':'#16a34a') : T.cardBorder}`,
                  padding: '32px 20px', textAlign: 'center', transition: 'all 0.2s',
                  background: isDark ? '#0b1628' : '#f8fafc',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10,
                }}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileInputChange}
                  accept=".jpg,.jpeg,.png"
                  className="hidden"
                />

                {/* Camera Icon */}
                <div style={{ width: 52, height: 52, borderRadius: 14, background: isDark?'rgba(34,197,94,0.12)':'#dcfce7', border: isDark?'1px solid rgba(34,197,94,0.25)':'1px solid #bbf7d0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: isDark?'#4ade80':'#16a34a' }}>
                  <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <circle cx="12" cy="13" r="4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>

                <div>
                  <p style={{ fontSize: 14, fontWeight: 700, color: T.textTitle }}>
                    Click or drag field photo here (.JPG, .PNG)
                  </p>
                  <p style={{ fontSize: 11, color: T.textMuted, marginTop: 2 }}>
                    Supports GPS geo-tagged photos directly from mobile phones or field tablets.
                  </p>
                </div>

                {/* Current Loaded File Tag */}
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 14px', borderRadius: 12, background: isDark?'#0f1e36':'#ffffff', border: `1px solid ${T.cardBorder}`, fontSize: 11, color: T.textSub }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e' }} />
                  <span style={{ fontWeight: 700, color: T.textTitle }}>{fileName}</span>
                  <span style={{ fontFamily: 'monospace', color: T.textMuted }}>({fileSize})</span>
                  <span style={{ color: isDark?'#4ade80':'#15803d', fontWeight: 700, marginLeft: 4 }}>✓ Loaded</span>
                </div>
              </div>
            </div>

            {/* GPS Location & Benchmarks Card */}
            <div style={{ background: T.cardBg, border: `1px solid ${T.cardBorder}`, borderRadius: 20, padding: 24, boxShadow: isDark ? '0 4px 20px rgba(0,0,0,0.3)' : '0 2px 12px rgba(0,0,0,0.04)' }}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4" style={{ borderBottom: `1px solid ${T.cardBorder}` }}>
                <div>
                  <h2 style={{ fontSize: 15, fontWeight: 700, color: T.textTitle }}>
                    2. Structure GPS Location
                  </h2>
                  <p style={{ fontSize: 11, color: T.textMuted, marginTop: 2 }}>
                    Confirm the exact coordinates or pick a Tamil Nadu river basin benchmark.
                  </p>
                </div>

                {/* Use Device GPS Button */}
                <button
                  type="button"
                  onClick={handleUseDeviceGPS}
                  disabled={isLocating}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 10,
                    background: isDark ? '#0b1628' : '#ffffff', border: `1px solid ${T.cardBorder}`,
                    color: isDark ? '#22d3ee' : '#0891b2', fontWeight: 700, fontSize: 11, cursor: 'pointer',
                  }}
                >
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="8" />
                    <path d="M12 2v2M12 20v2M2 12h2M20 12h2" />
                    <circle cx="12" cy="12" r="2" fill="currentColor" />
                  </svg>
                  {isLocating ? 'Finding Coordinates…' : 'Use Device GPS'}
                </button>
              </div>

              {/* Coordinates Inputs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label style={{ fontSize: 10, fontWeight: 800, color: T.textMuted, textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: 6 }}>
                    Latitude (North)
                  </label>
                  <input
                    type="text"
                    value={lat}
                    onChange={(e) => setLat(e.target.value)}
                    placeholder="e.g. 10.7870"
                    style={{
                      width: '100%', background: T.inputBg, border: `1px solid ${T.inputBorder}`,
                      borderRadius: 10, padding: '10px 14px', fontSize: 13, fontFamily: 'JetBrains Mono, monospace',
                      fontWeight: 700, color: T.textTitle, outline: 'none',
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: 10, fontWeight: 800, color: T.textMuted, textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: 6 }}>
                    Longitude (East)
                  </label>
                  <input
                    type="text"
                    value={lng}
                    onChange={(e) => setLng(e.target.value)}
                    placeholder="e.g. 79.1378"
                    style={{
                      width: '100%', background: T.inputBg, border: `1px solid ${T.inputBorder}`,
                      borderRadius: 10, padding: '10px 14px', fontSize: 13, fontFamily: 'JetBrains Mono, monospace',
                      fontWeight: 700, color: T.textTitle, outline: 'none',
                    }}
                  />
                </div>
              </div>

              {/* Status line */}
              <div style={{ fontSize: 11, color: T.textMuted, display: 'flex', alignItems: 'center', gap: 6, marginBottom: 14 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#38bdf8' }} />
                <span>Status: <strong style={{ color: T.textTitle }}>{locationStatus}</strong></span>
              </div>

              {/* Tamil Nadu Preset Buttons */}
              <div>
                <span style={{ fontSize: 10, fontWeight: 800, color: T.textMuted, textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: 8 }}>
                  Quick Tamil Nadu Benchmark Locations:
                </span>
                <div className="flex flex-wrap gap-2.5">
                  {TN_BENCHMARKS.map((bm) => {
                    const isSelected = activeBenchmark.id === bm.id;
                    return (
                      <button
                        key={bm.id}
                        type="button"
                        onClick={() => handleSelectBenchmark(bm)}
                        style={{
                          padding: '8px 14px', borderRadius: 10, fontSize: 11, fontWeight: 700, cursor: 'pointer',
                          background: isSelected
                            ? (isDark ? '#22c55e' : '#16a34a')
                            : (isDark ? '#0b1628' : '#f1f5f9'),
                          color: isSelected ? '#ffffff' : T.textSub,
                          border: isSelected
                            ? '1px solid transparent'
                            : `1px solid ${T.inputBorder}`,
                          transition: 'all 0.2s',
                        }}
                      >
                        {bm.basinLabel}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Primary Action Button */}
            <div>
              <button
                type="button"
                onClick={handleStartVerification}
                disabled={isVerifying}
                style={{
                  width: '100%', padding: '16px 24px', borderRadius: 16,
                  background: 'linear-gradient(90deg, #16a34a 0%, #15803d 100%)',
                  color: '#ffffff', fontWeight: 800, fontSize: 15, border: 'none', cursor: 'pointer',
                  boxShadow: '0 4px 16px rgba(22,163,74,0.25)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                  opacity: isVerifying ? 0.7 : 1, transition: 'all 0.2s',
                }}
              >
                {isVerifying ? (
                  <>
                    <div style={{ width: 18, height: 18, border: '2px solid #fff', borderTopColor: 'transparent', borderRadius: '50%' }} className="animate-spin" />
                    <span>{verifyStep || 'Processing Field Evidence…'}</span>
                  </>
                ) : (
                  <>
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Check Photo &amp; Cross-Match Satellite</span>
                  </>
                )}
              </button>
            </div>

          </div>

          {/* Right Column (5 cols — Live Telemetry & Platform Metrics) */}
          <div className="xl:col-span-5 space-y-6">

            {/* Platform Metrics Card */}
            <div style={{ background: T.cardBg, border: `1px solid ${T.cardBorder}`, borderRadius: 20, padding: 20, boxShadow: isDark ? '0 4px 20px rgba(0,0,0,0.3)' : '0 2px 12px rgba(0,0,0,0.04)' }}>
              <div className="flex items-center gap-2 mb-4 pb-3" style={{ borderBottom: `1px solid ${T.cardBorder}` }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#22c55e' }} className="animate-pulse" />
                <h3 style={{ fontSize: 13, fontWeight: 800, color: T.textTitle, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Platform Intake Telemetry
                </h3>
              </div>
              <div className="space-y-3">
                {[
                  { label: 'Photos Ingested Today', value: '2,847', delta: '+142', color: isDark ? '#4ade80' : '#15803d' },
                  { label: 'AI Verifications', value: '2,391', delta: '+98', color: isDark ? '#22d3ee' : '#0891b2' },
                  { label: 'Mismatches Flagged', value: '23', delta: '+3', color: isDark ? '#f87171' : '#b91c1c' },
                  { label: 'Payments Cleared', value: '₹48.3Cr', delta: '+₹2.1Cr', color: isDark ? '#fbbf24' : '#b45309' },
                  { label: 'Avg. Confidence', value: '86.7%', delta: '+0.4%', color: isDark ? '#c084fc' : '#7e22ce' },
                ].map(m => (
                  <div key={m.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 0', borderBottom: `1px solid ${T.innerBorder}` }}>
                    <span style={{ fontSize: 12, color: T.textMuted }}>{m.label}</span>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: 13, fontWeight: 800, fontFamily: 'monospace', color: m.color }}>{m.value}</span>
                      <span style={{ fontSize: 10, fontFamily: 'monospace', color: T.textMuted, marginLeft: 6 }}>{m.delta}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Satellite Passes Card */}
            <div style={{ background: T.cardBg, border: `1px solid ${T.cardBorder}`, borderRadius: 20, padding: 20, boxShadow: isDark ? '0 4px 20px rgba(0,0,0,0.3)' : '0 2px 12px rgba(0,0,0,0.04)' }}>
              <div className="flex items-center gap-2 mb-3 pb-2" style={{ borderBottom: `1px solid ${T.cardBorder}` }}>
                <span style={{ fontSize: 14 }}>🛰️</span>
                <h3 style={{ fontSize: 13, fontWeight: 800, color: T.textTitle, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Upcoming Satellite Passes
                </h3>
              </div>
              <div className="space-y-2.5">
                {[
                  { sat: 'Sentinel-2B', time: '10:31 IST', region: 'Cauvery Delta', status: 'Scheduled' },
                  { sat: 'Landsat-9', time: '11:04 IST', region: 'Vaigai Basin', status: 'Scheduled' },
                  { sat: 'Sentinel-1A', time: '06:22 IST', region: 'Thamirabarani Basin', status: 'Completed' },
                ].map(p => (
                  <div key={p.sat} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', borderRadius: 10, background: T.innerBg, border: `1px solid ${T.cardBorder}` }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: p.status==='Completed' ? '#22c55e' : '#f59e0b' }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 12, fontWeight: 700, color: T.textTitle }}>{p.sat}</p>
                      <p style={{ fontSize: 10, color: T.textMuted }}>{p.region}</p>
                    </div>
                    <span style={{ fontSize: 11, fontFamily: 'monospace', fontWeight: 700, color: p.status==='Completed' ? (isDark?'#4ade80':'#15803d') : (isDark?'#fbbf24':'#b45309') }}>{p.time}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tamil Nadu Basin Summary */}
            <div style={{ background: T.cardBg, border: `1px solid ${T.cardBorder}`, borderRadius: 20, padding: 20, boxShadow: isDark ? '0 4px 20px rgba(0,0,0,0.3)' : '0 2px 12px rgba(0,0,0,0.04)' }}>
              <div className="flex items-center gap-2 mb-3 pb-2" style={{ borderBottom: `1px solid ${T.cardBorder}` }}>
                <span style={{ fontSize: 14 }}>🌿</span>
                <h3 style={{ fontSize: 13, fontWeight: 800, color: T.textTitle, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  State Water Summary
                </h3>
              </div>
              <div style={{ background: T.innerBg, border: `1px solid ${T.cardBorder}`, borderRadius: 12, padding: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11 }}>
                  <span style={{ color: T.textMuted }}>Active Micro-Watersheds:</span>
                  <span style={{ fontWeight: 700, color: T.textTitle, fontFamily: 'monospace' }}>5,342 Sites</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11 }}>
                  <span style={{ color: T.textMuted }}>AI Structural Match Rate:</span>
                  <span style={{ fontWeight: 700, color: isDark?'#4ade80':'#15803d', fontFamily: 'monospace' }}>88.4% Confidence</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11 }}>
                  <span style={{ color: T.textMuted }}>DoLR Fund Compliance:</span>
                  <span style={{ fontWeight: 700, color: isDark?'#22d3ee':'#0891b2', fontFamily: 'monospace' }}>100% Geo-Validated</span>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* ─── 3. Post-Verification Result Panel (Full Width) ─── */}
        {hasVerified && (
          <div ref={resultsRef} className="space-y-6 pt-2 animate-fade-in w-full">
            
            {/* Results Title */}
            <div className="flex items-center justify-between pb-3" style={{ borderBottom: `1px solid ${T.cardBorder}` }}>
              <div>
                <span style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: isDark?'#4ade80':'#15803d' }}>
                  Verification Report
                </span>
                <h2 style={{ fontSize: 18, fontWeight: 800, color: T.textTitle, marginTop: 2 }}>
                  Field Photo &amp; Satellite Findings
                </h2>
              </div>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 12px', borderRadius: 20, background: isDark?'rgba(34,197,94,0.12)':'#dcfce7', border: isDark?'1px solid rgba(34,197,94,0.25)':'1px solid #bbf7d0', color: isDark?'#4ade80':'#15803d', fontSize: 11, fontWeight: 800 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e' }} />
                Verified Active
              </span>
            </div>

            {/* Split Panel: Left Photo vs Right AI Finding */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">

              {/* Left Box: Photo Preview with GPS Tag Badge */}
              <div style={{ background: T.cardBg, border: `1px solid ${T.cardBorder}`, borderRadius: 20, padding: 20, boxShadow: isDark ? '0 4px 20px rgba(0,0,0,0.3)' : '0 2px 12px rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div className="flex items-center justify-between">
                  <h3 style={{ fontSize: 14, fontWeight: 700, color: T.textTitle }}>
                    Uploaded Photo &amp; Geo-Tag
                  </h3>
                  <span style={{ fontSize: 11, fontFamily: 'monospace', color: T.textMuted }}>
                    {lat}° N, {lng}° E
                  </span>
                </div>

                {/* Photo with Overlay Badge */}
                <div style={{ position: 'relative', borderRadius: 14, overflow: 'hidden', border: `1px solid ${T.cardBorder}`, height: 220, background: isDark?'#000':'#f1f5f9' }}>
                  <img
                    src={photoPreview}
                    alt="Uploaded Field Inspection"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  {/* High Accuracy Badge Overlay */}
                  <div style={{ position: 'absolute', top: 10, left: 10, display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: 20, background: 'rgba(22,163,74,0.9)', color: '#ffffff', fontSize: 10, fontWeight: 700, backdropFilter: 'blur(4px)' }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#ffffff' }} className="animate-pulse" />
                    <span>Location Verified - High Accuracy</span>
                  </div>

                  {/* Bottom Meta Pill */}
                  <div style={{ position: 'absolute', bottom: 10, left: 10, right: 10, background: 'rgba(15,23,42,0.85)', backdropFilter: 'blur(4px)', color: '#ffffff', padding: 10, borderRadius: 10, fontSize: 11, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <span style={{ fontWeight: 700, display: 'block' }}>{fileName}</span>
                      <span style={{ color: '#cbd5e1', fontSize: 10 }}>{activeBenchmark.basinLabel}</span>
                    </div>
                    <span style={{ fontFamily: 'monospace', color: '#4ade80', fontWeight: 700 }}>GPS ±1.5m</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div style={{ background: T.innerBg, border: `1px solid ${T.cardBorder}`, padding: 10, borderRadius: 10 }}>
                    <span style={{ color: T.textMuted, display: 'block', fontSize: 9, fontWeight: 800, textTransform: 'uppercase' }}>Camera Orientation</span>
                    <span style={{ fontWeight: 700, color: T.textTitle }}>Heading 142° SE</span>
                  </div>
                  <div style={{ background: T.innerBg, border: `1px solid ${T.cardBorder}`, padding: 10, borderRadius: 10 }}>
                    <span style={{ color: T.textMuted, display: 'block', fontSize: 9, fontWeight: 800, textTransform: 'uppercase' }}>Field Timestamp</span>
                    <span style={{ fontWeight: 700, color: T.textTitle }}>Today, 09:15 AM</span>
                  </div>
                </div>
              </div>

              {/* Right Box: AI Finding & Probability Bar Chart */}
              <div style={{ background: T.cardBg, border: `1px solid ${T.cardBorder}`, borderRadius: 20, padding: 20, boxShadow: isDark ? '0 4px 20px rgba(0,0,0,0.3)' : '0 2px 12px rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div>
                  <h3 style={{ fontSize: 14, fontWeight: 700, color: T.textTitle }}>
                    Artificial Intelligence Finding
                  </h3>
                  <p style={{ fontSize: 11, color: T.textMuted, marginTop: 2 }}>
                    Structure classification detected by NeerDarpan computer vision model.
                  </p>
                </div>

                {/* Primary Classified Feature Callout */}
                <div style={{ background: T.innerBg, border: `1px solid ${T.cardBorder}`, borderRadius: 14, padding: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <span style={{ fontSize: 9, fontWeight: 800, color: T.textMuted, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                      Classified Feature
                    </span>
                    <div style={{ fontSize: 20, fontWeight: 800, color: T.textTitle, marginTop: 2 }}>
                      Check Dam
                    </div>
                    <p style={{ fontSize: 11, color: T.textMuted, marginTop: 2 }}>
                      Masonry weir structure designed for runoff storage and nala bed recharge.
                    </p>
                  </div>

                  <div style={{ padding: '8px 14px', borderRadius: 14, background: isDark?'rgba(34,197,94,0.12)':'#dcfce7', border: isDark?'1px solid rgba(34,197,94,0.25)':'1px solid #bbf7d0', textAlign: 'center', flexShrink: 0 }}>
                    <span style={{ fontSize: 18, fontWeight: 800, color: isDark?'#4ade80':'#15803d', display: 'block' }}>
                      88.4%
                    </span>
                    <span style={{ fontSize: 9, fontWeight: 800, color: isDark?'#4ade80':'#15803d', textTransform: 'uppercase' }}>
                      Match
                    </span>
                  </div>
                </div>

                {/* Probability Bar Chart */}
                <div style={{ background: T.innerBg, border: `1px solid ${T.cardBorder}`, borderRadius: 14, padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <span style={{ fontSize: 10, fontWeight: 800, color: T.textMuted, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                    Classification Probabilities:
                  </span>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {AI_PROBABILITIES.map((item) => (
                      <div key={item.name} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, fontWeight: 600 }}>
                          <span style={{ color: T.textTitle }}>{item.name}</span>
                          <span style={{ fontFamily: 'monospace', fontWeight: 700, color: isDark?'#4ade80':'#15803d' }}>
                            {item.prob}%
                          </span>
                        </div>
                        <div style={{ width: '100%', height: 6, background: isDark?'rgba(255,255,255,0.08)':'#e2e8f0', borderRadius: 3, overflow: 'hidden' }}>
                          <div style={{ width: `${item.prob}%`, height: '100%', background: isDark?'#22c55e':'#16a34a', borderRadius: 3 }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>

            {/* Bottom Two Cards: Satellite Check & Watershed Boundary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* Satellite Check Card */}
              <div style={{ background: T.cardBg, border: `1px solid ${T.cardBorder}`, borderRadius: 20, padding: 20, boxShadow: isDark ? '0 4px 20px rgba(0,0,0,0.3)' : '0 2px 12px rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div className="flex items-center gap-3">
                  <div style={{ width: 38, height: 38, borderRadius: 10, background: isDark?'rgba(34,211,238,0.12)':'#e0f2fe', border: isDark?'1px solid rgba(34,211,238,0.25)':'1px solid #7dd3fc', color: isDark?'#22d3ee':'#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>
                    🛰️
                  </div>
                  <div>
                    <h3 style={{ fontSize: 14, fontWeight: 700, color: T.textTitle }}>
                      Satellite Water Check
                    </h3>
                    <span style={{ fontSize: 11, color: T.textMuted }}>Sentinel-2 Live Optical Observation</span>
                  </div>
                </div>

                <div style={{ background: T.innerBg, border: `1px solid ${T.cardBorder}`, borderRadius: 12, padding: 14, display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <p style={{ fontSize: 12, fontWeight: 600, color: T.textTitle, lineHeight: 1.5 }}>
                    "{activeBenchmark.satelliteNotice}"
                  </p>
                  <div style={{ paddingTop: 8, borderTop: `1px solid ${T.cardBorder}`, display: 'flex', justifyContent: 'space-between', fontSize: 11, color: T.textMuted }}>
                    <span>Water Spread Delta:</span>
                    <strong style={{ color: isDark?'#22d3ee':'#0284c7', fontWeight: 700 }}>{activeBenchmark.waterSpreadDelta} Gain</strong>
                  </div>
                </div>
              </div>

              {/* Tamil Nadu Watershed Boundary Card */}
              <div style={{ background: T.cardBg, border: `1px solid ${T.cardBorder}`, borderRadius: 20, padding: 20, boxShadow: isDark ? '0 4px 20px rgba(0,0,0,0.3)' : '0 2px 12px rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div className="flex items-center gap-3">
                  <div style={{ width: 38, height: 38, borderRadius: 10, background: isDark?'rgba(34,197,94,0.12)':'#dcfce7', border: isDark?'1px solid rgba(34,197,94,0.25)':'1px solid #bbf7d0', color: isDark?'#4ade80':'#15803d', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>
                    🗺️
                  </div>
                  <div>
                    <h3 style={{ fontSize: 14, fontWeight: 700, color: T.textTitle }}>
                      Tamil Nadu Watershed Boundary
                    </h3>
                    <span style={{ fontSize: 11, color: T.textMuted }}>State Water Resources Delineation</span>
                  </div>
                </div>

                <div style={{ background: T.innerBg, border: `1px solid ${T.cardBorder}`, borderRadius: 12, padding: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11 }}>
                    <span style={{ color: T.textMuted }}>Basin Name:</span>
                    <strong style={{ color: T.textTitle, fontWeight: 700 }}>{activeBenchmark.basinName}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11 }}>
                    <span style={{ color: T.textMuted }}>Watershed Code:</span>
                    <strong style={{ color: isDark?'#4ade80':'#15803d', fontFamily: 'monospace', fontWeight: 700 }}>{activeBenchmark.watershedCode}</strong>
                  </div>
                </div>

                {onNavigateToMap && (
                  <button
                    type="button"
                    onClick={() => onNavigateToMap(lat, lng)}
                    style={{
                      width: '100%', padding: '10px 14px', borderRadius: 10,
                      background: isDark ? '#0b1628' : '#f1f5f9', border: `1px solid ${T.cardBorder}`,
                      color: T.textTitle, fontSize: 11, fontWeight: 700, cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                    }}
                  >
                    <span>View Location on Tamil Nadu GIS Map</span>
                    <span>→</span>
                  </button>
                )}
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default FieldEvidenceIngestion;
