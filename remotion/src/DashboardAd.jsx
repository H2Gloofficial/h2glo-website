import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion';

const CORAL = '#E8553C';
const FNT = "-apple-system,BlinkMacSystemFont,'SF Pro Display',system-ui,sans-serif";
const C = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' };
const spr = (f, fps, cfg) => Math.min(1, Math.max(0, spring({ frame: Math.max(0, f), fps, config: { damping: 12, mass: 0.8, stiffness: 100, ...cfg } })));

// Breathing background
function BG({ frame }) {
  const cx = 50 + Math.sin(frame * 0.004) * 8;
  const cy = 50 + Math.cos(frame * 0.003) * 6;
  const a = 0.04 + Math.sin(frame * 0.008) * 0.015;
  return <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse at ${cx}% ${cy}%, rgba(232,85,60,${a}) 0%, transparent 65%)` }}/>;
}

// Breathing text
function Txt({ children, inF, outF, frame, style: s }) {
  if (frame < inF - 5 || frame > outF + 5) return null;
  const o = interpolate(frame, [inF, inF + 12, outF - 12, outF], [0, 1, 1, 0], C);
  const enterY = interpolate(frame, [inF, inF + 15], [14, 0], C);
  const breathe = frame > inF + 15 && frame < outF - 12 ? Math.sin(frame * 0.05) * 2 : 0;
  return <div style={{ opacity: o, transform: `translateY(${enterY + breathe}px)`, fontFamily: FNT, ...s }}>{children}</div>;
}

// Cursor
function Cursor({ x, y, opacity, scale }) {
  return (
    <div style={{ position: 'absolute', left: x, top: y, opacity, transform: `scale(${scale})`, transformOrigin: 'top left', zIndex: 20 }}>
      <svg width="24" height="30" viewBox="0 0 24 30" fill="none" style={{ filter: 'drop-shadow(1px 2px 2px rgba(0,0,0,0.5))' }}>
        <path d="M2.5 0.5L2.5 23L7.5 17.5L12.5 27L15.5 25.5L10.5 15.5L17.5 15.5L2.5 0.5Z" fill="#fff" stroke="#111" strokeWidth="1.2" strokeLinejoin="round"/>
      </svg>
    </div>
  );
}

// Traffic Lights
function Dots() {
  return (
    <div style={{ display: 'flex', gap: 8 }}>
      {[['#FF5F57','#E0443E'],['#FFBD2E','#DEA123'],['#28C840','#1AAB29']].map(([bg,bd],i) => (
        <div key={i} style={{ width: 12, height: 12, borderRadius: '50%', background: bg, border: `1px solid ${bd}` }}/>
      ))}
    </div>
  );
}

// ─── Carousel Card ───
// Shows one card in focus with blurred ghost cards behind for depth
function CarouselCard({ label, value, suffix, frame, startF, dur }) {
  const local = frame - startF;
  const prog = interpolate(frame, [startF, startF + dur * 0.6], [0, 1], C);
  const eased = 1 - Math.pow(1 - prog, 4);
  const n = Math.round(eased * value);
  let disp;
  if (suffix === 'M') disp = (n / 1e6).toFixed(1) + 'M';
  else if (suffix === 'K') disp = (n / 1e3).toFixed(1) + 'K';
  else disp = n.toFixed(1) + '%';
  const pulse = prog >= 0.9 ? 0.88 + Math.sin(frame * 0.08) * 0.12 : 1;

  // Card pop-in spring
  const popIn = spr(local, 30, { damping: 10, stiffness: 140 });
  // Gentle drift
  const dX = interpolate(local, [0, dur], [-8, 6], C);
  const dY = interpolate(local, [0, dur], [-4, 3], C);
  const tiltY = interpolate(local, [0, dur], [-10, 2], C);
  const tiltX = interpolate(local, [0, dur], [6, 0], C);
  const glowA = 0.08 + Math.sin(frame * 0.06) * 0.04;

  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', perspective: 900 }}>
      {/* Background ghost cards for depth */}
      {[-280, 280].map((offset) => (
        <div key={offset} style={{
          position: 'absolute', left: `calc(50% + ${offset}px)`, top: '50%',
          transform: `translate(-50%,-50%) scale(0.8) rotateY(${offset > 0 ? -15 : 15}deg)`,
          width: 340, padding: '28px 36px', background: '#131313', borderRadius: 18,
          border: '1px solid #1a1a1a', filter: 'blur(6px)', opacity: 0.3,
        }}>
          <div style={{ height: 14, width: 80, background: '#222', borderRadius: 4, marginBottom: 12 }}/>
          <div style={{ height: 36, width: 140, background: '#1a1a1a', borderRadius: 6 }}/>
        </div>
      ))}
      {/* Focus card */}
      <div style={{
        transform: `translateX(${dX}px) translateY(${dY}px) scale(${0.5 + popIn * 0.5}) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`,
        opacity: popIn, width: 380, padding: '32px 40px',
        background: '#161616', borderRadius: 20, border: '1px solid #2a2a2a',
        boxShadow: `0 30px 80px rgba(0,0,0,0.5), 0 0 30px rgba(232,85,60,${glowA})`,
        transformStyle: 'preserve-3d', position: 'relative', zIndex: 2,
      }}>
        <div style={{ fontSize: 11, color: '#666', textTransform: 'uppercase', letterSpacing: 2.5, marginBottom: 14, fontFamily: FNT }}>{label}</div>
        <div style={{ fontSize: 56, fontWeight: 700, color: '#fff', fontVariantNumeric: 'tabular-nums', fontFamily: FNT, opacity: pulse }}>{disp}</div>
      </div>
    </div>
  );
}

// ─── Chart Card ───
function ChartCard({ color, data, label, sub, frame, startF, drawDur, area }) {
  const local = frame - startF;
  const total = drawDur + 80;
  const drawProg = interpolate(frame, [startF, startF + drawDur], [0, 1], C);
  const eased = 1 - Math.pow(1 - drawProg, 2);
  const popIn = spr(local, 30, { damping: 10, stiffness: 130 });

  const baseRY = interpolate(local, [0, total], [-16, -1], C);
  const orbitRY = drawProg >= 0.9 ? Math.sin((local - drawDur) * 0.018) * 4 : 0;
  const rY = baseRY + orbitRY;
  const rX = interpolate(local, [0, total], [5, 0.5], C);
  const dX = interpolate(local, [0, total], [-10, 6], C);
  const dY = interpolate(local, [0, total], [-5, 3], C);

  const W = 520, H = 155, mx = Math.max(...data);
  const pts = data.map((v, i) => ({ x: (i / (data.length - 1)) * W, y: H - (v / mx) * H * 0.88 - 8 }));
  const d = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
  const ad = d + ` L${W},${H} L0,${H} Z`;
  const id = label.replace(/\W/g, '');
  const len = W * 2.5;
  const pi = data.indexOf(mx); const pp = pts[pi];
  const glowOp = eased > 0.5 ? 0.25 + Math.sin(frame * 0.07) * 0.2 : eased * 0.25;

  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', perspective: 1000 }}>
      <div style={{
        transform: `translateX(${dX}px) translateY(${dY}px) scale(${0.5 + popIn * 0.5}) rotateX(${rX}deg) rotateY(${rY}deg)`,
        opacity: popIn, width: 580, padding: '26px 34px',
        background: '#161616', borderRadius: 20, border: '1px solid #2a2a2a',
        boxShadow: `0 30px 80px rgba(0,0,0,0.5), 0 0 25px rgba(232,85,60,${0.04 + Math.sin(frame * 0.05) * 0.02})`,
        transformStyle: 'preserve-3d',
      }}>
        <div style={{ fontSize: 15, fontWeight: 600, color: '#fff', marginBottom: 3, fontFamily: FNT }}>{label}</div>
        <div style={{ fontSize: 11, color: '#555', marginBottom: 16, fontFamily: FNT }}>{sub}</div>
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ display: 'block', width: '100%', height: 'auto' }}>
          <defs><filter id={`g${id}`}><feGaussianBlur stdDeviation="6"/></filter></defs>
          {[0.25, 0.5, 0.75].map(r => <line key={r} x1={0} y1={H * r} x2={W} y2={H * r} stroke="#1f1f1f" strokeWidth="0.5"/>)}
          <clipPath id={`c${id}`}><rect x={0} y={0} width={W * eased} height={H}/></clipPath>
          {area && <path d={ad} fill={color} fillOpacity={0.12} clipPath={`url(#c${id})`}/>}
          <path d={d} fill="none" stroke={color} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={len} strokeDashoffset={len * (1 - eased)}/>
          {pp && glowOp > 0 && <>
            <circle cx={pp.x} cy={pp.y} r={12} fill={color} opacity={glowOp * 0.35} filter={`url(#g${id})`}/>
            <circle cx={pp.x} cy={pp.y} r={4} fill={color} opacity={glowOp}/>
          </>}
        </svg>
      </div>
    </div>
  );
}

