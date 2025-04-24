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

// 이미지 임포트는 실제 이미지 파일이 추가될 때까지 주석 처리
// const arrowDown2 = require("../../assets/images/arrow-down-2.png");
// const home = require("../../assets/images/home.png");
// const profile = require("../../assets/images/profile.png");
// const group = require("../../assets/images/group.png");
// const group32 = require("../../assets/images/group-3-2.png");
// const group6 = require("../../assets/images/group-6.png");
// const image = require("../../assets/images/image.png");
// const rectangle992 = require("../../assets/images/rectangle-992.png");

type AspenHomeScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "AspenHome"
>;

const AspenHomeScreen = () => {
  const navigation = useNavigation<AspenHomeScreenNavigationProp>();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.exploreText}>Explore</Text>
            <Text style={styles.aspenText}>Aspen</Text>
          </View>

          <TouchableOpacity style={styles.locationBtn}>
            <Ionicons name="location-outline" size={16} color="#5f5f5f" />
            <Text style={styles.locationText}>Aspen, USA</Text>
            <Ionicons name="chevron-down" size={16} color="#5f5f5f" />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <TouchableOpacity style={styles.searchBar}>
          <View style={styles.searchIconContainer}>
            <Ionicons name="search" size={20} color="#B8B8B8" />
          </View>
          <Text style={styles.searchText}>Find things to do</Text>
        </TouchableOpacity>

        {/* Categories */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesContainer}
        >
          <TouchableOpacity style={styles.categoryActive}>
            <Text style={styles.categoryActiveText}>Location</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.category}>
            <Text style={styles.categoryText}>Hotels</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.category}>
            <Text style={styles.categoryText}>Food</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.category}>
            <Text style={styles.categoryText}>Adventure</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.category}>
            <Text style={styles.categoryText}>Adventure</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Popular Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Popular</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See all</Text>
            </TouchableOpacity>
          </View>

          {/* Popular Item - 이미지 대신 플레이스홀더 사용 */}
          <View style={styles.popularItem}>
            <View style={styles.popularImagePlaceholder} />
            <View style={styles.popularOverlay}>
              <View style={styles.popularBottomContent}>
                <View style={styles.popularPlaceBadge}>
                  <Text style={styles.popularPlaceText}>Alley Palace</Text>
                </View>
                <View style={styles.popularRatingBadge}>
                  <Ionicons name="star" size={16} color="#fff" />
                  <Text style={styles.popularRatingText}>4.1</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.heartButton}>
                <Ionicons name="heart-outline" size={16} color="#176FF2" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Recommended Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Recommended</Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.recommendedList}
          >
            {/* Recommended Item 1 - 이미지 대신 플레이스홀더 사용 */}
            <TouchableOpacity
              style={styles.recommendedItem}
              onPress={() => navigation.navigate("AspenDetail")}
            >
              <View style={styles.recommendedImagePlaceholder} />
              <View style={styles.packageBadge}>
                <Text style={styles.packageText}>4N/5D</Text>
              </View>
              <View style={styles.recommendedContent}>
                <Text style={styles.recommendedTitle}>Explore Aspen</Text>
                <View style={styles.hotDealContainer}>
                  <Ionicons name="trending-up" size={12} color="#3A544F" />
                  <Text style={styles.hotDealText}>Hot Deal</Text>
                </View>
              </View>
            </TouchableOpacity>

            {/* Recommended Item 2 - 이미지 대신 플레이스홀더 사용 */}
            <TouchableOpacity
              style={styles.recommendedItem}
              onPress={() => navigation.navigate("AspenDetail")}
            >
              <View style={styles.recommendedImagePlaceholder} />
              <View style={styles.packageBadge}>
                <Text style={styles.packageText}>2N/3D</Text>
              </View>
              <View style={styles.recommendedContent}>
                <Text style={styles.recommendedTitle}>Luxurious Aspen</Text>
                <View style={styles.hotDealContainer}>
                  <Ionicons name="trending-up" size={12} color="#3A544F" />
                  <Text style={styles.hotDealText}>Hot Deal</Text>
                </View>
              </View>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNavigation}>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="home" size={24} color="#176FF2" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="location-outline" size={20} color="#666" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="bookmark-outline" size={20} color="#666" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="person-outline" size={20} color="#666" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: 20,
    paddingTop: 20,
    marginBottom: 20,
  },
  headerLeft: {
    alignItems: "flex-start",
  },
  exploreText: {
    // fontFamily: "Montserrat-Regular", // 폰트 주석 처리
    fontSize: 14,
    color: "black",
  },
  aspenText: {
    // fontFamily: "Montserrat-Medium", // 폰트 주석 처리
    fontSize: 32,
    fontWeight: "500",
    color: "black",
  },
  locationBtn: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  locationText: {
    // fontFamily: "CircularXX-Regular", // 폰트 주석 처리
    fontSize: 12,
    color: "#5f5f5f",
    marginHorizontal: 4,
  },
  arrowDownIcon: {
    width: 16,
    height: 16,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F8FE",
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  searchIconContainer: {
    marginRight: 8,
  },
  searchIcon: {
    width: 20,
    height: 20,
  },
  searchText: {
    // fontFamily: "CircularXX-Book", // 폰트 주석 처리
    fontSize: 13,
    color: "#B8B8B8",
  },
  categoriesContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  category: {
    marginRight: 28,
    paddingVertical: 8,
  },
  categoryText: {
    // fontFamily: "CircularXX-Regular", // 폰트 주석 처리
    fontSize: 14,
    color: "#B8B8B8",
  },
  categoryActive: {
    backgroundColor: "rgba(23,111,242,0.05)",
    borderRadius: 33,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 28,
  },
  categoryActiveText: {
    // fontFamily: "CircularXX-Bold", // 폰트 주석 처리
    fontSize: 14,
    fontWeight: "bold",
    color: "#176FF2",
  },
  sectionContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    // fontFamily: "Montserrat-SemiBold", // 폰트 주석 처리
    fontSize: 18,
    fontWeight: "600",
    color: "#232323",
  },
  seeAllText: {
    // fontFamily: "CircularXX-Medium", // 폰트 주석 처리
    fontSize: 12,
    color: "#176FF2",
  },
  popularItem: {
    position: "relative",
    width: "100%",
    height: 240,
    borderRadius: 16,
    overflow: "hidden",
  },
  popularImagePlaceholder: {
    width: "100%",
    height: "100%",
    backgroundColor: "#E5E5E5",
  },
  popularOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
  },
  popularBottomContent: {
    flexDirection: "column",
    alignItems: "flex-start",
  },
  popularPlaceBadge: {
    backgroundColor: "#4C5652",
    borderRadius: 59,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginBottom: 6,
  },
  popularPlaceText: {
    // fontFamily: "CircularXX-Book", // 폰트 주석 처리
    fontSize: 12,
    color: "white",
  },
  popularRatingBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4C5652",
    borderRadius: 59,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  popularRatingText: {
    // fontFamily: "CircularXX-Book", // 폰트 주석 처리
    fontSize: 10,
    color: "white",
    marginLeft: 4,
  },
  heartButton: {
    position: "absolute",
    right: 16,
    bottom: 16,
    backgroundColor: "#F3F8FE",
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  recommendedList: {
    flexDirection: "row",
  },
  recommendedItem: {
    width: 166,
    marginRight: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#F4F4F4",
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    overflow: "hidden",
  },
  recommendedImagePlaceholder: {
    width: "100%",
    height: 96,
    backgroundColor: "#E5E5E5",
  },
  packageBadge: {
    position: "absolute",
    top: 84,
    right: 12,
    backgroundColor: "#3A544F",
    borderRadius: 9,
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderWidth: 2,
    borderColor: "white",
  },
  packageText: {
    // fontFamily: "Montserrat-SemiBold", // 폰트 주석 처리
    fontSize: 10,
    fontWeight: "600",
    color: "white",
  },
  recommendedContent: {
    padding: 8,
  },
  recommendedTitle: {
    // fontFamily: "CircularXX-Medium", // 폰트 주석 처리
    fontSize: 14,
    fontWeight: "500",
    color: "#232323",
    marginBottom: 3,
  },
  hotDealContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  hotDealText: {
    // fontFamily: "CircularXX-Regular", // 폰트 주석 처리
    fontSize: 10,
    color: "#3A544F",
    marginLeft: 4,
  },
  bottomNavigation: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "white",
    paddingVertical: 16,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    shadowColor: "#176FF2",
    shadowOffset: { width: 15, height: -19 },
    shadowOpacity: 0.05,
    shadowRadius: 22,
    elevation: 10,
  },
  navItem: {
    padding: 10,
  },
  navIcon: {
    width: 24,
    height: 24,
  },
});

export default AspenHomeScreen;
