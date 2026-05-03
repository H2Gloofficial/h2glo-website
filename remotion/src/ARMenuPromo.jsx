import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  staticFile,
  Sequence,
  Img,
} from 'remotion';

/* ============================================
   AR MENU PROMO - 9:16 vertical
   Phone mockup with mix grill emerging from screen
   ============================================ */

const COLORS = {
  bg: '#F0EAE0',
  bgDark: '#1D1D1F',
  gold: '#B8892A',
  goldLight: '#D4A843',
  text: '#1D1D1F',
  textMuted: '#6E6E73',
  signal: '#E63B2E',
};

// Generic iPhone frame component (Dynamic Island style)
const PhoneFrame = ({ children, scale = 1 }) => {
  const phoneWidth = 540 * scale;
  const phoneHeight = 1100 * scale;
  return (
    <div
      style={{
        width: phoneWidth,
        height: phoneHeight,
        background: '#0A0A0A',
        borderRadius: 70 * scale,
        padding: 12 * scale,
        boxShadow: '0 50px 120px rgba(0,0,0,0.45), 0 0 0 2px #2a2a2a, inset 0 0 0 6px #1a1a1a',
        position: 'relative',
      }}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          background: '#fff',
          borderRadius: 56 * scale,
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {/* Dynamic island */}
        <div
          style={{
            position: 'absolute',
            top: 16 * scale,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 130 * scale,
            height: 38 * scale,
            background: '#000',
            borderRadius: 999,
            zIndex: 10,
          }}
        />
        {children}
      </div>
    </div>
  );
};

// New Greek AR scanning UI inside the phone
const NewGreekUI = ({ frame, fps }) => {
  // Scanning line animation
  const scanProgress = interpolate(
    frame % (fps * 2),
    [0, fps * 2],
    [0, 1],
    { extrapolateRight: 'clamp' }
  );

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: '#F0EAE0',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <div
        style={{
          paddingTop: 80,
          paddingBottom: 18,
          paddingLeft: 24,
          paddingRight: 24,
          textAlign: 'center',
          background: 'rgba(255,255,255,0.6)',
          backdropFilter: 'blur(20px)',
        }}
      >
        <div
          style={{
            fontFamily: '"Cormorant Garamond", Georgia, serif',
            fontSize: 30,
            fontWeight: 700,
            color: COLORS.text,
            letterSpacing: '-0.01em',
            marginBottom: 4,
          }}
        >
          New Greek
        </div>
        <div
          style={{
            fontFamily: '"Inter", sans-serif',
            fontSize: 12,
            color: COLORS.textMuted,
            textTransform: 'uppercase',
            letterSpacing: '0.18em',
          }}
        >
          AR Menu / Newcastle
        </div>
      </div>

      {/* Main viewer area - this is where the dish "emerges" from */}
      <div
        style={{
          flex: 1,
          background: 'linear-gradient(180deg, #FAF6F1 0%, #E8E0D0 100%)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* AR scanning crosshair */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 320,
            height: 320,
            border: `2px solid ${COLORS.gold}`,
            borderRadius: 24,
            opacity: 0.6,
          }}
        >
          {[
            { top: -2, left: -2 },
            { top: -2, right: -2 },
            { bottom: -2, left: -2 },
            { bottom: -2, right: -2 },
          ].map((pos, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                ...pos,
                width: 28,
                height: 28,
                borderTop: pos.top !== undefined ? `4px solid ${COLORS.gold}` : 'none',
                borderBottom: pos.bottom !== undefined ? `4px solid ${COLORS.gold}` : 'none',
                borderLeft: pos.left !== undefined ? `4px solid ${COLORS.gold}` : 'none',
                borderRight: pos.right !== undefined ? `4px solid ${COLORS.gold}` : 'none',
                borderRadius: 4,
              }}
            />
          ))}
        </div>

        {/* Animated scanning line */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: `${scanProgress * 100}%`,
            height: 3,
            background: `linear-gradient(90deg, transparent 0%, ${COLORS.goldLight} 50%, transparent 100%)`,
            opacity: 0.7,
            boxShadow: `0 0 20px ${COLORS.goldLight}`,
          }}
        />

        {/* Status text */}
        <div
          style={{
            position: 'absolute',
            top: 40,
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(0,0,0,0.7)',
            color: '#fff',
            padding: '8px 18px',
            borderRadius: 999,
            fontFamily: '"Inter", sans-serif',
            fontSize: 12,
            fontWeight: 500,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: COLORS.signal,
              boxShadow: `0 0 8px ${COLORS.signal}`,
            }}
          />
          AR Active
        </div>
      </div>

      {/* Footer dish info */}
      <div
        style={{
          background: '#fff',
          padding: '18px 24px 32px',
          borderTop: '1px solid rgba(0,0,0,0.06)',
        }}
      >
        <div
          style={{
            fontFamily: '"Cormorant Garamond", Georgia, serif',
            fontSize: 26,
            fontWeight: 600,
            color: COLORS.text,
            marginBottom: 4,
          }}
        >
          Mix Grill for 2
        </div>
        <div
          style={{
            fontFamily: '"Inter", sans-serif',
            fontSize: 18,
            fontWeight: 700,
            color: COLORS.gold,
            marginBottom: 10,
          }}
        >
          £35.00
        </div>
        <div
          style={{
            background: COLORS.text,
            color: '#fff',
            padding: '12px 0',
            borderRadius: 14,
            textAlign: 'center',
            fontFamily: '"Inter", sans-serif',
            fontSize: 14,
            fontWeight: 600,
            letterSpacing: '0.02em',
          }}
        >
          Place on your table
        </div>
      </div>
    </div>
  );
};

