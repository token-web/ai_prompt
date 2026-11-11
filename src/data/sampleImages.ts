// SVG Data URLs for reliable, zero-latency Before & After visuals that work offline and on GitHub Pages

function svgToDataUrl(svg: string): string {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

// 1. Studio Portrait: Flat daily photo vs. Cinematic studio lighting
export const portraitBefore = svgToDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">
  <defs>
    <linearGradient id="bg_before" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#cbd5e1"/>
      <stop offset="100%" stop-color="#94a3b8"/>
    </linearGradient>
    <linearGradient id="skin_flat" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#fed7aa"/>
      <stop offset="100%" stop-color="#fdba74"/>
    </linearGradient>
  </defs>
  <!-- Background -->
  <rect width="800" height="600" fill="url(#bg_before)"/>
  <rect x="50" y="80" width="220" height="440" rx="8" fill="#e2e8f0" opacity="0.4"/>
  <rect x="530" y="60" width="220" height="460" rx="8" fill="#e2e8f0" opacity="0.3"/>
  
  <!-- Person Silhouettes / Flat lighting -->
  <path d="M 280 600 Q 280 430 400 420 Q 520 430 520 600 Z" fill="#475569"/>
  <!-- Neck -->
  <rect x="375" y="360" width="50" height="70" fill="url(#skin_flat)"/>
  <!-- Head -->
  <ellipse cx="400" cy="270" rx="90" ry="120" fill="url(#skin_flat)"/>
  <!-- Hair (Simple) -->
  <path d="M 300 240 Q 400 130 500 240 Q 510 320 480 340 Q 400 170 320 340 Z" fill="#1e293b"/>
  <!-- Eyes -->
  <circle cx="365" cy="265" r="9" fill="#0f172a"/>
  <circle cx="435" cy="265" r="9" fill="#0f172a"/>
  <!-- Mouth & Nose -->
  <path d="M 400 280 L 395 305 L 405 305" stroke="#ea580c" stroke-width="2" fill="none"/>
  <path d="M 380 335 Q 400 350 420 335" stroke="#c2410c" stroke-width="3" fill="none"/>

  <!-- Watermark / Stamp -->
  <rect x="30" y="30" width="130" height="34" rx="17" fill="rgba(15,23,42,0.6)"/>
  <text x="95" y="52" fill="#ffffff" font-family="sans-serif" font-weight="700" font-size="14" text-anchor="middle">ORIGINAL</text>
  <text x="400" y="570" fill="#ffffff" font-family="sans-serif" font-weight="600" font-size="16" text-anchor="middle" opacity="0.8">원본: 실내 형광등 일상 스냅샷</text>
</svg>
`);

export const portraitAfter = svgToDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">
  <defs>
    <radialGradient id="studio_glow" cx="50%" cy="30%" r="70%">
      <stop offset="0%" stop-color="#3b82f6" stop-opacity="0.8"/>
      <stop offset="40%" stop-color="#1e1b4b" stop-opacity="0.95"/>
      <stop offset="100%" stop-color="#090514"/>
    </radialGradient>
    <linearGradient id="warm_rim" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#f59e0b"/>
      <stop offset="50%" stop-color="#fbbf24"/>
      <stop offset="100%" stop-color="#ec4899"/>
    </linearGradient>
    <linearGradient id="skin_cinematic" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#ffedd5"/>
      <stop offset="60%" stop-color="#fed7aa"/>
      <stop offset="100%" stop-color="#f97316"/>
    </linearGradient>
    <filter id="soft_glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="14" result="blur"/>
      <feComposite in="SourceGraphic" in2="blur" operator="over"/>
    </filter>
  </defs>
  <!-- Background with bokeh -->
  <rect width="800" height="600" fill="url(#studio_glow)"/>
  <circle cx="150" cy="180" r="80" fill="#ec4899" opacity="0.25" filter="url(#soft_glow)"/>
  <circle cx="680" cy="220" r="110" fill="#3b82f6" opacity="0.3" filter="url(#soft_glow)"/>
  <circle cx="620" cy="460" r="60" fill="#f59e0b" opacity="0.2" filter="url(#soft_glow)"/>
  <circle cx="200" cy="440" r="90" fill="#8b5cf6" opacity="0.25" filter="url(#soft_glow)"/>
  
  <!-- Shoulders & Coat -->
  <path d="M 260 600 Q 270 410 400 400 Q 530 410 540 600 Z" fill="#0f172a"/>
  <!-- Rim Light on Collar -->
  <path d="M 330 450 L 400 520 L 470 450" stroke="url(#warm_rim)" stroke-width="4" fill="none"/>
  
  <!-- Neck -->
  <rect x="375" y="340" width="50" height="80" fill="url(#skin_cinematic)"/>
  <!-- Head -->
  <ellipse cx="400" cy="250" rx="92" ry="122" fill="url(#skin_cinematic)"/>
  
  <!-- Rim light side glow -->
  <path d="M 308 230 Q 312 360 400 372" stroke="#fbbf24" stroke-width="7" fill="none" filter="url(#soft_glow)"/>
  <path d="M 492 230 Q 488 360 400 372" stroke="#38bdf8" stroke-width="5" fill="none" filter="url(#soft_glow)"/>

  <!-- High fashion hair with highlights -->
  <path d="M 280 230 Q 400 110 520 230 Q 530 330 490 350 Q 400 140 310 350 Z" fill="#090514"/>
  <path d="M 300 210 Q 400 125 500 210" stroke="url(#warm_rim)" stroke-width="4" fill="none"/>

  <!-- Expressive Eyes with specular catchlights -->
  <ellipse cx="365" cy="245" rx="12" ry="10" fill="#0f172a"/>
  <circle cx="368" cy="242" r="3.5" fill="#ffffff"/>
  <ellipse cx="435" cy="245" rx="12" ry="10" fill="#0f172a"/>
  <circle cx="438" cy="242" r="3.5" fill="#ffffff"/>

  <!-- Refined Nose & Cinematic Lips -->
  <path d="M 400 260 L 394 285 L 406 285" stroke="#ea580c" stroke-width="2.5" fill="none"/>
  <path d="M 376 315 Q 400 332 424 315" stroke="#e11d48" stroke-width="4" fill="none"/>
  <ellipse cx="400" cy="322" rx="16" ry="5" fill="#f43f5e" opacity="0.7"/>

  <!-- Watermark / Stamp -->
  <rect x="630" y="30" width="140" height="34" rx="17" fill="rgba(34,211,238,0.9)"/>
  <text x="700" y="52" fill="#082f49" font-family="sans-serif" font-weight="800" font-size="14" text-anchor="middle">AI STUDIO ✨</text>
  <text x="400" y="570" fill="#fef08a" font-family="sans-serif" font-weight="700" font-size="16" text-anchor="middle">생성 결과: 8K 스튜디오 시네마틱 조명 & 보케</text>
</svg>
`);

