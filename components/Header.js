import React from "react";
import { StyleSheet, View, Image, Text } from "react-native";
import {
  useFonts,
  RedHatDisplay_700Bold,
} from "@expo-google-fonts/red-hat-display";
import Colors from "../constants/colors";

const Header = ({ text, children }) => {
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
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
    flexDirection: "row",
    justifyContent: "center",
    alignContent: "center",
    paddingTop: 62,
    paddingBottom: 40,
    zIndex: 0
  },
  logo: {
    width: 72,
    height: 43,
  },
  headline: {
    fontSize: 32,
    lineHeight: 42,
    fontFamily: "RedHatDisplay_700Bold",
    color: Colors.text,
    marginLeft: 5,
  },
});

export default Header;
