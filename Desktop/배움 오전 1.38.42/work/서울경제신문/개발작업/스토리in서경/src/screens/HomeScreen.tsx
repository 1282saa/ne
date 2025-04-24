import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  Image,
  FlatList,
  Modal,
  Dimensions,
  RefreshControl,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../types/navigation";
import {
  getPopularKeywords,
  getTodayIssues,
  formatDateForAPI,
  IssueItem,
} from "../services/newsService";
import { Calendar, DateData } from "react-native-calendars";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

const { width } = Dimensions.get("window");

// 간단한 날짜 포맷 함수
const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// 추가적인 캐러셀 스타일
const carouselCustomStyles = `
  .react-multi-carousel-list {
    padding-bottom: 20px;
  }
  .custom-dot-list-style {
    margin-top: 16px;
  }
  .custom-dot-list-style button {
    border: none;
    background: #E0E0E0;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    margin: 0 5px;
    padding: 0;
    transition: all 0.3s ease;
  }
  .custom-dot-list-style .react-multi-carousel-dot--active button {
    background: #2E64FE;
    width: 10px;
    height: 10px;
  }
  .carousel-item-padding-40-px {
    padding-bottom: 10px;
  }
`;

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, "Home">;

const HomeScreen = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [searchKeyword, setSearchKeyword] = useState("");
  const [issues, setIssues] = useState<IssueItem[]>([]);
  const [popularKeywords, setPopularKeywords] = useState<string[]>([]);
  const [isIssuesLoading, setIsIssuesLoading] = useState(true);
  const [isKeywordsLoading, setIsKeywordsLoading] = useState(true);

  // 날짜 선택 관련 상태
  const [selectedDate, setSelectedDate] = useState(formatDate(new Date()));
  const [showCalendar, setShowCalendar] = useState(false);
  const [maxDate, setMaxDate] = useState(formatDate(new Date()));
  const [formattedDate, setFormattedDate] = useState<string>("");

  useEffect(() => {
    // 캐러셀 커스텀 스타일 추가
    if (typeof document !== "undefined") {
      const styleElement = document.createElement("style");
      styleElement.innerHTML = carouselCustomStyles;
      document.head.appendChild(styleElement);

      return () => {
        document.head.removeChild(styleElement);
      };
    }

    // 어제 날짜를 기본으로 설정 (오늘 데이터가 없을 수 있으므로)
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = formatDate(yesterday);
    setSelectedDate(yesterdayStr);

    // 날짜 형식화 - 예: 2024년 4월 25일 (목)
    setFormattedDate(formatDisplayDate(yesterday));

    // 최대 선택 가능 날짜를 오늘로 설정
    setMaxDate(formatDate(new Date()));

    loadIssuesByDate(yesterdayStr);
    loadPopularKeywords();
  }, []);

  const loadIssuesByDate = async (date: string) => {
    setIsIssuesLoading(true);
    try {
      const issues = await getTodayIssues(10, date);
      if (issues.length > 0) {
        setIssues(issues);
        console.log(`${date}의 이슈 ${issues.length}개 로드 완료`);
      } else {
        setIssues([]);
        console.log(`${date}의 이슈가 없습니다`);
      }
    } catch (error) {
      console.error("이슈 로딩 오류:", error);
      setIssues([]);
    } finally {
      setIsIssuesLoading(false);
    }
  };

  const loadPopularKeywords = async () => {
    try {
      setIsKeywordsLoading(true);
      const keywords = await getPopularKeywords(6);
      setPopularKeywords(keywords);
    } catch (error) {
      console.error("인기 키워드 로드 오류:", error);
      // 오류 발생 시 기본 키워드 설정
      setPopularKeywords(["경제", "주식", "부동산", "금융", "기업", "국제"]);
    } finally {
      setIsKeywordsLoading(false);
    }
  };

  const handleDateSelect = (date: DateData) => {
    const dateStr = date.dateString;
    setSelectedDate(dateStr);

    // 날짜 객체로 변환 후 포맷팅
    const selectedDateObj = new Date(date.year, date.month - 1, date.day);
    setFormattedDate(formatDisplayDate(selectedDateObj));

    setShowCalendar(false);
    loadIssuesByDate(dateStr);
  };

  const formatDisplayDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const dayOfWeek = ["일", "월", "화", "수", "목", "금", "토"][date.getDay()];
    return `${year}년 ${month}월 ${day}일 (${dayOfWeek})`;
  };

  const handleSearch = () => {
    if (searchKeyword.trim()) {
      navigation.navigate("StoryResult", { keyword: searchKeyword });
    }
  };

  const goToAspenHome = () => {
    navigation.navigate("AspenHome");
  };

  const navigateToIssueTimeline = (issue: IssueItem) => {
    navigation.navigate("IssueTimeline", {
      issue: issue,
      keyword: issue.topic,
    });
  };

  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 3000 },
      items: 1,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 1,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 1,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };

  const renderIssueItem = ({
    item,
    index,
  }: {
    item: IssueItem;
    index: number;
  }) => {
    return (
      <View key={index} style={styles.issueCard}>
        <View style={styles.issueHeader}>
          <Text style={styles.issueTitle}>{item.topic}</Text>

          <View style={styles.rankContainer}>
            <View style={styles.rankBadge}>
              <Text style={styles.rankText}>중요도 {item.topicRank}</Text>
            </View>
          </View>
        </View>

        <View style={styles.keywordsContainer}>
          {item.keywords.slice(0, 6).map((keyword, idx) => (
            <Text key={idx} style={styles.keywordBadge}>
              {keyword}
            </Text>
          ))}
        </View>

        <View style={styles.contentContainer}>
          <Text style={styles.issueContent}>{item.content}</Text>
        </View>

        <TouchableOpacity
          style={styles.readMoreButton}
          onPress={() => navigateToIssueTimeline(item)}
        >
          <Text style={styles.readMoreText}>자세히 보기</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text
            style={[
              styles.title,
              { fontFamily: undefined, fontWeight: "bold" },
            ]}
          >
            스토리 in 서울경제
          </Text>
          <Text style={[styles.subtitle, { fontFamily: undefined }]}>
            당신이 궁금한 모든 이야기
          </Text>
        </View>

        <View style={styles.searchContainer}>
          <TextInput
            style={[styles.searchInput, { fontFamily: undefined }]}
            placeholder="키워드를 입력하세요"
            value={searchKeyword}
            onChangeText={setSearchKeyword}
            onSubmitEditing={handleSearch}
          />
          <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
            <Text
              style={[
                styles.searchButtonText,
                { fontFamily: undefined, fontWeight: "bold" },
              ]}
            >
              검색
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.recommendContainer}>
          <View style={styles.sectionHeader}>
            <Text
              style={[
                styles.recommendTitle,
                { fontFamily: undefined, fontWeight: "600" },
              ]}
            >
              인기 검색어
            </Text>
            <TouchableOpacity
              style={styles.viewMoreButton}
              onPress={() => {
                // TodayKeywords 화면이 없으므로 알림창으로 대체
                alert("인기 키워드 기능을 준비 중입니다.");
                // 또는 존재하는 다른 화면으로 이동하도록 변경 가능
                // navigation.navigate("Home");
              }}
            >
              <Text style={styles.viewMoreText}>키워드 더보기</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.keywordContainer}>
            {isKeywordsLoading ? (
              <ActivityIndicator size="small" color="#176FF2" />
            ) : (
              popularKeywords.map((keyword, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.keywordButton}
                  onPress={() => {
                    setSearchKeyword(keyword);
                    navigation.navigate("StoryResult", {
                      keyword,
                      options: {
                        sortBy: "date", // 최신순 정렬
                      },
                    });
                  }}
                >
                  <Text style={[styles.keywordText, { fontFamily: undefined }]}>
                    {keyword}
                  </Text>
                </TouchableOpacity>
              ))
            )}
          </View>
        </View>

        <View style={styles.todayIssueContainer}>
          <View style={styles.sectionHeader}>
            <Text
              style={[
                styles.todayIssueTitle,
                { fontFamily: undefined, fontWeight: "600" },
              ]}
            >
              오늘의 이슈
            </Text>
            <TouchableOpacity
              style={styles.refreshButton}
              onPress={() => loadIssuesByDate(selectedDate)}
            >
              <Text style={styles.refreshText}>새로고침</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.dateSelector}
            onPress={() => setShowCalendar(true)}
          >
            <Text style={styles.dateText}>{formattedDate}</Text>
            <Text style={styles.dateChangeText}>날짜 변경</Text>
          </TouchableOpacity>

          {isIssuesLoading ? (
            <View style={styles.loaderContainer}>
              <ActivityIndicator
                size="large"
                color="#176FF2"
                style={styles.loader}
              />
              <Text style={styles.loaderText}>이슈를 불러오는 중...</Text>
            </View>
          ) : issues.length > 0 ? (
            <View style={styles.carouselContainer}>
              <Carousel
                responsive={responsive}
                swipeable={true}
                draggable={true}
                showDots={true}
                infinite={true}
                autoPlay={true}
                autoPlaySpeed={7000}
                keyBoardControl={true}
                customTransition="all .5s"
                transitionDuration={500}
                containerClass="carousel-container"
                removeArrowOnDeviceType={["tablet", "mobile"]}
                dotListClass="custom-dot-list-style"
                itemClass="carousel-item-padding-40-px"
              >
                {issues.map((item, index) => renderIssueItem({ item, index }))}
              </Carousel>
            </View>
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.noIssuesText}>이슈가 없습니다.</Text>
              <Text style={styles.noIssuesSubText}>
                {selectedDate === formatDate(new Date())
                  ? "오늘의 이슈 데이터가 아직 준비되지 않았습니다."
                  : "다른 날짜를 선택해보세요. (예: 2025-04-24)"}
              </Text>
              <View style={styles.emptyActionContainer}>
                <TouchableOpacity
                  style={styles.tryAgainButton}
                  onPress={() => loadIssuesByDate(selectedDate)}
                >
                  <Text style={styles.tryAgainText}>다시 시도하기</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.tryAgainButton,
                    { backgroundColor: "#E8F0FE", marginLeft: 10 },
                  ]}
                  onPress={() => setShowCalendar(true)}
                >
                  <Text style={[styles.tryAgainText, { color: "#176FF2" }]}>
                    날짜 변경
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>

        <View style={styles.featuredContainer}>
          <Text
            style={[
              styles.featuredTitle,
              { fontFamily: undefined, fontWeight: "600" },
            ]}
          >
            추천 콘텐츠
          </Text>
          <TouchableOpacity style={styles.featuredCard} onPress={goToAspenHome}>
            <View style={styles.cardContent}>
              <Text
                style={[
                  styles.cardTitle,
                  { fontFamily: undefined, fontWeight: "600" },
                ]}
              >
                Anima로 디자인된 샘플 화면으로 이동
              </Text>
              <Text style={[styles.cardDescription, { fontFamily: undefined }]}>
                Anima에서 변환된 디자인 샘플을 확인해보세요
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Modal
        visible={showCalendar}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowCalendar(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.calendarContainer}>
            <View style={styles.calendarHeader}>
              <Text style={styles.calendarTitle}>날짜 선택</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowCalendar(false)}
              >
                <Text style={styles.closeButtonText}>닫기</Text>
              </TouchableOpacity>
            </View>
            <Calendar
              current={selectedDate}
              minDate="2019-01-01"
              maxDate={maxDate}
              onDayPress={handleDateSelect}
              monthFormat={"yyyy년 MM월"}
              hideExtraDays={true}
              markedDates={{
                [selectedDate]: { selected: true, selectedColor: "#176FF2" },
              }}
              theme={{
                selectedDayBackgroundColor: "#176FF2",
                todayTextColor: "#176FF2",
                arrowColor: "#176FF2",
                textDayFontWeight: "400",
                textMonthFontWeight: "bold",
                textDayHeaderFontWeight: "400",
              }}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  header: {
    padding: 20,
    alignItems: "center",
  },
  title: {
    fontFamily: "Montserrat-Bold",
    fontSize: 24,
    marginBottom: 8,
    color: "#176FF2",
  },
  subtitle: {
    fontFamily: "CircularXX-Medium",
    fontSize: 16,
    color: "#5F5F5F",
  },
  searchContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    height: 50,
    backgroundColor: "#ffffff",
    borderRadius: 8,
    paddingHorizontal: 15,
    marginRight: 10,
    fontFamily: "CircularXX-Regular",
    borderWidth: 1,
    borderColor: "#eaeaea",
  },
  searchButton: {
    backgroundColor: "#176FF2",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  searchButtonText: {
    color: "#ffffff",
    fontFamily: "CircularXX-Bold",
    fontSize: 16,
  },
  recommendContainer: {
    padding: 20,
    paddingTop: 0,
  },
  recommendTitle: {
    fontFamily: "Montserrat-SemiBold",
    fontSize: 18,
    marginBottom: 15,
    color: "#232323",
  },
  keywordContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  keywordButton: {
    backgroundColor: "rgba(23,111,242,0.1)",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
  },
  keywordText: {
    fontFamily: "CircularXX-Regular",
    color: "#176FF2",
  },
  todayIssueContainer: {
    padding: 20,
    paddingTop: 0,
  },
  todayIssueTitle: {
    fontFamily: "Montserrat-SemiBold",
    fontSize: 18,
    marginBottom: 15,
    color: "#232323",
  },
  dateSelector: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#eaeaea",
  },
  dateText: {
    fontSize: 15,
    color: "#333",
    fontWeight: "500",
  },
  dateChangeText: {
    fontSize: 14,
    color: "#176FF2",
  },
  loaderContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 30,
  },
  loader: {
    marginVertical: 20,
  },
  loaderText: {
    marginTop: 10,
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
  issueList: {
    marginBottom: 10,
  },
  issueCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    marginHorizontal: 10,
    marginBottom: 15,
    padding: 20,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    minHeight: 300,
  },
  issueHeader: {
    marginBottom: 16,
  },
  issueTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#232323",
    lineHeight: 24,
  },
  contentContainer: {
    flex: 1,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    paddingTop: 16,
    marginTop: 8,
  },
  issueDescription: {
    fontSize: 14,
    color: "#5F5F5F",
    marginBottom: 5,
  },
  issueDate: {
    fontSize: 12,
    color: "#888",
  },
  emptyContainer: {
    padding: 30,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    marginVertical: 10,
  },
  noIssuesText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#555",
    marginBottom: 8,
    textAlign: "center",
  },
  noIssuesSubText: {
    fontSize: 14,
    color: "#888",
    textAlign: "center",
    marginBottom: 16,
  },
  tryAgainButton: {
    backgroundColor: "#f0f0f0",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  tryAgainText: {
    color: "#555",
    fontSize: 14,
  },
  featuredContainer: {
    padding: 20,
    paddingTop: 0,
  },
  featuredTitle: {
    fontFamily: "Montserrat-SemiBold",
    fontSize: 18,
    marginBottom: 15,
    color: "#232323",
  },
  featuredCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 15,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardContent: {
    padding: 15,
  },
  cardTitle: {
    fontFamily: "Montserrat-SemiBold",
    fontSize: 16,
    marginBottom: 8,
    color: "#232323",
  },
  cardDescription: {
    fontFamily: "CircularXX-Regular",
    fontSize: 14,
    color: "#5F5F5F",
    lineHeight: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  viewMoreButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  viewMoreText: {
    color: "#176FF2",
    fontSize: 14,
  },
  refreshButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  refreshText: {
    color: "#176FF2",
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  calendarContainer: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  calendarHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  calendarTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  closeButton: {
    padding: 4,
  },
  closeButtonText: {
    color: "#666",
    fontSize: 16,
  },
  carouselContainer: {
    paddingVertical: 20,
    backgroundColor: "#f8f9fa",
    borderRadius: 16,
    marginTop: 10,
    marginBottom: 20,
  },
  rankContainer: {
    flexDirection: "row",
    marginBottom: 16,
  },
  rankBadge: {
    backgroundColor: "#2E64FE",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  rankText: {
    fontSize: 14,
    color: "#ffffff",
    fontWeight: "600",
  },
  issueContent: {
    fontSize: 15,
    color: "#333",
    lineHeight: 22,
    marginTop: 16,
  },
  keywordsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 8,
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
  emptyActionContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  readMoreButton: {
    backgroundColor: "#176FF2",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
  },
  readMoreText: {
    color: "#fff",
    fontWeight: "600",
  },
});

export default HomeScreen;
