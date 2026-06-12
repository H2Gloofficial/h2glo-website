import { useCurrentFrame, useVideoConfig, interpolate, spring, Sequence } from 'remotion';

// ── Bakery menu data split across 3 screens ───────────────────────────────────

const SCREEN_1 = {
  title: 'Pastries',
  subtitle: 'Freshly baked, every morning',
  sections: [
    {
      heading: 'Savoury',
      items: [
        { name: 'Spinach Cheese Pie', price: '3.85' },
        { name: 'Cheese Pie', price: '3.85' },
        { name: 'Santorini Pie', price: '3.85' },
        { name: 'Chicken Pie', price: '4.00' },
        { name: 'Koulouri Philadelphia', price: '3.45' },
        { name: 'Ham & Cheese Pie', price: '3.85' },
        { name: 'Potato Roll', price: '3.20' },
        { name: 'Pizza Special', price: '3.90' },
        { name: 'Croissant Butter', price: '2.80' },
        { name: 'Penerli', price: '3.90', highlight: true },
        { name: 'Koulouri', price: '2.10' },
        { name: 'Croissant Ham & Cheese', price: '' },
        { name: 'Double Sausage Roll', price: '3.90' },
        { name: 'Mushroom Pie', price: '3.85' },
      ],
    },
  ],
};

const SCREEN_2 = {
  title: 'Sweet & Desserts',
  subtitle: 'Handmade Greek sweets',
  sections: [
    {
      heading: 'Sweet Pastries',
      items: [
        { name: 'Bougatsa Cream', price: '3.60', highlight: true },
        { name: 'Bougatsa Cheese & Honey', price: '3.85' },
        { name: 'Croissant Chocolate Pralina', price: '3.30' },
      ],
    },
    {
      heading: 'Mini Pastries',
      items: [
        { name: 'Mini Sausage Roll', price: '1.20' },
        { name: 'Mini Potato Roll', price: '1.20' },
        { name: 'Mini Spinach Cheese Roll', price: '1.20' },
        { name: 'Mini Cheese Roll', price: '1.20' },
      ],
    },
    {
      heading: 'Desserts',
      items: [
        { name: 'Baklava', price: '4.65' },
        { name: 'Kataifi', price: '4.55' },
        { name: 'Galaktobureko', price: '4.95', highlight: true },
        { name: 'Orange Pie', price: '4.95' },
        { name: 'Red Velvet', price: '5.10' },
        { name: 'Chocolate Pie', price: '4.95' },
        { name: 'Walnut Cake', price: '4.95' },
        { name: 'Ferrero Cake', price: '5.50' },
        { name: 'Ekmek Kataifi', price: '5.50' },
      ],
    },
    {
      heading: 'Mini Desserts',
      items: [
        { name: 'Mini Puff Cake', price: '1.20' },
        { name: 'Mini Horne', price: '1.20' },
        { name: 'Mini Eclair', price: '1.20' },
        { name: 'Mini Cookies', price: '1.20' },
      ],
    },
  ],
};

const SCREEN_3 = {
  title: 'Coffee & Drinks',
  subtitle: 'Greek coffee, done properly',
  sections: [
    {
      heading: 'Coffee',
      items: [
        { name: 'Fredo Espresso', price: '3.70', highlight: true },
        { name: 'Fredo Cappuccino', price: '3.90' },
        { name: 'Frappe', price: '3.20' },
        { name: 'Espresso', price: '2.50' },
        { name: 'Double Espresso', price: '3.00' },
        { name: 'Cappuccino', price: '3.50' },
        { name: 'Double Cappuccino', price: '4.00' },
        { name: 'Flat White', price: '3.50' },
        { name: 'Latte', price: '3.50' },
        { name: 'Americano', price: '3.30' },
        { name: 'Tea', price: '3.00' },
      ],
    },
    {
      heading: 'Drinks',
      items: [
        { name: 'Loux', price: '2.20' },
        { name: 'Bravo', price: '2.50' },
        { name: 'Water 500ml', price: '1.20' },
        { name: 'Water 1L', price: '1.50' },
        { name: 'Energy Drink', price: '3.50' },
        { name: 'Amita Motion', price: '2.80' },
        { name: 'Amita Cherry', price: '2.50' },
        { name: 'Amita 1L', price: '3.75' },
        { name: 'Coca Cola', price: '2.00' },
        { name: 'Fanta', price: '2.00' },
        { name: 'Sprite', price: '2.00' },
      ],
    },
  ],
};

