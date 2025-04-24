import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  Image,
} from "react-native";
import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../types/navigation";
import {
  getNewsDetail,
  NewsDetail as NewsDetailType,
} from "../services/newsService";

type NewsDetailRouteProp = RouteProp<RootStackParamList, "NewsDetail">;
type NewsDetailNavigationProp = StackNavigationProp<
  RootStackParamList,
  "NewsDetail"
>;

type Props = {
  route: NewsDetailRouteProp;
  navigation: NewsDetailNavigationProp;
};

const NewsDetail = ({ route, navigation }: Props) => {
  const { id, title, url } = route.params;
  const [newsDetail, setNewsDetail] = useState<NewsDetailType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNewsDetail = async () => {
      try {
        setLoading(true);
        const detail = await getNewsDetail(id);
        setNewsDetail(detail);
        setError(null);
      } catch (error) {
        console.error("뉴스 상세 정보 로딩 오류:", error);
        setError("뉴스 정보를 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchNewsDetail();
  }, [id]);

  const formatDate = (dateString: string) => {
    if (!dateString) return "";

    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}.${month}.${day}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← 뒤로</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>뉴스 상세</Text>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#176FF2" />
          <Text style={styles.loadingText}>뉴스를 불러오는 중...</Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => getNewsDetail(id)}
          >
            <Text style={styles.retryButtonText}>다시 시도</Text>
          </TouchableOpacity>
        </View>
      ) : newsDetail ? (
        <ScrollView style={styles.content}>
          <View style={styles.articleContainer}>
            <Text style={styles.articleTitle}>{newsDetail.title}</Text>

            <View style={styles.metaContainer}>
              <Text style={styles.sourceText}>{newsDetail.source}</Text>
              <Text style={styles.dateText}>{formatDate(newsDetail.date)}</Text>
            </View>

            {newsDetail.imageUrl && (
              <Image
                source={{ uri: newsDetail.imageUrl }}
                style={styles.articleImage}
                resizeMode="cover"
              />
            )}

            <Text style={styles.articleContent}>{newsDetail.content}</Text>

            {newsDetail.author && (
              <Text style={styles.authorText}>기자: {newsDetail.author}</Text>
            )}

            {newsDetail.category && newsDetail.category.length > 0 && (
              <View style={styles.categoryContainer}>
                <Text style={styles.categoryLabel}>카테고리:</Text>
                <View style={styles.categoryWrapper}>
                  {newsDetail.category.map((cat, index) => (
                    <Text key={index} style={styles.categoryText}>
                      {cat}
                    </Text>
                  ))}
                </View>
              </View>
            )}
          </View>
        </ScrollView>
      ) : (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>뉴스 정보를 찾을 수 없습니다.</Text>
        </View>
      )}
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: "#d32f2f",
    textAlign: "center",
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: "#176FF2",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#fff",
    fontWeight: "500",
  },
  content: {
    flex: 1,
  },
  articleContainer: {
    backgroundColor: "#fff",
    margin: 16,
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  articleTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#232323",
    marginBottom: 16,
    lineHeight: 30,
  },
  metaContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  sourceText: {
    fontSize: 14,
    color: "#176FF2",
    fontWeight: "500",
  },
  dateText: {
    fontSize: 14,
    color: "#666",
  },
  articleImage: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginBottom: 16,
  },
  articleContent: {
    fontSize: 16,
    color: "#333",
    lineHeight: 24,
    marginBottom: 20,
  },
  authorText: {
    fontSize: 14,
    color: "#555",
    marginBottom: 16,
  },
  categoryContainer: {
    marginTop: 8,
  },
  categoryLabel: {
    fontSize: 14,
    color: "#555",
    marginBottom: 4,
  },
  categoryWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  categoryText: {
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
    fontSize: 12,
    color: "#555",
  },
});

export default NewsDetail;
