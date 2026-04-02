import React from 'react';
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
  Sequence,
} from 'remotion';

/* =========================================
   Data
   ========================================= */

const BEFORE = {
  label: 'Before',
  period: '28 Nov - 27 Dec',
  views: 46436,
  adsPercent: '0.0%',
  followers: 23.3,
  nonFollowers: 76.7,
  accountsReached: 16378,
  reachChange: '-8.4%',
  reachChangeColor: '#ff4444',
  contentTypes: [
    { name: 'Reels', pct: 51.7, color: '#8B5CF6' },
    { name: 'Posts', pct: 33.9, color: '#8B5CF6' },
    { name: 'Stories', pct: 14.4, color: '#8B5CF6' },
  ],
};

const AFTER = {
  label: 'After',
  period: '15 Feb - 16 Mar',
  views: 341945,
  adsPercent: '3.4%',
  followers: 6.5,
  nonFollowers: 93.5,
  accountsReached: 184897,
  reachChange: '+357.0%',
  reachChangeColor: '#22c55e',
  contentTypes: [
    { name: 'Reels', pct: 96.8, color: '#8B5CF6' },
    { name: 'Stories', pct: 1.9, color: '#8B5CF6' },
    { name: 'Posts', pct: 1.3, color: '#8B5CF6' },
  ],
};

/* =========================================
   Helpers
   ========================================= */

function formatNumber(n) {
  return Math.round(n).toLocaleString('en-US');
}

function useSpring(frame, fps, delay, config = {}) {
  return spring({
    frame: frame - delay,
    fps,
    config: { damping: 18, stiffness: 120, mass: 0.8, ...config },
  });
}

/* =========================================
   Donut Chart (SVG)
   ========================================= */

function DonutChart({ followers, nonFollowers, progress, size = 200 }) {
  const stroke = 14;
  const radius = (size - stroke) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = 2 * Math.PI * radius;

  const followersArc = (followers / 100) * circumference * progress;
  const nonFollowersArc = (nonFollowers / 100) * circumference * progress;
  const gap = 4;

  const followersRotation = -90;
  const nonFollowersRotation = -90 + (followers / 100) * 360 * progress;

  return (
    <svg width={size} height={size} style={{ overflow: 'visible' }}>
      {/* Track */}
      <circle
        cx={cx}
        cy={cy}
        r={radius}
        fill="none"
        stroke="rgba(255,255,255,0.08)"
        strokeWidth={stroke}
      />
      {/* Non-followers (pink/magenta) */}
      <circle
        cx={cx}
        cy={cy}
        r={radius}
        fill="none"
        stroke="#d946ef"
        strokeWidth={stroke}
        strokeDasharray={`${nonFollowersArc - gap} ${circumference}`}
        strokeLinecap="round"
        transform={`rotate(${nonFollowersRotation} ${cx} ${cy})`}
        style={{ transition: 'stroke-dasharray 0.3s' }}
      />
      {/* Followers (purple) */}
      <circle
        cx={cx}
        cy={cy}
        r={radius}
        fill="none"
        stroke="#8B5CF6"
        strokeWidth={stroke}
        strokeDasharray={`${followersArc - gap} ${circumference}`}
        strokeLinecap="round"
        transform={`rotate(${followersRotation} ${cx} ${cy})`}
        style={{ transition: 'stroke-dasharray 0.3s' }}
      />
    </svg>
  );
}

/* =========================================
   Content Type Bar
   ========================================= */

function ContentBar({ name, pct, progress, delay, frame, fps }) {
  const barProgress = interpolate(
    frame - delay,
    [0, 30],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) }
  );

  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: 4,
        fontSize: 13,
        color: 'rgba(255,255,255,0.85)',
        fontFamily: 'Inter, -apple-system, sans-serif',
      }}>
        <span>{name}</span>
        <span>{(pct * barProgress).toFixed(1)}%</span>
      </div>
      <div style={{
        height: 8,
        borderRadius: 4,
        background: 'rgba(255,255,255,0.08)',
        overflow: 'hidden',
        position: 'relative',
      }}>
        <div style={{
          position: 'absolute',
          left: 0,
          top: 0,
          height: '100%',
          borderRadius: 4,
          width: `${pct * barProgress}%`,
          background: 'linear-gradient(90deg, #ec4899, #8B5CF6)',
        }} />
      </div>
    </div>
  );
}

