'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';

const loadingSteps = [
  'Scanning website structure...',
  'Identifying conversion blockers...',
  'Measuring business impact...',
  'Building priority fix list...',
  'Generating recommendations...',
  'Finalizing your report...',
];

function SuccessContent() {
  const searchParams = useSearchParams();
  const url = searchParams.get('url');
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const stepInterval = setInterval(() => {
      setStep(prev => {
        if (prev < loadingSteps.length - 1) return prev + 1;
        return prev;
      });
      setProgress(prev => {
        if (prev < 85) return prev + 14;
        return prev;
      });
    }, 1800);

    if (url) {
      fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, fullReport: true }),
      })
        .then(res => res.json())
        .then(data => {
          clearInterval(stepInterval);
          setProgress(100);
          setTimeout(() => {
            setReport(data);
            setLoading(false);
          }, 600);
        });
    }

    return () => clearInterval(stepInterval);
  }, [url]);

  const serif = "'DM Serif Display', serif";
  const sans = "'DM Sans', sans-serif";

  if (loading) {
    return (
      <main style={{ minHeight: '100vh', background: '#050308', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: sans }}>
        <div style={{ width: '100%', maxWidth: 480, padding: '0 24px', textAlign: 'center' }}>

          {/* Ring */}
          <div style={{ position: 'relative', width: 140, height: 140, margin: '0 auto 32px' }}>
            <svg width="140" height="140" viewBox="0 0 140 140">
              <circle cx="70" cy="70" r="58" fill="none" stroke="#0c0818" strokeWidth="7"/>
              <circle cx="70" cy="70" r="58" fill="none" stroke="#9b6de0" strokeWidth="7"
                strokeDasharray="364"
                strokeDashoffset={364 - (progress / 100) * 364}
                strokeLinecap="round" transform="rotate(-90 70 70)"
                style={{ transition: 'stroke-dashoffset 0.8s cubic-bezier(0.4,0,0.2,1)' }}/>
            </svg>
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', textAlign: 'center' }}>
              <div style={{ fontFamily: serif, fontSize: 36, color: '#f0e8ff', lineHeight: 1 }}>{Math.round(progress)}%</div>
            </div>
          </div>

          {/* Title */}
          <div style={{ fontFamily: serif, fontSize: 22, color: '#f0e8ff', marginBottom: 8 }}>
            Generating Your Full Report
          </div>
          <div style={{ fontSize: 13, color: '#5a4878', marginBottom: 32 }}>{url}</div>

          {/* Progress bar */}
          <div style={{ height: 4, background: '#0c0818', borderRadius: 99, overflow: 'hidden', marginBottom: 28 }}>
            <div style={{ height: '100%', background: 'linear-gradient(90deg, #9b6de0, #d4aa4a)', borderRadius: 99, width: `${progress}%`, transition: 'width 0.8s ease' }}/>
          </div>

          {/* Steps */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, textAlign: 'left' }}>
            {loadingSteps.map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, opacity: i <= step ? 1 : 0.25, transition: 'opacity 0.4s ease' }}>
                <div style={{ width: 20, height: 20, borderRadius: '50%', background: i < step ? '#4ab090' : i === step ? '#9b6de0' : '#1a1430', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'background 0.4s ease' }}>
                  {i < step
                    ? <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 5l2.5 2.5L8 3" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    : i === step
                    ? <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#fff' }}/>
                    : null
                  }
                </div>
                <span style={{ fontSize: 13, color: i < step ? '#4ab090' : i === step ? '#c0b0d8' : '#3a2e52', transition: 'color 0.4s ease' }}>{s}</span>
              </div>
            ))}
          </div>

        </div>
      </main>
    );
  }

  // REPORT
  return (
    <main style={{ minHeight: '100vh', background: '#050308', fontFamily: sans, color: '#f0e8ff' }}>

      {/* Nav */}
      <nav style={{ background: '#050308', borderBottom: '0.5px solid rgba(212,170,74,0.12)', padding: '16px 6%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontFamily: serif, fontSize: 22, background: 'linear-gradient(135deg,#f0e8ff 30%,#d4aa4a 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Viora</div>
          <div style={{ fontSize: 9, color: '#5a4878', letterSpacing: '0.22em', textTransform: 'uppercase' }}>by Farah</div>
        </div>
        <a href="/" style={{ fontSize: 12, color: '#6a5888', textDecoration: 'none' }}>← Analyze Another Site</a>
      </nav>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '48px 6%' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ display: 'inline-block', background: 'rgba(74,176,144,0.1)', border: '0.5px solid rgba(74,176,144,0.3)', color: '#4ab090', fontSize: 10, fontWeight: 500, padding: '4px 14px', borderRadius: 99, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 14 }}>
            ✓ Full Report Ready
          </div>
          <h1 style={{ fontFamily: serif, fontSize: 'clamp(24px,3vw,36px)', color: '#f0e8ff', marginBottom: 8 }}>Your Full Audit Report</h1>
          <p style={{ color: '#5a4878', fontSize: 13 }}>{url}</p>
        </div>

        {/* Scores */}
        {report?.scores && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))', gap: 12, marginBottom: 32 }}>
            {Object.entries(report.scores).map(([key, val]: any) => (
              <div key={key} style={{ background: '#080512', border: '0.5px solid #1a1430', borderRadius: 12, padding: '18px 14px', textAlign: 'center' }}>
                <div style={{ fontSize: 36, fontFamily: serif, color: val >= 80 ? '#4ab090' : val >= 60 ? '#d4aa4a' : '#e24b4a', marginBottom: 4 }}>{val}</div>
                <div style={{ fontSize: 11, color: '#6a5888', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{key}</div>
              </div>
            ))}
          </div>
        )}

        {/* Summary */}
        {report?.summary && (
          <div style={{ background: '#080512', border: '0.5px solid #1a1430', borderRadius: 12, padding: '20px 24px', marginBottom: 24 }}>
            <div style={{ fontSize: 10, color: '#6a5888', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 10, fontWeight: 500 }}>Overall Assessment</div>
            <p style={{ fontSize: 14, color: '#a090c0', lineHeight: 1.8 }}>{report.summary}</p>
          </div>
        )}

        {/* Sections */}
        {report?.sections?.map((section: any, i: number) => (
          <div key={i} style={{ background: '#080512', border: '0.5px solid #1a1430', borderRadius: 12, padding: '22px 24px', marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 20 }}>{section.icon}</span>
                <span style={{ fontFamily: serif, fontSize: 18, color: '#f0e8ff' }}>{section.title}</span>
              </div>
              <div style={{ fontFamily: serif, fontSize: 24, color: section.score >= 80 ? '#4ab090' : section.score >= 60 ? '#d4aa4a' : '#e24b4a' }}>{section.score}</div>
            </div>
            {section.issues?.map((issue: any, j: number) => (
              <div key={j} style={{ background: '#0c0818', border: '0.5px solid #1a1430', borderRadius: 8, padding: '14px 16px', marginBottom: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <div style={{ width: 7, height: 7, borderRadius: '50%', background: issue.level === 'high' ? '#e24b4a' : issue.level === 'med' ? '#d4aa4a' : '#4ab090', flexShrink: 0 }}/>
                  <span style={{ fontSize: 13, fontWeight: 500, color: '#f0e8ff' }}>{issue.problem}</span>
                  <span style={{ fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 99, marginLeft: 'auto', background: issue.level === 'high' ? 'rgba(226,75,74,0.15)' : issue.level === 'med' ? 'rgba(212,170,74,0.15)' : 'rgba(74,176,144,0.15)', color: issue.level === 'high' ? '#f09595' : issue.level === 'med' ? '#d4aa4a' : '#4ab090' }}>{issue.level}</span>
                </div>
                <p style={{ fontSize: 12, color: '#6a5888', marginBottom: 8, lineHeight: 1.6 }}>{issue.description}</p>
                <div style={{ background: 'rgba(155,109,224,0.08)', border: '0.5px solid rgba(155,109,224,0.2)', borderRadius: 6, padding: '8px 12px' }}>
                  <span style={{ fontSize: 10, fontWeight: 600, color: '#9b6de0', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Fix: </span>
                  <span style={{ fontSize: 12, color: '#a090c0' }}>{issue.solution}</span>
                </div>
              </div>
            ))}
          </div>
        ))}

        {/* Priorities */}
        {report?.priorities && (
          <div style={{ background: 'rgba(155,109,224,0.08)', border: '0.5px solid rgba(155,109,224,0.25)', borderRadius: 12, padding: '24px', marginBottom: 32 }}>
            <div style={{ fontFamily: serif, fontSize: 20, color: '#f0e8ff', marginBottom: 16 }}>🎯 Priority Action Plan</div>
            {report.priorities.map((p: any) => (
              <div key={p.order} style={{ display: 'flex', gap: 14, alignItems: 'flex-start', marginBottom: 14 }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#9b6de0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 600, color: '#fff', flexShrink: 0 }}>{p.order}</div>
                <div>
                  <div style={{ fontSize: 13, color: '#f0e8ff', fontWeight: 500, marginBottom: 3 }}>{p.action}</div>
                  <span style={{ fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 99, background: p.impact === 'high' ? 'rgba(226,75,74,0.15)' : 'rgba(212,170,74,0.15)', color: p.impact === 'high' ? '#f09595' : '#d4aa4a' }}>{p.impact} impact</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={() => window.print()}
            style={{ background: '#9b6de0', color: '#fff', border: 'none', borderRadius: 8, padding: '13px 28px', fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: sans }}>
            Download PDF ↓
          </button>
          <a href="/" style={{ background: 'none', color: '#d4aa4a', border: '1px solid rgba(212,170,74,0.4)', borderRadius: 8, padding: '13px 28px', fontSize: 13, cursor: 'pointer', fontFamily: sans, textDecoration: 'none', display: 'inline-block' }}>
            Analyze Another Site →
          </a>
        </div>

      </div>
    </main>
  );
}

export default function SuccessPage() {
  return (
    <Suspense>
      <SuccessContent />
    </Suspense>
  );
}