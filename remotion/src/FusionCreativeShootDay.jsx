import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate, spring, AbsoluteFill } from 'remotion';
import { evolvePath } from '@remotion/paths';

// ── Brand Colours ──
const BG = "#0D0D0D";
const SURFACE = "#161616";
const ACCENT = "#E8645A";
const ACCENT_GLOW = "rgba(232,100,90,0.15)";
const WHITE = "#F0F0F0";
const GREY = "#888888";
const BORDER = "rgba(255,255,255,0.06)";

// ── Typography ──
const BEBAS = "'Bebas Neue', sans-serif";
const DM = "'DM Sans', sans-serif";

// ── Clamp shorthand ──
const C = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' };

// ── Spring helper ──
const spr = (f, fps, cfg = {}) =>
  Math.min(1, Math.max(0, spring({
    frame: Math.max(0, f),
    fps,
    config: { stiffness: 200, damping: 15, mass: 1, ...cfg },
  })));

// ── Squircle clip path ──
const squirclePath = (w, h, r) =>
  `M ${r},0 H ${w - r} Q ${w},0 ${w},${r} V ${h - r} Q ${w},${h} ${w - r},${h} H ${r} Q 0,${h} 0,${h - r} V ${r} Q 0,0 ${r},0 Z`;

function SquircleCard({ width, height, radius, children, style }) {
  const clipId = `sq-${width}-${height}-${radius}-${Math.random().toString(36).slice(2, 6)}`;
  return (
    <div style={{ position: 'relative', width, height, ...style }}>
      <svg style={{ position: 'absolute', width: 0, height: 0 }}>
        <defs>
          <clipPath id={clipId} clipPathUnits="objectBoundingBox">
            <path d={squirclePath(1, 1, radius / Math.max(width, height))} />
          </clipPath>
        </defs>
      </svg>
      <div style={{
        width, height,
        clipPath: `url(#${clipId})`,
        WebkitClipPath: `url(#${clipId})`,
      }}>
        {children}
      </div>
    </div>
  );
}

// ── Grid background ──
function GridBG({ opacity = 0.03 }) {
  return (
    <div style={{
      position: 'absolute', inset: 0,
      backgroundImage: `
        linear-gradient(rgba(255,255,255,${opacity}) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255,255,255,${opacity}) 1px, transparent 1px)
      `,
      backgroundSize: '40px 40px',
    }} />
  );
}

// ── Coral radial glow ──
function CoralGlow({ frame, cx = 50, cy = 15, opacity = 0.06 }) {
  const drift = Math.sin(frame * 0.004) * 5;
  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: `radial-gradient(ellipse at ${cx + drift}% ${cy}%, rgba(232,100,90,${opacity}) 0%, transparent 65%)`,
    }} />
  );
}

// ── Scene 1: Cold Open Hook (frames 0-108) ──
function Scene1({ frame, fps }) {
  if (frame > 120) return null;

  const fadeIn = interpolate(frame, [0, 12], [0, 1], C);

  const lines = [
    { text: "TODAY WE'RE DOING", color: WHITE, delay: 0, stiffness: 320 },
    { text: "A CONTENT SHOOT", color: ACCENT, delay: 6, stiffness: 310 },
    { text: "AT A CLIENT.", color: WHITE, delay: 12, stiffness: 330 },
  ];

  const labelOpacity = interpolate(frame, [80, 95], [0, 1], C);

  return (
    <AbsoluteFill style={{ opacity: fadeIn }}>
      <CoralGlow frame={frame} />
      <GridBG />

      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        gap: 8,
      }}>
        {lines.map((line, i) => {
          const prog = spr(frame - line.delay, fps, { stiffness: line.stiffness, damping: 14 });
          const y = interpolate(prog, [0, 1], [120, 0], C);
          return (
            <div key={i} style={{
              fontFamily: BEBAS,
              fontSize: 96,
              color: line.color,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              lineHeight: 1.05,
              textAlign: 'center',
              transform: `translateY(${y}px)`,
              opacity: prog,
            }}>
              {line.text}
            </div>
          );
        })}

        <div style={{
          fontFamily: DM,
          fontSize: 14,
          color: GREY,
          marginTop: 32,
          opacity: labelOpacity,
          letterSpacing: '0.05em',
        }}>
          Newcastle &middot; Fusion Creative
        </div>
      </div>
    </AbsoluteFill>
  );
}

