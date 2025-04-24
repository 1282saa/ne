import axios from "axios";
import { BIGKINDS_KEY } from "@env";

// BigKinds API 기본 URL
const BASE_URL = "https://tools.kinds.or.kr";

// API 클라이언트 설정
export const bigKindsAPI = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// 서울경제신문 언론사 코드
export const SEOUL_ECONOMY_CODE = "02100311";

// 언론사 코드 매핑 추가
export const PROVIDER_CODES: Record<string, string> = {
  "01100101": "경향신문",
  "01100201": "국민일보",
  "01100301": "내일신문",
  "01100401": "동아일보",
  "01100501": "문화일보",
  "01100611": "서울신문",
  "01100701": "세계일보",
  "01100751": "아시아투데이",
  "01100801": "조선일보",
  "01100901": "중앙일보",
  "01101001": "한겨레",
  "01101101": "한국일보",
  "01200101": "경기일보",
  "01200201": "경인일보",
  "01300201": "강원일보",
  "01400201": "대전일보",
  "01500501": "대구일보",
  "01500601": "매일신문",
  "01500701": "부산일보",
  "01501001": "대구신문",
  "01600451": "남도일보",
  "01600801": "전남일보",
  "01600901": "전라일보",
  "02100051": "대한경제",
  "02100101": "매일경제",
  "02100201": "머니투데이",
  "02100311": "서울경제", // 서울경제신문
  "02100351": "이투데이",
  "02100401": "메트로경제",
  "02100501": "파이낸셜뉴스",
  "02100601": "한국경제",
  "02100701": "헤럴드경제",
  "02100801": "아시아경제",
  "02100851": "아주경제",
  "04100058": "노컷뉴스",
  "04100078": "뉴스핌",
  "04100158": "데일리안",
  "04101008": "이데일리",
  "04102008": "쿠키뉴스",
  "04104008": "프레시안",
  "06101202": "주간한국",
  "07100501": "전자신문",
  "07100502": "환경일보",
  "07101201": "디지털타임스",
  "08100101": "KBS",
  "08100201": "MBC",
  "08100301": "SBS",
  "08100401": "YTN",
  "08200101": "OBS",
  "10100101": "스포츠서울",
  "10100301": "스포츠한국",
  "10100401": "스포츠월드",
};

