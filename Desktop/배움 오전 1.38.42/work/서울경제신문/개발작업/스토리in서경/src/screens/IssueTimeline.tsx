import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  Linking,
} from "react-native";
import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../types/navigation";
import {
  searchNewsByKeyword,
  IssueItem,
  NewsItem,
  getSeoulEconomicNews,
  getProviderFromNewsId,
  searchNewsByKeywordsForTimeline,
  formatDateForAPI,
  getNewsDetailsByIds,
} from "../services/newsService";

type IssueTimelineRouteProp = RouteProp<RootStackParamList, "IssueTimeline">;
type IssueTimelineNavigationProp = StackNavigationProp<
  RootStackParamList,
  "IssueTimeline"
>;

type Props = {
  route: IssueTimelineRouteProp;
  navigation: IssueTimelineNavigationProp;
};

// 언론사별 뉴스 통계를 저장하는 타입 정의
interface ProviderStat {
  name: string;
  count: number;
  code: string;
}

const IssueTimeline = ({ route, navigation }: Props) => {
  const { issue, keyword } = route.params;
  const [seoulEconomicNews, setSeoulEconomicNews] = useState<NewsItem[]>([]);
  const [providerStats, setProviderStats] = useState<ProviderStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [timelineNews, setTimelineNews] = useState<Record<string, NewsItem[]>>(
    {}
  );
  const [timelineLoading, setTimelineLoading] = useState(false);
  const [showTimeline, setShowTimeline] = useState(false);

  useEffect(() => {
    fetchProviderStats(); // 언론사별 통계 데이터 가져오기
    fetchSeoulEconomicNews(); // 서울경제 기사만 따로 가져오기
  }, [issue]);

  // 언론사별 통계 데이터만 가져오는 함수
  const fetchProviderStats = async () => {
    try {
      setStatsLoading(true);

      const newsClusterIds = issue.newsClusterIds || [];
      if (newsClusterIds.length > 0) {
        // 뉴스 ID로부터 언론사 코드 추출
        const providerCounts: Record<string, number> = {};

        // 각 뉴스 ID에서 언론사 코드 추출 (예: "02100311")
        newsClusterIds.forEach((id) => {
          const providerCode = id.substring(0, 8);
          const providerName = getProviderFromNewsId(providerCode);
          providerCounts[providerName] =
            (providerCounts[providerName] || 0) + 1;
        });

        // 통계 변환 및 정렬
        const stats: ProviderStat[] = Object.entries(providerCounts)
          .map(([name, count]) => ({
            name,
            count,
            code: name === "서울경제" ? "02100311" : "",
          }))
          .sort((a, b) => b.count - a.count);

        setProviderStats(stats);
      } else {
        setProviderStats([]);
      }
    } catch (error) {
      console.error("언론사 통계 로딩 오류:", error);
      setProviderStats([]);
    } finally {
      setStatsLoading(false);
    }
  };

  // 서울경제 기사만 가져오는 함수
  const fetchSeoulEconomicNews = async () => {
    try {
      setLoading(true);

      const newsClusterIds = issue.newsClusterIds || [];
      // 서울경제 뉴스 ID 추출 (02100311로 시작하는 ID)
      const seoulEconomicIds = newsClusterIds.filter((id) =>
        id.startsWith("02100311")
      );

      console.log("서울경제 뉴스 ID 개수:", seoulEconomicIds.length);

      if (seoulEconomicIds.length > 0) {
        // 서울경제 API 호출 (searchNewsByKeyword 대신 getNewsDetailsByIds 사용)
        const seoulNews = await getNewsDetailsByIds(seoulEconomicIds);
        console.log("서울경제 뉴스 응답:", seoulNews.length);
        setSeoulEconomicNews(seoulNews);
      } else {
        setSeoulEconomicNews([]);
      }
    } catch (error) {
      console.error("서울경제 뉴스 로딩 오류:", error);
      setSeoulEconomicNews([]);
    } finally {
      setLoading(false);
    }
  };

  // 이슈 흐름을 위한 뉴스 조회
  const fetchNewsTimeline = async () => {
    try {
      setTimelineLoading(true);

      // 이슈의 주요 키워드 가져오기 (최대 5개)
      let keywordsToSearch = issue.keywords?.slice(0, 5) || [];
      if (keywordsToSearch.length === 0) {
        // 이슈 제목에서 키워드 추출 시도
        if (issue.topic) {
          const topicWords = issue.topic
            .split(/\s+/)
            .filter((word) => word.length >= 2);
          if (topicWords.length > 0) {
            keywordsToSearch = topicWords.slice(0, 3);
            console.log("이슈 제목에서 추출한 키워드:", keywordsToSearch);
          }
        }

        if (keywordsToSearch.length === 0) {
          console.log("이슈 흐름 분석을 위한 키워드가 없습니다.");
          setTimelineLoading(false);
          return;
        }
      }

      console.log("이슈 키워드:", keywordsToSearch);

      // 현재 날짜
      const today = new Date();

      // 1개월 전 날짜 (범위를 넓힘)
      const oneMonthAgo = new Date(today);
      oneMonthAgo.setMonth(today.getMonth() - 1);

      // API 형식의 날짜 문자열로 변환
      const fromDate = formatDateForAPI(oneMonthAgo, false);
      const untilDate = formatDateForAPI(today, false);

      console.log(`이슈 흐름 분석 날짜 범위: ${fromDate} ~ ${untilDate}`);
      console.log(`검색 키워드: ${keywordsToSearch.join(", ")}`);

      // 타임라인 뉴스 검색
      try {
        const timelineResult = await searchNewsByKeywordsForTimeline(
          keywordsToSearch,
          fromDate,
          untilDate,
          100 // 최대 100개 기사로 증가
        );

        console.log(
          "타임라인 결과:",
          Object.keys(timelineResult).length,
          "일자"
        );

        if (Object.keys(timelineResult).length > 0) {
          console.log(
            "첫 번째 날짜의 기사 수:",
            Object.values(timelineResult)[0].length
          );
        } else {
          console.log("타임라인 결과가 비어있습니다");
        }

        setTimelineNews(timelineResult);
        setShowTimeline(true);
      } catch (searchError) {
        console.error("타임라인 검색 중 오류:", searchError);
      }
    } catch (error) {
      console.error("이슈 흐름 분석 중 오류 발생:", error);
    } finally {
      setTimelineLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "";

    try {
      const date = new Date(dateString);

      // 유효한 날짜인지 확인
      if (isNaN(date.getTime())) {
        return dateString;
      }

      // YYYY-MM-DD HH:MM 형식으로 변환
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");

      return `${year}-${month}-${day} ${hours}:${minutes}`;
    } catch (e) {
      console.error("날짜 변환 중 오류:", e);
      return dateString;
    }
  };

  const openNewsLink = (url: string) => {
    Linking.canOpenURL(url).then((supported) => {
      if (supported) {
        Linking.openURL(url);
      } else {
        console.log("Cannot open URL: " + url);
      }
    });
  };

  // 이슈 순위 텍스트를 가져오는 함수 추가
  const getIssueRank = (rank: number) => {
    if (rank <= 10) return "1위";
    if (rank <= 20) return "2위";
    if (rank <= 30) return "3위";
    if (rank <= 50) return "4위";
    if (rank <= 70) return "5위";
    return "주요";
  };

  // 날짜에 요일을 추가하는 함수
  const formatDateWithDay = (dateString: string) => {
    if (!dateString) return "";

    const date = new Date(dateString);
    const days = ["일", "월", "화", "수", "목", "금", "토"];
    const dayOfWeek = days[date.getDay()];

    return `${dateString} (${dayOfWeek})`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>← 뒤로</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>이슈 상세정보</Text>
        </View>

        {/* 이슈 정보 */}
        <View style={styles.issueContainer}>
          <View style={styles.issueRankContainer}>
            <Text style={styles.issueRankText}>
              🏆 {getIssueRank(issue.topicRank)} 이슈
            </Text>
          </View>

          <Text style={styles.issueTitle}>{issue.topic}</Text>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>📌 중요도 점수:</Text>
            <Text style={styles.infoValue}>{issue.topicRank}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>🔑 주요 키워드:</Text>
            <View style={styles.keywordsContainer}>
              {issue.keywords?.map((keyword, idx) => (
                <Text key={idx} style={styles.keywordBadge}>
                  {keyword}
                </Text>
              ))}
            </View>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>📰 관련 기사 수:</Text>
            <Text style={styles.infoValue}>
              {(issue.newsClusterIds || []).length}개
            </Text>
          </View>

          <View style={styles.divider} />

          <Text style={styles.issueContent}>{issue.content}</Text>
        </View>

        {/* 관련 기사 통계 */}
        <View style={styles.statsContainer}>
          <Text style={styles.sectionTitle}>📊 언론사별 기사 수</Text>

          {statsLoading ? (
            <ActivityIndicator size="small" color="#176FF2" />
          ) : (
            <>
              <Text style={styles.statsSummary}>
                총{" "}
                <Text style={styles.highlight}>
                  {(issue.newsClusterIds || []).length}개
                </Text>
                의 관련 기사가 발견되었습니다
              </Text>

              <View style={styles.providerList}>
                {providerStats.slice(0, 10).map((stat, idx) => (
                  <View key={idx} style={styles.providerItem}>
                    <Text style={styles.providerRank}>{idx + 1}</Text>
                    <Text style={styles.providerName}>{stat.name}:</Text>
                    <Text style={styles.providerCount}>{stat.count}개</Text>
                  </View>
                ))}
              </View>

              {providerStats.length > 10 && (
                <Text style={styles.statsMore}>
                  ... 외 {providerStats.length - 10}개 언론사
                </Text>
              )}
            </>
          )}
        </View>

        {/* 서울경제 이야기 */}
        <View style={styles.seContainer}>
          <Text style={styles.sectionTitle}>[서울경제 기사]</Text>

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#176FF2" />
              <Text style={styles.loadingText}>
                서울경제 뉴스를 로딩 중입니다...
              </Text>
            </View>
          ) : seoulEconomicNews.length > 0 ? (
            <View style={styles.seNewsContainer}>
              {seoulEconomicNews.map((newsItem, index) => (
                <View key={index} style={styles.seNewsItem}>
                  <Text style={styles.seNewsTitle}>
                    {index + 1}. {newsItem.title}
                  </Text>
                  <Text style={styles.seNewsTime}>
                    시간: {formatDate(newsItem.date)}
                  </Text>
                  <TouchableOpacity onPress={() => openNewsLink(newsItem.url)}>
                    <Text style={styles.seNewsLink}>링크: {newsItem.url}</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                서울경제 관련 뉴스가 없습니다.
              </Text>
            </View>
          )}
        </View>

        {/* 이슈 흐름 분석 */}
        <View style={styles.timelineContainer}>
          <Text style={styles.sectionTitle}>📈 이슈 흐름</Text>
          <Text style={styles.timelineDescription}>
            최근 1개월간 "{issue.keywords?.slice(0, 5).join(", ")}" 등 키워드로
            보도된 뉴스 흐름을 확인할 수 있습니다.
          </Text>

          {/* 키워드 표시 */}
          {issue.keywords && issue.keywords.length > 0 && (
            <View style={styles.timelineKeywords}>
              {issue.keywords.slice(0, 5).map((keyword, idx) => (
                <View key={idx} style={styles.timelineKeywordBadge}>
                  <Text style={styles.timelineKeywordText}>{keyword}</Text>
                </View>
              ))}
            </View>
          )}

          {/* 타임라인 로드 버튼 */}
          {!showTimeline && !timelineLoading && (
            <TouchableOpacity
              style={styles.loadTimelineButton}
              onPress={fetchNewsTimeline}
            >
              <Text style={styles.loadTimelineButtonText}>
                이슈 흐름 분석 시작하기
              </Text>
            </TouchableOpacity>
          )}

          {/* 로딩 표시 */}
          {timelineLoading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#176FF2" />
              <Text style={styles.loadingText}>
                이슈 흐름을 분석 중입니다...
              </Text>
            </View>
          )}

          {/* 타임라인 결과 */}
          {showTimeline && !timelineLoading && (
            <View style={styles.timelineResultsContainer}>
              {Object.keys(timelineNews).length > 0 ? (
                Object.entries(timelineNews).map(
                  ([date, newsItems], dateIndex) => (
                    <View key={dateIndex} style={styles.timelineDateGroup}>
                      <View style={styles.timelineDateHeader}>
                        <Text style={styles.timelineDateText}>
                          📅 {formatDateWithDay(date)}
                        </Text>
                        <Text style={styles.timelineCountBadge}>
                          {newsItems.length}건
                        </Text>
                      </View>

                      {newsItems.map((item, idx) => (
                        <View key={idx} style={styles.timelineNewsItem}>
                          <View style={styles.timelineNewsHeader}>
                            <Text style={styles.timelineNewsSource}>
                              {item.provider}
                            </Text>
                          </View>
                          <TouchableOpacity
                            onPress={() => openNewsLink(item.url)}
                          >
                            <Text style={styles.timelineNewsTitle}>
                              {item.title}
                            </Text>
                            <Text style={styles.timelineNewsContent}>
                              {item.description}
                            </Text>
                          </TouchableOpacity>
                        </View>
                      ))}
                    </View>
                  )
                )
              ) : (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>
                    관련 이슈 흐름 정보가 없습니다.
                  </Text>
                  <Text style={styles.emptySubText}>
                    선택한 이슈와 연관된 뉴스 기사가 발견되지 않았습니다. 다른
                    이슈를 선택하거나 나중에 다시 시도해 보세요.
                  </Text>
                  <TouchableOpacity
                    style={[styles.loadTimelineButton, { marginTop: 16 }]}
                    onPress={fetchNewsTimeline}
                  >
                    <Text style={styles.loadTimelineButtonText}>
                      다시 시도하기
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eaeaea",
    backgroundColor: "#fff",
  },
  backButton: {
    marginRight: 16,
  },
  backButtonText: {
    color: "#176FF2",
    fontSize: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#232323",
  },
  issueContainer: {
    backgroundColor: "#fff",
    padding: 20,
    margin: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  issueRankContainer: {
    backgroundColor: "#FFD700",
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 16,
    marginBottom: 12,
  },
  issueRankText: {
    fontWeight: "bold",
    color: "#333",
    fontSize: 16,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  infoLabel: {
    fontWeight: "600",
    fontSize: 15,
    color: "#444",
    minWidth: 110,
    marginRight: 10,
  },
  infoValue: {
    fontSize: 15,
    color: "#333",
    flex: 1,
  },
  divider: {
    height: 1,
    backgroundColor: "#e0e0e0",
    marginVertical: 16,
  },
  issueTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#232323",
    marginBottom: 16,
    lineHeight: 28,
  },
  keywordsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 16,
  },
  keywordBadge: {
    backgroundColor: "#E8F0FE",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
    fontSize: 13,
    color: "#176FF2",
    fontWeight: "500",
  },
  issueContent: {
    fontSize: 16,
    color: "#333",
    lineHeight: 24,
  },
  statsContainer: {
    backgroundColor: "#fff",
    padding: 20,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#232323",
    marginBottom: 16,
  },
  statsSummary: {
    fontSize: 16,
    color: "#333",
    marginBottom: 16,
  },
  highlight: {
    color: "#176FF2",
    fontWeight: "700",
  },
  providerList: {
    marginTop: 10,
  },
  providerItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    paddingVertical: 5,
  },
  providerRank: {
    width: 24,
    height: 24,
    backgroundColor: "#176FF2",
    borderRadius: 12,
    color: "white",
    textAlign: "center",
    lineHeight: 24,
    fontSize: 12,
    fontWeight: "bold",
    marginRight: 10,
  },
  providerName: {
    fontSize: 14,
    color: "#333",
    width: 100,
    marginRight: 5,
  },
  providerCount: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#176FF2",
  },
  statsMore: {
    fontSize: 13,
    color: "#888",
    textAlign: "right",
    marginTop: 8,
  },
  seContainer: {
    backgroundColor: "#fff",
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  loadingContainer: {
    padding: 20,
    alignItems: "center",
  },
  loadingText: {
    marginTop: 8,
    color: "#666",
  },
  seNewsContainer: {
    marginTop: 8,
  },
  seNewsItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eaeaea",
  },
  seNewsTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 6,
  },
  seNewsTime: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  seNewsLink: {
    fontSize: 14,
    color: "#176FF2",
    textDecorationLine: "underline",
  },
  emptyContainer: {
    padding: 20,
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 8,
  },
  emptyText: {
    color: "#888",
    fontSize: 16,
  },
  // 이슈 흐름 관련 스타일
  timelineContainer: {
    backgroundColor: "#fff",
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  timelineDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 16,
    lineHeight: 20,
  },
  loadTimelineButton: {
    backgroundColor: "#176FF2",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 10,
  },
  loadTimelineButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  timelineResultsContainer: {
    marginTop: 10,
  },
  timelineDateGroup: {
    marginBottom: 20,
  },
  timelineDateHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f4f7fc",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  timelineDateText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  timelineCountBadge: {
    backgroundColor: "#176FF2",
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  timelineNewsItem: {
    backgroundColor: "white",
    borderRadius: 8,
    marginBottom: 10,
    padding: 12,
    borderLeftWidth: 3,
    borderLeftColor: "#176FF2",
  },
  timelineNewsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  timelineNewsSource: {
    fontSize: 12,
    color: "#176FF2",
    fontWeight: "500",
  },
  timelineNewsTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 6,
    lineHeight: 20,
  },
  timelineNewsContent: {
    fontSize: 13,
    color: "#666",
    lineHeight: 18,
  },
  timelineKeywords: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 16,
  },
  timelineKeywordBadge: {
    backgroundColor: "#E8F0FE",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
    fontSize: 13,
    color: "#176FF2",
    fontWeight: "500",
  },
  timelineKeywordText: {
    fontSize: 13,
    color: "#176FF2",
    fontWeight: "500",
  },
  emptySubText: {
    color: "#888",
    fontSize: 14,
    marginBottom: 16,
  },
});

export default IssueTimeline;
