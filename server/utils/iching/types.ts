/**
 * 주역 64괘 고밀도 학술 데이터 스키마
 * 사용자 제안 HexagramContent 규격 100% 준수
 */

export interface HexagramContent {
  summary: string;            // 120~180자, 이 괘의 상황·핵심 교훈
  structureNote: string;      // 350~450자, 상·하괘, 호괘·착괘·종괘, 서괘 관계
  idioms: { phrase: string; source: string; note: string }[]; // 고사성어·문화
  fields: {
    career: string;           // 200~280자
    wealth: string;           // 200~280자
    love: string;             // 200~280자
    health: string;           // 200~280자 (상징적 해석 및 의료 대체 불가 고지)
  };
  lineOverview: string;       // 200~250자 (여섯 효가 하나의 시간 흐름으로 이어지는 방식)
  lines: {
    n: number;
    nameHanja?: string;
    nameKorean?: string;
    textHanja?: string;
    textKorean?: string;
    traditionalInterp?: string; // 전통 해석 (iching384LinesData에서 자동 병합)
    scene: string;             // scene: 구체 장면 한 줄
    modernAdvice: string;      // 현대 조언
  }[];
  compareWith: { id: number; name?: string; diff: string }[];
  misconceptions: string;     // 150~200자
  faq: { q: string; a: string }[]; // 3~4개, 본문과 다른 질문
  sources: string[];
  reviewedAt: string;
}

export interface HexagramDetailData {
  id: number;
  slug: string;
  nameKorean: string;
  nameHanji: string;
  desc: string;
  upperTrigram: string;
  lowerTrigram: string;
  guaCi: string;
  tuanZhuan: string;
  xiangZhuan: string;
  content: HexagramContent;
  prevHexagram?: { id: number; nameKorean: string; slug: string } | null;
  nextHexagram?: { id: number; nameKorean: string; slug: string } | null;
}

