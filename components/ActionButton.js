import React from "react";
import { StyleSheet, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  useFonts,
  RedHatDisplay_700Bold,
} from "@expo-google-fonts/red-hat-display";

const ActionButton = ({ children, onPress, isDisabled }) => {
  let [fontsLoaded] = useFonts({
    RedHatDisplay_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }
  return (
    <Pressable style={styles.button} onPress={onPress} disabled={isDisabled}>
      <LinearGradient
        colors={
          isDisabled
            ? ["rgba(255, 255, 255, 0.15)", "rgba(255, 255, 255, 0.15)"]
            : ["rgba(255, 255, 255, 0.15)", "#422BB8"]
        }
        start={{ x: -0.25, y: -0.5 }}
        end={{ x: 1, y: 1 }}
        locations={[0, 1]}
        style={styles.linearGradient}
      >
        {children}
      </LinearGradient>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    flex: 1,
    height: 48,
    width: 48,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    backgroundColor: "#806DFF",
    borderRadius: 24,
    bottom: 20,
  },
  linearGradient: {
    height: 48,
    width: 48,
    padding: 9,
    borderRadius: 24,
  },
});

export default ActionButton;