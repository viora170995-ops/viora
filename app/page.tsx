'use client';

import { useState, useEffect, useRef } from 'react';

export default function Home() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [animated, setAnimated] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const resultsRef = useRef<HTMLDivElement>(null);

  const loadingSteps = [
    'Scanning website structure...',
    'Identifying conversion blockers...',
    'Measuring business impact...',
    'Finding quick wins...',
    'Building your priority list...',
    'Finalizing your diagnosis...',
  ];

  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    const style = document.createElement('style');
    style.textContent = `
      @keyframes float { 0%,100%{transform:translateY(0px);}50%{transform:translateY(-8px);} }
      @keyframes pulse-ring { 0%,100%{opacity:1;}50%{opacity:0.5;} }
      @keyframes shimmer { 0%,100%{opacity:0.6;}50%{opacity:1;} }
      @property --angle { syntax:'<angle>'; initial-value:0deg; inherits:false; }
      @keyframes border-spin { 0%{--angle:0deg;}100%{--angle:360deg;} }
      @keyframes bounce { 0%,100%{transform:translateY(0);}50%{transform:translateY(6px);} }
      @keyframes fade-in { from{opacity:0;transform:translateY(16px);}to{opacity:1;transform:translateY(0);} }
      @keyframes step-pulse { 0%,100%{opacity:0.4;}50%{opacity:1;} }
      @keyframes glow { 0%,100%{box-shadow:0 0 20px rgba(212,170,74,0.1);}50%{box-shadow:0 0 40px rgba(212,170,74,0.25);} }
      .card-float {
        animation: float 4s ease-in-out infinite, border-spin 3s linear infinite;
        border: 1.5px solid transparent !important;
        background-image: linear-gradient(#080512,#080512), conic-gradient(from var(--angle),transparent 70%,rgba(212,170,74,0.8) 85%,#d4aa4a 90%,rgba(212,170,74,0.8) 95%,transparent 100%);
        background-origin: border-box;
        background-clip: padding-box, border-box;
      }
      .card-loading {
        border: 1.5px solid transparent !important;
        background-image: linear-gradient(#080512,#080512), conic-gradient(from var(--angle),transparent 60%,rgba(155,109,224,0.9) 80%,#9b6de0 90%,rgba(155,109,224,0.9) 95%,transparent 100%);
        background-origin: border-box;
        background-clip: padding-box, border-box;
        animation: border-spin 1.5s linear infinite;
      }
      .ring-pulse { animation: pulse-ring 3s ease-in-out infinite; }
      .shimmer { animation: shimmer 2.5s ease-in-out infinite; }
      .bounce-arrow { animation: bounce 1.2s ease-in-out infinite; }
      .fade-in { animation: fade-in 0.6s ease forwards; }
      .step-pulse { animation: step-pulse 1.5s ease-in-out infinite; }
      .glow-btn { animation: glow 2.5s ease-in-out infinite; }
      * { box-sizing:border-box; margin:0; padding:0; }
      body { background:#050308; }

      .hero-grid { display:grid; grid-template-columns:1fr 320px; align-items:center; gap:3%; }
      .covers-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:16px; }
      .how-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:48px; }
      .results-grid { display:grid; grid-template-columns:repeat(5,1fr); gap:14px; }
      .pricing-grid { display:grid; grid-template-columns:1fr 1.08fr 1fr; gap:16px; max-width:780px; margin:0 auto; }
      .stats-grid { display:grid; grid-template-columns:repeat(4,1fr); }
      .what-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:16px; }
      .priority-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:14px; }

      @media (max-width:900px) {
        .hero-grid { grid-template-columns:1fr; }
        .score-card-wrap { margin-top:32px; }
        .covers-grid { grid-template-columns:repeat(2,1fr); }
        .how-grid { grid-template-columns:1fr; gap:32px; }
        .results-grid { grid-template-columns:repeat(2,1fr); }
        .pricing-grid { grid-template-columns:1fr !important; max-width:420px !important; }
        .stats-grid { grid-template-columns:repeat(2,1fr); }
        .what-grid { grid-template-columns:repeat(2,1fr); }
        .priority-grid { grid-template-columns:1fr; }
      }
      @media (max-width:600px) {
        .hero-section { padding:40px 5% 48px !important; }
        .section-pad { padding:44px 5% !important; }
        .cta-btns { flex-direction:column !important; align-items:stretch !important; }
        .cta-btns button, .cta-btns a { width:100% !important; text-align:center; }
        .what-grid { grid-template-columns:1fr; }
        .results-grid { grid-template-columns:1fr; }
        .card-inner-svg { width:110px !important; height:110px !important; }
      }
    `;
    document.head.appendChild(style);
    setTimeout(() => setAnimated(true), 400);
  }, []);

  useEffect(() => {
    let interval: any;
    if (loading) {
      setLoadingStep(0);
      interval = setInterval(() => {
        setLoadingStep(prev => prev < loadingSteps.length - 1 ? prev + 1 : prev);
      }, 1200);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const analyzeWebsite = async () => {
    if (!url) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      setResult(data);
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 300);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const handleCheckout = async (priceId: string) => {
    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ priceId, url }),
    });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
  };

  const serif = "'DM Serif Display', serif";
  const sans = "'DM Sans', sans-serif";

  const IcoPerf = ({ size=22, color='#e0d0f8' }: any) => <svg width={size} height={size} viewBox="0 0 22 22" fill="none"><circle cx="11" cy="11" r="9" stroke={color} strokeWidth="1.4"/><path d="M11 7v4l3 1.5" stroke={color} strokeWidth="1.4" strokeLinecap="round"/></svg>;
  const IcoSEO = ({ size=22, color='#e0d0f8' }: any) => <svg width={size} height={size} viewBox="0 0 22 22" fill="none"><circle cx="10" cy="10" r="6" stroke={color} strokeWidth="1.4"/><path d="M14.5 14.5l4 4" stroke={color} strokeWidth="1.4" strokeLinecap="round"/></svg>;
  const IcoUX = ({ size=22, color='#e0d0f8' }: any) => <svg width={size} height={size} viewBox="0 0 22 22" fill="none"><rect x="2" y="3" width="18" height="12" rx="2" stroke={color} strokeWidth="1.4"/><path d="M8 19h6M11 15v4" stroke={color} strokeWidth="1.4" strokeLinecap="round"/></svg>;
  const IcoContent = ({ size=22, color='#e0d0f8' }: any) => <svg width={size} height={size} viewBox="0 0 22 22" fill="none"><path d="M4 6h14M4 10h10M4 14h12" stroke={color} strokeWidth="1.4" strokeLinecap="round"/></svg>;
  const IcoAccess = ({ size=22, color='#e0d0f8' }: any) => <svg width={size} height={size} viewBox="0 0 22 22" fill="none"><circle cx="11" cy="6" r="2" stroke={color} strokeWidth="1.4"/><path d="M6 10h10M9 10v8M13 10v8" stroke={color} strokeWidth="1.4" strokeLinecap="round"/></svg>;
  const IcoURL = () => <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><circle cx="11" cy="11" r="8" stroke="#e0d0f8" strokeWidth="1.3"/><path d="M3 11h16M11 3c-2.5 2-4 5-4 8s1.5 6 4 8M11 3c2.5 2 4 5 4 8s-1.5 6-4 8" stroke="#e0d0f8" strokeWidth="1.3"/></svg>;
  const IcoAI = () => <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><rect x="3" y="3" width="16" height="16" rx="3" stroke="#e0d0f8" strokeWidth="1.3"/><path d="M8 11h6M11 8v6" stroke="#e0d0f8" strokeWidth="1.3" strokeLinecap="round"/></svg>;
  const IcoReport = () => <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M7 2h8l5 5v13a1 1 0 01-1 1H3a1 1 0 01-1-1V3a1 1 0 011-1z" stroke="#e0d0f8" strokeWidth="1.3"/><path d="M7 9h8M7 13h5" stroke="#e0d0f8" strokeWidth="1.3" strokeLinecap="round"/></svg>;
  const IcoAlert = ({ color='#e24b4a' }: any) => <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M9 2L16 15H2L9 2Z" stroke={color} strokeWidth="1.3" strokeLinejoin="round"/><path d="M9 7v4M9 13v.5" stroke={color} strokeWidth="1.3" strokeLinecap="round"/></svg>;
  const IcoTrend = ({ color='#d4aa4a' }: any) => <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M2 13l5-5 3 3 6-7" stroke={color} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/><path d="M12 4h4v4" stroke={color} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>;
  const IcoFix = () => <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M14 4l-8 8M9 4H4v5" stroke="#9b6de0" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/><circle cx="13" cy="13" r="3" stroke="#9b6de0" strokeWidth="1.3"/></svg>;

  const scoreCategories = [
    { key: 'UX', label: 'UX & Navigation', icon: IcoUX, color: '#9b6de0', business: 'Conversion Flow' },
    { key: 'SEO', label: 'SEO & Visibility', icon: IcoSEO, color: '#d4aa4a', business: 'Traffic & Discovery' },
    { key: 'Performance', label: 'Speed & Performance', icon: IcoPerf, color: '#4a90d9', business: 'User Retention' },
    { key: 'Accessibility', label: 'Accessibility', icon: IcoAccess, color: '#4ab090', business: 'Reach & Inclusion' },
    { key: 'Content', label: 'Content & Messaging', icon: IcoContent, color: '#e07060', business: 'Trust & Clarity' },
  ];

  const demoBars = [
    { label: 'Conversion Flow', color: '#9b6de0', key: 'UX', demo: 82 },
    { label: 'Traffic & Discovery', color: '#d4aa4a', key: 'SEO', demo: 78 },
    { label: 'Speed & Retention', color: '#4a90d9', key: 'Performance', demo: 65 },
    { label: 'Trust & Clarity', color: '#e07060', key: 'Content', demo: 71 },
  ];

  const plans = [
    {
      type: 'Free', price: '$0', sub: 'Instant diagnosis',
      items: ['Overall health score', 'Top 3 conversion blockers', '5 category scores', 'Priority fix #1'],
      featured: false, priceId: '', btn: 'Get Free Diagnosis',
    },
    {
      type: 'Full Report', price: '$9', sub: 'One-time — no subscription',
      items: ['Everything in Free', '20+ conversion blockers', 'Estimated business impact', 'Full priority action plan', 'PDF download'],
      featured: true, priceId: 'price_1TR656HTnbJKvHmtIl9J0vS0', btn: 'Get Full Report — $9',
    },
    {
      type: 'Fix It With Farah', price: '$149', sub: 'Done with you',
      items: ['Full Report included', '60-min strategy session', 'Custom fix roadmap', 'Implementation guidance', 'Session recording'],
      featured: false, priceId: 'price_1TR68lHTnbJKvHmtpPwjXTIG', btn: 'Book Strategy Session',
    },
  ];

  const CIRC = 377;
  const uxScore = result?.scores?.UX ?? (animated ? 72 : 0);
  const ringOffset = CIRC - (uxScore / 100) * CIRC;
  const getScoreColor = (s: number) => s >= 80 ? '#4ab090' : s >= 60 ? '#d4aa4a' : '#e24b4a';
  const getScoreLabel = (s: number) => s >= 80 ? 'Good' : s >= 60 ? 'Needs Attention' : 'Critical';
  const getImpact = (s: number) => s >= 80 ? 'Low impact' : s >= 60 ? `~${100 - s}% drop-off risk` : `~${110 - s}% conversion loss`;

  const ScoreCard = ({ isLoading }: { isLoading: boolean }) => (
    <div className={isLoading ? 'card-loading' : 'card-float'}
      style={{ borderRadius: 16, padding: '28px 24px 24px', position: 'relative', zIndex: 1, minHeight: isLoading ? 380 : 'auto' }}>
      {isLoading ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 340 }}>
          <div style={{ position: 'relative', marginBottom: 28 }}>
            <svg width="120" height="120" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="50" fill="none" stroke="#0c0818" strokeWidth="6"/>
              <circle cx="60" cy="60" r="50" fill="none" stroke="#9b6de0" strokeWidth="6"
                strokeDasharray="314"
                strokeDashoffset={314 - (((loadingStep + 1) / loadingSteps.length) * 314)}
                strokeLinecap="round" transform="rotate(-90 60 60)"
                style={{ transition: 'stroke-dashoffset 1s cubic-bezier(0.4,0,0.2,1)' }}/>
            </svg>
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', textAlign: 'center' }}>
              <div style={{ fontFamily: serif, fontSize: 28, color: '#f0e8ff', lineHeight: 1 }}>
                {Math.round(((loadingStep + 1) / loadingSteps.length) * 100)}%
              </div>
            </div>
          </div>
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {loadingSteps.map((step, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, opacity: i <= loadingStep ? 1 : 0.25, transition: 'opacity 0.4s ease' }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: i < loadingStep ? '#4ab090' : i === loadingStep ? '#9b6de0' : '#2a1e3e', flexShrink: 0 }} />
                <span style={{ fontSize: 11, color: i < loadingStep ? '#4ab090' : i === loadingStep ? '#c0b0d8' : '#3a2e52' }}>{step}</span>
                {i === loadingStep && <span className="step-pulse" style={{ fontSize: 10, color: '#9b6de0', marginLeft: 'auto' }}>●</span>}
                {i < loadingStep && <span style={{ fontSize: 10, color: '#4ab090', marginLeft: 'auto' }}>✓</span>}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <>
          <div style={{ position: 'absolute', top: -12, right: 16, background: '#d4aa4a', color: '#050308', fontSize: 9, fontWeight: 600, padding: '4px 14px', borderRadius: 99, letterSpacing: '0.08em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
            Site Health Score
          </div>
          <div style={{ fontSize: 10, color: '#7a6898', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 18, fontWeight: 500 }}>Conversion Diagnosis</div>
          <div style={{ display: 'flex', justifyContent: 'center', position: 'relative', marginBottom: 20 }}>
            <svg className="card-inner-svg" width="150" height="150" viewBox="0 0 150 150">
              <circle cx="75" cy="75" r="60" fill="none" stroke="#0c0818" strokeWidth="8"/>
              <circle className="ring-pulse" cx="75" cy="75" r="60" fill="none" stroke="#9b6de0" strokeWidth="8"
                strokeDasharray={CIRC} strokeDashoffset={ringOffset}
                strokeLinecap="round" transform="rotate(-90 75 75)"
                style={{ transition: 'stroke-dashoffset 1.5s cubic-bezier(0.4,0,0.2,1)' }}/>
            </svg>
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', textAlign: 'center' }}>
              <div style={{ fontFamily: serif, fontSize: 48, color: '#f0e8ff', lineHeight: 1 }}>{uxScore}</div>
              <div style={{ fontSize: 10, color: '#6a5888', marginTop: 3 }}>out of 100</div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
            {demoBars.map(({ label, color, key, demo }) => {
              const val = result?.scores?.[key] ?? (animated ? demo : 0);
              return (
                <div key={key}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#c0b0d8', marginBottom: 4, fontWeight: 500 }}>
                    <span>{label}</span><span style={{ color: getScoreColor(val) }}>{val}</span>
                  </div>
                  <div style={{ height: 5, background: '#0c0818', borderRadius: 99, overflow: 'hidden' }}>
                    <div style={{ height: '100%', background: color, borderRadius: 99, width: `${val}%`, transition: 'width 1.5s cubic-bezier(0.4,0,0.2,1)' }}/>
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{ marginTop: 16, background: 'rgba(212,170,74,0.06)', border: '0.5px solid rgba(212,170,74,0.2)', borderRadius: 8, padding: '10px 12px' }}>
            <div style={{ fontSize: 10, color: '#d4aa4a', fontWeight: 500, marginBottom: 3 }}>⚡ Estimated monthly impact</div>
            <div style={{ fontSize: 11, color: '#8a78a8' }}>Fixing top issues could recover 15–30% of lost conversions</div>
          </div>
        </>
      )}
    </div>
  );

  return (
    <main style={{ fontFamily: sans, background: '#050308', color: '#f0e8ff', minHeight: '100vh' }}>

      {/* NAV */}
      <nav style={{ background: '#050308', borderBottom: '0.5px solid rgba(212,170,74,0.12)', padding: '14px 6%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontFamily: serif, fontSize: 26, letterSpacing: '0.06em', lineHeight: 1.1, background: 'linear-gradient(135deg, #f0e8ff 30%, #d4aa4a 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            Viora
          </div>
          <div style={{ fontSize: 9, color: '#5a4878', letterSpacing: '0.22em', textTransform: 'uppercase' }}>by Farah</div>
        </div>
        <button
          onClick={() => handleCheckout('price_1TR68lHTnbJKvHmtpPwjXTIG')}
          style={{ background: '#d4aa4a', color: '#050308', border: 'none', borderRadius: 5, padding: '8px 18px', fontSize: 12, fontWeight: 500, cursor: 'pointer', fontFamily: sans }}>
          Fix It With Farah →
        </button>
      </nav>

      {/* HERO */}
      <section className="hero-section" style={{ background: '#080512', padding: '72px 6%', borderBottom: '0.5px solid rgba(212,170,74,0.08)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 10% 55%, rgba(155,109,224,0.1) 0%, transparent 58%)', pointerEvents: 'none' }} />
        <div className="hero-grid">
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div className="shimmer" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(226,75,74,0.1)', border: '0.5px solid rgba(226,75,74,0.3)', color: '#f09595', fontSize: 10, fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', padding: '5px 14px', borderRadius: 99, marginBottom: 24 }}>
              <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#e24b4a' }} />
              Your website is losing customers right now
            </div>

            <h1 style={{ fontFamily: serif, fontSize: 'clamp(30px, 3.4vw, 52px)', fontWeight: 400, lineHeight: 1.08, color: '#f0e8ff', marginBottom: 16 }}>
              Find out why your<br />website isn't<br />
              <em style={{ fontStyle: 'italic', color: '#d4aa4a' }}>converting visitors.</em>
            </h1>

            <p style={{ fontSize: 16, color: '#a090c0', lineHeight: 1.75, marginBottom: 8, maxWidth: 460, fontWeight: 300 }}>
              Get your top conversion blockers, estimated business impact, and a clear priority list — in under 60 seconds.
            </p>
            <p style={{ fontSize: 13, color: '#5a4878', marginBottom: 28, fontFamily: serif, fontStyle: 'italic' }}>
              No signup required. No fluff. Just what's costing you customers.
            </p>

            <div style={{ display: 'flex', background: '#050308', border: '1.5px solid #2a1e3e', borderRadius: 10, overflow: 'hidden', maxWidth: 480, marginBottom: 12 }}>
              <input type="text" value={url}
                onChange={e => setUrl(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && analyzeWebsite()}
                placeholder="https://yourwebsite.com"
                style={{ flex: 1, background: 'none', border: 'none', outline: 'none', padding: '14px 18px', fontSize: 14, color: '#c0b0d8', fontFamily: sans }} />
              <button onClick={analyzeWebsite} disabled={loading}
                className="glow-btn"
                style={{ background: '#d4aa4a', color: '#050308', border: 'none', padding: '0 24px', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: sans, whiteSpace: 'nowrap', opacity: loading ? 0.8 : 1 }}>
                {loading ? 'Analyzing...' : 'Diagnose My Site →'}
              </button>
            </div>

            <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap', marginBottom: 32 }}>
              {['Free — no credit card', 'Results in 60 seconds', 'No account needed'].map((m, i) => (
                <span key={i} style={{ fontSize: 11, color: '#4a3860', display: 'flex', alignItems: 'center', gap: 5 }}>
                  <span style={{ color: '#4ab090' }}>✓</span> {m}
                </span>
              ))}
            </div>

            {/* Social proof */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', background: 'rgba(155,109,224,0.06)', border: '0.5px solid rgba(155,109,224,0.15)', borderRadius: 10, maxWidth: 420 }}>
              <div style={{ display: 'flex' }}>
                {['#9b6de0','#d4aa4a','#4ab090'].map((c, i) => (
                  <div key={i} style={{ width: 26, height: 26, borderRadius: '50%', background: c, border: '2px solid #080512', marginLeft: i > 0 ? -8 : 0, opacity: 0.9 }} />
                ))}
              </div>
              <div>
                <div style={{ fontSize: 12, color: '#c0b0d8', fontWeight: 500 }}>Trusted by business owners & marketers</div>
                <div style={{ fontSize: 11, color: '#5a4878' }}>Using Viora to recover lost conversions</div>
              </div>
            </div>
          </div>

          {/* CARD */}
          <div className="score-card-wrap">
            <ScoreCard isLoading={loading} />
          </div>
        </div>
      </section>

      {/* SCROLL HINT */}
      {result && (
        <div className="fade-in" style={{ background: '#080512', padding: '14px', textAlign: 'center', borderBottom: '0.5px solid rgba(155,109,224,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
          <span style={{ fontSize: 13, color: '#9b6de0', fontWeight: 500 }}>✨ Diagnosis complete — scroll down to see your conversion blockers</span>
          <div className="bounce-arrow" style={{ color: '#9b6de0', fontSize: 16 }}>↓</div>
        </div>
      )}

      {/* RESULTS */}
      {result && (
        <section ref={resultsRef} className="fade-in section-pad" style={{ background: '#0c0818', padding: '52px 6%', borderBottom: '0.5px solid rgba(255,255,255,0.03)' }}>

          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <div style={{ display: 'inline-block', background: 'rgba(226,75,74,0.1)', border: '0.5px solid rgba(226,75,74,0.3)', color: '#f09595', fontSize: 10, fontWeight: 500, padding: '4px 14px', borderRadius: 99, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>
              Conversion Diagnosis
            </div>
            <h2 style={{ fontFamily: serif, fontSize: 'clamp(22px,2.5vw,30px)', color: '#f0e8ff', marginBottom: 6 }}>
              Here's what's costing you customers
            </h2>
            <p style={{ color: '#6a5888', fontSize: 13 }}>{url}</p>
          </div>

          {/* Score cards */}
          <div className="results-grid" style={{ marginBottom: 32 }}>
            {scoreCategories.map(({ key, label, icon: Icon, color, business }) => {
              const score = result?.scores?.[key] ?? 0;
              const scoreColor = getScoreColor(score);
              const scoreLabel = getScoreLabel(score);
              const impact = getImpact(score);
              const catData = result?.categories?.[key];
              const circ = 2 * Math.PI * 28;
              const off = circ - (score / 100) * circ;
              return (
                <div key={key} className="fade-in" style={{ background: '#080512', border: `0.5px solid ${color}30`, borderRadius: 14, padding: '20px 16px', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: color, opacity: 0.7 }} />
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                    <Icon size={16} color={color}/>
                    <div style={{ background: `${scoreColor}18`, border: `0.5px solid ${scoreColor}50`, color: scoreColor, fontSize: 9, fontWeight: 600, padding: '2px 8px', borderRadius: 99 }}>
                      {scoreLabel}
                    </div>
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 500, color: '#f0e8ff', marginBottom: 3 }}>{label}</div>
                  <div style={{ fontSize: 10, color: '#5a4878', marginBottom: 12 }}>{business}</div>

                  <div style={{ display: 'flex', justifyContent: 'center', position: 'relative', marginBottom: 12 }}>
                    <svg width="80" height="80" viewBox="0 0 80 80">
                      <circle cx="40" cy="40" r="28" fill="none" stroke="#0c0818" strokeWidth="5"/>
                      <circle cx="40" cy="40" r="28" fill="none" stroke={color} strokeWidth="5"
                        strokeDasharray={circ} strokeDashoffset={off}
                        strokeLinecap="round" transform="rotate(-90 40 40)"
                        style={{ transition: 'stroke-dashoffset 1.5s cubic-bezier(0.4,0,0.2,1)' }}/>
                    </svg>
                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', textAlign: 'center' }}>
                      <div style={{ fontFamily: serif, fontSize: 24, color: '#f0e8ff', lineHeight: 1 }}>{score}</div>
                      <div style={{ fontSize: 8, color: '#4a3860', marginTop: 1 }}>/100</div>
                    </div>
                  </div>

                  {/* Impact badge */}
                  <div style={{ background: `${scoreColor}10`, borderRadius: 6, padding: '5px 8px', marginBottom: 10, textAlign: 'center' }}>
                    <span style={{ fontSize: 10, color: scoreColor, fontWeight: 500 }}>{impact}</span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                    {catData?.positives?.slice(0, 1).map((p: string, j: number) => (
                      <div key={j} style={{ display: 'flex', gap: 5, alignItems: 'flex-start' }}>
                        <span style={{ color: '#4ab090', fontSize: 9, flexShrink: 0, marginTop: 2 }}>✓</span>
                        <span style={{ fontSize: 10, color: '#4ab090', lineHeight: 1.5, opacity: 0.8 }}>{p}</span>
                      </div>
                    ))}
                    {catData?.negatives?.slice(0, 3).map((n: string, j: number) => (
                      <div key={j} style={{ display: 'flex', gap: 5, alignItems: 'flex-start' }}>
                        <span style={{ color: '#e24b4a', fontSize: 9, flexShrink: 0, marginTop: 2 }}>✕</span>
                        <span style={{ fontSize: 10, color: '#8a78a8', lineHeight: 1.5 }}>{n}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Priority fixes preview */}
          {result?.issues && (
            <div style={{ background: '#080512', border: '0.5px solid #2a1e3e', borderRadius: 14, padding: '24px', marginBottom: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <div>
                  <div style={{ fontSize: 11, color: '#8a78a8', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 500 }}>Top Conversion Blockers</div>
                  <div style={{ fontSize: 12, color: '#4a3860', marginTop: 2 }}>Fix these first for maximum impact</div>
                </div>
                <div style={{ fontSize: 10, color: '#5a4878', background: '#0c0818', border: '0.5px solid #1a1430', borderRadius: 99, padding: '4px 10px' }}>
                  {result.issues.length} issues found
                </div>
              </div>
              <div className="priority-grid">
                {result.issues.slice(0, 3).map((issue: any, i: number) => (
                  <div key={i} style={{ background: '#0c0818', border: `0.5px solid ${issue.level === 'high' ? 'rgba(226,75,74,0.3)' : issue.level === 'med' ? 'rgba(212,170,74,0.3)' : 'rgba(74,176,144,0.3)'}`, borderRadius: 10, padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                      <div style={{ background: issue.level === 'high' ? 'rgba(226,75,74,0.15)' : issue.level === 'med' ? 'rgba(212,170,74,0.15)' : 'rgba(74,176,144,0.15)', borderRadius: 6, padding: '4px 8px', fontSize: 9, fontWeight: 600, color: issue.level === 'high' ? '#f09595' : issue.level === 'med' ? '#d4aa4a' : '#4ab090', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                        {issue.level === 'high' ? '🔴 Critical' : issue.level === 'med' ? '🟡 Needs Attention' : '🟢 Minor'}
                      </div>
                      <div style={{ fontSize: 9, color: '#4a3860', marginLeft: 'auto' }}>Priority #{i + 1}</div>
                    </div>
                    <p style={{ fontSize: 12, color: '#c0b0d8', lineHeight: 1.6 }}>{issue.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CTA */}
          <div style={{ background: 'linear-gradient(135deg, #080512 0%, #0d0820 100%)', border: '1px solid #9b6de0', borderRadius: 16, padding: '32px', textAlign: 'center' }}>
            <div style={{ display: 'inline-block', background: 'rgba(155,109,224,0.1)', border: '0.5px solid rgba(155,109,224,0.3)', color: '#9b6de0', fontSize: 10, fontWeight: 500, padding: '4px 14px', borderRadius: 99, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 14 }}>
              Unlock Full Diagnosis
            </div>
            <div style={{ fontFamily: serif, fontSize: 'clamp(20px,2.5vw,26px)', color: '#f0e8ff', marginBottom: 8 }}>
              See every blocker. Know exactly what to fix.
            </div>
            <p style={{ fontSize: 14, color: '#8a78a8', marginBottom: 24, maxWidth: 440, margin: '0 auto 24px' }}>
              Get 20+ prioritized fixes, estimated business impact per issue, and a step-by-step action plan.
            </p>
            <div className="cta-btns" style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button onClick={() => handleCheckout('price_1TR656HTnbJKvHmtIl9J0vS0')}
                style={{ background: '#9b6de0', color: '#fff', border: 'none', borderRadius: 8, padding: '13px 28px', fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: sans }}>
                Get Full Report — $9 →
              </button>
              <button onClick={() => handleCheckout('price_1TR68lHTnbJKvHmtpPwjXTIG')}
                style={{ background: 'none', color: '#d4aa4a', border: '1px solid rgba(212,170,74,0.4)', borderRadius: 8, padding: '13px 28px', fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: sans }}>
                Fix It With Farah — $149 →
              </button>
            </div>
          </div>
        </section>
      )}

      {/* WHAT YOU'LL GET */}
      <section className="section-pad" style={{ background: '#080512', padding: '72px 6%', borderBottom: '0.5px solid rgba(255,255,255,0.03)' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{ fontSize: 10, color: '#d4aa4a', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 500, marginBottom: 10 }}>What you'll get</div>
          <h2 style={{ fontFamily: serif, fontSize: 'clamp(24px,3vw,38px)', color: '#f0e8ff', marginBottom: 12, lineHeight: 1.15 }}>
            A diagnosis, not just a score.
          </h2>
          <p style={{ color: '#6a5888', fontSize: 15, maxWidth: 520, margin: '0 auto', lineHeight: 1.75 }}>
            Most tools give you numbers. Viora tells you what those numbers mean for your business — and what to do next.
          </p>
        </div>

        <div className="what-grid">
          {[
            {
              icon: <IcoAlert color="#e24b4a"/>,
              title: 'Top 3 Conversion Blockers',
              desc: 'The specific issues costing you leads and sales — ranked by business impact, not technical severity.',
              color: '#e24b4a',
            },
            {
              icon: <IcoTrend color="#d4aa4a"/>,
              title: 'Estimated Business Impact',
              desc: 'Understand what each issue is actually costing you — in drop-off rates, lost leads, and missed revenue.',
              color: '#d4aa4a',
            },
            {
              icon: <IcoFix/>,
              title: 'Priority Fix List',
              desc: 'A clear, ordered action plan. Know exactly what to fix first to get the highest return on your time.',
              color: '#9b6de0',
            },
            {
              icon: <IcoReport/>,
              title: 'Actionable Recommendations',
              desc: 'No vague advice. Each fix comes with a specific, implementable recommendation you can act on today.',
              color: '#4ab090',
            },
          ].map((item, i) => (
            <div key={i} style={{ background: '#0c0818', border: `0.5px solid ${item.color}25`, borderRadius: 14, padding: '24px 20px', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: item.color, opacity: 0.5 }} />
              <div style={{ width: 36, height: 36, borderRadius: 10, background: `${item.color}15`, border: `0.5px solid ${item.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
                {item.icon}
              </div>
              <div style={{ fontSize: 14, fontWeight: 500, color: '#f0e8ff', marginBottom: 8 }}>{item.title}</div>
              <div style={{ fontSize: 13, color: '#6a5888', lineHeight: 1.7 }}>{item.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="section-pad" style={{ background: '#0c0818', padding: '64px 6%', borderBottom: '0.5px solid rgba(255,255,255,0.03)' }}>
        <div style={{ textAlign: 'center', marginBottom: 52 }}>
          <div style={{ fontSize: 10, color: '#9b6de0', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 500, marginBottom: 10 }}>How it works</div>
          <h2 style={{ fontFamily: serif, fontSize: 'clamp(22px,2.8vw,36px)', color: '#f0e8ff', marginBottom: 10 }}>Three steps. One clear answer.</h2>
          <p style={{ textAlign: 'center', color: '#6a5888', fontSize: 14 }}>No setup. No fluff. Just results.</p>
        </div>
        <div className="how-grid">
          {[
            { icon: <IcoURL/>, num: 'Step 01', title: 'Enter your URL', desc: 'Paste any website. No account, no signup, no waiting.' },
            { icon: <IcoAI/>, num: 'Step 02', title: 'AI diagnoses it', desc: 'Our engine identifies conversion blockers, SEO gaps, and performance issues in under 60 seconds.' },
            { icon: <IcoReport/>, num: 'Step 03', title: 'Get your action plan', desc: 'Receive a prioritized list of fixes with estimated impact — free instantly, full report with payment.' },
          ].map((s, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div style={{ width: 54, height: 54, borderRadius: '50%', background: 'rgba(155,109,224,0.08)', border: '0.5px solid rgba(155,109,224,0.22)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px' }}>
                {s.icon}
              </div>
              <div style={{ fontSize: 10, color: '#9b6de0', letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: 10, fontWeight: 500 }}>{s.num}</div>
              <h3 style={{ fontFamily: serif, fontSize: 20, color: '#f0e8ff', marginBottom: 8 }}>{s.title}</h3>
              <p style={{ fontSize: 13, color: '#8a78a8', lineHeight: 1.75 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* STATS */}
      <section style={{ background: '#050308', padding: '32px 6%', borderTop: '0.5px solid rgba(212,170,74,0.08)', borderBottom: '0.5px solid rgba(212,170,74,0.08)' }}>
        <div className="stats-grid">
          {[
            { n: '5', l: 'Audit Categories' },
            { n: '20+', l: 'Conversion Issues Checked' },
            { n: '<60s', l: 'Time to Diagnosis' },
            { n: 'AI', l: 'Powered Analysis' },
          ].map((s, i) => (
            <div key={i} style={{ textAlign: 'center', padding: '12px 16px', borderRight: i % 2 === 0 ? '0.5px solid #1a1430' : 'none' }}>
              <div style={{ fontFamily: serif, fontSize: 34, color: '#d4aa4a', marginBottom: 4 }}>{s.n}</div>
              <div style={{ fontSize: 12, color: '#8a78a8', letterSpacing: '0.06em' }}>{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section className="section-pad" style={{ background: '#0c0818', padding: '64px 6%' }}>
        <div style={{ textAlign: 'center', marginBottom: 44 }}>
          <div style={{ fontSize: 10, color: '#9b6de0', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 500, marginBottom: 10 }}>Pricing</div>
          <h2 style={{ fontFamily: serif, fontSize: 'clamp(22px,2.8vw,36px)', color: '#f0e8ff', marginBottom: 10 }}>Start free. Scale when you're ready.</h2>
          <p style={{ color: '#6a5888', fontSize: 14 }}>No subscriptions. No surprises.</p>
        </div>
        <div className="pricing-grid">
          {plans.map((p, i) => (
            <div key={i} style={{ background: '#080512', border: `0.5px solid ${p.featured ? '#9b6de0' : '#1a1430'}`, borderRadius: 14, padding: '28px 20px', position: 'relative' }}>
              {p.featured && (
                <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', background: '#d4aa4a', color: '#050308', fontSize: 9, fontWeight: 600, padding: '3px 14px', borderRadius: 99, letterSpacing: '0.08em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>Most Popular</div>
              )}
              <div style={{ fontSize: 10, color: '#8a78a8', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 8, fontWeight: 500 }}>{p.type}</div>
              <div style={{ fontFamily: serif, fontSize: 36, color: p.featured ? '#d4aa4a' : '#f0e8ff', marginBottom: 4, lineHeight: 1 }}>{p.price}</div>
              <div style={{ fontSize: 12, color: '#6a5888', marginBottom: 18 }}>{p.sub}</div>
              {p.items.map((item, j) => (
                <div key={j} style={{ fontSize: 13, color: p.featured ? '#c0b0d8' : '#8a78a8', padding: '4px 0', display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                  <span style={{ color: p.featured ? '#d4aa4a' : '#6a5888', fontSize: 12, flexShrink: 0, marginTop: 1 }}>✓</span>
                  {item}
                </div>
              ))}
              <button onClick={() => p.priceId ? handleCheckout(p.priceId) : analyzeWebsite()}
                style={{ display: 'block', width: '100%', marginTop: 22, padding: '12px', borderRadius: 6, fontSize: 12, fontWeight: 500, textAlign: 'center', cursor: 'pointer', border: p.featured ? 'none' : '0.5px solid #2a1e3e', background: p.featured ? '#9b6de0' : 'none', color: p.featured ? '#fff' : '#8a78a8', fontFamily: sans, letterSpacing: '0.06em' }}>
                {p.btn}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="section-pad" style={{ background: '#080512', padding: '72px 6%', textAlign: 'center', borderTop: '0.5px solid rgba(212,170,74,0.08)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 100%, rgba(212,170,74,0.06) 0%, transparent 65%)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ fontFamily: serif, fontSize: 'clamp(24px,3vw,42px)', color: '#f0e8ff', marginBottom: 14, lineHeight: 1.2 }}>
            Stop guessing.<br/>
            <em style={{ fontStyle: 'italic', color: '#d4aa4a' }}>Start fixing what matters.</em>
          </div>
          <p style={{ fontSize: 15, color: '#6a5888', marginBottom: 32, maxWidth: 460, margin: '0 auto 32px', lineHeight: 1.75 }}>
            Book a 1:1 session with Farah. Walk away with a clear roadmap of exactly what to fix — and how.
          </p>
          <div className="cta-btns" style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={analyzeWebsite}
              style={{ background: '#d4aa4a', color: '#050308', border: 'none', borderRadius: 8, padding: '14px 32px', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: sans }}>
              Diagnose My Site Free →
            </button>
            <button onClick={() => handleCheckout('price_1TR68lHTnbJKvHmtpPwjXTIG')}
              style={{ background: 'none', color: '#f0e8ff', border: '0.5px solid rgba(240,232,255,0.2)', borderRadius: 8, padding: '14px 32px', fontSize: 14, fontWeight: 400, cursor: 'pointer', fontFamily: sans }}>
              Fix It With Farah — $149
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: '#030206', padding: '20px 6%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '0.5px solid rgba(255,255,255,0.03)' }}>
        <div style={{ fontFamily: serif, fontSize: 15, background: 'linear-gradient(135deg, #f0e8ff 30%, #d4aa4a 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', letterSpacing: '0.08em' }}>Viora</div>
        <a href="https://farah.co" style={{ fontSize: 11, color: '#4a3860', textDecoration: 'none', borderBottom: '0.5px solid #2a1e3e', paddingBottom: 1, letterSpacing: '0.1em' }}>farah.co →</a>
      </footer>

    </main>
  );
}