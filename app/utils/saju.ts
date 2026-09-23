/**
 * 사주명리 간지(갑자) 계산 유틸리티 (클라이언트 공유)
 * server/utils/saju.ts 와 동일 로직 - app/utils/ 는 클라이언트에서도 자동 import됩니다.
 */

export interface GanzhiResult {
  stem: string;       // 천간 (갑, 을, 병...)
  branch: string;     // 지지 (자, 축, 인...)
  stemIdx: number;    // 천간 인덱스 (0~9)
  branchIdx: number;  // 지지 인덱스 (0~11)
  fullName: string;   // 간지 이름 (예: 임진)
}

/**
 * 특정 날짜(KST 기준 YYYY-MM-DD)의 일진(일주)을 계산합니다.
 * 기준일: 2000년 1월 1일 (무오일 - 천간 4 戊, 지지 6 午)
 */
export function getGanzhiOfDay(dateStr: string): GanzhiResult {
  const targetDate = new Date(`${dateStr}T00:00:00+09:00`);
  const refDate = new Date('2000-01-01T00:00:00+09:00');

  const diffTime = targetDate.getTime() - refDate.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  const stems = ["갑", "을", "병", "정", "무", "기", "경", "신", "임", "계"];
  const branches = ["자", "축", "인", "묘", "진", "사", "오", "미", "신", "유", "술", "해"];

  // 2000년 1월 1일은 戊(4) 午(6) 일
  const stemIdx = (4 + (diffDays % 10) + 10) % 10;
  const branchIdx = (6 + (diffDays % 12) + 12) % 12;

  return {
    stem: stems[stemIdx]!,
    branch: branches[branchIdx]!,
    stemIdx,
    branchIdx,
    fullName: stems[stemIdx]! + branches[branchIdx]!
  };
}

/**
 * 태어난 시간(HH:MM)을 바탕으로 시지(지지)를 계산합니다.
 */
export function getHourBranch(hourStr: string | null | undefined): string {
  if (!hourStr) return "모름";

  const parts = hourStr.split(':');
  if (parts.length < 2) return "모름";

  const h = parseInt(parts[0]!, 10);
  const m = parseInt(parts[1]!, 10);

  if (isNaN(h) || isNaN(m)) return "모름";

  const totalMinutes = h * 60 + m;

  // 한국 전통 자시는 23:30 ~ 01:29
  const adjusted = (totalMinutes + 30) % 1440;
  const index = Math.floor(adjusted / 120);

  const branches = ["자", "축", "인", "묘", "진", "사", "오", "미", "신", "유", "술", "해"];
  return branches[index]!;
}

/**
 * 특정 연도(YYYY)의 연주(년주) 및 12지신 띠를 계산합니다.
 */
export function getGanzhiOfYear(year: number): GanzhiResult & { animal: string; zodiacName: string } {
  const stems = ["갑", "을", "병", "정", "무", "기", "경", "신", "임", "계"];
  const branches = ["자", "축", "인", "묘", "진", "사", "오", "미", "신", "유", "술", "해"];
  const animals = ["쥐", "소", "호랑이", "토끼", "용", "뱀", "말", "양", "원숭이", "닭", "개", "돼지"];

  let stemIdx = (year - 4) % 10;
  if (stemIdx < 0) stemIdx += 10;

  let branchIdx = (year - 4) % 12;
  if (branchIdx < 0) branchIdx += 12;

  const stem = stems[stemIdx]!;
  const branch = branches[branchIdx]!;
  const animal = animals[branchIdx]!;
  const fullName = stem + branch;

  return {
    stem,
    branch,
    stemIdx,
    branchIdx,
    fullName,
    animal,
    zodiacName: `${fullName}년 ${animal}띠`
  };
}

/**
 * 오늘 날짜의 동적 음력 날짜 문자열(한자 및 음력 표시)을 계산합니다.
 * Intl.DateTimeFormat 표준 음력 달력(ca-chinese)을 활용하여 음력 월/일을 산출합니다.
 */
export function getTodayLunarDateString(inputDate: Date = new Date()): string {
  try {
    const kstUtc = inputDate.getTime() + (inputDate.getTimezoneOffset() * 60000) + (9 * 60 * 60 * 1000);
    const kstDate = new Date(kstUtc);

    const formatter = new Intl.DateTimeFormat('ko-KR-u-ca-chinese', {
      month: 'numeric',
      day: 'numeric'
    });
    
    const parts = formatter.formatToParts(kstDate);
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
    return `陰曆 八月 朔日`;
  }
}
