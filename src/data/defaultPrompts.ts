import { Category, PromptGroup } from '../types';
import {
  portraitBefore,
  portraitAfter,
  webtoonBefore,
  webtoonAfter,
  productBefore,
  productAfter,
  cyberpunkBefore,
  cyberpunkAfter,
} from './sampleImages';

export const defaultCategories: Category[] = [
  { name: '인물 & 프로필', desc: '프로필 사진, 인물 보정, 시네마틱 스튜디오, 웹툰 변환', icon: '👤', accentColor: '#0e7490' },
  { name: '사진 보정 & 연출', desc: '배경 교체, 영화 같은 색감 보정, 빈티지 필름 감성', icon: '🎨', accentColor: '#c2410c' },
  { name: '제품 & 상업 광고', desc: '화장품, 식음료, 가구 등 고품질 상업용 카탈로그 컷', icon: '💎', accentColor: '#15803d' },
  { name: '아트 & 일러스트', desc: '수채화, 유화, 3D 캐릭터, 사이버펑크, 애니메이션', icon: '✨', accentColor: '#6d28d9' },
  { name: '업무 & 글쓰기', desc: '기획서, 마케팅 카피, 보고서 감수, 이메일 작성', icon: '📝', accentColor: '#1d4ed8' },
];

export const defaultPrompts: PromptGroup[] = [
  {
    id: 'p-portrait-01',
    cat: '인물 & 프로필',
    title: '스튜디오 자연광 감성 프로필',
    icon: '✨',
    tag: '잡지 표지급 시네마틱 스튜디오 프로필',
    versions: [
      {
        id: 'v-port-01',
        name: '시네마틱 조명 (기본)',
        type: '이미지 생성',
        photo: true,
        guideKo: '인물 사진을 업로드한 후, 프롬프트에서 [인물 특징], [의상 색상], [배경 분위기]를 필요에 맞게 수정하세요.',
        guideEn: 'Upload the source portrait, and adjust placeholders like [subject details], [outfit], and [lighting mood] as needed.',
        bodyKo: `[첨부 사진의 인물 이목구비와 분위기 유지]
매거진 커버 스타일의 시네마틱 스튜디오 인물 사진.
부드러운 창가 자연광과 따뜻한 림 라이트(Rim Lighting),
85mm f/1.4 렌즈로 촬영된 얕은 심도와 자연스러운 보케.
피부 질감은 인위적이지 않고 모공과 생기가 자연스럽게 표현된 초고해상도 8K,
의상은 깔끔하고 세련된 [화이트/차콜] 린넨 셔츠,
시선은 카메라를 편안하고 은은한 미소로 응시,
미니멀한 모던 스튜디오 배경, 섬세한 하이라이트와 섀도우 밸런스.`,
        bodyEn: `Cinematic studio portrait maintaining the natural facial features of the uploaded reference photo.
Shot on 85mm f/1.4 lens, shallow depth of field, creamy bokeh in background.
Soft morning window illumination combined with warm golden rim lighting.
Hyper-realistic natural skin texture, visible fine pores, lifelike catchlights in eyes, no artificial wax smoothing.
Subject wearing an elegant minimalist linen shirt, relaxed posture and subtle confident gaze towards the camera.
Neutral toned architectural studio backdrop, Kodak Portra color grading, award-winning editorial magazine quality, 8k resolution, photorealistic.`,
        beforeImg: portraitBefore,
        afterImg: portraitAfter,
        beforeLabel: 'BEFORE (원본 스냅샷)',
        afterLabel: 'AFTER (스튜디오 조명)',
        next: '빈티지 35mm 필름 레트로 감성',
        hidden: false,
      },
      {
        id: 'v-port-02',
        name: '초고화질 극세사 디테일',
        type: '이미지 생성',
        photo: true,
        guideKo: '피부 디테일과 직물 텍스처를 극대화하는 매크로 화보용 버전입니다.',
        guideEn: 'Macro-level beauty editorial setting focusing on realistic skin texture and fabric clarity.',
        bodyKo: `[첨부된 인물 사진 참조]
하이패션 뷰티 매거진 클로즈업 샷, 핫셀블라드 100MP 중형 카메라 화질.
극세사 직물 디테일, 촉촉한 눈망울 반사광, 자연스러운 속눈썹과 입술 질감.
스튜디오 뷰티 디쉬(Beauty Dish)와 반사판을 통한 균형 잡힌 명암비,
색온도 5200K 클린 화이트 밸런스.`,
        bodyEn: `Extreme close-up beauty editorial portrait maintaining exact facial anatomy from reference image.
Shot on Hasselblad H6D-100c, medium format crispness, 100 megapixels clarity.
Subtle beauty dish key light with large soft reflector fill, catchlight in pupils, authentic skin moisture and lip sheen.
Sharp focus on eyes and eyelashes, neutral chic styling, minimalist luxury aesthetic.`,
        beforeImg: portraitBefore,
        afterImg: portraitAfter,
        hidden: false,
      },
    ],
  },
  {
    id: 'p-webtoon-01',
    cat: '인물 & 프로필',
    title: '한국 로맨스 웹툰 작화풍 변환',
    icon: '🌸',
    tag: '사진을 네이버/카카오 인기 웹툰 주인공으로',
    versions: [
      {
        id: 'v-webtoon-01',
        name: '로맨스 판타지 스타일',
        type: '이미지 생성',
        photo: true,
        guideKo: '셀카나 프로필 사진을 업로드하면 웹툰 주인공 작화풍으로 재탄생합니다. [헤어 스타일]과 [배경 효과]를 조절해보세요.',
        guideEn: 'Converts everyday photos into trending Korean romance webtoon / manhwa character illustration with sparkling pastel aesthetics.',
        bodyKo: `[첨부 사진 속 인물의 머리 모양과 표정, 포즈 유지]
네이버 웹툰 최상위권 로맨스 판타지 작화 스타일의 수려한 디지털 일러스트레이션.
날렵하고 매력적인 턱선, 반짝이는 보석 같은 큰 눈망울과 은은한 하이라이트.
섬세하고 부드러운 머릿결 묘사, 파스텔 톤의 화사한 조명과 은은하게 흩날리는 벚꽃 잎 파티클.
세련된 셀 셰이딩(Cell shading) 기법, 웹툰 표지 일러스트 감성, 화사한 분홍빛과 라벤더 색조.`,
        bodyEn: `Top-tier Korean romance fantasy webtoon cover illustration based on the facial features and pose of the reference photo.
Exquisite manhwa art style, sharp jawline, large expressive jewel-like eyes with sparkling starlight highlights.
Silky flowing hair strands with soft ambient glow, delicate pastel color palette with soft blush tones.
Gentle cherry blossom petal particles floating in air, professional clip studio paint digital rendering, crisp line art, beautiful lighting.`,
        beforeImg: webtoonBefore,
        afterImg: webtoonAfter,
        beforeLabel: 'BEFORE (실제 사진)',
        afterLabel: 'AFTER (웹툰 주인공 변환)',
        next: '스튜디오 자연광 감성 프로필',
        hidden: false,
      },
    ],
  },
  {
    id: 'p-film-01',
    cat: '사진 보정 & 연출',
    title: '빈티지 35mm 필름 레트로 감성',
    icon: '🎞️',
    tag: '1990년대 아날로그 라이카 필름 질감',
    versions: [
      {
        id: 'v-film-01',
        name: '코닥 포트라 400 톤',
        type: '이미지 생성',
        photo: true,
        guideKo: '현대적인 디지털 사진에 아날로그 필름 특유의 온기와 입상성을 부여합니다.',
        guideEn: 'Imbues modern digital photos with vintage 35mm film grain, warm nostalgic tones, and halation.',
        bodyKo: `[첨부된 사진의 구도와 인물 피사체 그대로 재현]
1995년 여름날 35mm 필름 카메라 Leica M6로 촬영한 아날로그 스냅사진.
Kodak Portra 400 필름 특유의 따스한 옐로우-오렌지 하이라이트와 부드러운 그린 섀도우.
은은한 필름 그레인(Film Grain), 렌즈 플레어와 미세한 할레이션(Halation) 효과.
노스탤직하고 감성적인 분위기, 살짝 바랜 듯한 레트로 색감, 자연스러운 빈티지 무드.`,
        bodyEn: `Authentic 35mm vintage analog photograph inspired by 1990s Kodak Portra 400 film.
Preserve exact subject and perspective from uploaded image.
Characteristic warm golden skin tones, gentle muted shadows, subtle organic film grain throughout.
Delicate red halation around bright highlights, vintage Leica Summicron 35mm lens characteristics, nostalgic candid summer atmosphere.`,
        beforeImg: portraitBefore,
        afterImg: portraitAfter,
        hidden: false,
      },
    ],
  },
  {
    id: 'p-cyberpunk-01',
    cat: '아트 & 일러스트',
    title: '미래형 사이버펑크 네온 시티',
    icon: '🚀',
    tag: '도시/건물 사진을 2088년 네온 메트로폴리스로',
    versions: [
      {
        id: 'v-cyber-01',
        name: '네온 홀로그램 (기본)',
        type: '이미지 생성',
        photo: true,
        guideKo: '도시 풍경 사진을 넣으면 미래적인 사이버펑크 도시로 변환됩니다.',
        guideEn: 'Transforms daytime or dusk cityscape photos into a futuristic sci-fi neon metropolis.',
        bodyKo: `[첨부 사진의 도로 및 건물 스카이라인 구조 유지]
서기 2088년 초고층 빌딩이 늘어선 거대한 미래 사이버펑크 도시의 야경.
건물 외벽을 타고 흐르는 화려한 네온사인과 홀로그램 한글 광고판.
비에 젖은 아스팔트 바닥에 반사되는 시안(Cyan)과 마젠타(Magenta) 핑크 불빛.
하늘을 가로지르는 비행 스피더(Hovercar)들의 빛의 궤적, 블레이드 러너 스타일의 몽환적인 안개.`,
        bodyEn: `Futuristic Cyberpunk 2088 megacity at night maintaining the structural skyline of the reference image.
Soaring high-rise brutalist architecture draped in holographic advertisements and vivid cyan and hot pink neon light strips.
Wet rain-slicked asphalt streets reflecting vibrant neon glows, dense atmospheric fog and steam rising from city vents.
Hovering flying vehicles leaving golden light streaks across the dark violet sky, cinematic Blade Runner aesthetic, unreal engine 5 render, 8k.`,
        beforeImg: cyberpunkBefore,
        afterImg: cyberpunkAfter,
        beforeLabel: 'BEFORE (일반 도시 풍경)',
        afterLabel: 'AFTER (사이버펑크 네온 변환)',
        hidden: false,
      },
    ],
  },
  {
    id: 'p-product-01',
    cat: '제품 & 상업 광고',
    title: '명품 향수/화장품 스튜디오 광고',
    icon: '💎',
    tag: '단순 제품 사진을 럭셔리 매거진 광고 컷으로',
    versions: [
      {
        id: 'v-prod-01',
        name: '워터 드롭 & 스톤 연출',
        type: '이미지 생성',
        photo: true,
        guideKo: '제품 용기 사진을 업로드하고 [제품 종류], [소재 질감], [자연 소품]을 변경해보세요.',
        guideEn: 'Transforms basic product snapshots into commercial luxury catalog photography on wet slate and water ripples.',
        bodyKo: `[첨부 사진 속 제품 용기 디자인과 라벨을 선명하게 유지]
하이엔드 럭셔리 스킨케어/향수 브랜드의 상업용 광고 화보 사진.
어두운 에메랄드와 슬레이트 컬러의 젖은 천연 대리석 받침대 위에 올려진 제품.
크리스탈처럼 맑은 물방울들이 튀어 오른 순간의 고속 셔터 찰나, 주변의 은은한 유칼립투스 잎 그림자.
미세한 스튜디오 후면 백라이트와 하이라이트 글래스 반사광, 보그/바자 광고 페이지 수준의 프리미엄 연출.`,
        bodyEn: `High-end luxury commercial advertisement photography featuring the exact cosmetic bottle design from reference.
Product standing majestically on a sleek wet black travertine pedestal with delicate crystal-clear water splashes frozen in motion.
Diffused soft studio top lighting casting elegant reflections onto polished stone, subtle botanical eucalyptus shadows in background.
Deep emerald and charcoal color harmony, Hasselblad commercial clarity, razor-sharp focus on brand typography, 8k.`,
        beforeImg: productBefore,
        afterImg: productAfter,
        beforeLabel: 'BEFORE (단순 제품 사진)',
        afterLabel: 'AFTER (럭셔리 스튜디오 광고)',
        next: '미니멀 대리석 인테리어 3D 렌더',
        hidden: false,
      },
    ],
  },
  {
    id: 'p-art-01',
    cat: '아트 & 일러스트',
    title: '인상주의 명화 수채화/유화풍',
    icon: '🎨',
    tag: '모네와 고흐의 감성을 담은 텍스처 예술화',
    versions: [
      {
        id: 'v-art-01',
        name: '모네 인상주의 수채화',
        type: '이미지 생성',
        photo: true,
        guideKo: '풍경이나 인물 사진을 예술적인 수채화/유화 붓터치 작품으로 변환합니다.',
        guideEn: 'Reimagines photographs into classical impressionist oil and watercolor paintings.',
        bodyKo: `[첨부된 사진의 구도와 색감 조화 참조]
클로드 모네(Claude Monet)의 인상주의 풍경 유화 화풍.
거친 캔버스 패브릭 질감 위에 두껍게 얹어진 임파스토(Impasto) 유화 물감 터치와 물 번짐 효과.
빛의 산란을 포착한 다채로운 색채 분할, 따뜻한 오후 햇살의 반짝임.
미술관에 전시된 원작 유화 명화의 입체적인 질감.`,
        bodyEn: `Masterpiece impressionist oil painting inspired by Claude Monet, preserving perspective of reference.
Rich impasto oil paint texture with visible palette knife strokes on authentic textured linen canvas.
Vibrant light dappling effect, loose energetic brushwork, harmonious blending of French romantic colors, museum gallery lighting.`,
        beforeImg: portraitBefore,
        afterImg: portraitAfter,
        hidden: false,
      },
    ],
  },
  {
    id: 'p-text-01',
    cat: '업무 & 글쓰기',
    title: '투자 유치용 사업계획서 IR 요약',
    icon: '📊',
    tag: '복잡한 사업 아이디어를 VC 설득용 3분 피칭 요약문으로',
    versions: [
      {
        id: 'v-text-01',
        name: 'VC 표준 IR 피치 덱 포맷',
        type: '텍스트',
        photo: false,
        guideKo: '[사업 아이템] 및 [현재 성과]에 여러분의 사업 내용을 입력하면 즉시 VC 설득 구조로 재구성됩니다.',
        guideEn: 'Structures your business idea into a compelling, metric-driven Investor Pitch Deck summary.',
        bodyKo: `당신은 실리콘밸리와 테헤란로 탑티어 벤처캐피털(VC)의 시니어 심사역입니다.
아래 제공되는 [사업 아이템 / 기술 설명]을 읽고, 투자 심의위원회가 한눈에 매료될 수 있는 1페이지 IR Executive Summary를 작성해 주세요.

[사업 내용]:
- 아이템명: [예: AI 프롬프트 및 콘텐츠 자동화 플랫폼]
- 타깃 고객: [예: 1인 크리에이터 및 중소 마케팅 에이전시]
- 핵심 차별점: [예: 기존 대비 80% 시간 단축, 고품질 듀얼 프롬프트 지원]

[작성 형식]:
1. Executive Hook (1문장: 시장의 비효율성과 우리의 압도적 해결책)
2. Problem (타깃 고객이 겪는 3대 고통점)
3. Solution & Unfair Advantage (독점적 기술/네트워크 해자)
4. Market Size & TAM (시장 규모 추정)
5. Traction & Milestones (현재 검증된 지표 및 다음 분기 목표)
6. Ask & Use of Funds (투자 유치 희망액 및 자금 집행 계획)

어조: 전문적이고 간결하며 수치 중심의 확신에 찬 어조로 작성하세요.`,
        bodyEn: `Act as a senior Venture Capital partner evaluating early-stage startups.
Analyze the following business overview and draft a high-impact 1-page Investor Relations (IR) Executive Summary tailored for angel investors and seed VC firms.

[Business Details]:
- Product Name: [e.g. AI Prompt & Workflow Automation Platform]
- Target Market: [e.g. Solo creators, digital marketing agencies]
- Core Differentiation: [e.g. 80% faster generation cycle, dual-language library]

[Output Structure]:
1. The Hook (One compelling sentence capturing the massive market shift)
2. The Urgent Problem (Top 3 validated customer pain points)
3. Solution & Defensibility (Our product and competitive moat)
4. Market Opportunity & TAM/SAM/SOM
5. Milestones & Traction Metrics
6. The Investment Ask & Resource Allocation

Tone: Crisp, persuasive, quantifiable, and free of vague buzzwords.`,
        next: 'SNS 인스타그램 카드뉴스 바이럴 카피',
        hidden: false,
      },
    ],
  },
  {
    id: 'p-text-02',
    cat: '업무 & 글쓰기',
    title: 'SNS 인스타그램 카드뉴스 바이럴 카피',
    icon: '📱',
    tag: '스크롤을 멈추게 하는 헤드라인과 8장 슬라이드 기획',
    versions: [
      {
        id: 'v-sns-01',
        name: '인스타 8장 캐러셀',
        type: '텍스트',
        photo: false,
        guideKo: '[주제]를 입력하면 팔로워 유입과 저장을 극대화하는 8장 카드뉴스 대본이 완성됩니다.',
        guideEn: 'Generates an 8-slide viral Instagram carousel script designed for maximum saves and shares.',
        bodyKo: `인스타그램에서 10만 이상 조회수를 기록하는 바이럴 콘텐츠 디렉터로서 답변하세요.
주제: [예: 2026년 일잘러가 몰래 쓰는 무료 AI 도구 5가지]

다음 8장 카드뉴스 구조로 슬라이드별 본문과 디자인 연출 팁을 작성하세요:
- 1장 (표지): 3초 안에 스크롤을 멈추는 파격적인 헤드라인 + 부제
- 2장 (공감/문제 제기): "아직도 이렇게 일하시나요?" 공감 유도
- 3~6장 (핵심 정보 4가지): 직관적인 팁 + 실사용 예시
- 7장 (한 장 요약 정리 표): 캡처하고 싶게 만드는 핵심 요약
- 8장 (CTA): "저장해두고 필요할 때 꺼내보세요" + 댓글 유도 질문

캡션(본문)과 추천 해시태그 15개도 함께 작성해 주세요.`,
        bodyEn: `Act as a viral social media strategist specializing in high-engagement Instagram carousels.
Topic: [e.g. 5 Free AI Tools Productive Creators Use in 2026]

Generate an 8-slide carousel script structured to maximize saves and shares:
- Slide 1 (Hook): Scroll-stopping bold headline + subheader
- Slide 2 (Pain Point): Relatable problem statement
- Slides 3-6 (Core Value): 4 actionable insights with concrete examples
- Slide 7 (Cheat Sheet Summary): Visual recap designed to be bookmarked
- Slide 8 (Call-to-Action): Clear save & comment prompt

Include a captivating caption copy and 15 targeted hashtags.`,
        hidden: false,
      },
    ],
  },
];
