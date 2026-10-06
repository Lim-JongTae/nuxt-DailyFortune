/**
 * 사주명리 간지(갑자) 및 오행 계산 유틸리티 (서버 런타임 공유 - Single Source of Truth)
 * 클라이언트 유틸리티(app/utils/saju.ts)와 100% 동일한 동기화를 유지합니다.
 */

export interface GanzhiResult {
  stem: string;          // 천간 (갑, 을, 병...)
  branch: string;        // 지지 (자, 축, 인...)
  stemIdx: number;       // 천간 인덱스 (0~9)
  branchIdx: number;     // 지지 인덱스 (0~11)
  fullName: string;      // 간지 이름 (예: 계축)
  stemElemIdx: number;   // 천간 오행 인덱스 (0:목, 1:화, 2:토, 3:금, 4:수)
  branchElemIdx: number; // 지지 오행 인덱스 (0:목, 1:화, 2:토, 3:금, 4:수)
  stemElement: string;   // 오행 명칭 (예: '음수(陰水)')
  branchElement: string; // 오행 명칭 (예: '음토(陰土)')
}

export interface TodaySajuSummary {
  ganzhi: string;                 // 오늘 일진 (예: 계축)
  todayDateStr: string;           // KST 날짜 (YYYY-MM-DD)
  ganzhiResult: GanzhiResult;     // 상세 간지 데이터
  elementBadge: string;           // 상단 배지 문구 (예: 계축 · 水土 조화)
  todayElementSentence: string;   // 오행 기운 설명 문장
  elementRatios: number[];        // 오행 5대 비율 [木%, 火%, 土%, 金%, 水%]
}

// 성능 최적화: 정적 상수 할당
export const STEMS = ["갑", "을", "병", "정", "무", "기", "경", "신", "임", "계"] as const;
export const BRANCHES = ["자", "축", "인", "묘", "진", "사", "오", "미", "신", "유", "술", "해"] as const;
export const ANIMALS = ["쥐", "소", "호랑이", "토끼", "용", "뱀", "말", "양", "원숭이", "닭", "개", "돼지"] as const;

export const BRANCH_ELEMENT_MAP: readonly number[] = [4, 2, 0, 0, 2, 1, 1, 2, 3, 3, 2, 4];
export const ELEM_NAMES: readonly string[] = ['木', '火', '土', '金', '水'];

export const STEM_ELEMENT_NAMES: readonly string[] = [
  '양목(陽木)', '음목(陰木)',
  '양화(陽火)', '음화(陰火)',
  '양토(陽土)', '음토(陰土)',
  '양금(陽金)', '음금(陰金)',
  '양수(陽水)', '음수(陰水)'
];

export const BRANCH_ELEMENT_NAMES: readonly string[] = [
  '양수(陽水)', '음토(陰土)', '양목(陽木)', '음목(陰木)',
  '양토(陽土)', '음화(陰火)', '양화(陽火)', '음토(陰土)',
  '양금(陽金)', '음금(陰金)', '양토(陽土)', '음수(陰水)'
];

export const ELEMENT_ATTRS = [
  { name: '나무', trait: '유연함과 푸른 생명력', action: '새로운 기운을 뻗어내는 날' },
  { name: '불', trait: '뜨거운 열정과 밝은 빛', action: '환하게 세상을 밝히는 날' },
  { name: '대지', trait: '든든한 포용력과 안정감', action: '중심을 굳건히 잡아주는 날' },
  { name: '바위', trait: '단단한 결단력', action: '알찬 결실을 이뤄내는 날' },
  { name: '샘물', trait: '깊은 지혜와 유유함', action: '지혜롭게 흘러가는 날' }
] as const;

/**
 * 한국 시각(KST Asia/Seoul) 기준 오늘 날짜 문자열(YYYY-MM-DD)을 단일화하여 구합니다.
 */
export function getKstTodayDateString(inputDate: Date = new Date()): string {
  try {
    const validDate = isNaN(inputDate.getTime()) ? new Date() : inputDate;
    return new Intl.DateTimeFormat('sv-SE', { timeZone: 'Asia/Seoul' }).format(validDate);
  } catch (e) {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }
}

/**
 * 특정 날짜(KST 기준 YYYY-MM-DD)의 일진(일주)을 계산합니다.
 * 기준일: 2000년 1월 1일 (무오일 - 천간 4 戊, 지지 6 午)
 */
export function getGanzhiOfDay(dateStr?: string): GanzhiResult {
  let targetStr = dateStr?.trim();
  if (!targetStr || !/^\d{4}-\d{2}-\d{2}$/.test(targetStr)) {
    targetStr = getKstTodayDateString();
  }

  let targetDate = new Date(`${targetStr}T00:00:00+09:00`);
  if (isNaN(targetDate.getTime())) {
    targetStr = getKstTodayDateString();
    targetDate = new Date(`${targetStr}T00:00:00+09:00`);
  }

  const refDate = new Date('2000-01-01T00:00:00+09:00');

  const diffTime = targetDate.getTime() - refDate.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  const stemIdx = (4 + (diffDays % 10) + 10) % 10;
  const branchIdx = (6 + (diffDays % 12) + 12) % 12;

  const stemElemIdx = Math.floor(stemIdx / 2);
  const branchElemIdx = BRANCH_ELEMENT_MAP[branchIdx] ?? 0;

  const stem = STEMS[stemIdx] || '갑';
  const branch = BRANCHES[branchIdx] || '자';

  return {
    stem,
    branch,
    stemIdx,
    branchIdx,
    fullName: stem + branch,
    stemElemIdx,
    branchElemIdx,
    stemElement: STEM_ELEMENT_NAMES[stemIdx] || '오행',
    branchElement: BRANCH_ELEMENT_NAMES[branchIdx] || '오행'
  };
}

