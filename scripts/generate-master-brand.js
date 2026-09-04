import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

/**
 * PROSPERITY AI - Official Multi-Purpose Brand Identity
 * Concept:
 * The sacred auspicious Shankha (Conch shell) geometry modernized with:
 * - Fibonacci golden spiral proportions (representing boundless prosperity & intelligence)
 * - Deep midnight obsidian (#090D16) & royal electric blue (#2563EB -> #38BDF8 -> #818CF8) luminous gradients
 * - Subtle radiant gold luxury spark (#F59E0B -> #FCD34D) at the apex focal point
 * - Designed to work across:
 *   1) Google Play Store & App Store (512x512 full-bleed square)
 *   2) Android Adaptive / Maskable icon (safe zone compliant)
 *   3) Mobile PWA (192x192)
 *   4) Web Favicon & Header badges (transparent SVG/PNG)
 *   5) Marketing & Presentation Brand Hero (800x800)
 */

function createMasterEmblemSvg(isDarkBg = true) {
  return `
    <g id="master-emblem">
      <!-- Outer Luminous Aurora Ring / Halo -->
      <circle cx="0" cy="0" r="160" fill="url(#coreGlow)" opacity="0.45" />

      <!-- Back Crest Shield / Outer Wave -->
      <path d="M 0,-152
               C 52,-150 115,-105 138,-42
               C 152,-3 154,48 128,102
               C 102,154 52,198 -16,220
               C 12,192 34,164 45,130
               C 70,55 64,-30 28,-96
               C 18,-115 8,-138 0,-152 Z"
            fill="url(#electricCyanGrad)"
            filter="url(#subtleNeonBloom)" />

      <!-- Left Embracing Ascending Flame Plume -->
      <path d="M -12,174
               C -35,130 -70,72 -72,-6
               C -74,-76 -46,-140 0,-174
               C -38,-148 -75,-88 -78,-16
               C -81,60 -55,130 -26,170
               C -20,175 -15,178 -12,174 Z"
            fill="url(#royalIndigoGrad)" />

      <!-- Main Shankha (Conch) Central Body -->
      <g id="core-shell">
        <!-- Crown Apex (Spire / Golden Node) -->
        <circle cx="0" cy="-118" r="9" fill="url(#goldApexGrad)" filter="url(#goldBloom)" />
        <path d="M -16,-98 C -16,-110 16,-110 16,-98 C 16,-88 -16,-88 -16,-98 Z" fill="url(#electricCyanGrad)" />
        <path d="M -26,-80 C -26,-94 26,-94 26,-80 C 26,-70 -26,-70 -26,-80 Z" fill="url(#primaryBlueGrad)" />

        <!-- Main Teardrop Conch Body -->
        <path d="M -44,-64
                 C -58,-12 -50,52 -12,130
                 C -6,142 0,154 4,162
                 C 8,148 16,132 24,116
                 C 52,54 58,-6 42,-64
                 C 30,-75 -32,-75 -44,-64 Z"
              fill="url(#midnightNavyGrad)" />

        <!-- Inner Golden Ratio Fibonacci Spiral (Neural Ridge) -->
        <path d="M -2,-45
                 C -24,-26 -32,4 -22,48
                 C -16,74 -1,104 6,120
                 C -3,100 -14,70 -14,44
                 C -14,6 4,-24 14,-36
                 C 8,-42 2,-44 -2,-45 Z"
              fill="url(#electricCyanGrad)"
              filter="url(#subtleNeonBloom)" />

        <!-- Neural Circuit Data Accent Points -->
        <circle cx="-18" cy="22" r="3" fill="#38BDF8" />
        <circle cx="12" cy="70" r="2.5" fill="#818CF8" />
        <circle cx="28" cy="-12" r="2.5" fill="#38BDF8" opacity="0.8" />
        <circle cx="-6" cy="98" r="2.5" fill="#FCD34D" />
      </g>
    </g>
  `;
}

