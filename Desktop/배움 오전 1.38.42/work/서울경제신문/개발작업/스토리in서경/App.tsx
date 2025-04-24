import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
// 폰트 로딩은 일단 주석 처리
// import { useFonts } from "expo-font";
// import * as SplashScreen from "expo-splash-screen";

// RootStackParamList 타입 임포트
import { RootStackParamList } from "./src/types/navigation";

// 화면 import
import HomeScreen from "./src/screens/HomeScreen";
import StoryResultScreen from "./src/screens/StoryResultScreen";
import NewsDetail from "./src/screens/NewsDetail";
import IssueTimeline from "./src/screens/IssueTimeline";
import AspenHomeScreen from "./src/screens/AspenHomeScreen";
import AspenDetailScreen from "./src/screens/AspenDetailScreen";

const Stack = createStackNavigator<RootStackParamList>();

// 스플래시 화면 유지 비활성화
// SplashScreen.preventAutoHideAsync();

export default function App() {
  // 폰트 로드 비활성화 - 추후 폰트 파일 추가 후 활성화
  /* 
  const [fontsLoaded] = useFonts({
    "Montserrat-Regular": require("./assets/fonts/Montserrat-Regular.ttf"),
    "Montserrat-Medium": require("./assets/fonts/Montserrat-Medium.ttf"),
    "Montserrat-SemiBold": require("./assets/fonts/Montserrat-SemiBold.ttf"),
    "Montserrat-Bold": require("./assets/fonts/Montserrat-Bold.ttf"),
    "CircularXX-Book": require("./assets/fonts/CircularXX-Book.ttf"),
    "CircularXX-Regular": require("./assets/fonts/CircularXX-Regular.ttf"),
    "CircularXX-Medium": require("./assets/fonts/CircularXX-Medium.ttf"),
    "CircularXX-Bold": require("./assets/fonts/CircularXX-Bold.ttf"),
  });

  React.useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }
  */

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="auto" />
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ title: "Story in 서울경제" }}
          />
          <Stack.Screen
            name="StoryResult"
            component={StoryResultScreen}
            options={({ route }) => ({
              title: `"${route.params.keyword}" 스토리`,
            })}
          />
          <Stack.Screen
            name="NewsDetail"
            component={NewsDetail}
            options={({ route }) => ({ title: route.params.title })}
          />
          <Stack.Screen
            name="IssueTimeline"
            component={IssueTimeline}
            options={({ route }) => ({ title: `${route.params.issue.topic}` })}
          />
          <Stack.Screen
            name="AspenHome"
            component={AspenHomeScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="AspenDetail"
            component={AspenDetailScreen}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