/**
 * 태어난 시간(HH:MM)을 바탕으로 시지(지지)를 계산합니다. (24시간 엄격 검증)
 */
export function getHourBranch(hourStr: string | null | undefined): string {
  if (!hourStr || typeof hourStr !== 'string') return "모름";

  const trimmed = hourStr.trim();
  if (!/^\d{1,2}:\d{1,2}$/.test(trimmed)) return "모름";

  const parts = trimmed.split(':');
  const h = parseInt(parts[0] || '', 10);
  const m = parseInt(parts[1] || '', 10);

  if (isNaN(h) || isNaN(m) || h < 0 || h > 23 || m < 0 || m > 59) return "모름";

  const totalMinutes = h * 60 + m;
  const adjusted = (totalMinutes + 30) % 1440;
  const index = Math.floor(adjusted / 120) % 12;

  return BRANCHES[index] || "모름";
}

/**
 * 일간(태어난 날의 천간)과 일진(오늘 날짜의 천간)의 관계(십신)를 계산합니다.
 */
export function getShipsin(birthStemIdx: number, todayStemIdx: number): string {
  const birthEl = Math.floor(birthStemIdx / 2);
  const todayEl = Math.floor(todayStemIdx / 2);

  const birthPolarity = birthStemIdx % 2;
  const todayPolarity = todayStemIdx % 2;
  const isSamePolarity = birthPolarity === todayPolarity;

  const diff = (todayEl - birthEl + 5) % 5;

  if (diff === 0) {
    return isSamePolarity ? "비견" : "겁재";
  } else if (diff === 1) {
    return isSamePolarity ? "식신" : "상관";
  } else if (diff === 2) {
    return isSamePolarity ? "편재" : "정재";
  } else if (diff === 3) {
    return isSamePolarity ? "편관" : "정관";
  } else {
    return isSamePolarity ? "편인" : "정인";
  }
}

/**
 * 특정 연도(YYYY)의 연주(년주) 및 12지신 띠를 계산합니다.
 */
export function getGanzhiOfYear(year: number): GanzhiResult & { animal: string; zodiacName: string } {
  const validYear = isNaN(year) || year < 1 ? new Date().getFullYear() : Math.floor(year);

  let stemIdx = (validYear - 4) % 10;
  if (stemIdx < 0) stemIdx += 10;

  let branchIdx = (validYear - 4) % 12;
  if (branchIdx < 0) branchIdx += 12;

  const stem = STEMS[stemIdx] || '갑';
  const branch = BRANCHES[branchIdx] || '자';
  const animal = ANIMALS[branchIdx] || '쥐';
  const fullName = stem + branch;

  const stemElemIdx = Math.floor(stemIdx / 2);
  const branchElemIdx = BRANCH_ELEMENT_MAP[branchIdx] ?? 0;

  return {
    stem,
    branch,
    stemIdx,
    branchIdx,
    fullName,
    stemElemIdx,
    branchElemIdx,
    stemElement: STEM_ELEMENT_NAMES[stemIdx] || '오행',
    branchElement: BRANCH_ELEMENT_NAMES[branchIdx] || '오행',
    animal,
    zodiacName: `${fullName}년 ${animal}띠`
  };
}

/**
 * 오늘 일진 기반 오행 5대 비율, 뱃지, 설명 문장을 통합하여 단일 제공합니다.
 */
export function getTodaySajuSummary(dateStr?: string): TodaySajuSummary {
  const todayDateStr = dateStr || getKstTodayDateString();
  const gz = getGanzhiOfDay(todayDateStr);

  const s = gz.stemElemIdx;
  const b = gz.branchElemIdx;
  const ganzhi = gz.fullName;

  const defaultAttr = ELEMENT_ATTRS[0];
  const stemAttr = ELEMENT_ATTRS[s % 5] || defaultAttr;
  const branchAttr = ELEMENT_ATTRS[b % 5] || defaultAttr;

  let todayElementSentence = '';
  let elementBadge = '';

  if (s === b) {
    todayElementSentence = `${ganzhi}일 · ${stemAttr.name}의 ${stemAttr.trait}이(가) 배가되어 ${stemAttr.action}`;
    elementBadge = `${ganzhi} · ${ELEM_NAMES[s]} 기운 왕성`;
  } else {
    todayElementSentence = `${stemAttr.name}의 ${stemAttr.trait}이(가) ${branchAttr.name}의 ${branchAttr.trait}과(와) 만나 ${branchAttr.action}`;
    elementBadge = `${ganzhi} · ${ELEM_NAMES[s]}${ELEM_NAMES[b]} 상생 조화`;
  }

  const ratios = [10, 10, 10, 10, 10];
  if (s === b) {
    if (ratios[s] !== undefined) ratios[s] += 40;
  } else {
    if (ratios[s] !== undefined) ratios[s] += 20;
    if (ratios[b] !== undefined) ratios[b] += 20;

    if ((s + 1) % 5 === b) {
      if (ratios[b] !== undefined) ratios[b] += 10;
    } else if ((b + 1) % 5 === s) {
      if (ratios[s] !== undefined) ratios[s] += 10;
    }
  }

  const sum = ratios.reduce((acc, cur) => acc + cur, 0);
  const elementRatios = ratios.map(r => Math.round((r / (sum || 1)) * 100));

  return {
    ganzhi,
    todayDateStr,
    ganzhiResult: gz,
    elementBadge,
    todayElementSentence,
    elementRatios
  };
}
