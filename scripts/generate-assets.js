import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

// Reusable SVG path definition of the exact PROSPERITY AI conch emblem
// Bounding box: X in [-66, 128], Y in [-174, 215]
// Center of mass: X ≈ 31, Y ≈ 20.5
// Width ≈ 194, Height ≈ 389
const renderEmblem = (primaryNavy = 'url(#primaryNavy)', rightWing = 'url(#rightWingGrad)', innerHighlight = '#FFFFFF') => `
  <g id="conch-emblem">
    <!-- Outer Left Enclosing Plume / Flame -->
    <path d="M -9,165 
             C -25,120 -58,65 -60,-8 
             C -62,-72 -38,-135 0,-168 
             C -32,-145 -62,-90 -66,-25 
             C -70,45 -48,110 -22,152 
             C -18,158 -13,163 -9,165 Z" 
          fill="${primaryNavy}" />

    <!-- Outer Right Embracing Wing -->
    <path d="M 8,-174 
             C 42,-172 90,-130 112,-65 
             C 128,-18 132,45 106,105 
             C 86,150 48,190 -16,215 
             C 5,188 20,165 30,135 
             C 58,58 55,-35 25,-105 
             C 18,-122 8,-150 8,-174 Z" 
          fill="${rightWing}" />

    <!-- Central Conch Shell Body -->
    <g id="shankha-body">
      <!-- Top spiral nodule (Crest tip) -->
      <path d="M -18,-106 
               C -18,-128 18,-128 18,-106 
               C 18,-92 -18,-92 -18,-106 Z" 
            fill="${primaryNavy}" />

      <!-- Upper Shell Tier / Ridge -->
      <path d="M -30,-88 
               C -30,-106 30,-106 30,-88 
               C 30,-74 -30,-74 -30,-88 Z" 
            fill="${primaryNavy}" />

      <!-- Main Conch Teardrop / Body -->
      <path d="M -46,-65 
               C -58,-15 -52,48 -14,125 
               C -10,133 -4,146 -2,155 
               C 2,142 8,128 14,115 
               C 42,50 50,-10 38,-65 
               C 28,-75 -35,-75 -46,-65 Z" 
            fill="${primaryNavy}" />

      <!-- Inner Elegant Spiral Highlight -->
      <path d="M -3,-48 
               C -24,-30 -34,0 -24,45 
               C -18,72 -2,102 4,118 
               C -5,98 -16,68 -16,42 
               C -16,5 2,-26 12,-38 
               C 6,-45 0,-47 -3,-48 Z" 
            fill="${innerHighlight}" />

      <!-- Conch Lip Detail Ridge -->
      <path d="M 6,-55 
               C 18,-42 22,-20 18,12 
               C 16,26 10,48 2,68 
               C 8,50 14,30 14,15 
               C 14,-15 10,-35 2,-48 Z" 
            fill="#050E20" opacity="0.35" />
    </g>
  </g>
`;

// 1. Google Play Store & Android Adaptive App Icon (Full-bleed 512x512 with safe-zone margin)
// NO rounded corners in the asset (Google Play requirement). Full bleed white background.
// Optical center at (256, 256), scale = 0.75 so the height is ~290px within the 384px Android safe zone.
const createPlayStoreIconSvg = () => `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="primaryNavy" x1="20%" y1="0%" x2="80%" y2="100%">
      <stop offset="0%" stop-color="#071329" />
      <stop offset="60%" stop-color="#0A1D44" />
      <stop offset="100%" stop-color="#0F2B66" />
    </linearGradient>

    <linearGradient id="rightWingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#07152E" />
      <stop offset="50%" stop-color="#0A2252" />
      <stop offset="100%" stop-color="#0E357F" />
    </linearGradient>

    <filter id="subtleShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="6" stdDeviation="10" flood-color="#071329" flood-opacity="0.12" />
    </filter>
  </defs>

  <!-- Google Play Required: 100% full bleed background, zero border radius -->
  <rect width="512" height="512" fill="#FFFFFF" />

  <!-- Centered strictly inside Android & Play Store Safe Zone (Radius < 190px) -->
  <!-- Center of bounding box is shifted by -31 in X and -20 in Y to be mathematically centered at (256, 256) -->
  <g transform="translate(240, 246) scale(0.72)" filter="url(#subtleShadow)">
    ${renderEmblem('url(#primaryNavy)', 'url(#rightWingGrad)', '#FFFFFF')}
  </g>
</svg>
`;

// 2. Transparent Emblem SVG for UI components (Header, Sidebar, Welcome badge)
// Clean transparent background so it looks flawless on any background color
const createTransparentEmblemSvg = (isDark = true) => `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 320" width="320" height="320">
  <defs>
    <linearGradient id="luminousNavy" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${isDark ? '#60A5FA' : '#071329'}" />
      <stop offset="50%" stop-color="${isDark ? '#3B82F6' : '#0A1D44'}" />
      <stop offset="100%" stop-color="${isDark ? '#1D4ED8' : '#0F2B66'}" />
    </linearGradient>

    <linearGradient id="luminousWing" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${isDark ? '#93C5FD' : '#07152E'}" />
      <stop offset="50%" stop-color="${isDark ? '#60A5FA' : '#0A2252'}" />
      <stop offset="100%" stop-color="${isDark ? '#2563EB' : '#0E357F'}" />
    </linearGradient>
  </defs>

  <g transform="translate(145, 155) scale(0.66)">
    ${renderEmblem(
      isDark ? 'url(#luminousNavy)' : 'url(#primaryNavy)',
      isDark ? 'url(#luminousWing)' : 'url(#rightWingGrad)',
      isDark ? '#0F172A' : '#FFFFFF'
    )}
  </g>
</svg>
`;

