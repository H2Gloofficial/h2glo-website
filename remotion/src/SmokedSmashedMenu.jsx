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

const FRAMES_PER_ITEM = 90; // 3 seconds at 30fps
const TRANSITION_FRAMES = 20;

function MenuItem({ item, index }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Slide in from right
  const slideIn = spring({
    frame,
    fps,
    from: 1080,
    to: 0,
    config: { damping: 14, stiffness: 120, mass: 0.8 },
  });

  // Slide out to left
  const slideOut = spring({
    frame: frame - (FRAMES_PER_ITEM - TRANSITION_FRAMES),
    fps,
    from: 0,
    to: -1080,
    config: { damping: 14, stiffness: 120, mass: 0.8 },
  });

  const translateX = frame < FRAMES_PER_ITEM - TRANSITION_FRAMES ? slideIn : slideOut;

  // Name slides up from bottom with slight delay
  const nameSlide = spring({
    frame: frame - 8,
    fps,
    from: 120,
    to: 0,
    config: { damping: 12, stiffness: 100, mass: 0.6 },
  });

  const nameOpacity = interpolate(frame, [6, 18], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Fade out name
  const nameExitOpacity = interpolate(
    frame,
    [FRAMES_PER_ITEM - TRANSITION_FRAMES - 5, FRAMES_PER_ITEM - TRANSITION_FRAMES + 5],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Subtle scale pulse on the image
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
      width: 1080,
      height: 1920,
      transform: `translateX(${translateX}px)`,
      overflow: 'hidden',
    }}>
      {/* Background - black/yellow split matching the images */}
      <div style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        background: '#000',
      }} />

      {/* Product image */}
      <div style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transform: `scale(${scale})`,
      }}>
        <Img
          src={staticFile(`smoked-smashed/${item.file}`)}
          style={{
            width: '100%',
            height: 'auto',
            objectFit: 'contain',
          }}
        />
      </div>

      {/* Bottom gradient overlay */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 500,
        background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.7) 40%, transparent 100%)',
      }} />

      {/* Product name */}
      <div style={{
        position: 'absolute',
        bottom: 160,
        left: 0,
        right: 0,
        textAlign: 'center',
        transform: `translateY(${nameSlide}px)`,
        opacity: nameOpacity * nameExitOpacity,
      }}>
        <div style={{
          fontFamily: 'Inter, Helvetica, Arial, sans-serif',
          fontSize: 56,
          fontWeight: 800,
          color: '#FFFFFF',
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
          lineHeight: 1.1,
          padding: '0 60px',
          textShadow: '0 4px 20px rgba(0,0,0,0.8)',
        }}>
          {item.name}
        </div>
        {/* Yellow accent line */}
        <div style={{
          width: 80,
          height: 4,
          background: '#FFD700',
          margin: '24px auto 0',
          borderRadius: 2,
        }} />
      </div>

    </div>
  );
}

export function SmokedSmashedMenu() {
  return (
    <div style={{
      width: 1080,
      height: 1920,
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
