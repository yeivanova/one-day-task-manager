import React from "react";
import { StyleSheet, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  useFonts,
  RedHatDisplay_700Bold,
} from "@expo-google-fonts/red-hat-display";
import Colors from "../constants/colors";

const ActionButton = ({ children, onPress, isDisabled }) => {
  let [fontsLoaded] = useFonts({
    RedHatDisplay_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }
  return (
    <Pressable style={({ pressed }) => pressed ? [styles.pressed, styles.button] : styles.button} onPress={onPress} disabled={isDisabled}>
      <LinearGradient
        colors={
          isDisabled
            ? [Colors.disabledButton, Colors.disabledButton]
            : [Colors.disabledButton, Colors.gradientStop]
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
    backgroundColor: Colors.primary,
    borderRadius: 24,
    bottom: 20,
  },
  pressed: {
    opacity: 0.9
  },
  linearGradient: {
    height: 48,
    width: 48,
    padding: 9,
    borderRadius: 24,
  },
});

export default ActionButton;