import React from 'react';

interface ProsperityEmblemProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'custom';
  className?: string;
  hasBackground?: boolean;
  hasBorder?: boolean;
}

const SIZE_MAP = {
  xs: 'h-6 w-6 text-[4px]',
  sm: 'h-8 w-8 text-[5px]',
  md: 'h-10 w-10 text-[6.5px]',
  lg: 'h-12 w-12 text-[8px]',
  xl: 'h-16 w-16 text-[10.5px]',
  '2xl': 'h-24 w-24 text-[15px]',
  custom: '',
};

/**
 * PROSPERITY AI - Square Letterform Emblem (1:1 Demanded Ratio)
 * 
 * Highly visible, bold typographic letterform featuring "PROSPERITY" & "AI"
 * Engineered with high optical contrast for pristine visibility across all sizes.
 */
export const ProsperityEmblem: React.FC<ProsperityEmblemProps> = ({
  size = 'md',
  className = '',
  hasBackground = true,
  hasBorder = true,
}) => {
  const sizeClass = SIZE_MAP[size] || SIZE_MAP.md;

  return (
    <div
      className={`relative inline-flex flex-shrink-0 aspect-square items-center justify-center select-none overflow-hidden ${
        hasBackground
          ? 'bg-gradient-to-br from-slate-900 via-neutral-950 to-slate-950'
          : 'bg-transparent'
      } ${
        hasBorder
          ? 'rounded-2xl border border-sky-500/35 shadow-lg shadow-sky-950/40 ring-1 ring-white/10'
          : 'rounded-xl'
      } ${sizeClass} ${className}`}
      style={{ aspectRatio: '1 / 1' }}
      title="PROSPERITY AI"
    >
      <svg
        viewBox="0 0 512 512"
        className="w-full h-full p-[8%]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="emblemTextGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#E2E8F0" />
          </linearGradient>
          <linearGradient id="emblemAiGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="100%" stopColor="#60A5FA" />
          </linearGradient>
          <filter id="emblemAiGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#0284C7" floodOpacity="0.45" />
          </filter>
        </defs>

        <g transform="translate(256, 215)">
          {/* Word 1: PROSPERITY - Bold, clear geometric letters */}
          <text
            x="0"
            y="0"
            fontFamily="-apple-system, BlinkMacSystemFont, 'Liberation Sans', 'Segoe UI', Roboto, sans-serif"
            fontSize="64"
            fontWeight="900"
            letterSpacing="4"
            textAnchor="middle"
            fill="url(#emblemTextGrad)"
          >
            PROSPERITY
          </text>

          {/* Word 2: AI - High-contrast electric cyan letters */}
          <text
            x="0"
            y="114"
            fontFamily="-apple-system, BlinkMacSystemFont, 'Liberation Sans', 'Segoe UI', Roboto, sans-serif"
            fontSize="92"
            fontWeight="900"
            letterSpacing="24"
            textAnchor="middle"
            filter="url(#emblemAiGlow)"
            fill="url(#emblemAiGrad)"
          >
            AI
          </text>
        </g>
      </svg>
    </div>
  );
};

interface ProsperityHorizontalLogoProps {
  className?: string;
  isCompact?: boolean;
}

/**
 * PROSPERITY AI - Horizontal Letterform Logo (4:1 Demanded Ratio)
 * 
 * Single-line bold letterform logo engineered in a 4:1 aspect ratio.
 */
export const ProsperityHorizontalLogo: React.FC<ProsperityHorizontalLogoProps> = ({
  className = 'h-8',
}) => {
  return (
    <div
      className={`relative inline-flex items-center justify-center select-none ${className}`}
      style={{ aspectRatio: '4 / 1' }}
      title="PROSPERITY AI"
    >
      <svg
        viewBox="0 0 880 220"
        className="w-full h-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="hzLogoTextGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#F8FAFC" />
          </linearGradient>
          <linearGradient id="hzLogoAiGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="100%" stopColor="#60A5FA" />
          </linearGradient>
          <filter id="hzLogoGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#0284C7" floodOpacity="0.4" />
          </filter>
        </defs>

        <g transform="translate(440, 138)">
          <text x="0" y="0" textAnchor="middle">
            <tspan
              fontFamily="-apple-system, BlinkMacSystemFont, 'Liberation Sans', 'Segoe UI', Roboto, sans-serif"
              fontSize="84"
              fontWeight="900"
              letterSpacing="6"
              fill="url(#hzLogoTextGrad)"
            >
              PROSPERITY{' '}
            </tspan>
            <tspan
              fontFamily="-apple-system, BlinkMacSystemFont, 'Liberation Sans', 'Segoe UI', Roboto, sans-serif"
              fontSize="84"
              fontWeight="900"
              letterSpacing="10"
              filter="url(#hzLogoGlow)"
              fill="url(#hzLogoAiGrad)"
            >
              AI
            </tspan>
          </text>
        </g>
      </svg>
    </div>
  );
};