// 2. Webtoon / Anime Transformation
export const webtoonBefore = svgToDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">
  <rect width="800" height="600" fill="#64748b"/>
  <!-- Street background blurred -->
  <rect x="80" y="100" width="640" height="400" rx="12" fill="#475569" opacity="0.6"/>
  <circle cx="400" cy="270" r="110" fill="#fbcfe8"/>
  <path d="M 280 600 C 280 430 520 430 520 600 Z" fill="#334155"/>
  <text x="95" y="52" fill="#ffffff" font-family="sans-serif" font-weight="700" font-size="14" text-anchor="middle">ORIGINAL</text>
  <rect x="30" y="30" width="130" height="34" rx="17" fill="rgba(15,23,42,0.6)"/>
  <text x="95" y="52" fill="#ffffff" font-family="sans-serif" font-weight="700" font-size="14" text-anchor="middle">ORIGINAL</text>
  <text x="400" y="570" fill="#ffffff" font-family="sans-serif" font-weight="600" font-size="16" text-anchor="middle">원본: 일반 거리 인물 사진</text>
</svg>
`);

export const webtoonAfter = svgToDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">
  <defs>
    <linearGradient id="wt_sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#fdf4ff"/>
      <stop offset="50%" stop-color="#fae8ff"/>
      <stop offset="100%" stop-color="#c084fc"/>
    </linearGradient>
    <linearGradient id="hair_anime" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#38bdf8"/>
      <stop offset="50%" stop-color="#6366f1"/>
      <stop offset="100%" stop-color="#a855f7"/>
    </linearGradient>
  </defs>
  <rect width="800" height="600" fill="url(#wt_sky)"/>
  <!-- Sparkles and cherry petals -->
  <path d="M 120 180 Q 130 160 140 180 Q 160 190 140 200 Q 130 220 120 200 Q 100 190 120 180 Z" fill="#f472b6" opacity="0.6"/>
  <path d="M 660 140 Q 670 120 680 140 Q 700 150 680 160 Q 670 180 660 160 Q 640 150 660 140 Z" fill="#f472b6" opacity="0.7"/>
  <circle cx="250" cy="120" r="4" fill="#ffffff"/>
  <circle cx="580" cy="100" r="5" fill="#ffffff"/>

  <!-- Webtoon Character Clothes -->
  <path d="M 270 600 Q 290 420 400 410 Q 510 420 530 600 Z" fill="#1e1b4b"/>
  <path d="M 370 410 L 400 480 L 430 410" fill="#ffffff" stroke="#c084fc" stroke-width="2"/>
  <polygon points="400,450 390,560 400,580 410,560" fill="#ec4899"/>

  <!-- Face & Chiseled Jawline -->
  <polygon points="320,240 400,370 480,240 450,180 350,180" fill="#fff1f2" stroke="#fda4af" stroke-width="1.5"/>
  
  <!-- Flowing Anime Hair -->
  <path d="M 280 240 Q 400 100 520 230 Q 560 360 510 400 Q 470 260 400 180 Q 330 260 290 400 Z" fill="url(#hair_anime)"/>
  <!-- Bangs strands -->
  <polygon points="370,180 385,250 395,180" fill="#38bdf8"/>
  <polygon points="395,180 410,260 425,180" fill="#818cf8"/>
  <polygon points="425,180 440,245 450,180" fill="#a855f7"/>

  <!-- Large Anime Sparkling Eyes -->
  <ellipse cx="360" cy="250" rx="18" ry="24" fill="#4338ca"/>
  <circle cx="363" cy="242" r="8" fill="#a5b4fc"/>
  <circle cx="366" cy="238" r="4" fill="#ffffff"/>
  <circle cx="355" cy="260" r="3" fill="#ffffff"/>

  <ellipse cx="440" cy="250" rx="18" ry="24" fill="#4338ca"/>
  <circle cx="443" cy="242" r="8" fill="#a5b4fc"/>
  <circle cx="446" cy="238" r="4" fill="#ffffff"/>
  <circle cx="435" cy="260" r="3" fill="#ffffff"/>

  <!-- Delicate mouth & blush -->
  <ellipse cx="340" cy="285" rx="14" ry="6" fill="#f43f5e" opacity="0.4"/>
  <ellipse cx="460" cy="285" rx="14" ry="6" fill="#f43f5e" opacity="0.4"/>
  <path d="M 390 320 Q 400 328 410 320" stroke="#e11d48" stroke-width="3" fill="none" stroke-linecap="round"/>

  <!-- Watermark / Stamp -->
  <rect x="630" y="30" width="140" height="34" rx="17" fill="rgba(192,132,252,0.9)"/>
  <text x="700" y="52" fill="#3b0764" font-family="sans-serif" font-weight="800" font-size="14" text-anchor="middle">MANHWA ART 🌸</text>
  <text x="400" y="570" fill="#581c87" font-family="sans-serif" font-weight="700" font-size="16" text-anchor="middle">생성 결과: 한국 인기 로맨스 웹툰 스타일 화풍</text>
</svg>
`);

