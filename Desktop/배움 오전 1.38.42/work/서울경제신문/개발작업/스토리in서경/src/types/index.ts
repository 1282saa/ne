// 뉴스 아이템 인터페이스
export interface NewsItem {
  id: string;
  title: string;
  description: string;
  date: string;
  url: string;
  imageUrl?: string;
}

// 사용자 인터페이스
export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
}

// 검색 옵션 인터페이스
export interface SearchOptions {
  category?: string;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: "relevance" | "date";
}

// 네비게이션 매개변수
export type RootStackParamList = {
  Home: undefined;
  StoryResult: { keyword: string; options?: SearchOptions };
  NewsDetail: { url: string; title: string };
  AspenHome: undefined;
  AspenDetail: undefined;
  UserProfile?: { userId: string };
  Settings: undefined;
};
