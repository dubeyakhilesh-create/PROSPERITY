import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

/**
 * PROSPERITY AI - Pure Letterform Brand Assets
 * "Not arranged. Keep simple only letters. PROSPERITY AI"
 * 
 * - Big, high-visibility geometric letterforms
 * - Demanded ratios: 1:1 (Square Emblem 512x512) and 4:1 (Horizontal Wordmark 880x220)
 * - Maximum optical legibility even at small dimensions (24px to 64px)
 * - Pure typography, bold high-contrast gradients, electric cyan highlight
 */

function getSquareLettersSvg({
  width = 512,
  height = 512,
  isTransparent = false,
  isMaskable = false,
}) {
  // For maskable icon, keep inside Android 80% safe circle (~410px)
  const fontSizeProsperity = isMaskable ? 54 : 62;
  const letterSpacingProsperity = isMaskable ? 3 : 4;
  const fontSizeAi = isMaskable ? 78 : 88;
  const letterSpacingAi = isMaskable ? 18 : 22;
  const translateY = isMaskable ? 218 : 212;

  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="${width}" height="${height}">
  <defs>
    <linearGradient id="sqBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0F172A" />
      <stop offset="50%" stop-color="#090D1A" />
      <stop offset="100%" stop-color="#020617" />
    </linearGradient>
    <linearGradient id="sqTextGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF" />
      <stop offset="100%" stop-color="#F1F5F9" />
    </linearGradient>
    <linearGradient id="sqAiGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38BDF8" />
      <stop offset="100%" stop-color="#60A5FA" />
    </linearGradient>
    <filter id="sqGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#0284C7" flood-opacity="0.4" />
    </filter>
  </defs>

  ${!isTransparent ? `
  <rect width="512" height="512" rx="${isMaskable ? 0 : 96}" fill="url(#sqBgGrad)" />
  ${!isMaskable ? '<rect width="504" height="504" x="4" y="4" rx="92" fill="none" stroke="#38BDF8" stroke-opacity="0.35" stroke-width="8" />' : ''}
  ` : ''}

  <!-- Letterform Logo: Big, high-impact PROSPERITY AI -->
  <g transform="translate(256, ${translateY})">
    <text x="0" y="0"
          font-family="'Liberation Sans', 'DejaVu Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
          font-size="${fontSizeProsperity}"
          font-weight="900"
          letter-spacing="${letterSpacingProsperity}"
          text-anchor="middle"
          fill="url(#sqTextGrad)">PROSPERITY</text>
    <text x="0" y="112"
          font-family="'Liberation Sans', 'DejaVu Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
          font-size="${fontSizeAi}"
          font-weight="900"
          letter-spacing="${letterSpacingAi}"
          text-anchor="middle"
          filter="url(#sqGlow)"
          fill="url(#sqAiGrad)">AI</text>
  </g>
</svg>
`;
}

function getHorizontalLogoSvg({
  width = 880,
  height = 220,
  isTransparent = false,
}) {
  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 880 220" width="${width}" height="${height}">
  <defs>
    <linearGradient id="hzBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0F172A" />
      <stop offset="50%" stop-color="#090D1A" />
      <stop offset="100%" stop-color="#020617" />
    </linearGradient>
    <linearGradient id="hzTextGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF" />
      <stop offset="100%" stop-color="#F1F5F9" />
    </linearGradient>
    <linearGradient id="hzAiGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38BDF8" />
      <stop offset="100%" stop-color="#60A5FA" />
    </linearGradient>
    <filter id="hzGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="2" stdDeviation="4" flood-color="#0284C7" flood-opacity="0.35" />
    </filter>
  </defs>

  ${!isTransparent ? `
  <rect width="880" height="220" rx="44" fill="url(#hzBgGrad)" />
  <rect width="872" height="212" x="4" y="4" rx="40" fill="none" stroke="#38BDF8" stroke-opacity="0.3" stroke-width="6" />
  ` : ''}

  <!-- Single high-visibility line: PROSPERITY AI in demanded 4:1 ratio -->
  <g transform="translate(440, 138)">
    <text x="0" y="0" text-anchor="middle">
      <tspan font-family="'Liberation Sans', 'DejaVu Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
             font-size="82"
             font-weight="900"
             letter-spacing="6"
             fill="url(#hzTextGrad)">PROSPERITY </tspan>
      <tspan font-family="'Liberation Sans', 'DejaVu Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
             font-size="82"
             font-weight="900"
             letter-spacing="10"
             filter="url(#hzGlow)"
             fill="url(#hzAiGrad)">AI</tspan>
    </text>
  </g>
</svg>
`;
}

