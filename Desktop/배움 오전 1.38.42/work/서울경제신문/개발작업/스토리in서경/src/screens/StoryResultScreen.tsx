import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  Share,
  SafeAreaView,
  ScrollView,
  Dimensions,
} from "react-native";
import { RouteProp, useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../types/navigation";
import { Ionicons } from "@expo/vector-icons";
import { searchNewsByKeyword } from "../services/newsService";

type StoryResultScreenRouteProp = RouteProp<RootStackParamList, "StoryResult">;
type StoryResultScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "StoryResult"
>;

type Props = {
  route: StoryResultScreenRouteProp;
};

// 기사 아이템 타입 정의
interface StoryNewsItem {
  id: string;
  title: string;
  date: string;
  summary: string;
  context: string;
  link: string;
}

// 화면 너비 계산
const SCREEN_WIDTH = Dimensions.get("window").width;

const StoryResultScreen: React.FC<Props> = ({ route }) => {
  const { keyword, options } = route.params;
  const navigation = useNavigation<StoryResultScreenNavigationProp>();

  const [loading, setLoading] = useState(true);
  const [newsStory, setNewsStory] = useState<StoryNewsItem[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // 실제 API 호출로 뉴스 데이터 가져오기
  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        setError(null);

        // API 호출로 뉴스 데이터 가져오기
        const newsData = await searchNewsByKeyword(keyword);

        if (newsData.length === 0) {
          setError("검색 결과가 없습니다. 다른 키워드로 검색해보세요.");
        } else {
          // NewsItem을 StoryNewsItem으로 변환
          const storyNews: StoryNewsItem[] = newsData.map((item) => ({
            id: item.id,
            title: item.title,
            date: item.date,
            summary: item.description,
            context: `${item.title}에 관한 더 많은 내용은 원문을 참고하세요.`,
            link: item.url,
          }));
          setNewsStory(storyNews);
        }
      } catch (error) {
        console.error("뉴스 검색 오류:", error);
        setError("뉴스를 검색하는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [keyword]);

  // 뉴스 상세 화면으로 이동
  const handleNewsPress = (item: StoryNewsItem) => {
    navigation.navigate("NewsDetail", {
      url: item.link,
      title: item.title,
      id: item.id,
    });
  };

  // 공유 기능
  const shareStory = async () => {
    try {
      const currentNews = newsStory[activeIndex];
      await Share.share({
        message: `${currentNews.title}\n\n${currentNews.summary}\n\n${currentNews.link}`,
        title: `스토리 in 서울경제: ${keyword}`,
      });
    } catch (error) {
      console.error("공유하는데 실패했습니다:", error);
    }
  };

  // 페이지 변경 처리
  const handleScroll = (event: any) => {
    const contentOffset = event.nativeEvent.contentOffset;
    const pageIndex = Math.round(contentOffset.x / SCREEN_WIDTH);
    if (pageIndex !== activeIndex) {
      setActiveIndex(pageIndex);
    }
  };

  // 로딩 중 표시
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#176FF2" />
        <Text style={[styles.loadingText, { fontFamily: undefined }]}>
          스토리를 만들고 있습니다...
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        style={styles.scrollView}
      >
        {newsStory.map((item, index) => (
          <View
            key={item.id}
            style={[styles.cardContainer, { width: SCREEN_WIDTH }]}
          >
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={[styles.cardDate, { fontFamily: undefined }]}>
                  {item.date}
                </Text>
                <Text
                  style={[
                    styles.cardNumber,
                    { fontFamily: undefined, fontWeight: "bold" },
                  ]}
                >
                  {index + 1}/{newsStory.length}
                </Text>
              </View>

              <Text
                style={[
                  styles.cardTitle,
                  { fontFamily: undefined, fontWeight: "bold" },
                ]}
              >
                {item.title}
              </Text>

              <View style={styles.divider} />

              <Text
                style={[
                  styles.summaryTitle,
                  { fontFamily: undefined, fontWeight: "bold" },
                ]}
              >
                요약
              </Text>
              <Text style={[styles.summaryText, { fontFamily: undefined }]}>
                {item.summary}
              </Text>

              <Text
                style={[
                  styles.contextTitle,
                  { fontFamily: undefined, fontWeight: "bold" },
                ]}
              >
                맥락
              </Text>
              <Text
                style={[
                  styles.contextText,
                  { fontFamily: undefined, fontStyle: "italic" },
                ]}
              >
                {item.context}
              </Text>

              <View style={styles.cardFooter}>
                <TouchableOpacity
                  style={styles.cardButton}
                  onPress={() => handleNewsPress(item)}
                >
                  <Text
                    style={[
                      styles.cardButtonText,
                      { fontFamily: undefined, fontWeight: "bold" },
                    ]}
                  >
                    자세히 보기
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.shareButton}
                  onPress={shareStory}
                >
                  <Ionicons name="share-outline" size={24} color="#176FF2" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* 페이지 인디케이터 */}
      <View style={styles.pageIndicatorContainer}>
        {newsStory.map((_, index) => (
          <View
            key={index}
            style={[
              styles.pageIndicator,
              index === activeIndex && styles.activePageIndicator,
            ]}
          />
        ))}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
    fontFamily: "CircularXX-Medium",
  },
  scrollView: {
    flex: 1,
  },
  cardContainer: {
    padding: 15,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    minHeight: 400,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  cardDate: {
    color: "#666",
    fontSize: 14,
    fontFamily: "CircularXX-Regular",
  },
  cardNumber: {
    color: "#176FF2",
    fontSize: 14,
    fontWeight: "bold",
    fontFamily: "CircularXX-Bold",
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    lineHeight: 28,
    fontFamily: "Montserrat-Bold",
  },
  divider: {
    height: 1,
    backgroundColor: "#eee",
    marginVertical: 16,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
    fontFamily: "Montserrat-SemiBold",
  },
  summaryText: {
    fontSize: 16,
    color: "#333",
    lineHeight: 24,
    marginBottom: 16,
    fontFamily: "CircularXX-Regular",
  },
  contextTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#176FF2",
    marginBottom: 8,
    fontFamily: "Montserrat-SemiBold",
  },
  contextText: {
    fontSize: 16,
    color: "#666",
    lineHeight: 24,
    marginBottom: 16,
    fontStyle: "italic",
    fontFamily: "CircularXX-Regular",
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "auto",
  },
  cardButton: {
    backgroundColor: "#176FF2",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  cardButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontFamily: "CircularXX-Bold",
  },
  shareButton: {
    padding: 8,
  },
  pageIndicatorContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
  },
  pageIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ccc",
    marginHorizontal: 4,
  },
  activePageIndicator: {
    backgroundColor: "#176FF2",
    width: 12,
    height: 12,
    borderRadius: 6,
  },
});

export default StoryResultScreen;
