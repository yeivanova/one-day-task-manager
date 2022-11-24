import React from "react";
import { StyleSheet, KeyboardAvoidingView, TextInput } from "react-native";

const Input = ({ value, onChangeText, placeholder }) => {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={"#585A66"}
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    justifyContent: "center",
    alignContent: "center",
  },
  input: {
    fontSize: 12,
    lineHeight: 14,
    fontFamily: "RedHatDisplay_400Regular",
    color: "#585A66",
    height: 40,
    minHeight: 40,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: "#FCFCFF",
    borderWidth: 1,
    borderColor: "#B3A4FF",
    borderRadius: 6.8,
    marginBottom: 14,
  },
});

export default Input;