async function generateAll() {
  const publicDir = path.resolve(process.cwd(), 'public');
  const distDir = path.resolve(process.cwd(), 'dist');

  const squareSvg = getSquareLettersSvg({ width: 512, height: 512 });
  const squareMaskableSvg = getSquareLettersSvg({ width: 512, height: 512, isMaskable: true });
  const squareTransparentSvg = getSquareLettersSvg({ width: 512, height: 512, isTransparent: true });
  const horizontalLogoSvg = getHorizontalLogoSvg({ width: 880, height: 220 });
  const horizontalTransparentLogoSvg = getHorizontalLogoSvg({ width: 880, height: 220, isTransparent: true });

  // Save SVGs
  fs.writeFileSync(path.join(publicDir, 'icon.svg'), squareSvg);
  fs.writeFileSync(path.join(publicDir, 'icon-transparent.svg'), squareTransparentSvg);
  fs.writeFileSync(path.join(publicDir, 'logo.svg'), horizontalLogoSvg);
  fs.writeFileSync(path.join(publicDir, 'logo-transparent.svg'), horizontalTransparentLogoSvg);
  console.log('✓ Wrote SVG vector files');

  // Render 512x512 Master App Icon (1:1 Ratio)
  await sharp(Buffer.from(squareSvg))
    .resize(512, 512)
    .png({ quality: 100 })
    .toFile(path.join(publicDir, 'icon-512.png'));
  console.log('✓ Rendered icon-512.png (512x512 High-Visibility Letters)');

  // Render Maskable Icon (512x512 Android Safe Zone)
  await sharp(Buffer.from(squareMaskableSvg))
    .resize(512, 512)
    .png({ quality: 100 })
    .toFile(path.join(publicDir, 'icon-maskable.png'));
  console.log('✓ Rendered icon-maskable.png (512x512 Android Safe Zone)');

  // Render 192x192 Icon
  await sharp(Buffer.from(squareSvg))
    .resize(192, 192)
    .png({ quality: 100 })
    .toFile(path.join(publicDir, 'icon-192.png'));
  console.log('✓ Rendered icon-192.png (192x192)');

  // Render Transparent UI Icon (256x256)
  await sharp(Buffer.from(squareTransparentSvg))
    .resize(256, 256)
    .png()
    .toFile(path.join(publicDir, 'icon-transparent.png'));
  console.log('✓ Rendered icon-transparent.png');

  // Render Horizontal Logo (880x220 PNG - 4:1 Demanded Ratio)
  await sharp(Buffer.from(horizontalLogoSvg))
    .resize(880, 220)
    .png({ quality: 100 })
    .toFile(path.join(publicDir, 'logo.png'));
  console.log('✓ Rendered logo.png (880x220 4:1 Demanded Ratio)');

  // Copy to dist if dist exists
  if (fs.existsSync(distDir)) {
    const assets = [
      'icon-512.png',
      'icon-maskable.png',
      'icon-192.png',
      'icon-transparent.png',
      'icon.svg',
      'icon-transparent.svg',
      'logo.png',
      'logo.svg',
      'logo-transparent.svg',
    ];
    for (const a of assets) {
      fs.copyFileSync(path.join(publicDir, a), path.join(distDir, a));
    }
    console.log('✓ Synced all assets to dist/');
  }
}

generateAll().catch(err => {
  console.error(err);
  process.exit(1);
});

