import React, { useState } from "react";
import { StyleSheet, Text, View, Image, Pressable } from "react-native";
import Colors from "../constants/colors";

const CheckBox = ({ highLighted, isCompleted, repeat, onPress, title, repeatCounter }) => {
  return (
    <Pressable style={styles.container} onPress={onPress}>
      <View
        style={[
          styles.checkbox,
          repeatCounter > 0 && styles.checkboxIsRepeated,
          isCompleted && styles.checkboxIsActive,
          highLighted && styles.highLighted
        ]}
      >
        {(isCompleted || (repeatCounter === repeat)) && (
          <Image
            style={styles.iconCheck}
            source={require("../assets/icons/check.png")}
          />
        )}
        {(repeatCounter > 0) && (repeatCounter < repeat) && (
          <Text style={styles.repeatText}>{repeatCounter}</Text>
        )}
      </View>
      <Text style={[styles.task, isCompleted && styles.taskCompleted, highLighted && styles.highLightedTask]}>
        {title}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignContent: "center",
  },
  checkbox: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignContent: "center",
    width: 16,
    height: 16,
    marginRight: 12,
    borderWidth: 1,
    borderRadius: 1.26,
    borderColor: Colors.lightPrimary,
  },
  checkboxIsRepeated: {
    backgroundColor: Colors.primary,
  },
  checkboxIsActive: {
    backgroundColor: Colors.primary,
  },
  highLighted: {
    borderColor: Colors.background,
    backgroundColor: Colors.background
  },
  task: {
    maxWidth: "80%",
    color: Colors.text,
    fontSize: 12,
    lineHeight: 14,
    fontFamily: "RedHatDisplay_400Regular",
  },
  taskCompleted: {
    color: Colors.lightPrimary,
    textDecorationLine: "line-through",
    opacity: 0.4,
  },
  highLightedTask: {
    color: Colors.background
  },
  iconCheck: {
    width: 9.5,
    height: 7,
    marginHorizontal: 1.5,
  },
  repeatText: {
    fontSize: 10.65,
    fontFamily: "RedHatDisplay_500Medium",
    color: Colors.background,
    textAlign: "center",
  },
});

export default CheckBox;