// ── Scene 2: The Strategy (frames 108-270) ──
function Scene2({ frame, fps }) {
  if (frame < 100 || frame > 285) return null;
  const local = frame - 108;

  // Coral wipe line
  const wipeProgress = interpolate(local, [0, 20], [0, 100], C);
  const wipeOpacity = interpolate(local, [0, 5, 15, 25], [0, 1, 1, 0], C);

  // Heading
  const headProg = spr(local - 15, fps, { stiffness: 190, damping: 16 });
  const subProg = spr(local - 22, fps, { stiffness: 175, damping: 15 });

  const cards = [
    {
      icon: "M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z",
      label: "TRENDING SOUNDS",
      sub: "researched before every shoot",
      delay: 30, stiffness: 210,
    },
    {
      icon: "M12 2a10 10 0 100 20 10 10 0 000-20zm0 4a6 6 0 100 12 6 6 0 000-12zm0 4a2 2 0 100 4 2 2 0 000-4z",
      label: "FORMAT STRATEGY",
      sub: "every shot has a purpose",
      delay: 38, stiffness: 220,
    },
    {
      icon: "M3 3v18h18M7 17l4-8 4 4 5-10",
      label: "ALGORITHM BRIEF",
      sub: "built around what performs now",
      delay: 46, stiffness: 195,
    },
  ];

  return (
    <AbsoluteFill>
      <CoralGlow frame={frame} cy={20} opacity={0.04} />
      <GridBG opacity={0.02} />

      {/* Coral wipe */}
      <div style={{
        position: 'absolute', top: '50%', left: 0,
        width: `${wipeProgress}%`, height: 2,
        background: ACCENT, opacity: wipeOpacity,
      }} />

      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '0 80px',
      }}>
        {/* Heading */}
        <div style={{
          fontFamily: BEBAS, fontSize: 72, color: WHITE,
          textTransform: 'uppercase', letterSpacing: '0.06em',
          textAlign: 'center', marginBottom: 12,
          opacity: headProg,
          transform: `translateY(${interpolate(headProg, [0, 1], [40, 0], C)}px)`,
        }}>
          THE STRATEGY
        </div>
        <div style={{
          fontFamily: DM, fontSize: 16, color: GREY,
          textAlign: 'center', marginBottom: 64,
          opacity: subProg,
        }}>
          This is what most agencies skip.
        </div>

        {/* Cards */}
        <div style={{ display: 'flex', gap: 20, justifyContent: 'center' }}>
          {cards.map((card, i) => {
            const prog = spr(local - card.delay, fps, { stiffness: card.stiffness, damping: 14 });
            const y = interpolate(prog, [0, 1], [80, 0], C);
            return (
              <div key={i} style={{
                width: 280, padding: 28,
                background: 'rgba(255,255,255,0.04)',
                backdropFilter: 'blur(6px)',
                WebkitBackdropFilter: 'blur(6px)',
                borderRadius: 20,
                borderLeft: `3px solid ${ACCENT}`,
                border: `1px solid ${BORDER}`,
                borderLeftWidth: 3,
                borderLeftColor: ACCENT,
                transform: `translateY(${y}px)`,
                opacity: prog,
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                  stroke={ACCENT} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                  style={{ marginBottom: 16 }}>
                  <path d={card.icon} />
                </svg>
                <div style={{
                  fontFamily: DM, fontSize: 14, fontWeight: 700,
                  color: WHITE, marginBottom: 6, letterSpacing: '0.02em',
                }}>
                  {card.label}
                </div>
                <div style={{ fontFamily: DM, fontSize: 12, color: GREY }}>
                  {card.sub}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
}

// ── Scene 3: The Shoot (frames 270-540) ──
function Scene3({ frame, fps }) {
  if (frame < 260 || frame > 555) return null;
  const local = frame - 270;

  // Pulsing coral line at bottom
  const pulseA = 0.4 + Math.sin(frame * 0.08) * 0.3;

  // Bento grid spring
  const gridProg = spr(local - 5, fps, { stiffness: 185, damping: 16 });
  const gridY = interpolate(gridProg, [0, 1], [60, 0], C);

  // Shot list typing
  const shotItems = ["01. Hero food shot", "02. Reaction clip", "03. Behind the scenes"];
  const typeStart = 30;

  // Stat count up
  const countStart = 60;
  const countEnd = 120;
  const rawCount = interpolate(local, [countStart, countEnd], [0, 2.6], C);
  const countVal = rawCount.toFixed(1);

  // Underline
  const underlineW = interpolate(local, [countEnd, countEnd + 20], [0, 100], C);

  // Bottom label
  const labelOp = interpolate(local, [countEnd + 30, countEnd + 50], [0, 1], C);

  return (
    <AbsoluteFill>
      <CoralGlow frame={frame} cy={60} opacity={0.03} />

      {/* Pulsing coral line at bottom */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        height: 2, background: ACCENT, opacity: pulseA,
      }} />

      {/* Bento grid */}
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', gap: 16,
        padding: '120px 60px 80px',
        opacity: gridProg,
        transform: `translateY(${gridY}px)`,
      }}>
        {/* Left panel */}
        <div style={{
          flex: 1, background: SURFACE,
          borderRadius: 20, padding: 40,
          border: `1px solid ${BORDER}`,
          display: 'flex', flexDirection: 'column',
        }}>
          <div style={{
            fontFamily: BEBAS, fontSize: 48, color: ACCENT,
            textTransform: 'uppercase', letterSpacing: '0.05em',
            marginBottom: 40,
          }}>
            SHOOT DAY
          </div>

          <div style={{
            flex: 1, background: BG, borderRadius: 12,
            padding: 28, border: `1px solid ${BORDER}`,
          }}>
            {shotItems.map((item, i) => {
              const itemStart = typeStart + i * item.length;
              const charsVisible = Math.max(0, Math.min(item.length, local - itemStart));
              const text = item.slice(0, charsVisible);
              const showCursor = local >= itemStart && local < itemStart + item.length;
              return (
                <div key={i} style={{
                  fontFamily: DM, fontSize: 18, color: WHITE,
                  marginBottom: 20, minHeight: 24,
                  opacity: local >= itemStart ? 1 : 0.2,
                }}>
                  {text}
                  {showCursor && <span style={{ color: ACCENT }}>|</span>}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right panel */}
        <div style={{
          width: 380, background: SURFACE,
          borderRadius: 20, padding: 40,
          border: `1px solid ${BORDER}`,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{
            fontFamily: BEBAS, fontSize: 120, color: ACCENT,
            letterSpacing: '0.02em', lineHeight: 1,
          }}>
            {countVal}M
          </div>
          <div style={{
            fontFamily: DM, fontSize: 16, color: WHITE,
            textAlign: 'center', marginTop: 8,
          }}>
            views for a Newcastle restaurant
          </div>

          {/* Coral underline */}
          <div style={{
            width: `${underlineW}%`, height: 2,
            background: ACCENT, marginTop: 16,
            borderRadius: 1,
          }} />

          <div style={{
            fontFamily: DM, fontSize: 13, color: GREY,
            marginTop: 32, textAlign: 'center',
            opacity: labelOp,
          }}>
            This is what the strategy produces.
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
}

// ── Scene 4: The Result (frames 540-756) ──
function Scene4({ frame, fps }) {
  if (frame < 530 || frame > 770) return null;
  const local = frame - 540;

  const cardProg = spr(local, fps, { stiffness: 205, damping: 13 });
  const cardY = interpolate(cardProg, [0, 1], [200, 0], C);

  const textOpacity = interpolate(local, [60, 80], [0, 1], C);

  // Horizontal rule at frame 680
  const hrProgress = interpolate(frame, [680, 710], [0, 100], C);

  return (
    <AbsoluteFill>
      {/* Coral glow behind card */}
      <div style={{
        position: 'absolute', top: '30%', left: '50%',
        width: 600, height: 400,
        transform: 'translate(-50%, -50%)',
        background: `radial-gradient(ellipse, ${ACCENT_GLOW} 0%, transparent 70%)`,
        filter: 'blur(60px)',
        opacity: cardProg,
      }} />

      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '0 60px',
      }}>
        <div style={{
          width: '100%', maxWidth: 900,
          background: SURFACE, borderRadius: 24,
          padding: '80px 60px',
          border: `1px solid ${BORDER}`,
          transform: `translateY(${cardY}px)`,
          opacity: cardProg,
          textAlign: 'center',
        }}>
          <div style={{
            fontFamily: BEBAS, fontSize: 80, color: WHITE,
            textTransform: 'uppercase', letterSpacing: '0.04em',
            lineHeight: 1.1,
          }}>
            NOT JUST PRETTY VIDEOS.
          </div>
          <div style={{
            fontFamily: BEBAS, fontSize: 80, color: ACCENT,
            textTransform: 'uppercase', letterSpacing: '0.04em',
            lineHeight: 1.1, marginBottom: 32,
          }}>
            VIDEOS THAT WORK.
          </div>

          <div style={{ opacity: textOpacity }}>
            <div style={{
              fontFamily: DM, fontSize: 16, color: GREY,
              lineHeight: 1.8,
            }}>
              Content that brings people through the door.
            </div>
            <div style={{
              fontFamily: DM, fontSize: 16, color: GREY,
              lineHeight: 1.8,
            }}>
              Strategy, execution, results.
            </div>
          </div>

          {/* Coral horizontal rule */}
          <div style={{
            width: `${hrProgress}%`, height: 2,
            background: ACCENT, margin: '32px auto 0',
            borderRadius: 1,
          }} />
        </div>
      </div>
    </AbsoluteFill>
  );
}

// ── Scene 5: CTA (frames 756-900) ──
function Scene5({ frame, fps }) {
  if (frame < 746) return null;
  const local = frame - 756;

  // Background lighten
  const bgOpacity = interpolate(local, [0, 20], [0, 1], C);

  // Main heading
  const headProg = spr(local - 5, fps, { stiffness: 215, damping: 14 });
  const headY = interpolate(headProg, [0, 1], [60, 0], C);

  // Subheading
  const subProg = spr(local - 15, fps, { stiffness: 190, damping: 16 });

  // Button at frame 820 (local 64)
  const btnProg = spr(local - 64, fps, { stiffness: 240, damping: 13 });
  const btnScale = interpolate(btnProg, [0, 1], [0.8, 1], C);

  // Wordmark at frame 860 (local 104)
  const wmOpacity = interpolate(local, [104, 120], [0, 1], C);

  return (
    <AbsoluteFill>
      {/* Slightly lighter bg */}
      <div style={{
        position: 'absolute', inset: 0,
        background: SURFACE, opacity: bgOpacity,
      }} />
      <CoralGlow frame={frame} cy={40} opacity={0.05} />

      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '0 80px',
      }}>
        {/* Heading */}
        <div style={{
          fontFamily: BEBAS, fontSize: 64, color: WHITE,
          textTransform: 'uppercase', letterSpacing: '0.04em',
          textAlign: 'center', lineHeight: 1.15,
          transform: `translateY(${headY}px)`,
          opacity: headProg,
          maxWidth: 800,
        }}>
          RESTAURANT OR BAR IN THE NORTH EAST?
        </div>

        {/* Subheading */}
        <div style={{
          fontFamily: DM, fontSize: 18, color: GREY,
          textAlign: 'center', marginTop: 20,
          opacity: subProg,
        }}>
          Let us make your content go viral.
        </div>

        {/* Frosted pill button */}
        <div style={{
          marginTop: 48,
          padding: '16px 48px',
          borderRadius: 999,
          border: `1.5px solid ${WHITE}`,
          background: 'rgba(255,255,255,0.04)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          fontFamily: DM, fontSize: 16, fontWeight: 700,
          color: WHITE, letterSpacing: '0.02em',
          transform: `scale(${btnScale})`,
          opacity: btnProg,
        }}>
          LINK IN BIO
        </div>

        {/* Wordmark */}
        <div style={{
          position: 'absolute', bottom: 80,
          fontFamily: DM, fontSize: 14, fontWeight: 700,
          color: WHITE, letterSpacing: '0.15em',
          opacity: wmOpacity,
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <span style={{ color: ACCENT, fontSize: 18 }}>&middot;</span>
          FUSION CREATIVE
        </div>
      </div>
    </AbsoluteFill>
  );
}

// ── Main Composition ──
export function FusionCreativeShootDay() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{
      backgroundColor: BG,
      fontFamily: DM,
    }}>
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,700;1,9..40,400&display=swap');
      `}</style>

      <Scene1 frame={frame} fps={fps} />
      <Scene2 frame={frame} fps={fps} />
      <Scene3 frame={frame} fps={fps} />
      <Scene4 frame={frame} fps={fps} />
      <Scene5 frame={frame} fps={fps} />
    </AbsoluteFill>
  );
}