// The dish image that "emerges" from the screen
const EmergingDish = ({ frame, fps }) => {
  const dishImg = staticFile('newgreek/mix-grill-02-front.jpg');

  // Three-phase animation:
  // 1. Fade in inside phone screen (0 - 30 frames)
  // 2. Scale up & emerge outward (30 - 90 frames)
  // 3. Float & gently rotate (90+ frames)
  const emergeProgress = spring({
    frame: frame - 20,
    fps,
    config: { damping: 14, stiffness: 80, mass: 1 },
  });

  // Scale: starts at 0.8 (within phone bounds) -> 1.5 (popping out)
  const scale = interpolate(emergeProgress, [0, 1], [0.85, 1.45], {
    extrapolateRight: 'clamp',
  });

  // Rotation Y: subtle yaw to imply 3D
  const rotateY = Math.sin(frame / 30) * 8;
  const rotateX = -10 - Math.sin(frame / 35) * 4;

  // Z translate to feel like it's coming forward
  const translateZ = interpolate(emergeProgress, [0, 1], [0, 80]);
  const translateY = interpolate(emergeProgress, [0, 1], [60, -90]);

  // Opacity for shadow under dish
  const shadowOpacity = interpolate(emergeProgress, [0, 1], [0.15, 0.45]);

  return (
    <div
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: `translate(-50%, -50%) translateY(${translateY}px)`,
        width: 480,
        height: 480,
        zIndex: 20,
        perspective: 1200,
        pointerEvents: 'none',
      }}
    >
      {/* Glow halo */}
      <div
        style={{
          position: 'absolute',
          inset: '-8%',
          background: `radial-gradient(circle, ${COLORS.gold}33 0%, transparent 60%)`,
          opacity: emergeProgress * 0.6,
          filter: 'blur(20px)',
        }}
      />

      {/* Floor shadow (under the dish) */}
      <div
        style={{
          position: 'absolute',
          bottom: '-4%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '70%',
          height: '8%',
          background: 'rgba(0,0,0,0.6)',
          borderRadius: '50%',
          filter: 'blur(20px)',
          opacity: shadowOpacity,
        }}
      />

      {/* The dish image with 3D transform */}
      <div
        style={{
          width: '100%',
          height: '100%',
          transform: `scale(${scale}) translateZ(${translateZ}px) rotateY(${rotateY}deg) rotateX(${rotateX}deg)`,
          transformStyle: 'preserve-3d',
          transformOrigin: 'center center',
        }}
      >
        <Img
          src={dishImg}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            filter: 'drop-shadow(0 30px 50px rgba(0,0,0,0.45)) drop-shadow(0 0 30px rgba(184, 137, 42, 0.25))',
          }}
        />
      </div>
    </div>
  );
};

// Particle sparkles around the emerging dish for "magic" feel
const Sparkles = ({ frame, fps }) => {
  const sparkles = React.useMemo(() => {
    return Array.from({ length: 18 }).map((_, i) => ({
      angle: (i / 18) * Math.PI * 2,
      delay: i * 3,
      radius: 200 + Math.random() * 80,
      size: 4 + Math.random() * 4,
    }));
  }, []);

  return (
    <div
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: 0,
        height: 0,
        zIndex: 21,
        pointerEvents: 'none',
      }}
    >
      {sparkles.map((s, i) => {
        const localFrame = Math.max(0, frame - 30 - s.delay);
        const lifeCycle = (localFrame % 60) / 60;
        const drift = lifeCycle * s.radius;
        const opacity = Math.sin(lifeCycle * Math.PI);

        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: Math.cos(s.angle) * drift,
              top: Math.sin(s.angle) * drift - lifeCycle * 60,
              width: s.size,
              height: s.size,
              background: COLORS.goldLight,
              borderRadius: '50%',
              opacity: opacity * 0.8,
              boxShadow: `0 0 8px ${COLORS.goldLight}`,
              transform: 'translate(-50%, -50%)',
            }}
          />
        );
      })}
    </div>
  );
};

