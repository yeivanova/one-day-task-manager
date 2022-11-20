import React from "react";
import { StyleSheet, Text, View } from "react-native";

const ThemeSwitcher = (props) => {
  return (
    <View style={styles.container}>
      <Text>day/night</Text>
    </View>
  )
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "right",
    paddingTop: 26,
    paddingBottom: 13,
  },
});

export default ThemeSwitcher;
