# Daily-Fortune (일일운세.kr) 이관 및 독립 구축 계획서

스마트라이프(`smartlife.pe.kr`) 프로젝트 내에 포함되어 있던 **오늘의 운세 (사주명리)** 및 **주역 비결 (주역 괘)** 기능을 추출하여 단독 서비스인 **Daily-Fortune (`일일운세.kr`)** 프로젝트로 구성하고 애드센스 수익 창출 극대화를 도모합니다.

---

## 1. 이관 대상 파일 및 구조 분석

기존 `smart-life` 디렉토리(`C:\Users\LimJongTae\Downloads\Temp\vive_code\smart-life`)에서 추출하여 이관할 대상:

| 구분 | 소스 위치 (smart-life) | 타겟 위치 (Daily-Fortune) | 비고 |
| :--- | :--- | :--- | :--- |
| **DB Schema** | `prisma/schema.prisma` (운세 테이블) | `prisma/schema.prisma` | SajuIlgan, SajuShipsin, SajuJiji, IChingHexagram, FortuneRateLimit |
| **DB Seed** | `prisma/seed-fortune.ts` | `prisma/seed-fortune.ts` | 천간/지간/십신/64괘 원천 데이터 |
| **Server Utility** | `server/utils/saju.ts`, `prisma.ts` | `server/utils/saju.ts`, `prisma.ts` | KST 일진/간지/십신 유틸 & Prisma DB 인스턴스 |
| **Server API** | `server/api/fortune/*.post.ts` | `server/api/fortune/*.post.ts` | `saju.post.ts`, `iching.post.ts` (Gemini 2.5 Flash 연동) |
| **Pinia Store** | `app/stores/fortune.ts` | `app/stores/fortune.ts` | 자정 기준 결과 자동 리셋 스토어 |
| **Pages** | `app/pages/fortune/*.vue` | `app/pages/*.vue` | `index.vue` (허브), `saju.vue` (사주), `iching.vue` (주역) |
| **Component** | `app/components/AdSense.client.vue` | `app/components/AdSense.client.vue` | 애드센스 슬롯 컴포넌트 |

---

## 2. 작업 단계별 실행 계획

### Phase 1: 개발 환경 패키지 및 환경변수 설정
1. **필수 패키지 추가**:
   - DB 및 ORM: `prisma`, `@prisma/client`, `tsx`
   - 유틸 및 AI: `@google/genai` (또는 기존 Gemini 호출 방식)
2. **`.env` 파일 구축**:
   - `GEMINI_API_KEY`: Google AI Studio API 키 설정
   - `DATABASE_URL`: SQLite (`file:./dev.db`) 또는 Supabase/PostgreSQL 연동 URL 설정

### Phase 2: 데이터베이스 스키마 구성 및 시딩
1. `prisma/schema.prisma` 파일 생성 및 운세 관련 5개 모델 정의
2. `prisma/seed-fortune.ts` 이관 후 `npx tsx prisma/seed-fortune.ts` 실행하여 64괘 및 사주 원천 데이터 시딩 완료

### Phase 3: 서버 로직 및 API 이관
1. `server/utils/saju.ts` (간지/십신 계산 엔진) 및 `server/utils/prisma.ts` 이관
2. `server/api/fortune/saju.post.ts` 및 `server/api/fortune/iching.post.ts` 이관 및 어뷰징 방지(쿠키 & IP 12시간 제한) 로직 확인

### Phase 4: 클라이언트 상태 및 페이지 구성 (Routing 단독화)
1. `app/stores/fortune.ts` 이관 및 Nuxt 4 Pinia 설정
2. 페이지 경로 단독화:
   - 기존 `app/pages/fortune/index.vue` → `app/pages/index.vue` (메인 허브)
   - 기존 `app/pages/fortune/saju.vue` → `app/pages/saju.vue` (사주명리)
   - 기존 `app/pages/fortune/iching.vue` → `app/pages/iching.vue` (주역비결)

### Phase 5: Stitch MCP 연동 및 디자인 polish
1. Stitch (StitchMCP) 프로젝트를 통해 `일일운세.kr`에 특화된 프리미엄 동양풍/현대적 UX 디자인 컴포넌트 구상 및 연동
2. 구글 애드센스 슬롯 위치 최적화 및 SEO/OG Image (카카오톡, SNS 공유용) 메타데이터 세팅

---

## 3. 검증 및 확인 계획 (Verification Plan)

### 마이그레이션 및 DB 검증
- `npx prisma db seed` 실행 후 데이터베이스 테이블 생성 및 64괘 데이터 정상 입력 여부 확인.

### 기능 및 API 검증
- `npm run dev` 실행 후 `/`, `/saju`, `/iching` 페이지 정상 접속 및 폼 입력 동작 확인.
- 사주 및 주역 입력 후 Gemini API를 통한 맞춤 해설 생성 동작 검증.
- 12시간 내 동일 브라우저/IP 접속 시 어뷰징 방지 차단 메세지 및 쿠키 세팅 동작 검증.