// 요청 인터셉터 설정 - API 키 추가
bigKindsAPI.interceptors.request.use(
  (config) => {
    // 요청 구조에 access_key 추가
    if (config.data && !config.data.access_key) {
      config.data = {
        access_key: BIGKINDS_KEY,
        argument: config.data.argument || config.data,
      };
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 뉴스 검색 결과 인터페이스
export interface NewsItem {
  id: string;
  title: string;
  description: string;
  date: string;
  url: string;
  imageUrl?: string;
  source?: string;
  content?: string; // 뉴스 본문 내용 (일부)
  provider?: string; // 언론사 이름
  providerCode?: string; // 언론사 코드
}

// 뉴스 상세 정보 인터페이스
export interface NewsDetail {
  id: string;
  title: string;
  content: string;
  date: string;
  url: string;
  imageUrl?: string;
  source?: string;
  author?: string;
  category?: string[];
}

// 새로운 인터페이스 추가
export interface IssueItem {
  id: string; // 고유 식별자
  topic: string; // 이슈 제목
  topicRank: number; // 인기도
  keywords: string[]; // 관련 키워드 (배열로 변환)
  content: string; // 요약 내용
  relatedNews?: NewsItem; // 관련 뉴스 (선택적)
  newsClusterIds?: string[]; // 관련 뉴스 ID 배열
}

/**
 * 키워드로 뉴스 검색
 * @param keyword 검색 키워드
 * @returns 뉴스 아이템 배열
 */
export const searchNewsByKeyword = async (
  keyword: string,
  days: number = 30
): Promise<NewsItem[]> => {
  try {
    // 날짜 범위 계산
    const today = new Date();
    const fromDate = new Date();
    fromDate.setDate(today.getDate() - days);

    const fromDateStr = formatDateForAPI(fromDate);
    const toDateStr = formatDateForAPI(today);

    const response = await bigKindsAPI.post("/search/news", {
      argument: {
        query: keyword,
        published_at: {
          from: fromDateStr,
          until: toDateStr,
        },
        provider: [SEOUL_ECONOMY_CODE], // 서울경제 언론사만 검색
        sort: { date: "desc" },
        return_from: 0,
        return_size: 20,
        fields: [
          "title",
          "content",
          "published_at",
          "provider_news_id",
          "images",
          "provider_link_page",
          "provider",
        ],
      },
    });

    // 응답 데이터 확인 및 매핑
    if (response.data && response.data.documents) {
      return response.data.documents.map((item: any) => ({
        id: item.news_id || item._id,
        title: item.title,
        description: item.content ? item.content.substring(0, 150) + "..." : "",
        date: formatReadableDate(item.published_at),
        url: item.provider_link_page,
        imageUrl: item.images && item.images.length > 0 ? item.images[0] : null,
        source: "서울경제",
        content: item.content ? item.content.substring(0, 150) + "..." : "",
        provider: item.provider,
        providerCode: item.provider_code,
      }));
    }

    return [];
  } catch (error) {
    console.error("뉴스 검색 중 오류 발생:", error);
    throw error;
  }
};

/**
 * 뉴스 상세 정보 조회
 * @param newsId 뉴스 ID
 * @returns 뉴스 상세 정보
 */
export const getNewsDetail = async (newsId: string): Promise<NewsDetail> => {
  try {
    const response = await bigKindsAPI.post("/search/news", {
      argument: {
        news_ids: [newsId],
        fields: [
          "title",
          "content",
          "published_at",
          "provider",
          "byline",
          "category",
          "images",
          "provider_link_page",
        ],
      },
    });

    // 응답 구조가 다르므로 적절히 처리
    if (
      response.data &&
      response.data.return_object &&
      response.data.return_object.documents &&
      response.data.return_object.documents.length > 0
    ) {
      const detail = response.data.return_object.documents[0];
      return {
        id: newsId,
        title: detail.title,
        content: detail.content,
        date: formatReadableDate(detail.published_at),
        url: detail.provider_link_page,
        imageUrl:
          detail.images && detail.images.length > 0 ? detail.images[0] : null,
        source: detail.provider || "서울경제",
        author: detail.byline || "",
        category: detail.category || [],
      };
    }

    throw new Error("뉴스 상세 정보를 찾을 수 없습니다.");
  } catch (error) {
    console.error("뉴스 상세 정보 조회 중 오류 발생:", error);
    throw error;
  }
};

/**
 * 오늘의 이슈 가져오기
 * @param size 가져올 이슈 수
 * @param dateStr 특정 날짜 (YYYY-MM-DD 형식)
 * @param providerName 특정 언론사 이름 (없으면 모든 언론사)
 * @returns 이슈 아이템 배열
 */
export const getTodayIssues = async (
  size: number = 10,
  dateStr?: string,
  providerName?: string
): Promise<IssueItem[]> => {
  try {
    // 날짜 설정 (지정된 날짜 또는 오늘)
    let targetDate: string;

    if (dateStr) {
      targetDate = dateStr; // 이미 YYYY-MM-DD 형식
    } else {
      // 현재 날짜를 YYYY-MM-DD 형식으로 변환
      const today = new Date();
      targetDate = formatDateForAPI(today, false);
    }

    console.log(
      `오늘의 이슈 API 호출: ${targetDate}, 언론사: ${
        providerName || "모든 언론사"
      }`
    );

    // API 요청 인자 구성
    const argument: any = {
      date: targetDate,
    };

    // 언론사가 지정된 경우에만 provider 추가
    if (providerName) {
      argument.provider = [providerName];
    }

    // 오늘의 이슈 요청
    const response = await bigKindsAPI.post("/issue_ranking", {
      argument: argument,
    });

    console.log("API 응답:", JSON.stringify(response.data, null, 2));

    // 이슈가 있는지 확인
    if (
      !response.data.return_object ||
      !response.data.return_object.topics ||
      response.data.return_object.topics.length === 0
    ) {
      console.log(`${targetDate} 이슈 없음`);
      return [];
    }

    // 각 이슈 데이터 변환
    const issues = response.data.return_object.topics.map(
      (issue: any, index: number) => {
        return {
          id: `issue-${index}-${targetDate}`,
          topic: issue.topic,
          topicRank: issue.topic_rank,
          keywords: issue.topic_keyword ? issue.topic_keyword.split(",") : [],
          content: issue.topic_content || "",
          newsClusterIds: issue.news_cluster || [],
        };
      }
    );

    return issues.slice(0, size);
  } catch (error) {
    console.error("오늘의 이슈 조회 중 오류 발생:", error);
    throw error;
  }
};

/**
 * 인기 검색어 가져오기
 * @param size 가져올 검색어 수
 * @returns 인기 검색어 배열
 */
export const getPopularKeywords = async (
  size: number = 10
): Promise<string[]> => {
  try {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const response = await bigKindsAPI.post("/query_rank", {
      argument: {
        from: formatDateForAPI(yesterday),
        until: formatDateForAPI(today),
        offset: size,
      },
    });

    if (response.data.return_object && response.data.return_object.queries) {
      return response.data.return_object.queries
        .sort((a: any, b: any) => b.count - a.count)
        .slice(0, size)
        .map((item: any) => item.query);
    }

    return [];
  } catch (error) {
    console.error("인기 검색어 조회 중 오류 발생:", error);
    throw error;
  }
};

/**
 * 연관어 분석 가져오기
 * @param keyword 검색 키워드
 * @param size 가져올 연관어 수
 * @returns 연관어 배열 {name: string, weight: number}
 */
export const getRelatedKeywords = async (
  keyword: string,
  size: number = 10
) => {
  try {
    const today = new Date();
    const lastMonth = new Date(today);
    lastMonth.setMonth(today.getMonth() - 1);

    const response = await bigKindsAPI.post("/word_cloud", {
      argument: {
        query: keyword,
        published_at: {
          from: formatDateForAPI(lastMonth),
          until: formatDateForAPI(today),
        },
        provider: [SEOUL_ECONOMY_CODE],
      },
    });

    if (response.data.return_object && response.data.return_object.nodes) {
      return response.data.return_object.nodes
        .sort((a: any, b: any) => b.weight - a.weight)
        .slice(0, size)
        .map((node: any) => ({
          name: node.name,
          weight: node.weight,
        }));
    }

    return [];
  } catch (error) {
    console.error("연관어 분석 중 오류 발생:", error);
    throw error;
  }
};

/**
 * 키워드로 타임라인 뉴스 가져오기
 * @param keyword 검색할 키워드
 * @param size 가져올 뉴스 개수
 * @returns 타임라인으로 정렬된 뉴스 아이템 배열
 */
export const getKeywordTimeline = async (
  keyword: string,
  size: number = 30
): Promise<NewsItem[]> => {
  try {
    // 최근 30일의 뉴스를 가져옴
    const newsItems = await searchNewsByKeyword(keyword, 30);

    // 날짜 기준으로 정렬
    return newsItems
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, size);
  } catch (error) {
    console.error("키워드 타임라인 조회 중 오류 발생:", error);
    throw error;
  }
};

/**
 * 오늘의 키워드(분야별 키워드) 가져오기
 * @returns 분야별 인기 키워드 목록
 */
export const getTodayKeywords = async () => {
  try {
    const response = await bigKindsAPI.post("/today_category_keyword", {
      argument: {},
    });

    if (response.data && response.data.return_object) {
      // 키워드와 카테고리 데이터 반환
      return {
        date: response.data.return_object.date,
        categories: response.data.return_object.cate_ratio || [],
        keywords: response.data.return_object.cate_keyword || [],
      };
    }

    return {
      date: "",
      categories: [],
      keywords: [],
    };
  } catch (error) {
    console.error("오늘의 키워드 조회 중 오류 발생:", error);
    throw error;
  }
};

/**
 * 키워드 트렌드 정보 가져오기
 * @param keyword 검색 키워드
 * @param interval 집계 간격 (day, month, year)
 * @param fromDate 시작 날짜
 * @param toDate 종료 날짜
 * @returns 기간별 키워드 언급 추이
 */
export const getKeywordTrend = async (
  keyword: string,
  interval: "day" | "month" | "year" = "month",
  fromDate?: Date,
  toDate?: Date
) => {
  try {
    // 날짜 범위 설정
    const endDate = toDate || new Date();
    const startDate = fromDate || new Date(endDate);

    if (!fromDate) {
      // 기본값으로 1년 전
      startDate.setFullYear(startDate.getFullYear() - 1);
    }

    const response = await bigKindsAPI.post("/time_line", {
      argument: {
        query: keyword,
        published_at: {
          from: formatDateForAPI(startDate),
          until: formatDateForAPI(endDate),
        },
        provider: [SEOUL_ECONOMY_CODE],
        interval: interval,
        normalize: "false",
      },
    });

    if (response.data && response.data.return_object) {
      return {
        totalHits: response.data.return_object.total_hits,
        timeline: response.data.return_object.time_line || [],
      };
    }

    return {
      totalHits: 0,
      timeline: [],
    };
  } catch (error) {
    console.error("키워드 트렌드 조회 중 오류 발생:", error);
    throw error;
  }
};

// 날짜 포맷 유틸리티 (YYYY-MM-DD 형식)
export const formatDateForAPI = (
  date: Date,
  asYYYYMMDD: boolean = false
): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  if (asYYYYMMDD) {
    return `${year}${month}${day}`;
  }

  return `${year}-${month}-${day}`;
};

// 읽기 쉬운 날짜 형식으로 변환
export const formatReadableDate = (dateString: string): string => {
  if (!dateString) return "";

  let date: Date;

  // 다양한 날짜 형식 처리
  if (dateString.match(/^\d{8}$/)) {
    // YYYYMMDD 형식
    const year = dateString.substring(0, 4);
    const month = dateString.substring(4, 6);
    const day = dateString.substring(6, 8);
    date = new Date(`${year}-${month}-${day}`);
  } else {
    // ISO 또는 다른 형식
    date = new Date(dateString);
  }

  // 유효하지 않은 날짜
  if (isNaN(date.getTime())) {
    return dateString;
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

// news_cluster ID를 직접 활용하여 뉴스 조회
const fetchNewsWithClusterIds = async (clusterIds: string[]) => {
  const response = await bigKindsAPI.post("/search/news", {
    argument: {
      news_ids: clusterIds,
      fields: ["news_id", "title", "content", "provider", "published_at"],
    },
  });
  return response.data?.return_object?.docs || [];
};

/**
 * 뉴스 ID에서 언론사 코드를 추출하여 언론사명 반환
 * @param newsId 뉴스 ID
 * @returns 언론사 이름
 */
export const getProviderFromNewsId = (newsId: string): string => {
  const providerCode = newsId.split(".")[0];
  return PROVIDER_CODES[providerCode] || `언론사코드(${providerCode})`;
};

/**
 * 뉴스가 서울경제 기사인지 확인
 * @param newsId 뉴스 ID
 * @returns boolean
 */
export const isSeoulEconomic = (newsId: string): boolean => {
  return newsId.startsWith("02100311");
};

/**
 * BigKinds 뉴스 상세 페이지 URL 생성
 * @param newsId 뉴스 ID
 * @returns URL 문자열
 */
export const generateBigkindsUrl = (newsId: string): string => {
  const baseUrl =
    "https://www.bigkinds.or.kr/v2/news/newsDetailView.do?newsId=";
  return `${baseUrl}${newsId}`;
};

/**
 * 여러 뉴스 ID로 뉴스 상세 정보 가져오기
 * @param newsIds 뉴스 ID 배열
 * @param options 추가 옵션 (필드 등)
 * @returns 뉴스 상세 정보 배열
 */
export const getNewsDetailsByIds = async (
  newsIds: string[],
  options?: {
    fields?: string[];
    includeFullContent?: boolean;
  }
): Promise<any[]> => {
  try {
    if (!newsIds || newsIds.length === 0) {
      return [];
    }

    console.log(`뉴스 상세 정보 요청: ${newsIds.length}개`, newsIds);

    // 기본 필드
    const defaultFields = [
      "title",
      "content",
      "published_at",
      "provider",
      "news_id",
      "provider_link_page",
      "images",
    ];

    // 요청에 사용할 필드 (옵션에서 제공되었으면 그것 사용, 아니면 기본값)
    const fields = options?.fields || defaultFields;

    const response = await bigKindsAPI.post("/search/news", {
      argument: {
        news_ids: newsIds,
        fields: fields,
      },
    });

    console.log("뉴스 상세 API 응답 코드:", response.status);

    // 전체 응답 구조 디버깅 로그 추가
    console.log(
      "API 응답 구조:",
      JSON.stringify(response.data).substring(0, 300) + "..."
    );

    // 응답에서 문서 목록 가져오기 (docs 또는 documents 필드 모두 확인)
    let documents = null;

    if (
      response.data?.return_object?.docs &&
      response.data.return_object.docs.length > 0
    ) {
      documents = response.data.return_object.docs;
      console.log(`API 응답에서 'docs' 필드로 ${documents.length}개 문서 발견`);
    } else if (
      response.data?.return_object?.documents &&
      response.data.return_object.documents.length > 0
    ) {
      documents = response.data.return_object.documents;
      console.log(
        `API 응답에서 'documents' 필드로 ${documents.length}개 문서 발견`
      );
    } else {
      console.log(
        "API 응답에 문서가 없음:",
        JSON.stringify(response.data).substring(0, 300)
      );
    }

    if (documents && documents.length > 0) {
      // 첫 번째 문서의 필드 출력 (디버깅용)
      console.log("첫 번째 문서 필드:", Object.keys(documents[0]).join(", "));

      return documents.map((item: any) => ({
        id: item.news_id,
        title: item.title || "제목 없음",
        content: item.content ? item.content.substring(0, 150) + "..." : "",
        description: item.content ? item.content.substring(0, 150) + "..." : "",
        date: formatReadableDate(item.published_at || ""),
        url: item.provider_link_page || generateBigkindsUrl(item.news_id),
        imageUrl: item.images && item.images.length > 0 ? item.images[0] : null,
        provider: getProviderFromNewsId(item.news_id),
        providerCode: item.news_id?.split(".")[0] || "",
        source: getProviderFromNewsId(item.news_id),
        fullContent: options?.includeFullContent ? item.content : undefined,
      }));
    }

    console.warn("뉴스 상세 정보 없음:", newsIds);
    return [];
  } catch (error) {
    console.error("뉴스 상세 정보 조회 중 오류 발생:", error);
    return [];
  }
};

/**
 * 서울경제 뉴스만 가져오기
 * @param newsClusterIds 뉴스 클러스터 ID 배열
 * @returns 서울경제 뉴스 아이템 배열
 */
export const getSeoulEconomicNews = async (
  newsClusterIds: string[]
): Promise<NewsItem[]> => {
  try {
    if (!newsClusterIds || newsClusterIds.length === 0) {
      console.log("서울경제 뉴스 조회: 뉴스 ID가 없음");
      return [];
    }

    // 모든 뉴스 ID를 로그로 출력
    console.log("모든 뉴스 ID:", newsClusterIds);

    // 서울경제 뉴스 ID만 필터링 (ID 시작부분이 "02100311"인 경우)
    const seoulEconomicIds = newsClusterIds.filter((id) =>
      id.startsWith("02100311")
    );

    // 서울경제 뉴스 ID 로그 출력
    console.log(
      "서울경제 필터링 결과:",
      seoulEconomicIds.length > 0 ? seoulEconomicIds : "서울경제 뉴스 ID가 없음"
    );
    console.log(
      `서울경제 뉴스 ID: ${seoulEconomicIds.length}개 / 전체 ${newsClusterIds.length}개`
    );

    // 만약 서울경제 뉴스가 없으면, 모든 뉴스 ID에서 처음 5개를 사용
    let targetNewsIds = seoulEconomicIds;
    if (targetNewsIds.length === 0) {
      console.log("서울경제 뉴스가 없어 전체 뉴스에서 최대 5개를 선택합니다.");
      targetNewsIds = newsClusterIds.slice(0, 5);
    } else {
      // 최대 10개까지만 처리
      targetNewsIds = seoulEconomicIds.slice(0, 10);
    }

    if (targetNewsIds.length === 0) {
      console.log("처리할 뉴스 ID가 없습니다.");
      return [];
    }

    // 뉴스 상세 정보 조회
    const response = await bigKindsAPI.post("/search/news", {
      argument: {
        news_ids: targetNewsIds,
        fields: [
          "title",
          "content",
          "published_at",
          "provider",
          "news_id",
          "provider_link_page",
          "images",
          "byline", // 기자 정보
        ],
      },
    });

    console.log(`서울경제 뉴스 API 응답: ${response.status}`);

    // API 응답 디버깅
    if (response.data?.return_object?.docs) {
      console.log(
        `API 응답에서 ${response.data.return_object.docs.length}개 문서 반환`
      );
    } else {
      console.log("API 응답에 문서가 없음:", response.data);
    }

    if (
      response.data?.return_object?.docs &&
      response.data.return_object.docs.length > 0
    ) {
      const news = response.data.return_object.docs.map((item: any) => {
        // 각 뉴스 아이템 로그
        console.log(`뉴스 ID: ${item.news_id}, 제목: ${item.title}`);

        return {
          id: item.news_id,
          title: item.title || "제목 없음",
          description: item.content
            ? item.content.substring(0, 200) + "..."
            : "",
          content: item.content ? item.content.substring(0, 200) + "..." : "",
          date: formatReadableDate(item.published_at),
          url: item.provider_link_page || generateBigkindsUrl(item.news_id),
          imageUrl:
            item.images && item.images.length > 0 ? item.images[0] : null,
          provider: getProviderFromNewsId(item.news_id),
          source: getProviderFromNewsId(item.news_id),
          providerCode: item.news_id.split(".")[0],
          author: item.byline || "",
        };
      });

      console.log(`서울경제 뉴스 ${news.length}개 반환 완료`);
      return news;
    }

    console.warn("서울경제 뉴스 정보 없음");
    return [];
  } catch (error) {
    console.error("서울경제 뉴스 조회 중 오류 발생:", error);
    return [];
  }
};

/**
 * 특정 언론사 뉴스만 가져오기
 * @param newsClusterIds 뉴스 클러스터 ID 배열
 * @param providerCodes 가져올 언론사 코드 배열 (없으면 서울경제를 제외한 모든 언론사)
 * @param limit 최대 가져올 뉴스 수
 * @returns 뉴스 아이템 배열
 */
export const getProviderNews = async (
  newsClusterIds: string[],
  providerCodes?: string[],
  limit: number = 20
): Promise<NewsItem[]> => {
  try {
    if (!newsClusterIds || newsClusterIds.length === 0) {
      console.log("언론사 뉴스 조회: 뉴스 ID가 없음");
      return [];
    }

    // 특정 언론사 뉴스 ID만 필터링
    let filteredIds: string[] = [];

    if (providerCodes && providerCodes.length > 0) {
      // 지정된 언론사 코드만 필터링
      filteredIds = newsClusterIds.filter((id) => {
        const providerCode = id.split(".")[0];
        return providerCodes.includes(providerCode);
      });
    } else {
      // 서울경제를 제외한 모든 언론사
      filteredIds = newsClusterIds.filter((id) => !isSeoulEconomic(id));
    }

    console.log(
      `선택된 언론사 뉴스 ID: ${filteredIds.length}개 / 전체 ${newsClusterIds.length}개`
    );

    if (filteredIds.length === 0) {
      console.log("해당 언론사 뉴스가 없습니다.");
      return [];
    }

    // 각 언론사별로 적절히 분배하여 가져오기
    const providerGroups: Record<string, string[]> = {};

    // 언론사별로 그룹화
    filteredIds.forEach((id) => {
      const providerCode = id.split(".")[0];
      if (!providerGroups[providerCode]) {
        providerGroups[providerCode] = [];
      }
      providerGroups[providerCode].push(id);
    });

    // 각 언론사에서 1-2개씩 골고루 선택
    const selectedIds: string[] = [];
    const providerCounts = Object.keys(providerGroups).length;
    const itemsPerProvider = Math.min(
      Math.max(1, Math.floor(limit / providerCounts)),
      3 // 언론사 당 최대 3개
    );

    Object.values(providerGroups).forEach((ids) => {
      selectedIds.push(...ids.slice(0, itemsPerProvider));
    });

    // 최대 limit 개까지만 처리
    const targetNewsIds = selectedIds.slice(0, limit);

    // 뉴스 상세 정보 조회
    const response = await bigKindsAPI.post("/search/news", {
      argument: {
        news_ids: targetNewsIds,
        fields: [
          "title",
          "content",
          "published_at",
          "provider",
          "news_id",
          "provider_link_page",
          "images",
        ],
      },
    });

    console.log(`언론사 뉴스 API 응답: ${response.status}`);

    if (
      response.data?.return_object?.docs &&
      response.data.return_object.docs.length > 0
    ) {
      const news = response.data.return_object.docs.map((item: any) => {
        const providerCode = item.news_id.split(".")[0];
        const providerName = getProviderFromNewsId(item.news_id);

        return {
          id: item.news_id,
          title: item.title || "제목 없음",
          description: item.content
            ? item.content.substring(0, 150) + "..."
            : "",
          content: item.content ? item.content.substring(0, 150) + "..." : "",
          date: formatReadableDate(item.published_at),
          url: item.provider_link_page || generateBigkindsUrl(item.news_id),
          imageUrl:
            item.images && item.images.length > 0 ? item.images[0] : null,
          provider: providerName,
          source: providerName,
          providerCode: providerCode,
        };
      });

      console.log(`언론사 뉴스 ${news.length}개 반환 완료`);
      return news;
    }

    console.warn("언론사 뉴스 정보 없음");
    return [];
  } catch (error) {
    console.error("언론사 뉴스 조회 중 오류 발생:", error);
    return [];
  }
};

/**
 * 키워드 배열을 OR로 연결하여 뉴스 검색 (이슈 흐름 분석용)
 * @param keywords 검색할 키워드 배열
 * @param fromDate 검색 시작 날짜 (YYYY-MM-DD)
 * @param untilDate 검색 종료 날짜 (YYYY-MM-DD)
 * @param maxResults 최대 결과 수
 * @returns 날짜별로 그룹화된 뉴스 아이템
 */
export const searchNewsByKeywordsForTimeline = async (
  keywords: string[],
  fromDate: string,
  untilDate: string,
  maxResults: number = 100
): Promise<Record<string, NewsItem[]>> => {
  try {
    if (!keywords || keywords.length === 0) {
      console.log("검색 키워드가 없습니다.");
      return {};
    }

    // 키워드를 OR로 연결하여 쿼리 생성 (ex: "키워드1 OR 키워드2 OR 키워드3")
    const query = keywords.join(" OR ");
    console.log(`[이슈흐름] 검색 쿼리: "${query}"`);
    console.log(`[이슈흐름] 검색 기간: ${fromDate} ~ ${untilDate}`);

    // API 요청
    const requestData = {
      query: query, // OR로 연결된 키워드
      published_at: {
        from: fromDate,
        until: untilDate,
      },
      sort: { date: "asc" }, // 날짜 오름차순 정렬
      return_from: 0,
      return_size: maxResults,
      hilight: 200, // 검색어가 포함된 영역 추출 (최대 200자)
      fields: [
        "title",
        "content",
        "published_at",
        "enveloped_at",
        "dateline",
        "provider",
        "category",
        "byline",
        "images",
        "provider_link_page",
        "provider_news_id",
        "news_id",
      ],
    };

    console.log(
      `[이슈흐름] API 요청 데이터:`,
      JSON.stringify(requestData).substring(0, 300) + "..."
    );

    const response = await bigKindsAPI.post("/search/news", {
      argument: requestData,
    });

    console.log("[이슈흐름] API 응답 코드:", response.status);

    // API 응답 구조 확인을 위한 디버깅
    console.log(
      "[이슈흐름] API 응답 구조:",
      Object.keys(response.data || {}).join(", ")
    );

    if (response.data?.return_object) {
      console.log(
        "[이슈흐름] return_object 키:",
        Object.keys(response.data.return_object).join(", ")
      );
    }

    // 응답 데이터 구조에 따라 문서 가져오기
    let documents = [];
    let totalHits = 0;

    if (response.data?.return_object?.docs) {
      documents = response.data.return_object.docs;
      totalHits = response.data.return_object.total_hits || documents.length;
      console.log(
        `[이슈흐름] docs에서 ${documents.length}개 문서 발견 (전체 ${totalHits}개)`
      );
    } else if (response.data?.return_object?.documents) {
      documents = response.data.return_object.documents;
      totalHits = response.data.return_object.total_hits || documents.length;
      console.log(
        `[이슈흐름] documents에서 ${documents.length}개 문서 발견 (전체 ${totalHits}개)`
      );
    } else {
      console.log(
        "[이슈흐름] 문서가 없습니다. 응답 데이터:",
        JSON.stringify(response.data).substring(0, 500) + "..."
      );
      return {};
    }

    // 첫 번째 문서 샘플 출력 (디버깅용)
    if (documents.length > 0) {
      console.log(
        "[이슈흐름] 첫 번째 문서 필드:",
        Object.keys(documents[0]).join(", ")
      );
      console.log(
        "[이슈흐름] 첫 번째 문서 샘플:",
        JSON.stringify(documents[0]).substring(0, 300) + "..."
      );
    }

    const newsItems = documents.map((item: any) => {
      try {
        const newsId = item.news_id || "";
        const title = item.title || "제목 없음";
        const content = item.content || "";
        const summary = content
          ? content.length > 150
            ? content.substring(0, 150) + "..."
            : content
          : "";
        const publishedDate = item.published_at || "";
        const formattedDate = formatReadableDate(publishedDate);
        const providerName = item.provider || getProviderFromNewsId(newsId);
        const url = item.provider_link_page || generateBigkindsUrl(newsId);
        const imageUrl =
          item.images && item.images.length > 0 ? item.images[0] : null;

        return {
          id: newsId,
          title: title,
          description: summary,
          date: formattedDate,
          url: url,
          imageUrl: imageUrl,
          source: providerName,
          content: summary,
          provider: providerName,
          providerCode: newsId.split(".")[0],
          originalDate: publishedDate,
          byline: item.byline || "",
          category: item.category || [],
        };
      } catch (mapError) {
        console.error("[이슈흐름] 뉴스 아이템 매핑 중 오류:", mapError);
        return {
          id: "error",
          title: "처리 중 오류 발생",
          description: "",
          date: "",
          url: "",
          imageUrl: null,
          source: "",
          content: "",
          provider: "",
          providerCode: "",
          originalDate: "",
        };
      }
    });

    // 유효한 뉴스 아이템만 필터링
    const validNewsItems = newsItems.filter((item) => item.id !== "error");

    // 날짜별로 그룹화
    const groupedByDate: Record<string, NewsItem[]> = {};

    for (const item of validNewsItems) {
      // 날짜가 없거나 유효하지 않은 경우 건너뛰기
      if (!item.date) continue;

      const dateParts = item.date.split(" ");
      const dateKey = dateParts.length > 0 ? dateParts[0] : "unknown"; // YYYY-MM-DD 부분만 추출

      if (!groupedByDate[dateKey]) {
        groupedByDate[dateKey] = [];
      }

      groupedByDate[dateKey].push(item);
    }

    // 날짜 기준 내림차순 정렬 (최신순)
    const sortedDates = Object.keys(groupedByDate).sort((a, b) =>
      b.localeCompare(a)
    );
    const sortedResult: Record<string, NewsItem[]> = {};

    for (const date of sortedDates) {
      sortedResult[date] = groupedByDate[date];
    }

    console.log(
      `[이슈흐름] 결과: ${validNewsItems.length}개 기사, ${sortedDates.length}개 날짜`
    );

    // 데이터가 있는 각 날짜의 기사 수 출력
    sortedDates.forEach((date) => {
      console.log(`[이슈흐름] ${date}: ${sortedResult[date].length}개 기사`);
    });

    return sortedResult;
  } catch (error) {
    console.error("[이슈흐름] 뉴스 검색 중 오류 발생:", error);
    return {};
  }
};