/* =========================================
   Analytics Card
   ========================================= */

function AnalyticsCard({ data, side, frame, fps }) {
  const isAfter = side === 'right';
  const cardDelay = isAfter ? 20 : 0;

  // Card entrance
  const slideX = isAfter ? 60 : -60;
  const entrance = useSpring(frame, fps, cardDelay);
  const cardX = interpolate(entrance, [0, 1], [slideX, 0]);
  const cardOpacity = interpolate(entrance, [0, 1], [0, 1]);

  // Donut animation
  const donutProgress = interpolate(
    frame - cardDelay - 15,
    [0, 45],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) }
  );

  // Number count-up
  const countProgress = interpolate(
    frame - cardDelay - 20,
    [0, 40],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) }
  );

  const currentViews = data.views * countProgress;
  const currentReach = data.accountsReached * countProgress;

  // Stats fade in
  const statsFade = interpolate(
    frame - cardDelay - 30,
    [0, 20],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Label badge
  const badgeColor = isAfter ? '#22c55e' : 'rgba(255,255,255,0.15)';
  const badgeTextColor = isAfter ? '#ffffff' : 'rgba(255,255,255,0.6)';

  return (
    <div style={{
      transform: `translateX(${cardX}px)`,
      opacity: cardOpacity,
      width: 420,
      background: 'rgba(255,255,255,0.04)',
      border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: 24,
      padding: '28px 28px 24px',
      backdropFilter: 'blur(20px)',
      position: 'relative',
    }}>
      {/* Label badge */}
      <div style={{
        position: 'absolute',
        top: -14,
        left: '50%',
        transform: 'translateX(-50%)',
        background: badgeColor,
        color: badgeTextColor,
        fontSize: 12,
        fontWeight: 700,
        fontFamily: 'Inter, sans-serif',
        padding: '5px 20px',
        borderRadius: 20,
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
      }}>
        {data.label}
      </div>

      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
        marginTop: 8,
      }}>
        <span style={{
          fontSize: 13,
          fontFamily: 'Inter, sans-serif',
          fontWeight: 600,
          color: 'rgba(255,255,255,0.9)',
        }}>Views</span>
        <span style={{
          fontSize: 12,
          fontFamily: 'Inter, sans-serif',
          color: 'rgba(255,255,255,0.4)',
        }}>{data.period}</span>
      </div>

      {/* Donut + views */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        margin: '16px 0',
        position: 'relative',
      }}>
        <DonutChart
          followers={data.followers}
          nonFollowers={data.nonFollowers}
          progress={donutProgress}
          size={180}
        />
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
        }}>
          <div style={{
            fontSize: 11,
            color: 'rgba(255,255,255,0.5)',
            fontFamily: 'Inter, sans-serif',
            marginBottom: 2,
          }}>Views</div>
          <div style={{
            fontSize: 32,
            fontWeight: 800,
            fontFamily: 'Inter, -apple-system, sans-serif',
            color: '#fff',
            letterSpacing: '-0.02em',
            lineHeight: 1,
          }}>{formatNumber(currentViews)}</div>
          <div style={{
            fontSize: 11,
            color: 'rgba(255,255,255,0.4)',
            fontFamily: 'Inter, sans-serif',
            marginTop: 4,
          }}>{data.adsPercent} from ads</div>
        </div>
      </div>

      {/* Follower breakdown */}
      <div style={{ opacity: statsFade, marginBottom: 16 }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '8px 0',
          fontSize: 13,
          fontFamily: 'Inter, sans-serif',
          color: 'rgba(255,255,255,0.8)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 8, height: 8, borderRadius: 4, background: '#d946ef' }} />
            <span>Followers</span>
          </div>
          <span style={{ fontWeight: 600 }}>{data.followers}%</span>
        </div>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '8px 0',
          fontSize: 13,
          fontFamily: 'Inter, sans-serif',
          color: 'rgba(255,255,255,0.8)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 8, height: 8, borderRadius: 4, background: '#8B5CF6' }} />
            <span>Non-followers</span>
          </div>
          <span style={{ fontWeight: 600 }}>{data.nonFollowers}%</span>
        </div>

        {/* Divider */}
        <div style={{
          height: 1,
          background: 'rgba(255,255,255,0.06)',
          margin: '8px 0',
        }} />

        {/* Accounts reached */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          padding: '8px 0',
          fontSize: 13,
          fontFamily: 'Inter, sans-serif',
          color: 'rgba(255,255,255,0.8)',
        }}>
          <span>Accounts reached</span>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontWeight: 700, fontSize: 15 }}>{formatNumber(currentReach)}</div>
            <div style={{
              fontSize: 11,
              color: data.reachChangeColor,
              fontWeight: 600,
            }}>{data.reachChange}</div>
          </div>
        </div>

        {/* Divider */}
        <div style={{
          height: 1,
          background: 'rgba(255,255,255,0.06)',
          margin: '8px 0',
        }} />
      </div>

      {/* Content type bars */}
      <div style={{ opacity: statsFade }}>
        <div style={{
          fontSize: 14,
          fontWeight: 700,
          fontFamily: 'Inter, sans-serif',
          color: 'rgba(255,255,255,0.9)',
          marginBottom: 12,
        }}>By content type</div>
        {data.contentTypes.map((ct, i) => (
          <ContentBar
            key={ct.name}
            name={ct.name}
            pct={ct.pct}
            progress={donutProgress}
            delay={cardDelay + 40 + i * 8}
            frame={frame}
            fps={fps}
          />
        ))}
      </div>
    </div>
  );
}

