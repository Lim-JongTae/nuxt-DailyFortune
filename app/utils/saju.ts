/**
 * 사주명리 간지(갑자) 및 오행 계산 유틸리티 (클라이언트 공유 - Single Source of Truth)
 * 모든 컴포넌트, 스토어 및 백엔드 유틸리티에서 이 단일 기준과 유틸리티 함수를 공유합니다.
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

// 4. 성능 최적화: 최상단 모듈 스코프에 정적 상수 선언 (Allocation 제거)
export const STEMS = ["갑", "을", "병", "정", "무", "기", "경", "신", "임", "계"] as const;
export const BRANCHES = ["자", "축", "인", "묘", "진", "사", "오", "미", "신", "유", "술", "해"] as const;
export const ANIMALS = ["쥐", "소", "호랑이", "토끼", "용", "뱀", "말", "양", "원숭이", "닭", "개", "돼지"] as const;

// 12지지별 오행 인덱스 매핑 (0:木, 1:火, 2:土, 3:金, 4:水)
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

// 오행별 명사, 특성, 동작 매핑
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
  // 2. 날짜 파싱 방어 검증 (잘못된 포맷 방어)
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

  // 2000년 1월 1일(양력)은 戊午(무오)일 (천간 戊:4, 지지 午:6)
  const stemIdx = (4 + (diffDays % 10) + 10) % 10;
  const branchIdx = (6 + (diffDays % 12) + 12) % 12;

  const stemElemIdx = Math.floor(stemIdx / 2); // 0:목, 1:화, 2:토, 3:금, 4:수
  const branchElemIdx = BRANCH_ELEMENT_MAP[branchIdx] ?? 0;

  // 3. non-null assertion 제거 및 안전 인덱스 엑세스
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
 * 태어난 시간(HH:MM)을 바탕으로 시지(지지)를 계산합니다. (1, 5 번 24시간 범위 및 유효성 엄격 체크)
 */
export function getHourBranch(hourStr: string | null | undefined): string {
  if (!hourStr || typeof hourStr !== 'string') return "모름";

  const trimmed = hourStr.trim();
  if (!/^\d{1,2}:\d{1,2}$/.test(trimmed)) return "모름";

  const parts = trimmed.split(':');
  const h = parseInt(parts[0] || '', 10);
  const m = parseInt(parts[1] || '', 10);

  // 1 & 5번: 24시간 범위 유효성 엄격 검증 (h: 0~23, m: 0~59)
  if (isNaN(h) || isNaN(m) || h < 0 || h > 23 || m < 0 || m > 59) return "모름";

  const totalMinutes = h * 60 + m;

  // 한국 전통 자시는 23:30 ~ 01:29 (30분 가산 후 120분 단위 나눔)
  const adjusted = (totalMinutes + 30) % 1440;
  const index = Math.floor(adjusted / 120) % 12;

  return BRANCHES[index] || "모름";
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
 * 오늘 일진 기반 오행 5대 비율, 뱃지, 설명 문장을 통합하여 단일 제공합니다. (6번 비율 정밀 보정)
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

  // 6번 보완: 5대 오행 비율 정산 (s === b 일 때와 상생 상극 정밀 분기 처리)
  const ratios = [10, 10, 10, 10, 10];
  if (s === b) {
    // 동일 오행 기운 중첩 가중치
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

/**
 * 오늘 날짜의 동적 음력 날짜 문자열(한자 및 음력 표시)을 계산합니다. (7번 안전 Fallback 보완)
 */
export function getTodayLunarDateString(inputDate: Date = new Date()): string {
  try {
    const validDate = isNaN(inputDate.getTime()) ? new Date() : inputDate;
    const formatter = new Intl.DateTimeFormat('ko-KR-u-ca-chinese', {
      timeZone: 'Asia/Seoul',
      month: 'numeric',
      day: 'numeric'
    });

    const parts = formatter.formatToParts(validDate);
    let monthNum = 1;
    let dayNum = 1;

    for (const part of parts) {
      if (part.type === 'month') {
        monthNum = parseInt(part.value, 10) || 1;
      } else if (part.type === 'day') {
        dayNum = parseInt(part.value, 10) || 1;
      }
    }

    const hanjaMonths = ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十", "十一", "十二"];
    const hanjaDays = [
      "朔日", "初二日", "初三日", "初四日", "初五日", "初六日", "初七日", "初八日", "初九日", "初十日",
      "十一日", "十二日", "十三日", "十四日", "十五日", "十六日", "十七日", "十八日", "十九日", "二十日",
      "廿一日", "廿二日", "廿三日", "廿四日", "廿五日", "廿六日", "廿七日", "廿八日", "廿九日", "三十日"
    ];

    const mHanja = hanjaMonths[(monthNum - 1) % 12] || `${monthNum}`;
    const dHanja = hanjaDays[(dayNum - 1) % 30] || `${dayNum}日`;

    return `陰曆 ${mHanja}月 ${dHanja} · 음력 ${monthNum}월 ${dayNum}일`;
  } catch (e) {
    // 7. 음력 산출 예외 시 빈 문자열 대신 안전 Fallback 제공 (UI 레이아웃 유지)
    console.warn('[Lunar Date Error] Failed to calculate lunar date:', e);
    const d = inputDate || new Date();
    const safeMonth = !isNaN(d.getTime()) ? d.getMonth() + 1 : new Date().getMonth() + 1;
    const safeDate = !isNaN(d.getTime()) ? d.getDate() : new Date().getDate();
    return `양력 ${safeMonth}월 ${safeDate}일 기준`;
  }
}