const SCREENS = [SCREEN_1, SCREEN_2, SCREEN_3];

const SCREEN_DURATION = 270; // 9 seconds per screen (more items to read)
const TRANSITION = 25;

// ── Colours ───────────────────────────────────────────────────────────────────

const BLUE = '#0D47A1';
const BLUE_DARK = '#062A5E';
const GOLD = '#C9A84C';
const WHITE = '#FFFFFF';
const OFF_WHITE = '#F5F2EB';
const WARM_BG = '#0B3A7A';

// ── Placeholder food image (animated plate with bakery icon) ──────────────────

function FoodPlaceholder({ size = 180, delay = 0, x, y, icon = 'pastry' }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const floatY = Math.sin((frame + delay * 10) * 0.04) * 8;
  const floatRotate = Math.sin((frame + delay * 10) * 0.03) * 2;

  const scaleSpring = spring({
    frame: frame - delay,
    fps,
    from: 0,
    to: 1,
    config: { damping: 10, stiffness: 80, mass: 0.8 },
  });

  const glowOpacity = interpolate(
    Math.sin((frame + delay * 5) * 0.06),
    [-1, 1],
    [0.15, 0.4]
  );

  const iconPaths = {
    pastry: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z',
    coffee: 'M2 21h18v-2H2M20 8h-2V5h2m0-2H4v10a4 4 0 004 4h6a4 4 0 004-4v-3h2a2 2 0 002-2V8a2 2 0 00-2-2z',
    cake: 'M12 6c1.11 0 2-.9 2-2 0-.38-.1-.73-.29-1.03L12 0l-1.71 2.97c-.19.3-.29.65-.29 1.03 0 1.1.9 2 2 2zm4.6 9.99l-1.07-1.07-1.08 1.07c-1.3 1.3-3.58 1.31-4.89 0l-1.07-1.07-1.09 1.07C6.75 16.64 5.88 17 4.96 17c-.73 0-1.4-.23-1.96-.61V21h18v-4.61c-.56.38-1.23.61-1.96.61-.92 0-1.79-.36-2.44-1.01zM18 9h-5V7h-2v2H6c-1.66 0-3 1.34-3 3v1.54c0 1.08.88 1.96 1.96 1.96.52 0 1.02-.2 1.38-.57l2.14-2.13 2.13 2.13c.74.74 2.03.74 2.77 0l2.14-2.13 2.13 2.13c.37.37.86.57 1.38.57 1.08 0 1.96-.88 1.96-1.96V12c.01-1.66-1.33-3-2.99-3z',
  };

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: size,
        height: size,
        transform: `scale(${scaleSpring}) translateY(${floatY}px) rotate(${floatRotate}deg)`,
        transformOrigin: 'center center',
      }}
    >
      {/* Glow ring */}
      <div
        style={{
          position: 'absolute',
          inset: -12,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${GOLD}${Math.round(glowOpacity * 255).toString(16).padStart(2, '0')} 0%, transparent 70%)`,
        }}
      />
      {/* Plate circle */}
      <div
        style={{
          width: '100%',
          height: '100%',
          borderRadius: '50%',
          background: `linear-gradient(135deg, ${OFF_WHITE} 0%, #E8E2D6 100%)`,
          border: `3px solid ${GOLD}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 12px 40px rgba(0,0,0,0.3), inset 0 2px 8px rgba(255,255,255,0.5)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: size * 0.7,
            height: size * 0.7,
            borderRadius: '50%',
            border: `1.5px solid ${GOLD}40`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <svg width={size * 0.3} height={size * 0.3} viewBox="0 0 24 24" fill="none">
            <path d={iconPaths[icon] || iconPaths.pastry} fill={GOLD} opacity="0.6" />
          </svg>
        </div>
      </div>
    </div>
  );
}

// ── Decorative olive leaf ─────────────────────────────────────────────────────

function OliveLeaf({ x, y, rotation = 0, delay = 0, scale = 1 }) {
  const frame = useCurrentFrame();
  const sway = Math.sin((frame + delay * 8) * 0.025) * 5;
  const opacity = interpolate(frame - delay, [0, 20], [0, 0.15], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <svg
      width={60 * scale}
      height={90 * scale}
      viewBox="0 0 60 90"
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: `rotate(${rotation + sway}deg)`,
        opacity,
      }}
    >
      <ellipse cx="30" cy="45" rx="18" ry="38" fill={GOLD} />
      <line x1="30" y1="10" x2="30" y2="80" stroke={OFF_WHITE} strokeWidth="1.5" opacity="0.4" />
    </svg>
  );
}

// ── Section heading within a screen ───────────────────────────────────────────

function SectionHeading({ text, delay }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const opacity = interpolate(frame - delay, [0, 15], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const slideX = spring({
    frame: frame - delay,
    fps,
    from: -30,
    to: 0,
    config: { damping: 14, stiffness: 100, mass: 0.6 },
  });

  return (
    <div
      style={{
        opacity,
        transform: `translateX(${slideX}px)`,
        marginTop: 8,
        marginBottom: 4,
        display: 'flex',
        alignItems: 'center',
        gap: 12,
      }}
    >
      <span
        style={{
          fontFamily: "'Georgia', serif",
          fontSize: 22,
          fontWeight: 400,
          fontStyle: 'italic',
          color: `${GOLD}BB`,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          whiteSpace: 'nowrap',
        }}
      >
        {text}
      </span>
      <span
        style={{
          flex: 1,
          height: 1,
          background: `linear-gradient(90deg, ${GOLD}40, transparent)`,
        }}
      />
    </div>
  );
}

// ── Single menu item row ──────────────────────────────────────────────────────

function MenuItemRow({ name, price, index, highlight, totalOffset }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const stagger = totalOffset * 3;

  const slideX = spring({
    frame: frame - stagger - 15,
    fps,
    from: 50,
    to: 0,
    config: { damping: 14, stiffness: 100, mass: 0.6 },
  });

  const opacity = interpolate(frame - stagger - 15, [0, 12], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const lineOpacity = spring({
    frame: frame - stagger - 20,
    fps,
    from: 0,
    to: 1,
    config: { damping: 16, stiffness: 60, mass: 1 },
  });

  const fontSize = highlight ? 28 : 24;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'baseline',
        gap: 10,
        transform: `translateX(${slideX}px)`,
        opacity,
        marginBottom: 0,
      }}
    >
      <span
        style={{
          fontFamily: "'Georgia', serif",
          fontSize,
          fontWeight: highlight ? 700 : 400,
          color: highlight ? GOLD : WHITE,
          whiteSpace: 'nowrap',
          letterSpacing: '0.01em',
        }}
      >
        {name}
      </span>
      {price && (
        <>
          <span
            style={{
              flex: 1,
              height: 1,
              borderBottom: `1.5px dotted ${GOLD}35`,
              opacity: lineOpacity,
              minWidth: 16,
            }}
          />
          <span
            style={{
              fontFamily: "'Georgia', serif",
              fontSize,
              fontWeight: highlight ? 700 : 400,
              color: GOLD,
              whiteSpace: 'nowrap',
              letterSpacing: '0.02em',
            }}
          >
            {`\u00A3${price}`}
          </span>
        </>
      )}
    </div>
  );
}

// ── Single menu screen ────────────────────────────────────────────────────────

function MenuScreen({ screen, screenIndex }) {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // Enter/exit fades
  const enterOpacity = interpolate(frame, [0, TRANSITION], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const exitOpacity = interpolate(
    frame,
    [SCREEN_DURATION - TRANSITION, SCREEN_DURATION],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );
  const opacity = Math.min(enterOpacity, exitOpacity);

  // Parallax bg
  const bgShift = interpolate(frame, [0, SCREEN_DURATION], [0, -30], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Title animations
  const titleScale = spring({
    frame: frame - 5,
    fps,
    from: 0.8,
    to: 1,
    config: { damping: 12, stiffness: 80, mass: 0.8 },
  });
  const titleOpacity = interpolate(frame, [5, 25], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const goldLineWidth = spring({
    frame: frame - 18,
    fps,
    from: 0,
    to: 180,
    config: { damping: 14, stiffness: 60, mass: 1 },
  });
  const subtitleOpacity = interpolate(frame, [20, 38], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const subtitleY = spring({
    frame: frame - 20,
    fps,
    from: 20,
    to: 0,
    config: { damping: 14, stiffness: 100, mass: 0.6 },
  });

  // Food placeholder configs per screen
  const placeholderConfigs = [
    [
      { x: width - 220, y: 90, size: 150, delay: 8, icon: 'pastry' },
      { x: 30, y: height - 360, size: 130, delay: 16, icon: 'pastry' },
      { x: width - 180, y: height - 420, size: 110, delay: 24, icon: 'pastry' },
    ],
    [
      { x: width - 210, y: 100, size: 140, delay: 10, icon: 'cake' },
      { x: 40, y: height - 340, size: 120, delay: 18, icon: 'cake' },
      { x: width - 190, y: height - 450, size: 130, delay: 26, icon: 'cake' },
    ],
    [
      { x: width - 230, y: 85, size: 145, delay: 8, icon: 'coffee' },
      { x: 35, y: height - 370, size: 125, delay: 14, icon: 'coffee' },
      { x: width - 175, y: height - 430, size: 115, delay: 22, icon: 'coffee' },
    ],
  ];

  const placeholders = placeholderConfigs[screenIndex] || placeholderConfigs[0];

  // Build flat list with section headers for rendering
  let totalOffset = 0;
  const rows = [];
  for (const section of screen.sections) {
    if (screen.sections.length > 1) {
      rows.push({ type: 'heading', text: section.heading, delay: totalOffset * 3 + 12 });
      totalOffset += 1;
    }
    for (const item of section.items) {
      rows.push({ type: 'item', ...item, totalOffset });
      totalOffset += 1;
    }
  }

  // Calculate item spacing based on total items
  const totalItems = rows.length;
  const availableHeight = height - 340 - 160; // top offset to bottom bar
  const itemGap = Math.min(12, Math.max(4, (availableHeight / totalItems) - 28));

  return (
    <div
      style={{
        position: 'absolute',
        width,
        height,
        opacity,
        overflow: 'hidden',
      }}
    >
      {/* Background gradient */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(170deg, ${BLUE_DARK} 0%, ${BLUE} 40%, ${WARM_BG} 100%)`,
          transform: `translateY(${bgShift}px)`,
        }}
      />

      {/* Subtle diagonal pattern */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.035,
          backgroundImage: `repeating-linear-gradient(
            45deg,
            transparent,
            transparent 40px,
            ${WHITE} 40px,
            ${WHITE} 41px
          )`,
        }}
      />

      {/* Olive leaves */}
      <OliveLeaf x={-10} y={80} rotation={-20} delay={5} scale={1.2} />
      <OliveLeaf x={width - 70} y={height * 0.4} rotation={160} delay={10} />
      <OliveLeaf x={60} y={height * 0.65} rotation={30} delay={15} scale={0.8} />
      <OliveLeaf x={width - 100} y={height - 200} rotation={-140} delay={20} />

      {/* Top gold accent */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 5,
          background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)`,
        }}
      />

      {/* Brand */}
      <div
        style={{
          position: 'absolute',
          top: 50,
          left: 0,
          right: 0,
          textAlign: 'center',
          opacity: titleOpacity,
          transform: `scale(${titleScale})`,
        }}
      >
        <div
          style={{
            fontFamily: "'Georgia', serif",
            fontSize: 32,
            fontWeight: 400,
            color: GOLD,
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
          }}
        >
          New Greek Bakery
        </div>
      </div>

      {/* Section title */}
      <div
        style={{
          position: 'absolute',
          top: 115,
          left: 0,
          right: 0,
          textAlign: 'center',
        }}
      >
        <div
          style={{
            fontFamily: "'Georgia', serif",
            fontSize: 58,
            fontWeight: 700,
            color: WHITE,
            letterSpacing: '0.04em',
            opacity: titleOpacity,
            transform: `scale(${titleScale})`,
          }}
        >
          {screen.title}
        </div>
        <div
          style={{
            width: goldLineWidth,
            height: 2,
            background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)`,
            margin: '12px auto',
          }}
        />
        <div
          style={{
            fontFamily: "'Georgia', serif",
            fontSize: 22,
            fontStyle: 'italic',
            color: `${GOLD}CC`,
            opacity: subtitleOpacity,
            transform: `translateY(${subtitleY}px)`,
            letterSpacing: '0.08em',
          }}
        >
          {screen.subtitle}
        </div>
      </div>

      {/* Menu items */}
      <div
        style={{
          position: 'absolute',
          top: 280,
          left: 70,
          right: 70,
          display: 'flex',
          flexDirection: 'column',
          gap: itemGap,
        }}
      >
        {rows.map((row, i) =>
          row.type === 'heading' ? (
            <SectionHeading key={`h-${i}`} text={row.text} delay={row.delay} />
          ) : (
            <MenuItemRow
              key={`i-${i}`}
              name={row.name}
              price={row.price}
              index={i}
              highlight={row.highlight}
              totalOffset={row.totalOffset}
            />
          )
        )}
      </div>

      {/* Floating food placeholders */}
      {placeholders.map((pos, i) => (
        <FoodPlaceholder
          key={i}
          x={pos.x}
          y={pos.y}
          size={pos.size}
          delay={pos.delay}
          icon={pos.icon}
        />
      ))}

      {/* Bottom bar */}
      <div
        style={{
          position: 'absolute',
          bottom: 45,
          left: 0,
          right: 0,
          textAlign: 'center',
        }}
      >
        {/* Page dots */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 14,
            marginBottom: 18,
          }}
        >
          {SCREENS.map((_, i) => {
            const isActive = i === screenIndex;
            const dotScale = spring({
              frame: isActive ? frame - 10 : 0,
              fps,
              from: 0.6,
              to: 1,
              config: { damping: 10, stiffness: 120, mass: 0.4 },
            });
            return (
              <div
                key={i}
                style={{
                  width: isActive ? 28 : 10,
                  height: 10,
                  borderRadius: 5,
                  background: isActive ? GOLD : `${WHITE}40`,
                  transform: `scale(${isActive ? dotScale : 1})`,
                }}
              />
            );
          })}
        </div>
        <div
          style={{
            fontFamily: "'Georgia', serif",
            fontSize: 18,
            color: `${WHITE}70`,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
          }}
        >
          8 Clayton Road, Jesmond
        </div>
      </div>

      {/* Bottom gold accent */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 5,
          background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)`,
        }}
      />
    </div>
  );
}

// ── Main composition ──────────────────────────────────────────────────────────

export function NewGreekBakeryMenu() {
  return (
    <div
      style={{
        width: 1080,
        height: 1920,
        background: BLUE_DARK,
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {SCREENS.map((screen, i) => (
        <Sequence
          key={i}
          from={i * SCREEN_DURATION}
          durationInFrames={SCREEN_DURATION}
        >
          <MenuScreen screen={screen} screenIndex={i} />
        </Sequence>
      ))}
    </div>
  );
}