// 3. Product Photography (Commercial Cosmetics)
export const productBefore = svgToDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">
  <rect width="800" height="600" fill="#e2e8f0"/>
  <!-- Table edge -->
  <line x1="0" y1="420" x2="800" y2="420" stroke="#94a3b8" stroke-width="4"/>
  <rect x="0" y="420" width="800" height="180" fill="#cbd5e1"/>
  <!-- Plain bottle -->
  <rect x="350" y="220" width="100" height="200" rx="16" fill="#94a3b8"/>
  <rect x="380" y="160" width="40" height="60" fill="#64748b"/>
  <rect x="30" y="30" width="130" height="34" rx="17" fill="rgba(15,23,42,0.6)"/>
  <text x="95" y="52" fill="#ffffff" font-family="sans-serif" font-weight="700" font-size="14" text-anchor="middle">ORIGINAL</text>
  <text x="400" y="570" fill="#475569" font-family="sans-serif" font-weight="600" font-size="16" text-anchor="middle">원본: 일반 책상 위 단순 화장품 용기</text>
</svg>
`);

export const productAfter = svgToDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">
  <defs>
    <linearGradient id="prod_bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#022c22"/>
      <stop offset="50%" stop-color="#064e3b"/>
      <stop offset="100%" stop-color="#0f172a"/>
    </linearGradient>
    <linearGradient id="gold_cap" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#fef08a"/>
      <stop offset="50%" stop-color="#eab308"/>
      <stop offset="100%" stop-color="#a16207"/>
    </linearGradient>
    <linearGradient id="glass_bottle" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#10b981" stop-opacity="0.8"/>
      <stop offset="30%" stop-color="#ecfdf5" stop-opacity="0.9"/>
      <stop offset="70%" stop-color="#059669" stop-opacity="0.85"/>
      <stop offset="100%" stop-color="#047857"/>
    </linearGradient>
    <filter id="water_glow">
      <feGaussianBlur stdDeviation="6" result="b"/>
      <feComposite in="SourceGraphic" in2="b" operator="over"/>
    </filter>
  </defs>
  <rect width="800" height="600" fill="url(#prod_bg)"/>

  <!-- Wet Black Stone Podium -->
  <polygon points="180,440 620,440 680,520 120,520" fill="#1e293b"/>
  <ellipse cx="400" cy="520" rx="280" ry="20" fill="#0f172a" opacity="0.8"/>
  <ellipse cx="400" cy="440" rx="220" ry="14" fill="#334155"/>

  <!-- Water Ripples -->
  <ellipse cx="400" cy="450" rx="160" ry="8" fill="none" stroke="#34d399" stroke-width="2" opacity="0.6"/>
  <ellipse cx="400" cy="450" rx="100" ry="5" fill="none" stroke="#6ee7b7" stroke-width="1.5" opacity="0.8"/>

  <!-- Botanical Leaf Accents in Background -->
  <path d="M 600 120 Q 680 180 720 280 Q 640 240 580 200 Z" fill="#047857" opacity="0.7"/>
  <path d="M 160 160 Q 120 260 80 340 Q 160 300 220 220 Z" fill="#059669" opacity="0.6"/>

  <!-- Luxury Perfume Bottle -->
  <!-- Shadow -->
  <ellipse cx="400" cy="435" rx="55" ry="12" fill="#022c22" opacity="0.9"/>
  <!-- Body -->
  <rect x="345" y="210" width="110" height="220" rx="22" fill="url(#glass_bottle)"/>
  <!-- Specular reflection highlight on bottle -->
  <rect x="360" y="225" width="12" height="190" rx="6" fill="#ffffff" opacity="0.75" filter="url(#water_glow)"/>
  <!-- Golden Label Plate -->
  <rect x="365" y="290" width="70" height="45" rx="4" fill="url(#gold_cap)"/>
  <text x="400" y="310" fill="#451a03" font-family="'Plus Jakarta Sans', sans-serif" font-weight="800" font-size="10" text-anchor="middle">L'ÉLIXIR</text>
  <text x="400" y="323" fill="#451a03" font-family="'Plus Jakarta Sans', sans-serif" font-weight="600" font-size="7" text-anchor="middle">EAU DE PARFUM</text>
  
  <!-- Golden Cap & Neck -->
  <rect x="382" y="185" width="36" height="25" fill="#fef08a"/>
  <rect x="375" y="145" width="50" height="40" rx="6" fill="url(#gold_cap)"/>

  <!-- Water Drops -->
  <circle cx="390" cy="240" r="3.5" fill="#ffffff" opacity="0.9"/>
  <circle cx="430" cy="370" r="4" fill="#ffffff" opacity="0.85"/>
  <circle cx="360" cy="380" r="2.5" fill="#ffffff" opacity="0.9"/>

  <!-- Watermark / Stamp -->
  <rect x="630" y="30" width="140" height="34" rx="17" fill="rgba(16,185,129,0.9)"/>
  <text x="700" y="52" fill="#022c22" font-family="sans-serif" font-weight="800" font-size="14" text-anchor="middle">COMMERCIAL 🌿</text>
  <text x="400" y="570" fill="#a7f3d0" font-family="sans-serif" font-weight="700" font-size="16" text-anchor="middle">생성 결과: 명품 뷰티 화보급 스튜디오 수분 연출</text>
</svg>
`);

