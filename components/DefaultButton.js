import React from "react";
import { StyleSheet, Pressable } from "react-native";

const DefaultButton = ({ children, onPress }) => {
  return (
    <Pressable style={styles.button} onPress={onPress}>
      {children}
    </Pressable>
  )
};

const styles = StyleSheet.create({
  button: {
    height: 40,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingHorizontal: 13,
    paddingVertical: 9,
    borderRadius: 4,
    backgroundColor: "#ffffff",
    shadowColor: "rgb(128, 109, 255)",
    shadowOpacity: 0.12,
    shadowRadius: 3,
  }
});

export default DefaultButton;