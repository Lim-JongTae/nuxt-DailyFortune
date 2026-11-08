/**
 * 사주명리 60일주(60柱論) 고밀도 학술 데이터 스키마
 * 사용자 제안 IljuContent 규격 100% 준수
 */

export interface IljuContent {
  summary: string;            // 150~200자, 이 일주 전용
  structureNote: string;      // 구조 해부 (납음·십이운성·일지 십신 서술)
  traits: {
    strengths: string[];
    weaknesses: string[];
    scenes: string[];         // scenes 3개 필수 (회의, 연애 갈등, 결정 미루기 등 구체 상황)
  };
  fields: {
    career: string;           // 250자+
    wealth: string;           // 250자+
    love: string;             // 250자+
    health: string;           // 250자+ (전통 명리 관점 및 의료 대체 불가 고지)
  };
  seasonFlow: string;         // 200~250자 (계절·환경·관계 흐름)
  compat: {
    good: { id: string; name: string; reason: string }[];
    clash: { id: string; name: string; reason: string }[];
  };
  misconceptions: string;     // 150~200자 (단식 판단 경계)
  faq: { q: string; a: string }[]; // 3~4개, 본문 복붙 금지
  sources: string[];
  reviewedAt: string;
}

export interface IljuDetailData {
  order: number;
  code: string;
  ganzhi: string;
  ganzhiHanja: string;
  stem: string;
  stemHanja: string;
  stemElement: string;
  stemColor: 'wood' | 'fire' | 'earth' | 'metal' | 'water';
  branch: string;
  branchHanja: string;
  branchElement: string;
  branchColor: 'wood' | 'fire' | 'earth' | 'metal' | 'water';
  branchAnimal: string;
  content: IljuContent;
  prevIlju?: { code: string; ganzhi: string; ganzhiHanja: string; order: number } | null;
  nextIlju?: { code: string; ganzhi: string; ganzhiHanja: string; order: number } | null;
}
