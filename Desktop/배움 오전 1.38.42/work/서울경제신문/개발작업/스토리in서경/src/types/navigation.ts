// src/types/navigation.ts

import { IssueItem } from "../services/newsService";

export interface SearchOptions {
  sortBy?: "date" | "relevance";
  filterBy?: string[];
}

export type RootStackParamList = {
  Home: undefined;
  AspenHome: undefined;
  StoryResult: {
    keyword: string;
    options?: {
      sortBy?: string;
    };
  };
  IssueTimeline: {
    issue: IssueItem;
    keyword: string;
  };
  NewsDetail: {
    url: string;
    title: string;
    id: string;
  };
  AspenDetail: undefined;
  TodayKeywords: undefined;
};
