import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../types/navigation";

// 이미지 임포트 - 실제 이미지 파일이 없으므로 모두 주석 처리
// const arrowDown2 = require("../../assets/images/arrow-down-2.png");
// const home = require("../../assets/images/home.png");
// const profile = require("../../assets/images/profile.png");
// const group = require("../../assets/images/group.png");
// const group32 = require("../../assets/images/group-3-2.png");
// const group6 = require("../../assets/images/group-6.png");
// const image = require("../../assets/images/image.png");
// const rectangle992 = require("../../assets/images/rectangle-992.png");

type AspenDetailScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "AspenDetail"
>;

const AspenDetailScreen = () => {
  const navigation = useNavigation<AspenDetailScreenNavigationProp>();

  // 뒤로 가기 함수
  const goBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* 상품 이미지 자리 (이미지 대신 색상 배경 사용) */}
        <View style={styles.productImagePlaceholder}>
          <Text style={{ color: "#666" }}>이미지가 추가되면 표시됩니다</Text>
        </View>

        {/* 콘텐츠 섹션 */}
        <View style={styles.contentContainer}>
          {/* 제목 및 평점 */}
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Coeurdes Alpes</Text>

            <View style={styles.ratingRow}>
              <View style={styles.ratingContainer}>
                <Ionicons name="star" size={16} color="#FFD700" />
                <Text style={styles.ratingText}>4.5 (355 Reviews)</Text>
              </View>
              <TouchableOpacity>
                <Text style={styles.showMapText}>Show map</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* 설명 */}
          <Text style={styles.description}>
            Aspen is as close as one can get to a storybook alpine town in
            America. The choose-your-own-adventure possibilities—skiing, hiking,
            dining shopping and ....
          </Text>

          {/* 더 읽기 버튼 */}
          <TouchableOpacity style={styles.readMoreContainer}>
            <Text style={styles.readMoreText}>Read more</Text>
            <Ionicons name="chevron-down" size={18} color="#176FF2" />
          </TouchableOpacity>

          {/* 시설 섹션 */}
          <View style={styles.facilitiesSection}>
            <Text style={styles.sectionTitle}>Facilities</Text>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.facilitiesContainer}
            >
              <View style={styles.facilityItem}>
                <Ionicons name="wifi" size={32} color="#3A544F" />
                <Text style={styles.facilityText}>1 Heater</Text>
              </View>

              <View style={styles.facilityItem}>
                <Ionicons name="restaurant" size={32} color="#C8C8C8" />
                <Text style={styles.facilityTextGray}>Dinner</Text>
              </View>

              <View style={styles.facilityItem}>
                <Ionicons name="water" size={32} color="#C8C8C8" />
                <Text style={styles.facilityTextGray}>1 Tub</Text>
              </View>

              <View style={styles.facilityItem}>
                <Ionicons name="fitness" size={32} color="#C8C8C8" />
                <Text style={styles.facilityTextGray}>Pool</Text>
              </View>
            </ScrollView>
          </View>
        </View>
      </ScrollView>

      {/* 하단 예약 섹션 */}
      <View style={styles.bookingSection}>
        <View style={styles.priceContainer}>
          <Text style={styles.priceLabel}>Price</Text>
          <Text style={styles.price}>$199</Text>
        </View>

        <TouchableOpacity style={styles.bookButton} onPress={goBack}>
          <Text style={styles.bookButtonText}>Book Now</Text>
          <Ionicons name="arrow-forward" size={20} color="white" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollView: {
    flex: 1,
  },
  productImagePlaceholder: {
    width: "100%",
    height: 386,
    backgroundColor: "#E5E5E5",
    justifyContent: "center",
    alignItems: "center",
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  titleContainer: {
    marginBottom: 16,
  },
  title: {
    // fontFamily: "Montserrat-SemiBold", // 폰트 주석 처리
    fontSize: 24,
    fontWeight: "600",
    color: "#232323",
    marginBottom: 10,
  },
  ratingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    // fontFamily: "CircularXX-Regular", // 폰트 주석 처리
    fontSize: 12,
    color: "#5F5F5F",
    marginLeft: 8,
  },
  showMapText: {
    // fontFamily: "CircularXX-Bold", // 폰트 주석 처리
    fontSize: 14,
    fontWeight: "bold",
    color: "#176FF2",
  },
  description: {
    // fontFamily: "CircularXX-Book", // 폰트 주석 처리
    fontSize: 14,
    color: "#3A544F",
    lineHeight: 20,
    marginBottom: 16,
  },
  readMoreContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  readMoreText: {
    // fontFamily: "CircularXX-Bold", // 폰트 주석 처리
    fontSize: 14,
    fontWeight: "bold",
    color: "#176FF2",
    marginRight: 4,
  },
  facilitiesSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    // fontFamily: "Montserrat-SemiBold", // 폰트 주석 처리
    fontSize: 18,
    fontWeight: "600",
    color: "#232323",
    marginBottom: 16,
  },
  facilitiesContainer: {
    flexDirection: "row",
  },
  facilityItem: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(23,111,242,0.05)",
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginRight: 14,
  },
  facilityIcon: {
    width: 32,
    height: 32,
    marginBottom: 6,
  },
  facilityText: {
    // fontFamily: "CircularXX-Book", // 폰트 주석 처리
    fontSize: 10,
    color: "#B8B8B8",
  },
  facilityTextGray: {
    // fontFamily: "CircularXX-Book", // 폰트 주석 처리
    fontSize: 10,
    color: "#C8C8C8",
  },
  bookingSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#F5F5F5",
  },
  priceContainer: {
    flexDirection: "column",
  },
  priceLabel: {
    // fontFamily: "CircularXX-Medium", // 폰트 주석 처리
    fontSize: 12,
    fontWeight: "500",
    color: "#232323",
  },
  price: {
    // fontFamily: "Montserrat-Bold", // 폰트 주석 처리
    fontSize: 24,
    fontWeight: "bold",
    color: "#2CD6A3",
  },
  bookButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#176FF2",
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 16,
    shadowColor: "#0038FF",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.24,
    shadowRadius: 19,
    elevation: 5,
  },
  bookButtonText: {
    // fontFamily: "CircularXX-Bold", // 폰트 주석 처리
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
    marginRight: 8,
  },
});

export default AspenDetailScreen;
