import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../types/navigation";
import { getTodayKeywords } from "../services/newsService";

type TodayKeywordsScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "TodayKeywords"
>;

interface Category {
  category_name: string;
  category_code: string;
  category_percent: number;
  category_count: number;
}

interface Keyword {
  category_name: string;
  category_code: string;
  named_entity: string;
  named_entity_count: number;
  entity_step: string;
  named_entity_type: string;
}

const TodayKeywordsScreen = () => {
  const navigation = useNavigation<TodayKeywordsScreenNavigationProp>();
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [keywords, setKeywords] = useState<Keyword[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("000000000"); // 전체

  useEffect(() => {
    loadTodayKeywords();
  }, []);

  const loadTodayKeywords = async () => {
    try {
      setLoading(true);
      const data = await getTodayKeywords();

      setDate(data.date);
      setCategories(data.categories);
      setKeywords(data.keywords);
    } catch (error) {
      console.error("오늘의 키워드 로드 오류:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString || dateString.length !== 8) return "";
    const year = dateString.substring(0, 4);
    const month = dateString.substring(4, 6);
    const day = dateString.substring(6, 8);
    return `${year}년 ${month}월 ${day}일`;
  };

  const handleKeywordPress = (keyword: string) => {
    navigation.navigate("StoryResult", {
      keyword,
      options: { sortBy: "date" },
    });
  };

  // 선택된 카테고리에 따라 키워드 필터링
  const filteredKeywords = keywords.filter(
    (keyword) =>
      selectedCategory === "000000000" ||
      keyword.category_code === selectedCategory
  );

  // entity_step에 따른 글자 크기 계산
  const getFontSize = (step: string) => {
    switch (step) {
      case "step5":
        return 22;
      case "step4":
        return 20;
      case "step3":
        return 18;
      case "step2":
        return 16;
      case "step1":
      default:
        return 14;
    }
  };

  // 개체 타입에 따른 색상 설정
  const getKeywordColor = (type: string) => {
    switch (type) {
      case "PS":
        return "#E57373"; // 인물: 빨간색 계열
      case "LC":
        return "#4DB6AC"; // 장소: 초록색 계열
      case "OG":
        return "#64B5F6"; // 기관: 파란색 계열
      default:
        return "#9575CD"; // 기타: 보라색 계열
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#176FF2" />
          <Text style={styles.loadingText}>오늘의 키워드를 불러오는 중...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>오늘의 키워드</Text>
        <Text style={styles.headerDate}>{formatDate(date)}</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoryScroll}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category.category_code}
            style={[
              styles.categoryButton,
              selectedCategory === category.category_code &&
                styles.selectedCategory,
            ]}
            onPress={() => setSelectedCategory(category.category_code)}
          >
            <Text
              style={[
                styles.categoryText,
                selectedCategory === category.category_code &&
                  styles.selectedCategoryText,
              ]}
            >
              {category.category_name}
              {category.category_code !== "000000000" &&
                ` (${category.category_percent}%)`}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView style={styles.keywordContainer}>
        <View style={styles.keywordCloud}>
          {filteredKeywords.map((keyword, index) => (
            <TouchableOpacity
              key={`${keyword.named_entity}-${index}`}
              style={[
                styles.keywordBubble,
                {
                  backgroundColor: `${getKeywordColor(
                    keyword.named_entity_type
                  )}22`,
                },
              ]}
              onPress={() => handleKeywordPress(keyword.named_entity)}
            >
              <Text
                style={[
                  styles.keywordText,
                  {
                    fontSize: getFontSize(keyword.entity_step),
                    color: getKeywordColor(keyword.named_entity_type),
                  },
                ]}
              >
                {keyword.named_entity}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <View style={styles.legend}>
        <Text style={styles.legendTitle}>키워드 유형:</Text>
        <View style={styles.legendItems}>
          <View style={styles.legendItem}>
            <View
              style={[styles.legendColor, { backgroundColor: "#E57373" }]}
            />
            <Text style={styles.legendText}>인물</Text>
          </View>
          <View style={styles.legendItem}>
            <View
              style={[styles.legendColor, { backgroundColor: "#4DB6AC" }]}
            />
            <Text style={styles.legendText}>장소</Text>
          </View>
          <View style={styles.legendItem}>
            <View
              style={[styles.legendColor, { backgroundColor: "#64B5F6" }]}
            />
            <Text style={styles.legendText}>기관</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
  header: {
    padding: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#232323",
  },
  headerDate: {
    marginTop: 5,
    fontSize: 14,
    color: "#666",
  },
  categoryScroll: {
    backgroundColor: "#fff",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 6,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
  },
  selectedCategory: {
    backgroundColor: "#176FF2",
  },
  categoryText: {
    color: "#444",
    fontSize: 14,
  },
  selectedCategoryText: {
    color: "#fff",
    fontWeight: "500",
  },
  keywordContainer: {
    flex: 1,
    padding: 20,
  },
  keywordCloud: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
  },
  keywordBubble: {
    margin: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  keywordText: {
    textAlign: "center",
  },
  legend: {
    padding: 16,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  legendTitle: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 8,
  },
  legendItems: {
    flexDirection: "row",
    alignItems: "center",
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  legendText: {
    fontSize: 12,
    color: "#666",
  },
});

export default TodayKeywordsScreen;
