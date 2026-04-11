import { useCurrentFrame, useVideoConfig, Img, staticFile, interpolate, spring, Sequence } from 'remotion';

const ITEMS = [
  { file: 'hf_20260403_092704_35144c5c-bab0-40db-ab40-f7cae2814d11.png', name: 'Classic Smash Burger' },
  { file: 'hf_20260403_133128_6be36082-a11d-4cc8-977b-9f9bd2ecb108.png', name: 'Chocolate Freakshake' },
  { file: 'hf_20260403_135707_df226276-b66d-4705-9b56-95a4756809e8.png', name: 'Double Smash Burger' },
  { file: 'hf_20260403_135825_b8b424a0-d616-4d69-bb8c-8dbff92dfa58.png', name: 'Flat Iron Steak & Fries' },
  { file: 'hf_20260403_135850_6bb59fe7-4533-435b-a010-336c41923f86.png', name: 'Strawberry Cocktail Pouch' },
  { file: 'hf_20260403_140313_42dd0a30-c465-4b6c-bb5e-4c9ef84e25c3.png', name: 'Berry Lemonade Pouch' },
  { file: 'hf_20260403_140530_488ceb64-bd2f-4b5b-a37a-38dec6c5eae1.png', name: 'Loaded Pulled Pork Fries' },
  { file: 'hf_20260403_140539_36c6e5d5-bcec-45ff-a7e4-fb97edb10088.png', name: 'Crispy Chicken Wings' },
  { file: 'hf_20260403_140552_7b5fa6d9-687b-413b-9951-8c7f14106b56.png', name: 'Triple Stack Burger' },
  { file: 'hf_20260403_140602_1842c3d2-1cee-4503-8307-efb0e29c1864.png', name: 'Brisket Plate' },
  { file: 'hf_20260403_140801_c879b9a1-fc72-42d0-bc4c-9c29bc116221.png', name: 'Pulled Pork Burger' },
  { file: 'hf_20260403_140953_2996262a-5ae8-4fba-ac99-affd8ef89fca.png', name: 'Smoked BBQ Sandwich' },
  { file: 'hf_20260403_141325_bec243f2-c6d5-46bb-bbf4-23f6a308c6a8.png', name: 'Olive & Hummus Bowl' },
  { file: 'hf_20260403_142046_8d1b892e-de16-42c3-8ef4-75e8f9ca543b.png', name: 'Smoked Half Chicken' },
  { file: 'hf_20260403_142326_d8bb8465-11f1-4b1a-91c1-1ad7de493376.png', name: 'Crispy Chicken Burger' },
  { file: 'hf_20260403_142424_a27a7a90-be78-4bcf-a61d-3147a450e1c4.png', name: 'Smoked Brisket Burger' },
  { file: 'hf_20260403_143341_4d1f8d14-a543-45a0-ad85-6398545a2def.png', name: 'OG Smash Burger' },
];

const FRAMES_PER_ITEM = 90;
const TRANSITION_FRAMES = 20;

function MenuItem({ item, index }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Image slides in from right
  const imgSlideIn = spring({
    frame,
    fps,
    from: 1920,
    to: 0,
    config: { damping: 14, stiffness: 120, mass: 0.8 },
  });

  const imgSlideOut = spring({
    frame: frame - (FRAMES_PER_ITEM - TRANSITION_FRAMES),
    fps,
    from: 0,
    to: -1920,
    config: { damping: 14, stiffness: 120, mass: 0.8 },
  });

  const imgTranslateX = frame < FRAMES_PER_ITEM - TRANSITION_FRAMES ? imgSlideIn : imgSlideOut;

  // Text slides up
  const nameSlide = spring({
    frame: frame - 10,
    fps,
    from: 80,
    to: 0,
    config: { damping: 12, stiffness: 100, mass: 0.6 },
  });

  const nameOpacity = interpolate(frame, [8, 20], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const nameExitOpacity = interpolate(
    frame,
    [FRAMES_PER_ITEM - TRANSITION_FRAMES - 5, FRAMES_PER_ITEM - TRANSITION_FRAMES + 5],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const scale = spring({
    frame: frame - 5,
    fps,
    from: 1.05,
    to: 1,
    config: { damping: 20, stiffness: 80, mass: 1 },
  });

  return (
    <div style={{
      position: 'absolute',
      width: 1920,
      height: 1080,
      overflow: 'hidden',
    }}>
      {/* Background */}
      <div style={{ position: 'absolute', width: '100%', height: '100%', background: '#000' }} />

      {/* Product image - right side, full bleed */}
      <div style={{
        position: 'absolute',
        right: 0,
        top: 0,
        width: '60%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transform: `translateX(${imgTranslateX}px) scale(${scale})`,
        overflow: 'hidden',
      }}>
        <Img
          src={staticFile(`smoked-smashed/${item.file}`)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      </div>

      {/* Left side gradient overlay for text legibility */}
      <div style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: '65%',
        height: '100%',
        background: 'linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,0.95) 55%, rgba(0,0,0,0.4) 80%, transparent 100%)',
      }} />

      {/* Text content - left side */}
      <div style={{
        position: 'absolute',
        left: 80,
        top: 0,
        width: '45%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        transform: `translateY(${nameSlide}px)`,
        opacity: nameOpacity * nameExitOpacity,
      }}>
        <div style={{
          fontFamily: 'Inter, Helvetica, Arial, sans-serif',
          fontSize: 64,
          fontWeight: 800,
          color: '#FFFFFF',
          textTransform: 'uppercase',
          letterSpacing: '0.03em',
          lineHeight: 1.1,
          textShadow: '0 4px 20px rgba(0,0,0,0.8)',
        }}>
          {item.name}
        </div>
        {/* Yellow accent line */}
        <div style={{
          width: 80,
          height: 4,
          background: '#FFD700',
          marginTop: 28,
          borderRadius: 2,
        }} />
      </div>
    </div>
  );
}

export function SmokedSmashedMenuWide() {
  return (
    <div style={{
      width: 1920,
      height: 1080,
      background: '#000',
      overflow: 'hidden',
      position: 'relative',
    }}>
      {ITEMS.map((item, i) => (
        <Sequence
          key={i}
          from={i * (FRAMES_PER_ITEM - TRANSITION_FRAMES)}
          durationInFrames={FRAMES_PER_ITEM}
        >
          <MenuItem item={item} index={i} />
        </Sequence>
      ))}
    </div>
  );
}
