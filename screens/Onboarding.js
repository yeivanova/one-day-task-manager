import React, { useState, useEffect, useCallback, useRef } from "react";
import { StyleSheet, View, Animated, Easing } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import LottieView from "lottie-react-native";

SplashScreen.preventAutoHideAsync();

const Onboarding = () => {
  const [appIsReady, setAppIsReady] = useState(false);
  const [mainIsReady, setMainIsReady] = useState(false);
  const animationRef = useRef(null);
  const animationProgress = useRef(new Animated.Value(0));

  useEffect(() => {
    (async () => {
      try {
        await SplashScreen.preventAutoHideAsync();
        Animated.timing(animationProgress.current, {
          toValue: 1,
          duration: 15000,
          easing: Easing.linear,
          useNativeDriver: true,
        }).start();
      } catch {
        console.log("error");
      } finally {
        setAppIsReady(true);
      }
    })();
  }, []);

  const onLayout = useCallback(() => {
    if (appIsReady) {
      SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <View style={styles.page} onLayout={onLayout}>
      <LottieView
        ref={animationRef}
        source={require("../assets/animation/onboarding.json")}
        progress={animationProgress.current}
        loop={false}
        autoPlay={false}
        style={{ flex: 1 }}
        resizeMode="cover"
        onAnimationFinish={() => {
          console.log("animation finished");
          setMainIsReady(true);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  page: {
    flex: 1,
  },
});

export default Onboarding;
