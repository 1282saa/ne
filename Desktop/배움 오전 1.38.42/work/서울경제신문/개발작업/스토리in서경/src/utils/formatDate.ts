/**
 * ISO 날짜 문자열을 'YYYY-MM-DD' 형식으로 변환
 * @param isoString ISO 형식의 날짜 문자열
 * @returns 형식화된 날짜 문자열
 */
export const formatDate = (isoString: string): string => {
  const date = new Date(isoString);

  if (isNaN(date.getTime())) {
    return "Invalid Date";
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

/**
 * ISO 날짜 문자열을 '2023년 7월 15일' 형식으로 변환
 * @param isoString ISO 형식의 날짜 문자열
 * @returns 한국어 형식의 날짜 문자열
 */
export const formatKoreanDate = (isoString: string): string => {
  const date = new Date(isoString);

  if (isNaN(date.getTime())) {
    return "날짜 정보 없음";
  }

  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  return `${year}년 ${month}월 ${day}일`;
};

/**
 * 경과 시간 계산 (예: "3일 전", "5시간 전", "방금 전")
 * @param isoString ISO 형식의 날짜 문자열
 * @returns 경과 시간 문자열
 */
export const getTimeAgo = (isoString: string): string => {
  const date = new Date(isoString);

  if (isNaN(date.getTime())) {
    return "날짜 정보 없음";
  }

  const now = new Date();
  const diffSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffSeconds < 60) {
    return "방금 전";
  }

  const diffMinutes = Math.floor(diffSeconds / 60);
  if (diffMinutes < 60) {
    return `${diffMinutes}분 전`;
  }

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) {
    return `${diffHours}시간 전`;
  }

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 30) {
    return `${diffDays}일 전`;
  }

  const diffMonths = Math.floor(diffDays / 30);
  if (diffMonths < 12) {
    return `${diffMonths}달 전`;
  }

  const diffYears = Math.floor(diffMonths / 12);
  return `${diffYears}년 전`;
};
