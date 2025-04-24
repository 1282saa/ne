import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../types/navigation";

interface TimelineItemProps {
  item: any;
  isFirst: boolean;
  isLast: boolean;
}

const TimelineItem: React.FC<TimelineItemProps> = ({
  item,
  isFirst,
  isLast,
}) => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const handlePress = () => {
    navigation.navigate("NewsDetail", {
      url: item.url,
      title: item.title,
      id: item.id,
    });
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      {/* 타임라인 선 */}
      <View style={styles.timelineContainer}>
        <View
          style={[
            styles.timelineLineTop,
            isFirst ? styles.timelineLineHidden : null,
          ]}
        />
        <View style={styles.timelineDot} />
        <View
          style={[
            styles.timelineLineBottom,
            isLast ? styles.timelineLineHidden : null,
          ]}
        />
      </View>

      {/* 콘텐츠 */}
      <View style={styles.contentContainer}>
        <Text style={styles.date}>{item.date}</Text>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description} numberOfLines={3}>
          {item.description}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginVertical: 8,
    paddingHorizontal: 16,
  },
  timelineContainer: {
    width: 24,
    alignItems: "center",
    marginRight: 12,
  },
  timelineLineTop: {
    width: 2,
    height: 24,
    backgroundColor: "#176FF2",
  },
  timelineLineHidden: {
    backgroundColor: "transparent",
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#176FF2",
    marginVertical: 4,
  },
  timelineLineBottom: {
    width: 2,
    height: 24,
    backgroundColor: "#176FF2",
  },
  contentContainer: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderRadius: 8,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  date: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#232323",
    marginBottom: 6,
  },
  description: {
    fontSize: 14,
    color: "#5F5F5F",
    lineHeight: 20,
  },
});

export default TimelineItem;
