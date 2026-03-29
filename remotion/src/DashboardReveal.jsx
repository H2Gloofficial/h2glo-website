import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate, spring, Sequence } from 'remotion';

const CORAL = '#E8553C';
const BG = '#0a0a0a';

// ─── Cursor SVG ───
function MacCursor({ style }) {
  return (
    <svg width="24" height="32" viewBox="0 0 24 32" fill="none" style={style}>
      <path
        d="M2 1L2 23.5L7.5 18L13 28L16.5 26.5L11 16.5L18 16.5L2 1Z"
        fill="white"
        stroke="black"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ─── macOS Traffic Lights ───
function TrafficLights() {
  const dots = [
    { color: '#FF5F57', border: '#E0443E' },
    { color: '#FEBC2E', border: '#DEA123' },
    { color: '#28C840', border: '#1AAB29' },
  ];
  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      {dots.map((d, i) => (
        <div
          key={i}
          style={{
            width: 12,
            height: 12,
            borderRadius: '50%',
            background: d.color,
            border: `1px solid ${d.border}`,
          }}
        />
      ))}
    </div>
  );
}

// ─── Stat Card ───
function StatCard({ label, value, suffix, frame, delay }) {
  const countStart = 180 + delay;
  const progress = interpolate(frame, [countStart, countStart + 60], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const eased = 1 - Math.pow(1 - progress, 3);
  const num = Math.round(eased * value);
  let display;
  if (suffix === 'M') display = (num / 1000000).toFixed(1) + 'M';
  else if (suffix === 'K') display = (num / 1000).toFixed(1) + 'K';
  else display = num.toLocaleString();

  return (
    <div
      style={{
        background: '#1a1a1a',
        borderRadius: 12,
        padding: '16px 20px',
        flex: 1,
        border: '1px solid #2a2a2a',
      }}
    >
      <div style={{ fontSize: 11, color: '#666', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 8 }}>
        {label}
      </div>
      <div style={{ fontSize: 28, fontWeight: 700, color: '#fff', fontVariantNumeric: 'tabular-nums' }}>
        {display}
      </div>
    </div>
  );
}

// ─── Line Chart ───
function LineChart({ color, drawStart, frame, data, label }) {
  const progress = interpolate(frame, [drawStart, drawStart + 60], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const eased = 1 - Math.pow(1 - progress, 2);

  const w = 440;
  const h = 100;
  const points = data.map((v, i) => ({
    x: (i / (data.length - 1)) * w,
    y: h - (v / Math.max(...data)) * h * 0.85 - 8,
  }));

  const pathD = points.map((p, i) => (i === 0 ? `M${p.x},${p.y}` : `L${p.x},${p.y}`)).join(' ');
  const areaD = pathD + ` L${w},${h} L0,${h} Z`;

  return (
    <div style={{ flex: 1, background: '#1a1a1a', borderRadius: 12, padding: '16px 20px', border: '1px solid #2a2a2a' }}>
      <div style={{ fontSize: 13, fontWeight: 600, color: '#fff', marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 10, color: '#666', marginBottom: 12 }}>30-day rolling</div>
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ display: 'block', width: '100%', height: 'auto' }}>
        {/* Grid lines */}
        {[0.25, 0.5, 0.75].map((r) => (
          <line key={r} x1="0" y1={h * r} x2={w} y2={h * r} stroke="#2a2a2a" strokeWidth="0.5" />
        ))}
        {/* Area fill */}
        <clipPath id={`clip-${label.replace(/\s/g, '')}`}>
          <rect x="0" y="0" width={w * eased} height={h} />
        </clipPath>
        <path
          d={areaD}
          fill={color}
          fillOpacity={0.08}
          clipPath={`url(#clip-${label.replace(/\s/g, '')})`}
        />
        {/* Line */}
        <path
          d={pathD}
          fill="none"
          stroke={color}
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={w * 3}
          strokeDashoffset={w * 3 * (1 - eased)}
        />
      </svg>
    </div>
  );
}

// ─── Text Overlay ───
function TextOverlay({ text, fadeIn, fadeOut, frame }) {
  const opacity = interpolate(
    frame,
    [fadeIn, fadeIn + 15, fadeOut - 15, fadeOut],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );
  const y = interpolate(frame, [fadeIn, fadeIn + 15], [12, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <div
      style={{
        position: 'absolute',
        bottom: 60,
        left: 0,
        right: 0,
        textAlign: 'center',
        opacity,
        transform: `translateY(${y}px)`,
        fontSize: 22,
        fontWeight: 500,
        color: 'rgba(255,255,255,0.7)',
        letterSpacing: 0.5,
      }}
    >
      {text}
    </div>
  );
}

// ─── Main Composition ───
export function DashboardReveal() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ── Scene 1: Icon + Cursor (0-90) ──
  const iconScale = spring({ frame, fps, from: 0, to: 1, config: { damping: 12, stiffness: 120 } });

  const cursorX = interpolate(frame, [20, 65], [500, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const cursorEased = 1 - Math.pow(1 - interpolate(frame, [20, 65], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  }), 3);
  const cursorActualX = 500 * (1 - cursorEased);

  // Double click animation
  const click1 = interpolate(frame, [68, 72, 76], [1, 0.85, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const click2 = interpolate(frame, [78, 82, 86], [1, 0.85, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const cursorScale = click1 * click2;

  // ── Scene 2: Window (90-180) ──
  const windowSpring = spring({
    frame: Math.max(0, frame - 90),
    fps,
    from: 0,
    to: 1,
    config: { damping: 14, stiffness: 100 },
  });
  const windowScale = interpolate(windowSpring, [0, 1], [0.1, 1]);
  const windowOpacity = interpolate(frame, [90, 100], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const dashboardFade = interpolate(frame, [110, 140], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // ── Scene 4: Close (360-450) ──
  const closeScale = interpolate(frame, [360, 400], [1, 0.85], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const closeFade = interpolate(frame, [360, 400], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const brandFade = interpolate(frame, [390, 420], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const taglineFade = interpolate(frame, [410, 435], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const glowPulse = 0.4 + 0.2 * Math.sin((frame - 390) * 0.08);

  // Scene visibility
  const showIcon = frame < 100;
  const showWindow = frame >= 90 && frame < 410;
  const showBrand = frame >= 380;

  // IG chart data
  const igData = [120, 180, 250, 220, 340, 380, 310, 420, 500, 480, 520, 600, 580, 650, 700, 680, 750, 800, 770, 850];
  const tkData = [80, 150, 200, 350, 300, 450, 500, 420, 600, 700, 650, 800, 750, 900, 850, 950, 1000, 1100, 1050, 1200];

  return (
    <div
      style={{
        width: 1920,
        height: 1080,
        background: BG,
        fontFamily: "'Space Grotesk', -apple-system, system-ui, sans-serif",
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Subtle radial glow */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: 800,
          height: 800,
          transform: 'translate(-50%, -50%)',
          background: 'radial-gradient(circle, rgba(232,85,60,0.04) 0%, transparent 70%)',
          borderRadius: '50%',
        }}
      />

      {/* ── Scene 1: App Icon ── */}
      {showIcon && (
        <>
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: `translate(-50%, -50%) scale(${iconScale})`,
              width: 128,
              height: 128,
              borderRadius: 28,
              background: 'linear-gradient(135deg, #1a1a1a 0%, #111 100%)',
              border: '1px solid #333',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
            }}
          >
            <span style={{ fontSize: 56, fontWeight: 700, color: CORAL, fontFamily: "'Space Grotesk', sans-serif" }}>
              F
            </span>
          </div>

          {/* Cursor */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: `translate(${cursorActualX + 10}px, 10px) scale(${cursorScale})`,
              transformOrigin: 'top left',
              opacity: interpolate(frame, [20, 30], [0, 1], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
              }),
            }}
          >
            <MacCursor />
          </div>
        </>
      )}

      {/* ── Scene 2 & 3: Window ── */}
      {showWindow && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: `translate(-50%, -50%) scale(${windowScale * closeScale})`,
            opacity: windowOpacity * closeFade,
            width: 1440,
            borderRadius: 12,
            overflow: 'hidden',
            boxShadow: '0 40px 120px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.05)',
          }}
        >
          {/* Title bar */}
          <div
            style={{
              background: '#1e1e1e',
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              borderBottom: '1px solid #2a2a2a',
            }}
          >
            <TrafficLights />
            <div style={{ fontSize: 13, color: '#888', fontWeight: 500, flex: 1, textAlign: 'center', marginRight: 68 }}>
              Fusion Creative — New Greek
            </div>
          </div>

          {/* Dashboard content */}
          <div
            style={{
              background: '#0d0d0d',
              padding: 32,
              opacity: dashboardFade,
              minHeight: 500,
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 28 }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: '50%',
                  background: '#E8573C',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 20,
                  fontWeight: 700,
                  color: '#fff',
                }}
              >
                N
              </div>
              <div>
                <div style={{ fontSize: 22, fontWeight: 700, color: '#fff' }}>New Greek</div>
                <div style={{ fontSize: 12, color: '#666' }}>Growth reporting and analytics</div>
              </div>
            </div>

            {/* Stat cards */}
            <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
              <StatCard label="Total Reach" value={2300000} suffix="M" frame={frame} delay={0} />
              <StatCard label="Impressions" value={3100000} suffix="M" frame={frame} delay={6} />
              <StatCard label="Engagements" value={55300} suffix="K" frame={frame} delay={12} />
              <StatCard label="Profile Visits" value={10900} suffix="K" frame={frame} delay={18} />
            </div>

            {/* Charts */}
            <div style={{ display: 'flex', gap: 16 }}>
              <LineChart color="#fff" drawStart={200} frame={frame} data={igData} label="Instagram Views" />
              <LineChart color={CORAL} drawStart={260} frame={frame} data={tkData} label="TikTok Views" />
            </div>
          </div>
        </div>
      )}

      {/* ── Scene 3: Text Overlays ── */}
      <TextOverlay text="Real-time performance tracking" fadeIn={180} fadeOut={240} frame={frame} />
      <TextOverlay text="30-day rolling analytics" fadeIn={240} fadeOut={300} frame={frame} />
      <TextOverlay text="Content intelligence, built in" fadeIn={300} fadeOut={360} frame={frame} />

      {/* ── Scene 4: Brand Close ── */}
      {showBrand && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            opacity: brandFade,
          }}
        >
          {/* Glow */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 400,
              height: 200,
              background: `radial-gradient(circle, rgba(232,85,60,${glowPulse}) 0%, transparent 70%)`,
              borderRadius: '50%',
              filter: 'blur(40px)',
            }}
          />
          <div
            style={{
              position: 'relative',
              fontSize: 64,
              fontWeight: 700,
              letterSpacing: -1,
            }}
          >
            <span style={{ color: '#fff' }}>Fusion </span>
            <span style={{ color: CORAL }}>Creative</span>
          </div>
          <div
            style={{
              position: 'relative',
              fontSize: 20,
              color: 'rgba(255,255,255,0.6)',
              marginTop: 16,
              fontWeight: 400,
              opacity: taglineFade,
            }}
          >
            Your growth, visualised.
          </div>
        </div>
      )}
    </div>
  );
}
