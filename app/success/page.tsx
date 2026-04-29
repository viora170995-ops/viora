'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';

function SuccessContent() {
  const searchParams = useSearchParams();
  const url = searchParams.get('url');
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (url) {
      fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, fullReport: true }),
      })
        .then((res) => res.json())
        .then((data) => {
          setReport(data);
          setLoading(false);
        });
    }
  }, [url]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#0a0a0f] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#7c6af7] border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <h2 className="text-xl font-black mb-2">Generating Your Full Report...</h2>
          <p className="text-white/40">Claude AI is analyzing {url}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white font-sans">
      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-white/10">
        <div className="text-xl font-black tracking-tight">
          Vio<span className="text-[#7c6af7]">ra</span>
        </div>
        <a href="/" className="text-sm text-white/40 hover:text-white transition">
          ← Analyze Another Website
        </a>
      </nav>

      <div className="max-w-4xl mx-auto px-8 py-12">

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block bg-[#1d9e75]/10 border border-[#1d9e75]/30 text-[#5dcaa5] text-xs font-bold tracking-widest uppercase px-4 py-2 rounded-full mb-6">
            ✓ Payment Successful — Full Report Ready
          </div>
          <h1 className="text-3xl font-black mb-3">Full Audit Report</h1>
          <p className="text-white/40">{url}</p>
        </div>

        {/* Scores */}
        <div className="grid grid-cols-4 gap-4 mb-10">
          {Object.entries(report?.scores || {}).map(([key, val]: any) => (
            <div key={key} className="bg-[#13121d] border border-white/10 rounded-2xl p-5 text-center">
              <div className="text-3xl font-black mb-1" style={{
                color: val >= 80 ? '#1d9e75' : val >= 60 ? '#ef9f27' : '#e24b4a'
              }}>{val}</div>
              <div className="text-xs text-white/40 uppercase tracking-wider font-bold">{key}</div>
            </div>
          ))}
        </div>

        {/* Summary */}
        {report?.summary && (
          <div className="bg-[#13121d] border border-white/10 rounded-2xl p-6 mb-8">
            <h3 className="text-sm font-bold text-white/40 uppercase tracking-wider mb-3">Overall Assessment</h3>
            <p className="text-white/80 leading-relaxed">{report.summary}</p>
          </div>
        )}

        {/* Sections */}
        {report?.sections?.map((section: any, i: number) => (
          <div key={i} className="bg-[#13121d] border border-white/10 rounded-2xl p-6 mb-6">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{section.icon}</span>
                <h3 className="font-black text-white">{section.title}</h3>
              </div>
              <div className="text-2xl font-black" style={{
                color: section.score >= 80 ? '#1d9e75' : section.score >= 60 ? '#ef9f27' : '#e24b4a'
              }}>{section.score}</div>
            </div>
            {section.issues?.map((issue: any, j: number) => (
              <div key={j} className="border border-white/5 rounded-xl p-4 mb-3 last:mb-0">
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                    issue.level === 'high' ? 'bg-[#e24b4a]' :
                    issue.level === 'med' ? 'bg-[#ef9f27]' : 'bg-[#1d9e75]'
                  }`} />
                  <span className="font-bold text-sm text-white">{issue.problem}</span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ml-auto ${
                    issue.level === 'high' ? 'bg-[#e24b4a]/15 text-[#f09595]' :
                    issue.level === 'med' ? 'bg-[#ef9f27]/15 text-[#fac775]' : 'bg-[#1d9e75]/15 text-[#5dcaa5]'
                  }`}>{issue.level}</span>
                </div>
                <p className="text-white/50 text-sm mb-2">{issue.description}</p>
                <div className="bg-[#7c6af7]/10 border border-[#7c6af7]/20 rounded-lg p-3">
                  <span className="text-xs font-bold text-[#a99fff] uppercase tracking-wider">Solution: </span>
                  <span className="text-sm text-white/70">{issue.solution}</span>
                </div>
              </div>
            ))}
          </div>
        ))}

        {/* Priorities */}
        {report?.priorities && (
          <div className="bg-[#7c6af7]/10 border border-[#7c6af7]/30 rounded-2xl p-6 mb-8">
            <h3 className="font-black text-white mb-5">🎯 Priority Action Plan</h3>
            {report.priorities.map((p: any) => (
              <div key={p.order} className="flex gap-4 items-start mb-4 last:mb-0">
                <div className="w-8 h-8 bg-[#7c6af7] rounded-full flex items-center justify-center text-sm font-black flex-shrink-0">
                  {p.order}
                </div>
                <div>
                  <p className="text-white font-bold text-sm">{p.action}</p>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                    p.impact === 'high' ? 'bg-[#e24b4a]/15 text-[#f09595]' : 'bg-[#ef9f27]/15 text-[#fac775]'
                  }`}>{p.impact} impact</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Download + CTA */}
        <div className="text-center">
          <button
            onClick={() => window.print()}
            className="bg-[#7c6af7] hover:bg-[#8f7fff] text-white font-bold px-8 py-3 rounded-xl transition mr-4"
          >
            Download PDF ↓
          </button>
          <a href="/" className="bg-white/10 hover:bg-white/20 text-white font-bold px-8 py-3 rounded-xl transition inline-block">
            Analyze Another Website ←
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