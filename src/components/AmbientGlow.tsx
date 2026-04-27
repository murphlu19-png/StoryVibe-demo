import React from 'react';

/**
 * AmbientGlow — StoryVibe Atmosphere Lighting
 * 
 * Creates a cinematic "warm studio" atmosphere using:
 * - Large diffused radial gradient orbs (extremely low opacity)
 * - Slow ambient drift animation (20s cycle)
 * - Optional gradient mesh overlay
 * 
 * Usage: Place as the first child of a page container with relative positioning.
 * The component uses fixed positioning by default, or absolute if nested.
 * 
 * Inspired by Gemini AI Visual Design's "fluidity" and "directional gradients".
 */

interface AmbientGlowProps {
  /** Variant controls the intensity and style of the glow */
  variant?: 'subtle' | 'warm' | 'cinematic' | 'hero';
  /** Whether to constrain the glow to the parent (absolute) or the viewport (fixed) */
  fixed?: boolean;
  /** Additional CSS class */
  className?: string;
}

export const AmbientGlow: React.FC<AmbientGlowProps> = ({
  variant = 'subtle',
  fixed = true,
  className = '',
}) => {
  // Variant configurations
  const configs = {
    subtle: {
      orbOpacity: 0.08,
      rayOpacity: 0.04,
      meshOpacity: 0.3,
      blur: '100px',
    },
    warm: {
      orbOpacity: 0.12,
      rayOpacity: 0.06,
      meshOpacity: 0.5,
      blur: '120px',
    },
    cinematic: {
      orbOpacity: 0.18,
      rayOpacity: 0.1,
      meshOpacity: 0.7,
      blur: '140px',
    },
    hero: {
      orbOpacity: 0.22,
      rayOpacity: 0.12,
      meshOpacity: 0.9,
      blur: '160px',
    },
  };

  const config = configs[variant];
  const positionClass = fixed ? 'fixed' : 'absolute';

  return (
    <div
      className={`${positionClass} inset-0 pointer-events-none overflow-hidden z-0 ${className}`}
      aria-hidden="true"
    >
      {/* ── Primary Warm Orb (top-right) ── */}
      <div
        className="sv-breathe"
        style={{
          position: 'absolute',
          width: '700px',
          height: '700px',
          top: '-250px',
          right: '-150px',
          borderRadius: '50%',
          background: `radial-gradient(circle, rgba(255, 132, 61, ${config.orbOpacity * 1.5}) 0%, rgba(255, 132, 61, ${config.orbOpacity}) 25%, rgba(255, 164, 101, ${config.orbOpacity * 0.5}) 45%, transparent 65%)`,
          filter: `blur(${config.blur})`,
          animationDelay: '0s',
          animationDuration: '20s',
        }}
      />

      {/* ── Secondary Warm Orb (bottom-left) ── */}
      <div
        className="sv-breathe"
        style={{
          position: 'absolute',
          width: '500px',
          height: '500px',
          bottom: '-100px',
          left: '-100px',
          borderRadius: '50%',
          background: `radial-gradient(circle, rgba(255, 99, 21, ${config.orbOpacity}) 0%, rgba(255, 132, 61, ${config.orbOpacity * 0.6}) 30%, rgba(255, 132, 61, ${config.orbOpacity * 0.25}) 50%, transparent 70%)`,
          filter: `blur(${config.blur})`,
          animationDelay: '-8s',
          animationDuration: '25s',
        }}
      />

      {/* ── Ethereal Highlight Orb (center-top) ── */}
      <div
        className="sv-breathe"
        style={{
          position: 'absolute',
          width: '400px',
          height: '400px',
          top: '5%',
          left: '50%',
          transform: 'translateX(-50%)',
          borderRadius: '50%',
          background: `radial-gradient(circle, rgba(255, 195, 138, ${config.orbOpacity * 0.6}) 0%, rgba(255, 164, 101, ${config.orbOpacity * 0.25}) 35%, transparent 60%)`,
          filter: `blur(${config.blur})`,
          animationDelay: '-15s',
          animationDuration: '22s',
        }}
      />

      {/* ── Directional Light Ray (top-left diagonal) ── */}
      {variant !== 'subtle' && (
        <div
          className="sv-light-ray"
          style={{
            top: '-10%',
            left: '-5%',
            width: '60%',
            height: '80%',
            background: `linear-gradient(135deg, rgba(255, 132, 61, ${config.rayOpacity * 4}) 0%, rgba(255, 132, 61, ${config.rayOpacity * 1.5}) 20%, transparent 60%)`,
            filter: `blur(${config.blur})`,
            opacity: 1,
          }}
        />
      )}

      {/* ── Cinematic Light Leak (rotating conic) ── */}
      {variant === 'cinematic' || variant === 'hero' ? (
        <div
          className="sv-light-leak"
          style={{
            opacity: config.meshOpacity * 0.4,
          }}
        />
      ) : null}

      {/* ── Gradient Mesh Overlay ── */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 70% 50% at 20% 30%, rgba(255, 132, 61, ${config.meshOpacity * 0.06}) 0%, transparent 50%),
            radial-gradient(ellipse 50% 40% at 80% 20%, rgba(255, 99, 21, ${config.meshOpacity * 0.035}) 0%, transparent 50%),
            radial-gradient(ellipse 45% 55% at 50% 85%, rgba(255, 164, 101, ${config.meshOpacity * 0.03}) 0%, transparent 50%)
          `,
          animation: 'sv-mesh-shift 18s ease-in-out infinite alternate',
        }}
      />
    </div>
  );
};

/**
 * ThinkingGlow — A localized "AI thinking" glow effect
 * Use near AI avatar or generating indicators
 */
export const ThinkingGlow: React.FC<{ active?: boolean }> = ({ active = true }) => {
  if (!active) return null;
  return (
    <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
      <div
        className="sv-pulse-thinking"
        style={{
          position: 'absolute',
          width: '120px',
          height: '120px',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255, 132, 61, 0.15) 0%, rgba(255, 132, 61, 0.05) 40%, transparent 65%)',
          filter: 'blur(30px)',
        }}
      />
    </div>
  );
};

/**
 * CardGlow — Subtle glow that appears on card hover
 */
export const CardGlow: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => {
  return (
    <div className={`relative group ${className}`}>
      {/* Hover glow effect */}
      <div
        className="absolute -inset-px rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(255, 132, 61, 0.08) 0%, transparent 60%)',
        }}
      />
      {children}
    </div>
  );
};

export default AmbientGlow;