// ─── Full Dashboard Window ───
function DashWin({ opacity, frame, scale }) {
  const igD = [80,120,160,140,220,260,200,290,341,310,280,320,300,340,310,290,260,280,250,240];
  const tkD = [60,100,140,250,200,350,380,300,500,650,550,800,700,1300,900,750,600,550,500,480];
  const cp = (s) => interpolate(frame, [s, s + 60], [0, 1], C);
  return (
    <div style={{ perspective: 1400, position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ transform: `scale(${scale})`, opacity, width: 1440, borderRadius: 12, overflow: 'hidden', boxShadow: '0 50px 150px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.04)' }}>
        <div style={{ background: '#1a1a1a', padding: '12px 18px', display: 'flex', alignItems: 'center', gap: 16, borderBottom: '1px solid #2a2a2a' }}>
          <Dots/><div style={{ fontSize: 13, color: '#777', fontWeight: 500, flex: 1, textAlign: 'center', marginRight: 72, fontFamily: FNT }}>Fusion Creative — New Greek Dashboard</div>
        </div>
        <div style={{ background: '#0d0d0d', padding: 36, minHeight: 520 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 28 }}>
            <div style={{ width: 46, height: 46, borderRadius: '50%', background: CORAL, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 700, color: '#fff', fontFamily: FNT }}>N</div>
            <div><div style={{ fontSize: 22, fontWeight: 700, color: '#fff', fontFamily: FNT }}>New Greek</div><div style={{ fontSize: 12, color: '#555', fontFamily: FNT }}>Growth reporting and analytics</div></div>
          </div>
          <div style={{ display: 'flex', gap: 14, marginBottom: 24 }}>
            {[['Total Reach',2300000,'M'],['Impressions',3100000,'M'],['Engagements',55300,'K'],['Profile Visits',10900,'K']].map(([l,v,s], idx) => {
              const t = cp(200 + idx * 4); const e = 1 - Math.pow(1 - t, 4); const n = Math.round(e * v);
              let d; if (s === 'M') d = (n/1e6).toFixed(1)+'M'; else d = (n/1e3).toFixed(1)+'K';
              const pulse = t >= 0.95 ? 0.88 + Math.sin(frame * 0.08) * 0.12 : 1;
              return (
                <div key={l} style={{ background: '#161616', borderRadius: 12, padding: '16px 20px', flex: 1, border: '1px solid #2a2a2a' }}>
                  <div style={{ fontSize: 9, color: '#666', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 8, fontFamily: FNT }}>{l}</div>
                  <div style={{ fontSize: 26, fontWeight: 700, color: '#fff', fontVariantNumeric: 'tabular-nums', fontFamily: FNT, opacity: pulse }}>{d}</div>
                </div>
              );
            })}
          </div>
          <div style={{ display: 'flex', gap: 14 }}>
            {[['#fff', igD, 'Instagram Views', '30-day rolling window'], [CORAL, tkD, 'TikTok Views', '30-day rolling']].map(([col, data, lbl, sub]) => {
              const W = 480, H = 120, mx = Math.max(...data);
              const pts = data.map((v, i) => ({ x: (i/(data.length-1))*W, y: H-(v/mx)*H*0.88-8 }));
              const path = pts.map((p,i) => `${i===0?'M':'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
              return (
                <div key={lbl} style={{ flex: 1, background: '#161616', borderRadius: 12, padding: '16px 20px', border: '1px solid #2a2a2a' }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#fff', marginBottom: 2, fontFamily: FNT }}>{lbl}</div>
                  <div style={{ fontSize: 10, color: '#555', marginBottom: 12, fontFamily: FNT }}>{sub}</div>
                  <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ display: 'block', width: '100%', height: 'auto' }}>
                    {[0.25,0.5,0.75].map(r => <line key={r} x1={0} y1={H*r} x2={W} y2={H*r} stroke="#1f1f1f" strokeWidth="0.5"/>)}
                    <path d={path} fill="none" stroke={col} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" opacity={0.3}/>
                  </svg>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════
   MAIN — 1650 frames, 30fps, 55s
   Faster pacing, 2 card close-ups only
   ══════════════════════════════════════ */
export function DashboardAd() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const igData = [80,120,160,140,220,260,200,290,341,310,280,320,300,340,310,290,260,280,250,240];
  const tkData = [60,100,140,250,200,350,380,300,500,650,550,800,700,1300,900,750,600,550,500,480];

  // Cross-dissolve
  const xf = (inF, outF) => interpolate(frame, [inF, inF + 12, outF - 12, outF], [0, 1, 1, 0], C);

  // ── S1: Desktop (0-130) — faster, snappier ──
  const s1 = xf(0, 130);
  const curOp = interpolate(frame, [30, 40], [0, 1], C);
  const curT = interpolate(frame, [30, 90], [0, 1], C);
  const curX = 1400 - curT * curT * 440;
  const curY = 400 + curT * 160;
  const clk1 = interpolate(frame, [95, 98, 101], [1, 0.82, 1], C);
  const clk2 = interpolate(frame, [103, 106, 109], [1, 0.82, 1], C);
  const iconS = 1 + spr(frame - 98, fps, { damping: 8, stiffness: 200 }) * 0.1;

  // ── S2: Window opens fast (118-260) ──
  const s2 = xf(118, 260);
  const wS = spr(frame - 125, fps, { damping: 12, mass: 0.8, stiffness: 120 });
  const wScale = 0.06 + wS * 0.94;
  const dBlur = interpolate(frame, [118, 140], [0, 12], C);

  // ── S3: "Every client" text (248-395) ──
  const s3 = xf(248, 395);

  // ── S4: 2 card close-ups carousel style (383-575) ──
  const s4 = xf(383, 575);
  // Card 1: Total Reach (390-480)
  const c1op = xf(390, 480);
  // Card 2: Engagements (468-560)
  const c2op = xf(468, 560);

  // ── S5: IG chart close-up (563-730) ──
  const s5 = xf(563, 730);

  // ── S6: TK chart close-up (718-885) ──
  const s6 = xf(718, 885);

  // ── S7: Full dashboard pull-back (873-1060) ──
  const s7 = xf(873, 1060);
  const s7scale = interpolate(frame, [880, 960], [0.3, 1], C);

  // ── S8: "Included" offer text (1048-1230) ──
  const s8 = xf(1048, 1230);

  // ── S9: Brand close (1218-1650) ──
  const s9op = interpolate(frame, [1218, 1245], [0, 1], C);
  const endFade = interpolate(frame, [1620, 1650], [1, 0], C);
  const brOp = interpolate(frame, [1240, 1275], [0, 1], C);
  const tgOp = interpolate(frame, [1275, 1305], [0, 1], C);
  const urlOp = interpolate(frame, [1305, 1330], [0, 1], C);
  const glow = 0.3 + 0.15 * Math.sin(frame * 0.05);

  return (
    <div style={{ width: 1920, height: 1080, background: '#080808', position: 'relative', overflow: 'hidden', fontFamily: FNT }}>
      <BG frame={frame}/>

      {/* ═══ S1: Desktop ═══ */}
      {s1 > 0.01 && (
        <div style={{ position: 'absolute', inset: 0, opacity: s1, filter: frame >= 118 ? `blur(${dBlur}px)` : 'none' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 30% 60%,#1a2a4a 0%,#0d1117 60%,#080808 100%)' }}/>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 28, background: 'rgba(20,20,20,0.85)', display: 'flex', alignItems: 'center', padding: '0 14px', fontSize: 13, color: '#ccc', fontFamily: FNT, gap: 20, zIndex: 10 }}>
            <svg width="13" height="16" viewBox="0 0 14 17" fill="#ccc"><path d="M11.8 9c0-2.1 1.7-3.1 1.8-3.2-1-1.4-2.5-1.6-3.1-1.7-1.3-.1-2.6.8-3.2.8-.7 0-1.7-.8-2.8-.7C3.1 4.3 1.8 5.1 1.1 6.4c-1.5 2.6-.4 6.5 1.1 8.6.7 1 1.6 2.2 2.7 2.2 1.1 0 1.5-.7 2.8-.7s1.7.7 2.8.7c1.2 0 1.9-1 2.6-2.1.8-1.2 1.2-2.3 1.2-2.4 0 0-2.3-.9-2.5-3.7zM9.5 3.1c.6-.7 1-1.7.9-2.7-.9 0-1.9.6-2.5 1.3-.6.6-1 1.6-.9 2.6.9.1 1.9-.5 2.5-1.2z"/></svg>
            <span style={{ fontWeight: 600 }}>Finder</span>
            {['File','Edit','View','Go','Window','Help'].map(m => <span key={m} style={{ color: '#aaa' }}>{m}</span>)}
            <div style={{ flex: 1 }}/><span style={{ fontSize: 12, fontWeight: 500 }}>09:41</span>
          </div>
          {[['#1A8EF5','S'],['#2196F3','M'],['#FF3B30','C'],['#5AC8FA','F'],['#FFF176','N']].map(([bg,l],i) => (
            <div key={i} style={{ position: 'absolute', right: 40, top: 60 + i * 100, textAlign: 'center' }}>
              <div style={{ width: 52, height: 52, borderRadius: 12, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <span style={{ fontSize: 20, fontWeight: 700, color: '#fff', fontFamily: FNT }}>{l}</span>
              </div>
            </div>
          ))}
          <div style={{ position: 'absolute', left: '50%', top: '52%', transform: `translate(-50%,-50%) scale(${iconS})`, textAlign: 'center' }}>
            <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)', width: 140, height: 140, borderRadius: '50%', background: `radial-gradient(circle,rgba(232,85,60,${0.15 + Math.sin(frame * 0.06) * 0.05})0%,transparent 70%)`, filter: 'blur(12px)' }}/>
            <div style={{ width: 76, height: 76, borderRadius: 18, background: 'linear-gradient(145deg,#1c1c1c,#111)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 30px rgba(0,0,0,0.5)', border: '1px solid #333', position: 'relative' }}>
              <span style={{ fontSize: 30, fontWeight: 700, color: CORAL, fontFamily: FNT }}>FC</span>
            </div>
            <div style={{ fontSize: 11, color: '#fff', marginTop: 6, textShadow: '0 1px 4px rgba(0,0,0,0.8)', fontFamily: FNT }}>Fusion Creative</div>
          </div>
          <div style={{ position: 'absolute', bottom: 8, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 4, padding: '5px 10px', background: 'rgba(255,255,255,0.08)', borderRadius: 14, border: '1px solid rgba(255,255,255,0.06)' }}>
            {['#1A8EF5','#2196F3','#FF3B30','#161616','#5AC8FA','#FFF176'].map((bg,i) => (
              <div key={i} style={{ width: 40, height: 40, borderRadius: 9, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', border: i === 3 ? '1px solid rgba(232,85,60,0.3)' : '1px solid rgba(255,255,255,0.04)' }}>
                {i === 3 && <span style={{ fontSize: 14, fontWeight: 700, color: CORAL, fontFamily: FNT }}>FC</span>}
              </div>
            ))}
          </div>
          <Cursor x={curX} y={curY} opacity={curOp} scale={clk1 * clk2}/>
        </div>
      )}

      {/* ═══ S2: Window opens ═══ */}
      {s2 > 0.01 && <div style={{ position: 'absolute', inset: 0, opacity: s2 }}><DashWin scale={wScale} opacity={1} frame={frame}/></div>}
      <Txt inF={195} outF={255} frame={frame} style={{ position: 'absolute', bottom: 55, left: 0, right: 0, textAlign: 'center', fontSize: 19, color: 'rgba(255,255,255,0.55)' }}>
        Your clients deserve better than a monthly PDF report.
      </Txt>

      {/* ═══ S3: Text ═══ */}
      {s3 > 0.01 && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: s3 }}>
          <div style={{ textAlign: 'center' }}>
            <Txt inF={258} outF={388} frame={frame} style={{ fontSize: 42, fontWeight: 600, color: '#fff', letterSpacing: -0.5 }}>Every client gets their own personal dashboard.</Txt>
            <Txt inF={265} outF={388} frame={frame} style={{ fontSize: 24, fontWeight: 500, color: CORAL, marginTop: 18 }}>Live data. Real numbers. Zero guesswork.</Txt>
            <Txt inF={272} outF={388} frame={frame} style={{ fontSize: 17, color: 'rgba(255,255,255,0.4)', marginTop: 14 }}>Included with every Fusion Creative retainer.</Txt>
          </div>
        </div>
      )}

      {/* ═══ S4: 2 Card carousel close-ups ═══ */}
      {s4 > 0.01 && (
        <div style={{ position: 'absolute', inset: 0, opacity: s4 }}>
          {c1op > 0.01 && <div style={{ position: 'absolute', inset: 0, opacity: c1op }}><CarouselCard label="Total Reach" value={2300000} suffix="M" frame={frame} startF={390} dur={85}/></div>}
          {c2op > 0.01 && <div style={{ position: 'absolute', inset: 0, opacity: c2op }}><CarouselCard label="Engagements" value={55300} suffix="K" frame={frame} startF={468} dur={85}/></div>}
        </div>
      )}
      <Txt inF={395} outF={470} frame={frame} style={{ position: 'absolute', bottom: 75, left: 0, right: 0, textAlign: 'center', fontSize: 17, color: 'rgba(255,255,255,0.5)' }}>Live performance data. Always up to date.</Txt>

      {/* ═══ S5: IG chart close-up ═══ */}
      {s5 > 0.01 && <div style={{ position: 'absolute', inset: 0, opacity: s5 }}><ChartCard color="#fff" data={igData} label="Instagram Views" sub="30-day rolling window" frame={frame} startF={573} drawDur={75}/></div>}
      <Txt inF={600} outF={680} frame={frame} style={{ position: 'absolute', bottom: 85, left: 0, right: 0, textAlign: 'center', fontSize: 24, fontWeight: 600, color: '#fff' }}>Instagram Views</Txt>
      <Txt inF={620} outF={700} frame={frame} style={{ position: 'absolute', bottom: 55, left: 0, right: 0, textAlign: 'center', fontSize: 17, fontWeight: 700, color: CORAL }}>Peak: 341,000 views</Txt>

      {/* ═══ S6: TK chart close-up ═══ */}
      {s6 > 0.01 && <div style={{ position: 'absolute', inset: 0, opacity: s6 }}><ChartCard color={CORAL} data={tkData} label="TikTok Views" sub="30-day rolling" frame={frame} startF={728} drawDur={75} area/></div>}
      <Txt inF={755} outF={835} frame={frame} style={{ position: 'absolute', bottom: 85, left: 0, right: 0, textAlign: 'center', fontSize: 24, fontWeight: 600, color: '#fff' }}>TikTok Views</Txt>
      <Txt inF={770} outF={850} frame={frame} style={{ position: 'absolute', bottom: 55, left: 0, right: 0, textAlign: 'center', fontSize: 19, fontWeight: 700, color: CORAL }}>1.3 million views in a single week.</Txt>

      {/* ═══ S7: Full dashboard pull-back ═══ */}
      {s7 > 0.01 && <div style={{ position: 'absolute', inset: 0, opacity: s7 }}><DashWin scale={s7scale} opacity={1} frame={frame}/></div>}
      <Txt inF={920} outF={1020} frame={frame} style={{ position: 'absolute', bottom: 55, left: 0, right: 0, textAlign: 'center', fontSize: 19, color: 'rgba(255,255,255,0.5)' }}>Everything your client needs. One place.</Txt>

      {/* ═══ S8: Offer ═══ */}
      {s8 > 0.01 && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: s8 }}>
          <div style={{ textAlign: 'center' }}>
            <Txt inF={1058} outF={1223} frame={frame} style={{ fontSize: 42, fontWeight: 600, color: '#fff' }}>Included with every retainer.</Txt>
            <Txt inF={1066} outF={1223} frame={frame} style={{ fontSize: 22, color: 'rgba(255,255,255,0.6)', marginTop: 18 }}>Your own dashboard. Your own login. Your own data.</Txt>
            <Txt inF={1074} outF={1223} frame={frame} style={{ fontSize: 22, fontWeight: 500, color: CORAL, marginTop: 14 }}>No extra cost. No setup fee. Just results.</Txt>
          </div>
        </div>
      )}

      {/* ═══ S9: Brand ═══ */}
      {frame >= 1218 && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: s9op * endFade }}>
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 550, height: 300, borderRadius: '50%', background: `radial-gradient(circle,rgba(232,85,60,${glow})0%,transparent 70%)`, filter: 'blur(60px)' }}/>
          <div style={{ position: 'relative', textAlign: 'center' }}>
            <div style={{ fontSize: 76, fontWeight: 700, letterSpacing: -2, opacity: brOp, fontFamily: FNT }}><span style={{ color: '#fff' }}>Fusion </span><span style={{ color: CORAL }}>Creative</span></div>
            <div style={{ fontSize: 24, color: 'rgba(255,255,255,0.55)', marginTop: 18, opacity: tgOp, fontFamily: FNT }}>Your growth, visualised.</div>
            <div style={{ fontSize: 16, color: 'rgba(255,255,255,0.3)', marginTop: 12, opacity: urlOp, fontFamily: FNT }}>fusioncreative.uk</div>
          </div>
        </div>
      )}
    </div>
  );
}
