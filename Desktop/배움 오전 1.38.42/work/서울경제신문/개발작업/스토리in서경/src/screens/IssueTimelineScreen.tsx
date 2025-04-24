// src/screens/IssueTimelineScreen.tsx

import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  ActivityIndicator,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { RouteProp, useRoute, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../types/navigation";
import {
  searchNewsByKeyword,
  getKeywordTimeline,
  getRelatedKeywords,
} from "../services/newsService";
import TimelineItem from "../components/TimelineItem";

type IssueTimelineRouteProp = RouteProp<RootStackParamList, "IssueTimeline">;

const IssueTimelineScreen = () => {
  const route = useRoute<IssueTimelineRouteProp>();
  const { issue, keyword } = route.params;

  const [loading, setLoading] = useState(true);
  const [news, setNews] = useState<any[]>([]);
  const [timeline, setTimeline] = useState<any>({});
  const [relatedKeywords, setRelatedKeywords] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadIssueData();
  }, [keyword]);

  const loadIssueData = async () => {
    try {
      setLoading(true);
      setError(null);

      // 병렬로 여러 API 요청 실행
      const [newsData, timelineData, keywordsData] = await Promise.all([
        searchNewsByKeyword(keyword, 30),
        getKeywordTimeline(keyword, 30),
        getRelatedKeywords(keyword, 15),
      ]);

      // 날짜별로 뉴스 정렬
      const sortedNews = newsData.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );

      setNews(sortedNews);
      setTimeline(timelineData);
      setRelatedKeywords(keywordsData);
    } catch (error) {
      console.error("이슈 데이터 로드 오류:", error);
      setError("이슈 데이터를 불러오는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#176FF2" />
        <Text style={styles.loadingText}>이슈 타임라인을 불러오는 중...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.issueTitle}>{issue.topic || keyword}</Text>
        <Text style={styles.issueKeywords}>
          {relatedKeywords
            .slice(0, 5)
            .map((k) => k.name)
            .join(", ")}
        </Text>
      </View>

      {/* 뉴스 타임라인 */}
      <FlatList
        data={news}
        renderItem={({ item, index }) => (
          <TimelineItem
            item={item}
            isFirst={index === 0}
            isLast={index === news.length - 1}
          />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.timelineList}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>관련 뉴스가 없습니다.</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  header: {
    padding: 20,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#eaeaea",
  },
  issueTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#232323",
    marginBottom: 8,
  },
  issueKeywords: {
    fontSize: 14,
    color: "#5F5F5F",
    marginBottom: 5,
  },
  timelineList: {
    paddingVertical: 10,
  },
  emptyContainer: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
});

export default IssueTimelineScreen;
