import React from "react";
import { StyleSheet, View } from "react-native";

const ControlPanel = ({ children }) => {
  return (
    <View style={styles.panel}>
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
    backgroundColor: "#ffffff",
    shadowRadius: 6,
  }
});

export default ControlPanel;