// 3. Full Brand Logo (Emblem + PROSPERITY + AI text)
const createFullLogoSvg = () => `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="800" height="800">
  <defs>
    <linearGradient id="primaryNavy" x1="20%" y1="0%" x2="80%" y2="100%">
      <stop offset="0%" stop-color="#071329" />
      <stop offset="60%" stop-color="#0A1D44" />
      <stop offset="100%" stop-color="#0F2B66" />
    </linearGradient>

    <linearGradient id="rightWingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#07152E" />
      <stop offset="50%" stop-color="#0A2252" />
      <stop offset="100%" stop-color="#0E357F" />
    </linearGradient>

    <linearGradient id="lineAccent" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#0066FF" stop-opacity="0" />
      <stop offset="50%" stop-color="#0066FF" stop-opacity="1" />
      <stop offset="100%" stop-color="#0088FF" stop-opacity="0.8" />
    </linearGradient>
    <linearGradient id="lineAccentRight" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#0088FF" stop-opacity="0.8" />
      <stop offset="50%" stop-color="#0066FF" stop-opacity="1" />
      <stop offset="100%" stop-color="#0066FF" stop-opacity="0" />
    </linearGradient>
  </defs>

  <rect width="800" height="800" fill="#FFFFFF" />

  <!-- EMBLEM: Centered horizontally at 400 -->
  <g transform="translate(382, 270) scale(0.95)">
    ${renderEmblem('url(#primaryNavy)', 'url(#rightWingGrad)', '#FFFFFF')}
  </g>

  <!-- BRAND TEXT: PROSPERITY -->
  <text x="400" y="580" 
        font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" 
        font-size="64" 
        font-weight="800" 
        letter-spacing="14" 
        text-anchor="middle" 
        fill="#071329">PROSPERITY</text>

  <!-- SUBTITLE: — A I — -->
  <line x1="210" y1="630" x2="355" y2="630" stroke="url(#lineAccent)" stroke-width="3" stroke-linecap="round" />
  
  <text x="400" y="638" 
        font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" 
        font-size="28" 
        font-weight="700" 
        letter-spacing="10" 
        text-anchor="middle" 
        fill="#0055FF">A I</text>
  
  <line x1="445" y1="630" x2="590" y2="630" stroke="url(#lineAccentRight)" stroke-width="3" stroke-linecap="round" />
</svg>
`;

async function main() {
  const publicDir = path.resolve(process.cwd(), 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  const playStoreSvg = createPlayStoreIconSvg();
  const transparentDarkSvg = createTransparentEmblemSvg(true);
  const transparentLightSvg = createTransparentEmblemSvg(false);
  const fullLogoSvg = createFullLogoSvg();

  // Write SVGs
  fs.writeFileSync(path.join(publicDir, 'icon.svg'), playStoreSvg);
  fs.writeFileSync(path.join(publicDir, 'logo.svg'), fullLogoSvg);
  fs.writeFileSync(path.join(publicDir, 'icon-transparent.svg'), transparentDarkSvg);
  fs.writeFileSync(path.join(publicDir, 'icon-dark.svg'), transparentDarkSvg);
  fs.writeFileSync(path.join(publicDir, 'icon-light.svg'), transparentLightSvg);

  // 1. Google Play Store & Android Launcher Icon 512x512 (Full bleed white, centered in safe zone)
  await sharp(Buffer.from(playStoreSvg))
    .resize(512, 512)
    .png({ quality: 100, compressionLevel: 9 })
    .toFile(path.join(publicDir, 'icon-512.png'));
  console.log('✓ Generated icon-512.png (512x512, Android Safe Zone optimized)');

  // 2. Android Maskable Icon 512x512 (PWABuilder maskable test pass)
  await sharp(Buffer.from(playStoreSvg))
    .resize(512, 512)
    .png({ quality: 100 })
    .toFile(path.join(publicDir, 'icon-maskable.png'));
  console.log('✓ Generated icon-maskable.png');

  // 3. App Icon 192x192
  await sharp(Buffer.from(playStoreSvg))
    .resize(192, 192)
    .png({ quality: 100, compressionLevel: 9 })
    .toFile(path.join(publicDir, 'icon-192.png'));
  console.log('✓ Generated icon-192.png');

  // 4. Transparent In-App Emblem (For Header, Sidebar, and Welcome state)
  await sharp(Buffer.from(transparentDarkSvg))
    .resize(256, 256)
    .png()
    .toFile(path.join(publicDir, 'icon-transparent.png'));
  console.log('✓ Generated icon-transparent.png');

  // 5. Full Logo 800x800 PNG
  await sharp(Buffer.from(fullLogoSvg))
    .resize(800, 800)
    .png({ quality: 100 })
    .toFile(path.join(publicDir, 'logo.png'));
  console.log('✓ Generated logo.png');

  // Sync to dist if present
  const distDir = path.resolve(process.cwd(), 'dist');
  if (fs.existsSync(distDir)) {
    const filesToSync = [
      'icon-512.png',
      'icon-192.png',
      'icon-maskable.png',
      'icon-transparent.png',
      'icon.svg',
      'logo.png',
      'logo.svg',
    ];
    for (const f of filesToSync) {
      fs.copyFileSync(path.join(publicDir, f), path.join(distDir, f));
    }
    console.log('✓ Synced all assets to dist/');
  }
}

main().catch(err => {
  console.error('Error generating assets:', err);
  process.exit(1);
});