// 1. Full-Bleed 512x512 Master App Icon (For Android, Google Play Store, iOS)
function createPlayStoreIconSvg() {
  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <!-- Background: Deep Obsidian Midnight Space with subtle radial glow -->
    <radialGradient id="bgGrad" cx="50%" cy="40%" r="65%">
      <stop offset="0%" stop-color="#111B33" />
      <stop offset="55%" stop-color="#090E1C" />
      <stop offset="100%" stop-color="#04060B" />
    </radialGradient>

    <!-- Core Ambient Bloom -->
    <radialGradient id="coreGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#0066FF" stop-opacity="0.35" />
      <stop offset="50%" stop-color="#38BDF8" stop-opacity="0.15" />
      <stop offset="100%" stop-color="#090E1C" stop-opacity="0" />
    </radialGradient>

    <!-- Primary Electric Gradients -->
    <linearGradient id="electricCyanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38BDF8" />
      <stop offset="45%" stop-color="#2563EB" />
      <stop offset="100%" stop-color="#1D4ED8" />
    </linearGradient>

    <linearGradient id="royalIndigoGrad" x1="100%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#60A5FA" />
      <stop offset="40%" stop-color="#3B82F6" />
      <stop offset="100%" stop-color="#1E3A8A" />
    </linearGradient>

    <linearGradient id="primaryBlueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1E40AF" />
      <stop offset="100%" stop-color="#0F172A" />
    </linearGradient>

    <linearGradient id="midnightNavyGrad" x1="30%" y1="0%" x2="70%" y2="100%">
      <stop offset="0%" stop-color="#0F1F3D" />
      <stop offset="60%" stop-color="#0A1326" />
      <stop offset="100%" stop-color="#050811" />
    </linearGradient>

    <!-- Gold Luxury Apex Spark -->
    <linearGradient id="goldApexGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFFBEB" />
      <stop offset="35%" stop-color="#FDE047" />
      <stop offset="100%" stop-color="#F59E0B" />
    </linearGradient>

    <!-- Soft Neon Filter -->
    <filter id="subtleNeonBloom" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="0" stdDeviation="6" flood-color="#38BDF8" flood-opacity="0.35" />
    </filter>

    <filter id="goldBloom" x="-50%" y="-50%" width="200%" height="200%">
      <feDropShadow dx="0" dy="0" stdDeviation="4" flood-color="#F59E0B" flood-opacity="0.7" />
    </filter>
  </defs>

  <!-- Google Play 100% full-bleed square canvas -->
  <rect width="512" height="512" fill="url(#bgGrad)" />

  <!-- Outer subtle tech frame / safe guide -->
  <circle cx="256" cy="256" r="215" fill="none" stroke="rgba(56, 189, 248, 0.08)" stroke-width="1.5" stroke-dasharray="8 6" />

  <!-- Center Emblem (scale = 0.86, within Android 66% safe zone radius ~170px) -->
  <g transform="translate(256, 258) scale(0.86)">
    ${createMasterEmblemSvg(true)}
  </g>
</svg>
`;
}

// 2. Full Brand Logo with Typography (800x800)
function createFullBrandLogoSvg() {
  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="800" height="800">
  <defs>
    <radialGradient id="bgGrad" cx="50%" cy="35%" r="70%">
      <stop offset="0%" stop-color="#111B33" />
      <stop offset="60%" stop-color="#090E1C" />
      <stop offset="100%" stop-color="#04060B" />
    </radialGradient>

    <radialGradient id="coreGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#0066FF" stop-opacity="0.4" />
      <stop offset="50%" stop-color="#38BDF8" stop-opacity="0.18" />
      <stop offset="100%" stop-color="#090E1C" stop-opacity="0" />
    </radialGradient>

    <linearGradient id="electricCyanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38BDF8" />
      <stop offset="45%" stop-color="#2563EB" />
      <stop offset="100%" stop-color="#1D4ED8" />
    </linearGradient>

    <linearGradient id="royalIndigoGrad" x1="100%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#60A5FA" />
      <stop offset="40%" stop-color="#3B82F6" />
      <stop offset="100%" stop-color="#1E3A8A" />
    </linearGradient>

    <linearGradient id="primaryBlueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1E40AF" />
      <stop offset="100%" stop-color="#0F172A" />
    </linearGradient>

    <linearGradient id="midnightNavyGrad" x1="30%" y1="0%" x2="70%" y2="100%">
      <stop offset="0%" stop-color="#0F1F3D" />
      <stop offset="60%" stop-color="#0A1326" />
      <stop offset="100%" stop-color="#050811" />
    </linearGradient>

    <linearGradient id="goldApexGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFFBEB" />
      <stop offset="35%" stop-color="#FDE047" />
      <stop offset="100%" stop-color="#F59E0B" />
    </linearGradient>

    <linearGradient id="brandTextGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#FFFFFF" />
      <stop offset="60%" stop-color="#F1F5F9" />
      <stop offset="100%" stop-color="#94A3B8" />
    </linearGradient>

    <linearGradient id="glowDividerLeft" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#38BDF8" stop-opacity="0" />
      <stop offset="50%" stop-color="#38BDF8" stop-opacity="0.8" />
      <stop offset="100%" stop-color="#818CF8" stop-opacity="1" />
    </linearGradient>
    <linearGradient id="glowDividerRight" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#818CF8" stop-opacity="1" />
      <stop offset="50%" stop-color="#38BDF8" stop-opacity="0.8" />
      <stop offset="100%" stop-color="#38BDF8" stop-opacity="0" />
    </linearGradient>

    <filter id="subtleNeonBloom" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="0" stdDeviation="8" flood-color="#38BDF8" flood-opacity="0.4" />
    </filter>

    <filter id="goldBloom" x="-50%" y="-50%" width="200%" height="200%">
      <feDropShadow dx="0" dy="0" stdDeviation="5" flood-color="#F59E0B" flood-opacity="0.8" />
    </filter>
  </defs>

  <!-- Background Base -->
  <rect width="800" height="800" fill="url(#bgGrad)" />

  <!-- Subtle Radial Grid -->
  <circle cx="400" cy="275" r="230" fill="none" stroke="rgba(56, 189, 248, 0.05)" stroke-width="1.5" />
  <circle cx="400" cy="275" r="170" fill="none" stroke="rgba(56, 189, 248, 0.08)" stroke-width="1" stroke-dasharray="6 6" />

  <!-- Centered Master Emblem -->
  <g transform="translate(400, 275) scale(0.96)">
    ${createMasterEmblemSvg(true)}
  </g>

  <!-- Typography: PROSPERITY -->
  <text x="400" y="585" 
        font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" 
        font-size="52" 
        font-weight="800" 
        letter-spacing="16" 
        text-anchor="middle" 
        fill="url(#brandTextGrad)">PROSPERITY</text>

  <!-- Divider & Subtitle: — A I — -->
  <line x1="220" y1="634" x2="350" y2="634" stroke="url(#glowDividerLeft)" stroke-width="2.5" stroke-linecap="round" />
  
  <text x="400" y="642" 
        font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" 
        font-size="24" 
        font-weight="700" 
        letter-spacing="12" 
        text-anchor="middle" 
        fill="#38BDF8">A I</text>
  
  <line x1="450" y1="634" x2="580" y2="634" stroke="url(#glowDividerRight)" stroke-width="2.5" stroke-linecap="round" />

  <!-- Tagline -->
  <text x="400" y="688"
        font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
        font-size="14"
        font-weight="500"
        letter-spacing="4"
        text-anchor="middle"
        fill="#64748B">INTELLIGENCE · CLARITY · EMPOWERMENT</text>
</svg>
`;
}

