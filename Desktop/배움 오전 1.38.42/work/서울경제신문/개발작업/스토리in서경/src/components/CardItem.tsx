import React from "react";
import { StyleSheet, View, Text, TouchableOpacity, Image } from "react-native";
import { NewsItem } from "../types";

interface CardItemProps {
  item: NewsItem;
  onPress: (item: NewsItem) => void;
}

const CardItem: React.FC<CardItemProps> = ({ item, onPress }) => {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress(item)}
      activeOpacity={0.7}
    >
      {item.imageUrl && (
        <Image
          source={{ uri: item.imageUrl }}
          style={styles.image}
          resizeMode="cover"
        />
      )}
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.description} numberOfLines={3}>
          {item.description}
        </Text>
        <Text style={styles.date}>{item.date}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: {
    width: "100%",
    height: 160,
  },
  content: {
    padding: 16,
  },
  title: {
    fontFamily: "Montserrat-SemiBold",
    fontSize: 16,
    color: "#232323",
    marginBottom: 8,
    lineHeight: 22,
  },
  description: {
    fontFamily: "CircularXX-Regular",
    fontSize: 14,
    color: "#5F5F5F",
    marginBottom: 10,
    lineHeight: 20,
  },
  date: {
    fontFamily: "CircularXX-Book",
    fontSize: 12,
    color: "#B8B8B8",
  },
});

export default CardItem;
