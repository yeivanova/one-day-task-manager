import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Pressable,
  Image,
  Keyboard,
  ImageBackground,
} from "react-native";
import Colors from "../constants/colors";

const NumberInput = ({
  value,
  setValue,
  placeholder,
  maxLength,
  editable,
  label,
}) => {
  const increment = (value) => {
    value = +value;
    if (value < 59) setValue(value + 1);
    else if (value >= 59) setValue(59);
  };

  const decrement = (value) => {
    value = +value;
    if (value > 0) setValue(value - 1);
  };

  const inputHandler = (val) => {
    number = parseInt(val);
    if (val.length === 0) {
      setValue("");
    } else {
      setValue(number);
      if (number >= 59) {
        setValue(59);
      } else if (number < 0) {
        setValue(0);
      } else setValue(number);
    }
  };

  return (
    <View style={[styles.container, editable && styles.IsActive]}>
      <Pressable
        style={styles.control}
        disabled={!editable}
        onPress={() => increment(value)}
      >
        <Image
          style={styles.icon}
          source={require("../assets/icons/increase.png")}
        />
      </Pressable>
      <ImageBackground
        source={require("../assets/images/number-input-bg.png")}
        style={styles.inputContainer}
        resizeMode={"stretch"}
      >
        <TextInput
          editable={editable}
          keyboardType="decimal-pad"
          maxLength={maxLength}
          style={styles.input}
          value={value.toString()}
          onChangeText={(value) => inputHandler(value)}
          placeholder={placeholder}
          placeholderTextColor={Colors.placeholder}
          onSubmitEditing={Keyboard.dismiss}
        />
      </ImageBackground>
      <Text style={styles.label}>{label}</Text>
      <Pressable
        style={styles.control}
        disabled={!editable}
        onPress={() => decrement(value)}
      >
        <Image
          style={styles.icon}
          source={require("../assets/icons/decrease.png")}
        />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    justifyContent: "center",
    alignContent: "center",
    opacity: 0.8,
  },
  IsActive: {
    opacity: 1,
  },
  input: {
    fontSize: 12,
    lineHeight: 16,
    fontFamily: "RedHatDisplay_700Bold",
    color: Colors.lightText,
    width: 46,
    height: 18,
    minHeight: 18,
    paddingHorizontal: 10,
    backgroundColor: "transparent",
    borderRadius: 3.2,
  },
  inputContainer: {
    borderRadius: 6.8,
    width: 46,
    height: 18,
  },
  control: {
    alignSelf: "center",
    padding: 6,
  },
  icon: {
    width: 5.5,
    height: 3.5,
  },
  label: {
    position: "absolute",
    right: 4,
    top: 22,
    fontSize: 6.4,
    lineHeight: 9,
    color: Colors.placeholder,
  },
});

export default NumberInput;
