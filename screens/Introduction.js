import React, { useEffect } from "react";
import { StyleSheet } from "react-native";
import LottieView from "lottie-react-native";
// import SplashAnimation from "./components/SplashAnimation";

const Introduction = (props) => {
  const [loaded, setLoaded] = useState(false);

  if (loaded == false) {
    return (
      <View style={styles.splash}>
        <LottieView
          source={require("./assets/animation/introduction.json")}
          autoPlay
          loop={false}
          resizeMode="cover"
          onAnimationFinish={() => {
            console.log("animation finished");
            setLoaded(true);
          }}
        />
      </View>
    );
  } else {
    return (
      <View style={styles.text}>
        <Text>HOWDY WORLD!</Text>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  splash: {
    flex: 1,
    justifyContent: "center",
    alighItems: "center",
    margin: 0,
  },
});

export default Introduction;