// Title overlay sequence
const TitleOverlay = ({ text, subtext, frame, fps }) => {
  const enter = spring({ frame, fps, config: { damping: 18, mass: 0.7 } });
  const opacity = interpolate(enter, [0, 1], [0, 1]);
  const translateY = interpolate(enter, [0, 1], [30, 0]);

  return (
    <div
      style={{
        position: 'absolute',
        top: 100,
        left: 0,
        right: 0,
        textAlign: 'center',
        opacity,
        transform: `translateY(${translateY}px)`,
        zIndex: 30,
      }}
    >
      <div
        style={{
          fontFamily: '"DM Serif Display", Georgia, serif',
          fontSize: 90,
          fontWeight: 700,
          color: COLORS.text,
          letterSpacing: '-0.04em',
          lineHeight: 0.95,
          padding: '0 60px',
        }}
      >
        {text}
      </div>
      {subtext && (
        <div
          style={{
            fontFamily: '"Space Mono", monospace',
            fontSize: 24,
            color: COLORS.signal,
            marginTop: 24,
            textTransform: 'uppercase',
            letterSpacing: '0.18em',
            fontWeight: 400,
          }}
        >
          {subtext}
        </div>
      )}
    </div>
  );
};

const EndCard = ({ frame, fps }) => {
  const enter = spring({ frame, fps, config: { damping: 16 } });
  const scale = interpolate(enter, [0, 1], [0.9, 1]);
  const opacity = interpolate(enter, [0, 1], [0, 1]);

  return (
    <AbsoluteFill
      style={{
        background: COLORS.bgDark,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 80,
      }}
    >
      <div
        style={{
          fontFamily: '"Space Mono", monospace',
          fontSize: 28,
          color: COLORS.signal,
          textTransform: 'uppercase',
          letterSpacing: '0.2em',
          marginBottom: 48,
          opacity,
        }}
      >
        Fusion Creative
      </div>
      <div
        style={{
          fontFamily: '"DM Serif Display", Georgia, serif',
          fontSize: 110,
          fontWeight: 700,
          color: '#fff',
          letterSpacing: '-0.04em',
          lineHeight: 0.95,
          textAlign: 'center',
          marginBottom: 60,
          opacity,
          transform: `scale(${scale})`,
        }}
      >
        Your dishes.<br />
        <span style={{ color: COLORS.signal }}>On their table.</span>
      </div>
      <div
        style={{
          background: COLORS.signal,
          color: '#fff',
          padding: '28px 56px',
          borderRadius: 999,
          fontFamily: '"Space Grotesk", sans-serif',
          fontSize: 36,
          fontWeight: 600,
          opacity,
          marginBottom: 48,
        }}
      >
        fusioncreative.uk/ar-menu
      </div>
      <div
        style={{
          fontFamily: '"Space Mono", monospace',
          fontSize: 20,
          color: 'rgba(255,255,255,0.5)',
          textTransform: 'uppercase',
          letterSpacing: '0.2em',
          opacity,
        }}
      >
        AR menus for restaurants
      </div>
    </AbsoluteFill>
  );
};

export const ARMenuPromo = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Background pulse
  const bgPulse = Math.sin(frame / 60) * 0.05;

  return (
    <AbsoluteFill style={{ background: COLORS.bg, overflow: 'hidden' }}>
      {/* Animated radial gradient background */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 50% 45%, ${COLORS.goldLight}22 0%, transparent 60%)`,
          opacity: 0.6 + bgPulse,
        }}
      />

      {/* Title sequence: 0 - 60 frames */}
      <Sequence from={0} durationInFrames={75}>
        <TitleOverlay
          text="Watch your menu come to life"
          subtext="LIVE AR DEMO"
          frame={frame}
          fps={fps}
        />
      </Sequence>

      {/* Main phone scene: 60 - 360 frames */}
      <Sequence from={60} durationInFrames={300}>
        <PhoneScene frame={frame - 60} fps={fps} />
      </Sequence>

      {/* Mid title: 360 - 420 */}
      <Sequence from={360} durationInFrames={60}>
        <TitleOverlay
          text="Built for any restaurant"
          subtext="WE PHOTOGRAPH / WE BUILD / WE DEPLOY"
          frame={frame - 360}
          fps={fps}
        />
      </Sequence>

      {/* End card: 420+ */}
      <Sequence from={420}>
        <EndCard frame={frame - 420} fps={fps} />
      </Sequence>
    </AbsoluteFill>
  );
};

// Phone scene wrapper
const PhoneScene = ({ frame, fps }) => {
  // Phone slides up & rotates in
  const phoneIn = spring({
    frame,
    fps,
    config: { damping: 16, mass: 0.9 },
  });
  const phoneY = interpolate(phoneIn, [0, 1], [800, 0]);
  const phoneRotate = interpolate(phoneIn, [0, 1], [12, -3]);
  // Subtle floating after entrance
  const floatY = Math.sin(frame / 30) * 8;
  const floatRotate = Math.sin(frame / 40) * 1.5;

  return (
    <AbsoluteFill
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          position: 'relative',
          transform: `translateY(${phoneY + floatY}px) rotate(${phoneRotate + floatRotate}deg)`,
        }}
      >
        <PhoneFrame scale={1}>
          <NewGreekUI frame={frame} fps={fps} />
        </PhoneFrame>

        {/* Dish emerging from screen */}
        <EmergingDish frame={frame} fps={fps} />
        {/* Sparkles */}
        <Sparkles frame={frame} fps={fps} />
      </div>
    </AbsoluteFill>
  );
};
