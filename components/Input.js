import React from "react";
import {
  StyleSheet,
  KeyboardAvoidingView,
  TextInput,
  ImageBackground,
} from "react-native";

const Input = ({ value, onChangeText, placeholder, multiline = false }) => {
  let inputBacjgroung = multiline
    ? require("../assets/images/textarea-bg.png")
    : require("../assets/images/input-bg.png");

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ImageBackground
        source={inputBacjgroung}
        style={[
          styles.inputContainer,
          multiline === true && styles.textAreaContainer,
        ]}
      >
        <TextInput
          style={[styles.input, multiline === true && styles.textArea]}
          value={value}
          multiline={multiline}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={"rgba(88, 90, 102, 0.3)"}
        />
      </ImageBackground>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    justifyContent: "center",
    alignContent: "center",
  },
  inputContainer: {
    resizeMode: "auto",
    borderRadius: 6.8,
    height: 40,
    marginBottom: 14,
  },
  textAreaContainer: {
    height: 105,
  },
  input: {
    fontSize: 12,
    lineHeight: 15,
    fontFamily: "RedHatDisplay_400Regular",
    color: "#585A66",
    height: 40,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 6.8,
    backgroundColor: "rgba(255, 255, 255, 0)",
  },
  textArea: {
    height: 105,
    lineHeight: 20,
  },
});

export default Input;
