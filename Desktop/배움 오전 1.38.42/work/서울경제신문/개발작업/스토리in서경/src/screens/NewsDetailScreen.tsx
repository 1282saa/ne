import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  Share,
  TouchableOpacity,
  Linking,
} from "react-native";
import { useRoute, RouteProp } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { RootStackParamList } from "../types/navigation";
import { getNewsDetail } from "../services/newsService";

type NewsDetailScreenRouteProp = RouteProp<RootStackParamList, "NewsDetail">;

const NewsDetailScreen = () => {
  const route = useRoute<NewsDetailScreenRouteProp>();
  const { url, title } = route.params;

  const [loading, setLoading] = useState(true);
  const [newsContent, setNewsContent] = useState("");
  const [newsTitle, setNewsTitle] = useState("");
  const [newsDate, setNewsDate] = useState("");
  const [newsImage, setNewsImage] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 실제 API를 통해 뉴스 상세 정보 가져오기
    const fetchNewsDetail = async () => {
      try {
        setLoading(true);
        setError(null);

        // 뉴스 상세 정보 가져오기
        const detail = await getNewsDetail(url);

        // 뉴스 내용 설정
        setNewsContent(detail.content);

        // 추가 정보가 있다면 설정
        if (detail.title) {
          setNewsTitle(detail.title);
        }
        if (detail.date) {
          setNewsDate(detail.date);
        }
        if (detail.imageUrl) {
          setNewsImage(detail.imageUrl);
        }
      } catch (error) {
        console.error("뉴스 상세 정보 가져오기 오류:", error);
        setError("뉴스 내용을 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchNewsDetail();
  }, [url]);

  const handleShare = async () => {
    try {
      await Share.share({
        message: `${newsTitle}\n\n${url}`,
        title: newsTitle,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const openOriginalArticle = () => {
    Linking.openURL(url).catch((err) =>
      console.error("링크를 열 수 없습니다", err)
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#176FF2" />
        <Text style={[styles.loadingText, { fontFamily: undefined }]}>
          콘텐츠를 불러오는 중...
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text
          style={[
            styles.newsTitle,
            { fontFamily: undefined, fontWeight: "bold" },
          ]}
        >
          {newsTitle}
        </Text>

        <View style={styles.metaContainer}>
          <Text style={[styles.dateText, { fontFamily: undefined }]}>
            {newsDate}
          </Text>
          <TouchableOpacity onPress={handleShare} style={styles.shareButton}>
            <Ionicons name="share-outline" size={20} color="#176FF2" />
            <Text
              style={[
                styles.shareText,
                { fontFamily: undefined, fontWeight: "500" },
              ]}
            >
              공유
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.divider} />

        <Text style={[styles.contentText, { fontFamily: undefined }]}>
          {newsContent}
        </Text>

        <TouchableOpacity
          style={styles.sourceButton}
          onPress={openOriginalArticle}
        >
          <Text
            style={[
              styles.sourceButtonText,
              { fontFamily: undefined, fontWeight: "bold" },
            ]}
          >
            원본 기사 보기
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontFamily: "CircularXX-Medium",
    color: "#5F5F5F",
  },
  contentContainer: {
    padding: 20,
  },
  newsTitle: {
    fontFamily: "Montserrat-Bold",
    fontSize: 22,
    color: "#232323",
    marginBottom: 15,
    lineHeight: 30,
  },
  metaContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  dateText: {
    fontFamily: "CircularXX-Regular",
    fontSize: 12,
    color: "#B8B8B8",
  },
  shareButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  shareText: {
    fontFamily: "CircularXX-Medium",
    fontSize: 14,
    color: "#176FF2",
    marginLeft: 5,
  },
  divider: {
    height: 1,
    backgroundColor: "#F0F0F0",
    marginBottom: 20,
  },
  contentText: {
    fontFamily: "CircularXX-Regular",
    fontSize: 16,
    color: "#3A3A3A",
    lineHeight: 24,
    marginBottom: 30,
  },
  sourceButton: {
    alignSelf: "center",
    backgroundColor: "#176FF2",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 30,
  },
  sourceButtonText: {
    fontFamily: "CircularXX-Bold",
    fontSize: 14,
    color: "#FFFFFF",
  },
});

export default NewsDetailScreen;
