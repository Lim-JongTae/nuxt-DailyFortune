/**
 * 사주명리 간지(갑자) 계산 유틸리티
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
  // 날짜 파싱 (KST 00시 기준)
  const targetDate = new Date(`${dateStr}T00:00:00+09:00`);
  const refDate = new Date('2000-01-01T00:00:00+09:00');

  // 날짜 차이 계산 (밀리초 변환 후 반올림하여 윤초/서머타임 방지)
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
  // 30분을 더한 후 120분 단위로 나눔
  const adjusted = (totalMinutes + 30) % 1440;
  const index = Math.floor(adjusted / 120);
  
  const branches = ["자", "축", "인", "묘", "진", "사", "오", "미", "신", "유", "술", "해"];
  return branches[index]!;
}

/**
 * 일간(태어난 날의 천간)과 일진(오늘 날짜의 천간)의 관계(십신)를 계산합니다.
 */
export function getShipsin(birthStemIdx: number, todayStemIdx: number): string {
  const birthEl = Math.floor(birthStemIdx / 2); // 0: 목, 1: 화, 2: 토, 3: 금, 4: 수
  const todayEl = Math.floor(todayStemIdx / 2);
  
  const birthPolarity = birthStemIdx % 2; // 0: 양, 1: 음
  const todayPolarity = todayStemIdx % 2;
  const isSamePolarity = birthPolarity === todayPolarity;
  
  // 오행 상생상극 차이 계산 (0: 비겁, 1: 식상, 2: 재성, 3: 관성, 4: 인성)
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