/* =========================================
   Main Composition
   ========================================= */

export function InstagramBeforeAfter() {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // Title animation
  const titleEntrance = useSpring(frame, fps, 0, { damping: 20 });
  const titleY = interpolate(titleEntrance, [0, 1], [-30, 0]);
  const titleOpacity = interpolate(titleEntrance, [0, 1], [0, 1]);

  // Arrow animation
  const arrowDelay = 50;
  const arrowEntrance = useSpring(frame, fps, arrowDelay);
  const arrowScale = interpolate(arrowEntrance, [0, 1], [0, 1]);
  const arrowPulse = interpolate(
    frame - arrowDelay - 15,
    [0, 30, 60],
    [1, 1.15, 1],
    { extrapolateRight: 'extend' }
  );

  // Subtitle
  const subEntrance = useSpring(frame, fps, 60);
  const subOpacity = interpolate(subEntrance, [0, 1], [0, 1]);

  return (
    <div style={{
      width,
      height,
      background: '#000000',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Gradient background */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(ellipse 80% 60% at 30% 80%, rgba(139,92,246,0.12) 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 70% 20%, rgba(217,70,239,0.08) 0%, transparent 50%), #0a0a0a',
      }} />

      {/* Noise overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        opacity: 0.03,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'repeat',
        backgroundSize: '256px 256px',
      }} />

      {/* Title */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        textAlign: 'center',
        marginBottom: 36,
        transform: `translateY(${titleY}px)`,
        opacity: titleOpacity,
      }}>
        <h1 style={{
          fontFamily: 'Inter, -apple-system, sans-serif',
          fontSize: 42,
          fontWeight: 800,
          color: '#ffffff',
          letterSpacing: '-0.03em',
          margin: 0,
          lineHeight: 1.1,
        }}>
          Instagram Growth Results
        </h1>
        <p style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: 16,
          color: 'rgba(255,255,255,0.45)',
          marginTop: 10,
          fontWeight: 500,
          opacity: subOpacity,
        }}>
          46K views to 342K views in 3 months
        </p>
      </div>

      {/* Cards row */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        display: 'flex',
        alignItems: 'center',
        gap: 48,
      }}>
        <AnalyticsCard data={BEFORE} side="left" frame={frame} fps={fps} />

        {/* Arrow */}
        <div style={{
          transform: `scale(${arrowScale * arrowPulse})`,
          opacity: arrowScale,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 8,
        }}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#8B5CF6" strokeWidth="2">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
          <span style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: 12,
            fontWeight: 700,
            color: '#8B5CF6',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
          }}>+636%</span>
        </div>

        <AnalyticsCard data={AFTER} side="right" frame={frame} fps={fps} />
      </div>

      {/* Watermark */}
      <div style={{
        position: 'absolute',
        bottom: 28,
        right: 36,
        fontFamily: 'Inter, sans-serif',
        fontSize: 13,
        fontWeight: 600,
        color: 'rgba(255,255,255,0.2)',
        letterSpacing: '0.02em',
      }}>
        Fusion Creative
      </div>
    </div>
  );
}
