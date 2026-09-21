# GEMINI.md - Daily-Fortune (일일운세.kr) 프로젝트 지침서

## 1. 프로젝트 개요 (Project Overview)
- **프로젝트명**: Daily-Fortune (일일운세.kr)
- **목적**: 기존 스마트라이프(`smartlife.pe.kr`)에서 독립시킨 AI 맞춤형 사주명리 및 주역 비결 단독 운세 서비스.
- **주요 목표**: 높은 체류 시간과 SNS 공유 유도를 통해 구글 애드센스(Google AdSense) 수익성 및 사용자 경험 극대화.
- **주요 기능**:
  1. **오늘의 사주명리 (AI 사주)**: 생년월일시 및 고민 입력 기반의 일진/십신 분석 + Gemini AI 총평 및 부적/조언 생성.
  2. **오늘의 주역 비결 (AI 주역)**: 3단계 대나무 점대 드로우(하괘 -> 상괘 -> 동효) 기반 64괘 분석 + Gemini AI 조언 생성.
  3. **어뷰징 방지 (Rate Limit)**: Gemini API 비용 절감을 위해 12시간 단위 쿠키 & IP 기반 중복 조회 방지.
  4. **결과지 복사 및 공유**: SNS 친화적인 텍스트 변환 공유 및 카톡 공유 지원.

---

## 2. 기술 스택 (Tech Stack)
- **Framework**: Nuxt 4 (Vue 3, TypeScript)
- **PWA & Mobile**: `@vite-pwa/nuxt` (App Manifest, Service Worker, 모바일 앱 설치 팝업)
- **UI & Styling**: Nuxt UI (`@nuxt/ui`), Tailwind CSS v4, Stitch (StitchMCP) 디자인 연동
- **State Management**: Pinia (`@pinia/nuxt`) - 자정 기준 자동 리셋 및 로컬 스토리지 연계
- **Database & ORM**: Prisma (`@prisma/client`, SQLite / PostgreSQL/Supabase), `npx tsx prisma/seed-fortune.ts`
- **AI Integration**: Google Gemini 2.5 Flash API
- **Analytics & Monitization**: Google AdSense, Google Analytics (GTag)

---

## 3. 디렉토리 구조 (Directory Structure)
```
Daily-Fortune/
├── app/
│   ├── pages/
│   │   ├── index.vue          # 운세 메인 허브 (사주 / 주역 선택)
│   │   ├── saju.vue           # 오늘의 사주명리 입력 폼 및 AI 보고서
│   │   └── iching.vue         # 오늘의 주역 비결 3단계 점대 드로우 및 AI 보고서
│   ├── stores/
│   │   └── fortune.ts         # 사주/주역 입력 상태 및 결과 관리 Pinia 스토어
│   └── components/
│       └── AdSense.client.vue # 애드센스 광고 슬롯 컴포넌트
├── server/
│   ├── api/
│   │   └── fortune/
│   │       ├── saju.post.ts   # 사주명리 AI 분석 API
│   │       └── iching.post.ts # 주역비결 AI 분석 API
│   └── utils/
│       ├── saju.ts            # KST 기준 천간/지간/십신 계산 유틸
│       └── prisma.ts          # Prisma DB 인스턴스
├── prisma/
│   ├── schema.prisma          # SajuIlgan, SajuShipsin, SajuJiji, IChingHexagram, FortuneRateLimit
│   └── seed-fortune.ts        # 천간, 십신, 12지간, 64괘 원천 시드 데이터
├── nuxt.config.ts             # 모듈 및 메타 태그 설정
└── GEMINI.md                  # 본 개발 지침서
```

---

## 4. 개발 및 실행 명령어 (Development Commands)
```bash
# 개발 서버 실행
npm run dev

# 빌드 및 전처리
npm run build

# Prisma DB 준비 및 시딩
npx prisma generate
npx tsx prisma/seed-fortune.ts

# Windows 환경 Prisma 잠김 해제 (필요시)
Get-Process | Where-Object {$_.Modules.ModuleName -like "*query_engine*"} | Stop-Process -Force
```

---

## 5. 핵심 규칙 및 가이드라인 (Rules & Guidelines)
1. **언어 규칙**: 모든 설명, 마크다운 문서 및 UI 텍스트는 한국어로 작성합니다. (코드 변수/주석은 영문 유지)
2. **Stitch MCP 활용**: 디자인 연동 및 UI UI 컴포넌트 제작 시 Stitch MCP를 적극 활용합니다.
3. **API 어뷰징 방지**: 사주 및 주역 API 호출 시 12시간 이내 재요청은 DB IP 및 쿠키 기반으로 차단 조치합니다.
4. **자정 자동 초기화**: 스토어(`fortune.ts`)에 기록된 조회 결과는 자정(00:00) 경과 시 자동 초기화되어 사용자가 매일 새로운 운세를 볼 수 있게 합니다.
5. **안전한 코드 수정**: 기존 소스 변경 및 이관 시 기존 파일 백업 및 타입 검사(`nuxt typecheck`)를 준수합니다.
