import React from "react";
import { StyleSheet, View, Image, Text } from "react-native";
import {
  useFonts,
  RedHatDisplay_700Bold,
} from "@expo-google-fonts/red-hat-display";

const Header = ({ text }) => {
  let [fontsLoaded] = useFonts({
    RedHatDisplay_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }
  return (
    <View style={styles.container}>
      <Image
        style={styles.logo}
        source={require("../assets/images/logo.png")}
      />
      <Text style={styles.headline}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignContent: "center",
    paddingTop: 62,
    paddingBottom: 40,
  },
  logo: {
    width: 72,
    height: 43,
  },
  headline: {
    fontSize: 32,
    lineHeight: 42,
    fontFamily: "RedHatDisplay_700Bold",
    color: "#000000",
    marginLeft: 9,
  },
});

export default Header;