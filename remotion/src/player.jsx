import React from 'react';
import { createRoot } from 'react-dom/client';
import { Player } from '@remotion/player';
import { DashboardReveal } from './DashboardReveal';

function DashboardRevealPlayer() {
  return React.createElement(Player, {
    component: DashboardReveal,
    durationInFrames: 450,
    compositionWidth: 1920,
    compositionHeight: 1080,
    fps: 30,
    autoPlay: true,
    loop: true,
    controls: false,
    style: {
      width: '100%',
      maxHeight: 500,
      borderRadius: '16px',
    },
  });
}

// Auto-mount when DOM is ready
function mount() {
  const el = document.getElementById('remotion-player');
  if (el) {
    const root = createRoot(el);
    root.render(React.createElement(DashboardRevealPlayer));
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mount);
} else {
  mount();
}