// 4. Cyberpunk / Sci-Fi Transformation
export const cyberpunkBefore = svgToDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">
  <rect width="800" height="600" fill="#334155"/>
  <!-- Dim city buildings -->
  <rect x="60" y="240" width="120" height="360" fill="#1e293b"/>
  <rect x="220" y="180" width="160" height="420" fill="#0f172a"/>
  <rect x="420" y="220" width="140" height="380" fill="#1e293b"/>
  <rect x="600" y="160" width="140" height="440" fill="#0f172a"/>
  <rect x="30" y="30" width="130" height="34" rx="17" fill="rgba(15,23,42,0.6)"/>
  <text x="95" y="52" fill="#ffffff" font-family="sans-serif" font-weight="700" font-size="14" text-anchor="middle">ORIGINAL</text>
  <text x="400" y="570" fill="#cbd5e1" font-family="sans-serif" font-weight="600" font-size="16" text-anchor="middle">원본: 흐린 날 평범한 도시 건물</text>
</svg>
`);

export const cyberpunkAfter = svgToDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">
  <defs>
    <linearGradient id="cyber_sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#4c1d95"/>
      <stop offset="40%" stop-color="#831843"/>
      <stop offset="100%" stop-color="#020617"/>
    </linearGradient>
    <filter id="neon_glow">
      <feGaussianBlur stdDeviation="8" result="b"/>
      <feComposite in="SourceGraphic" in2="b" operator="over"/>
    </filter>
  </defs>
  <rect width="800" height="600" fill="url(#cyber_sky)"/>

  <!-- Massive Sci-Fi Skyscrapers -->
  <polygon points="40,200 180,140 180,600 40,600" fill="#09090b"/>
  <polygon points="210,120 380,80 380,600 210,600" fill="#030712"/>
  <polygon points="410,160 560,110 560,600 410,600" fill="#09090b"/>
  <polygon points="590,90 760,140 760,600 590,600" fill="#030712"/>

  <!-- Neon Vertical Strips -->
  <line x1="170" y1="160" x2="170" y2="580" stroke="#06b6d4" stroke-width="4" filter="url(#neon_glow)"/>
  <line x1="230" y1="140" x2="230" y2="580" stroke="#ec4899" stroke-width="5" filter="url(#neon_glow)"/>
  <line x1="370" y1="100" x2="370" y2="580" stroke="#3b82f6" stroke-width="4" filter="url(#neon_glow)"/>
  <line x1="550" y1="130" x2="550" y2="580" stroke="#f43f5e" stroke-width="4" filter="url(#neon_glow)"/>

  <!-- Holographic Billboards -->
  <rect x="240" y="200" width="110" height="70" rx="4" fill="rgba(6,182,212,0.15)" stroke="#06b6d4" stroke-width="2"/>
  <text x="295" y="240" fill="#22d3ee" font-family="'JetBrains Mono', monospace" font-weight="800" font-size="16" text-anchor="middle" filter="url(#neon_glow)">CYBER</text>
  <text x="295" y="258" fill="#38bdf8" font-family="'JetBrains Mono', monospace" font-weight="600" font-size="10" text-anchor="middle">2088 CITY</text>

  <rect x="430" y="240" width="100" height="60" rx="4" fill="rgba(236,72,153,0.15)" stroke="#ec4899" stroke-width="2"/>
  <text x="480" y="275" fill="#f472b6" font-family="'JetBrains Mono', monospace" font-weight="800" font-size="15" text-anchor="middle" filter="url(#neon_glow)">AI CORE</text>

  <!-- Flying Vehicles (Light Streaks) -->
  <line x1="50" y1="360" x2="320" y2="330" stroke="#fbbf24" stroke-width="3" filter="url(#neon_glow)"/>
  <polygon points="320,330 310,326 310,334" fill="#fbbf24"/>
  <line x1="450" y1="420" x2="750" y2="390" stroke="#06b6d4" stroke-width="3" filter="url(#neon_glow)"/>

  <!-- Wet asphalt street reflection -->
  <rect x="0" y="520" width="800" height="80" fill="#020617"/>
  <ellipse cx="280" cy="560" rx="120" ry="15" fill="#ec4899" opacity="0.3" filter="url(#neon_glow)"/>
  <ellipse cx="500" cy="560" rx="140" ry="15" fill="#06b6d4" opacity="0.3" filter="url(#neon_glow)"/>

  <!-- Watermark / Stamp -->
  <rect x="630" y="30" width="140" height="34" rx="17" fill="rgba(236,72,153,0.9)"/>
  <text x="700" y="52" fill="#ffffff" font-family="sans-serif" font-weight="800" font-size="14" text-anchor="middle">CYBERPUNK 🚀</text>
  <text x="400" y="570" fill="#67e8f9" font-family="sans-serif" font-weight="700" font-size="16" text-anchor="middle">생성 결과: 미래형 사이버펑크 네온 홀로그램 도시</text>
</svg>
`);
