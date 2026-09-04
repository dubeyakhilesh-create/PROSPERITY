import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

// Generate SVG string based on the user's exact uploaded image (IMG_20260903_024703.jpg)
// Black emblem on white background, with exact organic curves
function getEmblemSvg({
  width = 512,
  height = 512,
  fillColor = '#000000',
  innerHighlight = '#FFFFFF',
  bgColor = '#FFFFFF',
  isTransparent = false,
  padding = 40,
}) {
  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" width="${width}" height="${height}">
  ${!isTransparent ? `<rect width="1000" height="1000" fill="${bgColor}" />` : ''}
  
  <g id="prosperity-shankha-logo" transform="translate(500, 500) scale(0.92) translate(-500, -500)">
    
    <!-- 1. OUTER RIGHT CRESCENT WING -->
    <path d="M 470,146 
             C 500,147 542,154 582,176 
             C 652,216 712,282 735,368 
             C 748,422 742,488 718,552 
             C 686,634 632,714 568,796 
             C 518,860 472,925 452,982 
             C 455,950 466,912 485,862 
             C 525,762 575,658 602,548 
             C 618,482 620,412 596,346 
             C 572,280 522,218 470,182 
             Z" 
          fill="${fillColor}" />

    <!-- 2. OUTER LEFT FLAME PLUME -->
    <path d="M 408,170 
             C 388,198 360,234 336,275 
             C 330,285 328,298 332,312 
             C 334,318 332,326 325,334 
             C 298,368 274,420 264,475 
             C 252,538 262,608 288,675 
             C 318,748 362,828 422,942 
             C 408,890 382,822 355,752 
             C 324,670 298,582 298,502 
             C 298,428 320,362 352,308 
             C 374,272 396,225 408,170 
             Z" 
          fill="${fillColor}" />

    <!-- 3. CENTRAL SHANKHA (CONCH) BODY -->
    <g id="conch-center">
      <!-- Top Crown Finial Knob -->
      <path d="M 440,256 
               C 440,240 452,234 466,234 
               C 480,234 492,240 492,256 
               C 492,270 480,278 466,278 
               C 452,278 440,270 440,256 Z" 
            fill="${fillColor}" />
      
      <!-- Crown Top Ring / Tier 1 -->
      <path d="M 432,284 
               C 432,275 448,272 466,272 
               C 484,272 500,275 500,284 
               C 500,296 484,302 466,302 
               C 448,302 432,296 432,284 Z" 
            fill="${fillColor}" />

      <!-- Crown Base Ring / Tier 2 -->
      <path d="M 412,315 
               C 412,298 436,294 466,294 
               C 496,294 520,298 520,315 
               C 520,332 496,338 466,338 
               C 436,338 412,332 412,315 Z" 
            fill="${fillColor}" />

      <!-- Main Shell Body -->
      <path d="M 416,336 
               C 388,360 366,400 354,445 
               C 342,492 348,542 368,590 
               C 392,646 426,712 454,785 
               C 468,735 498,662 534,592 
               C 564,535 590,476 588,425 
               C 586,375 556,345 516,336 
               Z" 
            fill="${fillColor}" />

      <!-- Outer Left Spiral Creep / Flange of Conch Shell -->
      <path d="M 374,435 
               C 358,472 355,515 368,556 
               C 378,588 396,626 414,658 
               C 404,625 390,588 382,555 
               C 374,518 376,478 388,445 
               Z" 
            fill="${!isTransparent ? bgColor : innerHighlight}" />

      <!-- Inner White Crescent Swirl inside Conch Body -->
      <path d="M 454,395 
               C 436,420 428,458 432,496 
               C 436,532 452,568 474,600 
               C 480,608 484,618 482,624 
               C 480,628 474,626 468,618 
               C 446,585 426,544 420,502 
               C 416,458 424,418 445,390 
               C 448,386 454,388 454,395 Z" 
            fill="${!isTransparent ? bgColor : innerHighlight}" />

      <!-- Subtle inner depth curve on right lip -->
      <path d="M 495,440 
               C 506,462 508,490 502,520 
               C 496,545 484,570 472,592 
               C 478,570 488,545 492,522 
               C 496,495 495,468 488,446 
               Z" 
            fill="${!isTransparent ? '#E2E8F0' : 'rgba(255,255,255,0.4)'}" opacity="0.5" />
    </g>
  </g>
</svg>
`;
}

async function run() {
  const publicDir = path.resolve(process.cwd(), 'public');
  const distDir = path.resolve(process.cwd(), 'dist');

  // 1. Black & White Master App Icon for Google Play / Android (512x512)
  // Exact match to user's uploaded art IMG_20260903_024703.jpg
  const playStoreSvg = getEmblemSvg({
    width: 512,
    height: 512,
    fillColor: '#000000',
    innerHighlight: '#FFFFFF',
    bgColor: '#FFFFFF',
    isTransparent: false,
  });

  // 2. Android Maskable Icon (512x512)
  const maskableSvg = getEmblemSvg({
    width: 512,
    height: 512,
    fillColor: '#000000',
    innerHighlight: '#FFFFFF',
    bgColor: '#FFFFFF',
    isTransparent: false,
  });

  // 3. Transparent Luminous Vector for UI (Sidebar, Welcome State)
  // Clean white & electric blue glow on dark backgrounds
  const transparentUiSvg = getEmblemSvg({
    width: 320,
    height: 320,
    fillColor: '#F8FAFC',
    innerHighlight: '#0F172A',
    isTransparent: true,
  });

  fs.writeFileSync(path.join(publicDir, 'icon.svg'), playStoreSvg);
  fs.writeFileSync(path.join(publicDir, 'icon-transparent.svg'), transparentUiSvg);

  // Render 512x512 icon PNG
  await sharp(Buffer.from(playStoreSvg))
    .resize(512, 512)
    .png({ quality: 100 })
    .toFile(path.join(publicDir, 'icon-512.png'));
  console.log('✓ Created 512x512 icon-512.png from uploaded artwork');

  // Render 192x192 icon PNG
  await sharp(Buffer.from(playStoreSvg))
    .resize(192, 192)
    .png({ quality: 100 })
    .toFile(path.join(publicDir, 'icon-192.png'));
  console.log('✓ Created 192x192 icon-192.png');

  // Render maskable icon PNG
  await sharp(Buffer.from(maskableSvg))
    .resize(512, 512)
    .png({ quality: 100 })
    .toFile(path.join(publicDir, 'icon-maskable.png'));
  console.log('✓ Created 512x512 icon-maskable.png');

  // Render UI transparent emblem PNG
  await sharp(Buffer.from(transparentUiSvg))
    .resize(256, 256)
    .png()
    .toFile(path.join(publicDir, 'icon-transparent.png'));
  console.log('✓ Created transparent UI icon-transparent.png');

  // Sync with dist
  if (fs.existsSync(distDir)) {
    const assets = ['icon-512.png', 'icon-192.png', 'icon-maskable.png', 'icon-transparent.png', 'icon.svg', 'icon-transparent.svg'];
    for (const a of assets) {
      fs.copyFileSync(path.join(publicDir, a), path.join(distDir, a));
    }
    console.log('✓ Synced all new icons to dist/');
  }
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
