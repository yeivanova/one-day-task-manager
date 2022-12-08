import React from "react";
import { StyleSheet, View } from "react-native";
import Colors from "../constants/colors";

const ControlPanel = ({ style, children }) => {
  return (
    <View style={[styles.panel, style]}>
      {children}
    </View>
  )
}

const styles = StyleSheet.create({
  panel: {
    width: "100%",
    height: 45,
    flexDirection: "row",
    justifyContent: "center",
    alignContent: "center",
    backgroundColor: Colors.background,
    shadowRadius: 6,
  }
});

export default ControlPanel;