// 3. Clean Transparent Emblem for in-app UI badges (320x320)
function createTransparentUiSvg() {
  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 360" width="360" height="360">
  <defs>
    <radialGradient id="coreGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#38BDF8" stop-opacity="0.3" />
      <stop offset="100%" stop-color="#38BDF8" stop-opacity="0" />
    </radialGradient>

    <linearGradient id="electricCyanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38BDF8" />
      <stop offset="50%" stop-color="#2563EB" />
      <stop offset="100%" stop-color="#1D4ED8" />
    </linearGradient>

    <linearGradient id="royalIndigoGrad" x1="100%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#93C5FD" />
      <stop offset="50%" stop-color="#3B82F6" />
      <stop offset="100%" stop-color="#1E3A8A" />
    </linearGradient>

    <linearGradient id="primaryBlueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1E40AF" />
      <stop offset="100%" stop-color="#0F172A" />
    </linearGradient>

    <linearGradient id="midnightNavyGrad" x1="30%" y1="0%" x2="70%" y2="100%">
      <stop offset="0%" stop-color="#1E293B" />
      <stop offset="100%" stop-color="#0F172A" />
    </linearGradient>

    <linearGradient id="goldApexGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFFBEB" />
      <stop offset="40%" stop-color="#FDE047" />
      <stop offset="100%" stop-color="#F59E0B" />
    </linearGradient>

    <filter id="subtleNeonBloom" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="0" stdDeviation="6" flood-color="#38BDF8" flood-opacity="0.45" />
    </filter>

    <filter id="goldBloom" x="-50%" y="-50%" width="200%" height="200%">
      <feDropShadow dx="0" dy="0" stdDeviation="4" flood-color="#F59E0B" flood-opacity="0.8" />
    </filter>
  </defs>

  <g transform="translate(180, 180) scale(0.82)">
    ${createMasterEmblemSvg(false)}
  </g>
</svg>
`;
}

async function buildAll() {
  const publicDir = path.resolve(process.cwd(), 'public');
  const distDir = path.resolve(process.cwd(), 'dist');

  const playStoreSvg = createPlayStoreIconSvg();
  const fullLogoSvg = createFullBrandLogoSvg();
  const transparentSvg = createTransparentUiSvg();

  // Write Vector SVGs
  fs.writeFileSync(path.join(publicDir, 'icon.svg'), playStoreSvg);
  fs.writeFileSync(path.join(publicDir, 'logo.svg'), fullLogoSvg);
  fs.writeFileSync(path.join(publicDir, 'icon-transparent.svg'), transparentSvg);
  console.log('✓ Written SVG files to public/');

  // 1. Google Play Store 512x512 Master App Icon
  await sharp(Buffer.from(playStoreSvg))
    .resize(512, 512)
    .png({ quality: 100, compressionLevel: 9 })
    .toFile(path.join(publicDir, 'icon-512.png'));
  console.log('✓ Rendered icon-512.png (512x512 Play Store)');

  // 2. Android Maskable Icon (512x512)
  await sharp(Buffer.from(playStoreSvg))
    .resize(512, 512)
    .png({ quality: 100 })
    .toFile(path.join(publicDir, 'icon-maskable.png'));
  console.log('✓ Rendered icon-maskable.png (512x512 Android Safe Zone)');

  // 3. Mobile PWA & Home screen icon (192x192)
  await sharp(Buffer.from(playStoreSvg))
    .resize(192, 192)
    .png({ quality: 100 })
    .toFile(path.join(publicDir, 'icon-192.png'));
  console.log('✓ Rendered icon-192.png');

  // 4. In-App UI Transparent Icon (256x256)
  await sharp(Buffer.from(transparentSvg))
    .resize(256, 256)
    .png()
    .toFile(path.join(publicDir, 'icon-transparent.png'));
  console.log('✓ Rendered icon-transparent.png');

  // 5. Full Brand Logo (800x800 PNG)
  await sharp(Buffer.from(fullLogoSvg))
    .resize(800, 800)
    .png({ quality: 100 })
    .toFile(path.join(publicDir, 'logo.png'));
  console.log('✓ Rendered logo.png (800x800)');

  // Sync to dist if present
  if (fs.existsSync(distDir)) {
    const assets = [
      'icon-512.png',
      'icon-192.png',
      'icon-maskable.png',
      'icon-transparent.png',
      'icon.svg',
      'icon-transparent.svg',
      'logo.png',
      'logo.svg'
    ];
    for (const a of assets) {
      fs.copyFileSync(path.join(publicDir, a), path.join(distDir, a));
    }
    console.log('✓ Synced all assets to dist/');
  }
}

buildAll().catch(err => {
  console.error(err);
  process.exit(1);
});
