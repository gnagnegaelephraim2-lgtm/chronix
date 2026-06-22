import React, { useState, useRef, useEffect } from 'react';
import type { Worker, ClockLog } from '../types';
import type { TFunction } from '../data/translations';
import { 
  Camera, 
  Search, 
  MapPin, 
  Lock, 
  X, 
  Fingerprint, 
  UserCheck, 
  Smile, 
  Briefcase 
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface KioskPortalProps {
  workers: Worker[];
  onClockAction: (
    workerId: string, 
    method: ClockLog['method']
  ) => { success: boolean; isClockIn: boolean; error?: string };
  t: TFunction;
}

export default function KioskPortal({ workers, onClockAction, t }: KioskPortalProps) {
  const [selectedDept, setSelectedDept] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedWorker, setSelectedWorker] = useState<Worker | null>(null);
  
  // Verification Modes: 'pin' | 'password' | 'face' | null
  const [verificationMode, setVerificationMode] = useState<'pin' | 'password' | 'face' | null>(null);
  const [pinValue, setPinValue] = useState<string>('');
  const [passwordValue, setPasswordValue] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');
  
  // Face ID scan simulation state
  const [faceScanState, setFaceScanState] = useState<'idle' | 'scanning' | 'success' | 'failed'>('idle');
  const [faceProgress, setFaceProgress] = useState<string>('');
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Live clock display
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  // Idle timer — reset kiosk after 60s of no interaction when a worker is selected
  const lastActivityRef = useRef<number>(Date.now());
  const trackActivity = () => { lastActivityRef.current = Date.now(); };

  // Departments list for filtering
  const departments = ['all', ...Array.from(new Set(workers.map(w => w.department))).filter(Boolean)];

  // Filtered workers list
  const filteredWorkers = workers.filter(w => {
    if (w.status !== 'active') return false;
    const matchDept = selectedDept === 'all' || w.department === selectedDept;
    const nameStr = `${w.name} ${w.surname}`.toLowerCase();
    const matchSearch = nameStr.includes(searchQuery.toLowerCase()) || w.passportOrNcid.toLowerCase().includes(searchQuery.toLowerCase());
    return matchDept && matchSearch;
  });

  // Numeric pad press handler
  const handlePinPress = (num: string) => {
    trackActivity();
    if (pinValue.length < 4) {
      const newVal = pinValue + num;
      setPinValue(newVal);
      if (newVal.length === 4) {
        handlePinSubmit(newVal);
      }
    }
  };

  const handlePinBackspace = () => {
    setPinValue(pinValue.slice(0, -1));
  };

  const handlePinClear = () => {
    setPinValue('');
  };

  // Check PIN clock action
  const handlePinSubmit = (pin: string) => {
    if (!selectedWorker) return;
    if (selectedWorker.pin === pin) {
      triggerSuccess(selectedWorker.id, 'kiosk_pin');
    } else {
      setErrorMsg(t('enterPin') + ' - Invalid');
      setPinValue('');
      // Vibrate if supported
      if (navigator.vibrate) navigator.vibrate(200);
    }
  };

  // Check password action
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    trackActivity();
    if (!selectedWorker) return;
    if (!selectedWorker.password) {
      setErrorMsg('No password set for this worker. Use PIN or Face ID instead.');
      setPasswordValue('');
      return;
    }
    if (passwordValue === selectedWorker.password) {
      triggerSuccess(selectedWorker.id, 'kiosk_password');
    } else {
      setErrorMsg('Invalid password. Please try again.');
      setPasswordValue('');
      if (navigator.vibrate) navigator.vibrate(200);
    }
  };

  // Start video stream for Face ID simulation
  const startCamera = async () => {
    try {
      setFaceScanState('scanning');
      setFaceProgress(t('faceScanning'));
      setErrorMsg('');

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 320, height: 240, facingMode: 'user' }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      // Simulate recognition pipeline
      setTimeout(() => {
        setFaceProgress(t('faceScanMatch'));
      }, 1500);

      setTimeout(() => {
        if (selectedWorker) {
          triggerSuccess(selectedWorker.id, 'kiosk_face');
        }
      }, 3000);

    } catch (e) {
      console.warn('Camera access denied or unavailable. Fallback to image avatar simulation.');
      // If camera fails, still show visual progress simulation
      setFaceProgress(t('faceScanning'));
      setTimeout(() => {
        setFaceProgress(t('faceScanMatch'));
      }, 1500);
      setTimeout(() => {
        if (selectedWorker) {
          triggerSuccess(selectedWorker.id, 'kiosk_face');
        }
      }, 3000);
    }
  };

  // Stop video stream
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  // Success flow
  const triggerSuccess = (workerId: string, method: ClockLog['method']) => {
    stopCamera();
    const res = onClockAction(workerId, method);
    if (res.success) {
      setFaceScanState('success');
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      // Give user 4s to read the VERIFIED screen before resetting
      setTimeout(() => resetKiosk(), 4000);
    } else {
      setErrorMsg(res.error || 'Clock operation failed.');
      setFaceScanState('failed');
    }
  };

  const resetKiosk = () => {
    stopCamera();
    setSelectedWorker(null);
    setVerificationMode(null);
    setPinValue('');
    setPasswordValue('');
    setFaceScanState('idle');
    setFaceProgress('');
    setErrorMsg('');
  };

  useEffect(() => {
    if (verificationMode === 'face') {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [verificationMode]);

  // Live clock ticker
  useEffect(() => {
    const ticker = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(ticker);
  }, []);

  // Idle auto-reset when a worker is selected but no interaction for 60s
  useEffect(() => {
    if (!selectedWorker) return;
    lastActivityRef.current = Date.now();
    const idleCheck = setInterval(() => {
      if (Date.now() - lastActivityRef.current > 60000) {
        stopCamera();
        setSelectedWorker(null);
        setVerificationMode(null);
        setPinValue('');
        setPasswordValue('');
        setFaceScanState('idle');
        setFaceProgress('');
        setErrorMsg('');
      }
    }, 5000);
    return () => clearInterval(idleCheck);
  }, [selectedWorker]);

  return (
    <div style={{ padding: '1rem', maxWidth: '1100px', margin: '0 auto' }} onClick={trackActivity}>
      <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 700 }}>{t('kioskSetup')}</h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>{t('kioskInstructions')}</p>
        </div>

        {/* Live Clock + Dept Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: '1.8rem', fontWeight: 800, fontFamily: 'monospace', color: 'var(--accent-primary)', lineHeight: 1 }}>
              {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </p>
            <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
              {currentTime.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </div>

        {/* Department Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Briefcase size={18} style={{ color: 'var(--accent-primary)' }} />
          <select 
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="form-input"
            style={{ width: 'auto', minWidth: '200px', padding: '0.6rem 1rem' }}
          >
            {departments.map(dept => (
              <option key={dept} value={dept}>
                {dept === 'all' ? t('allDepartments') : dept}
              </option>
            ))}
          </select>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: selectedWorker ? '1fr' : '1fr 340px', gap: '2rem' }}>
        
        {/* Main interactive workflow */}
        {selectedWorker ? (
          <div className="glass-panel" style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
            <button 
              onClick={resetKiosk}
              style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
            >
              <X size={24} />
            </button>

            {/* Selected worker preview banner */}
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'var(--accent-primary-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', border: '2px solid var(--accent-primary)', overflow: 'hidden' }}>
                {selectedWorker.avatar ? (
                  <img src={selectedWorker.avatar} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <Smile size={40} style={{ color: 'var(--accent-primary)', margin: 'auto' }} />
                )}
              </div>
              <h3 style={{ fontSize: '1.5rem' }}>{selectedWorker.name} {selectedWorker.surname}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
                {selectedWorker.department} | {selectedWorker.passportOrNcid}
              </p>
            </div>

            {/* Step: Choose method */}
            {!verificationMode && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%', maxWidth: '350px' }}>
                <button onClick={() => setVerificationMode('face')} className="btn btn-primary" style={{ height: '54px', fontSize: '1rem' }}>
                  <Camera size={20} /> {t('faceVerify')}
                </button>
                <button onClick={() => setVerificationMode('pin')} className="btn btn-outline" style={{ height: '54px', fontSize: '1rem' }}>
                  <Fingerprint size={20} /> {t('pinVerify')}
                </button>
                <button onClick={() => setVerificationMode('password')} className="btn btn-outline" style={{ height: '54px', fontSize: '1rem' }}>
                  <Lock size={20} /> {t('passwordVerify')}
                </button>
              </div>
            )}

            {/* Error notifications */}
            {errorMsg && (
              <div className="badge badge-danger" style={{ marginBottom: '1.5rem', padding: '0.6rem 1.2rem', fontSize: '0.9rem' }}>
                {errorMsg}
              </div>
            )}

            {/* Method 1: PIN Pad */}
            {verificationMode === 'pin' && (
              <div style={{ width: '100%', maxWidth: '320px', textAlign: 'center' }}>
                <h4 style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>{t('enterPin')}</h4>
                
                {/* Dots indicator */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                  {[0, 1, 2, 3].map(idx => (
                    <div 
                      key={idx}
                      style={{
                        width: '18px',
                        height: '18px',
                        borderRadius: '50%',
                        backgroundColor: pinValue.length > idx ? 'var(--accent-primary)' : 'rgba(255, 255, 255, 0.1)',
                        border: '2px solid',
                        borderColor: pinValue.length > idx ? 'var(--accent-primary)' : 'var(--border-color)',
                        transition: 'var(--transition-smooth)'
                      }}
                    />
                  ))}
                </div>

                {/* Keypad Grid */}
                <div className="pin-grid">
                  {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(num => (
                    <button key={num} onClick={() => handlePinPress(num)} className="pin-btn">
                      {num}
                    </button>
                  ))}
                  <button onClick={handlePinClear} className="pin-btn" style={{ fontSize: '1rem', color: 'var(--accent-danger)' }}>
                    C
                  </button>
                  <button onClick={() => handlePinPress('0')} className="pin-btn">
                    0
                  </button>
                  <button onClick={handlePinBackspace} className="pin-btn" style={{ fontSize: '1rem' }}>
                    ⌫
                  </button>
                </div>
              </div>
            )}

            {/* Method 2: Password */}
            {verificationMode === 'password' && (
              <form onSubmit={handlePasswordSubmit} style={{ width: '100%', maxWidth: '350px' }}>
                <div className="form-group">
                  <label>{t('enterPassword')}</label>
                  <input 
                    type="password"
                    value={passwordValue}
                    onChange={(e) => setPasswordValue(e.target.value)}
                    className="form-input"
                    placeholder="••••••••"
                    required
                    autoFocus
                  />
                </div>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                  <button type="button" onClick={() => setVerificationMode(null)} className="btn btn-outline" style={{ flex: 1 }}>
                    {t('cancel')}
                  </button>
                  <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                    {t('submit')}
                  </button>
                </div>
              </form>
            )}

            {/* Method 3: Face ID Simulator */}
            {verificationMode === 'face' && (
              <div style={{ textAlign: 'center', width: '100%', maxWidth: '360px' }}>
                <div 
                  style={{
                    position: 'relative',
                    width: '280px',
                    height: '240px',
                    margin: '0 auto 1.5rem',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    background: '#090d16',
                    border: '3px solid var(--accent-primary-glow)',
                    boxShadow: '0 0 20px var(--accent-primary-glow)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {/* Glowing scan target corners */}
                  <div style={{ position: 'absolute', top: 12, left: 12, width: 20, height: 20, borderTop: '3px solid #10b981', borderLeft: '3px solid #10b981' }} />
                  <div style={{ position: 'absolute', top: 12, right: 12, width: 20, height: 20, borderTop: '3px solid #10b981', borderRight: '3px solid #10b981' }} />
                  <div style={{ position: 'absolute', bottom: 12, left: 12, width: 20, height: 20, borderBottom: '3px solid #10b981', borderLeft: '3px solid #10b981' }} />
                  <div style={{ position: 'absolute', bottom: 12, right: 12, width: 20, height: 20, borderBottom: '3px solid #10b981', borderRight: '3px solid #10b981' }} />

                  {/* Scanning Animation lines */}
                  {faceScanState === 'scanning' && <div className="face-scan-line" />}

                  {/* HTML5 video element or avatar mockup */}
                  <video 
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      display: streamRef.current ? 'block' : 'none'
                    }}
                  />

                  {/* Fallback avatar matching view when camera stream is disabled/denied */}
                  {!streamRef.current && (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                      {selectedWorker.avatar ? (
                        <img 
                          src={selectedWorker.avatar} 
                          alt="Matching" 
                          style={{
                            width: '120px',
                            height: '120px',
                            borderRadius: '50%',
                            objectFit: 'cover',
                            border: '4px solid var(--accent-secondary)'
                          }}
                        />
                      ) : (
                        <Smile size={80} style={{ color: 'var(--text-muted)' }} />
                      )}
                    </div>
                  )}

                  {/* Large Status Overlays */}
                  {faceScanState === 'success' && (
                    <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(16, 185, 129, 0.9)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>
                      <UserCheck size={64} style={{ color: '#fff' }} />
                      <h4 style={{ color: '#fff', fontSize: '1.4rem', marginTop: '0.5rem', fontWeight: 'bold' }}>VERIFIED</h4>
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                  <p style={{ fontWeight: 600, color: faceScanState === 'failed' ? 'var(--accent-danger)' : 'var(--text-primary)' }}>
                    {faceProgress}
                  </p>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {faceScanState === 'scanning' ? 'Verifying biometric points...' : ''}
                  </span>
                </div>

                <button 
                  onClick={() => setVerificationMode(null)}
                  className="btn btn-outline" 
                  style={{ marginTop: '1.5rem', width: '100%' }}
                >
                  {t('cancel')}
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Search & Select worker lists */
          <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="glass-panel" style={{ padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Search size={20} style={{ color: 'var(--text-muted)' }} />
                <input 
                  type="text"
                  placeholder={t('searchWorker')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    flex: 1,
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    color: 'var(--text-primary)',
                    fontSize: '1.05rem',
                    fontFamily: 'var(--font-body)'
                  }}
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
                  >
                    <X size={18} />
                  </button>
                )}
              </div>

              {/* Workers Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', maxHeight: '500px', overflowY: 'auto', paddingRight: '0.5rem' }}>
                {filteredWorkers.map(w => (
                  <div 
                    key={w.id} 
                    onClick={() => setSelectedWorker(w)}
                    className="glass-panel"
                    style={{
                      padding: '1.25rem',
                      textAlign: 'center',
                      cursor: 'pointer',
                      border: '1px solid var(--border-color)',
                    }}
                  >
                    <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                      {w.avatar ? (
                        <img src={w.avatar} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <Smile size={28} style={{ color: 'var(--text-muted)' }} />
                      )}
                    </div>
                    <h4 style={{ fontSize: '1rem', fontWeight: 600 }}>{w.name} {w.surname}</h4>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '0.2rem' }}>
                      {w.department}
                    </p>
                  </div>
                ))}

                {filteredWorkers.length === 0 && (
                  <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
                    No active employees found matching criteria.
                  </div>
                )}
              </div>
            </div>

            {/* Quick terminal status card on right side */}
            <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: 'fit-content' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <MapPin size={18} style={{ color: 'var(--accent-primary)' }} />
                  {t('siteLocation')}
                </h3>
                <div style={{ padding: '1rem', background: 'rgba(0,0,0,0.2)', borderRadius: '10px', fontSize: '0.85rem' }}>
                  <p style={{ fontWeight: 600 }}>Mauritius Headquarters</p>
                  <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>Kiosk Station #1 - Front Gate</p>
                </div>
              </div>

              <div style={{ marginTop: '2rem' }}>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Hardware Status: Active
                </p>
                <div style={{ width: '100%', height: '4px', background: 'var(--accent-secondary)', borderRadius: '2px', marginTop: '0.5rem' }} />
              </div>
            </div>
          </>
        )}

      </div>
    </div>
  );
}
