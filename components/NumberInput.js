import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Pressable,
  Image,
  Keyboard,
} from "react-native";

const NumberInput = ({
  value,
  setValue,
  placeholder,
  onChangeHandle,
  maxLength,
  editable,
  label,
}) => {
  const decrement = () => {
    if (value > 0) setValue(value - 1);
  };

  const increment = () => {
    if (value < 59) setValue(value + 1);
    else if (value >= 59) setValue(59);
  };

  const formatValue = (value) => {
    value = value.toString();
    while (value.length < 2) value = "0" + value;
    return value;
  }

  return (
    <View style={[styles.container, editable && styles.IsActive]}>
      <Pressable
        style={styles.control}
        disabled={!editable}
        onPress={() => increment(+value)}
      >
        <Image
          style={styles.icon}
          source={require("../assets/icons/increase.png")}
        />
      </Pressable>
      <TextInput
        editable={editable}
        keyboardType="decimal-pad"
        maxLength={maxLength}
        style={styles.input}
        value={formatValue(value) || ""}
        onChangeText={onChangeHandle}
        placeholder={placeholder}
        placeholderTextColor={"#585A66"}
        onSubmitEditing={Keyboard.dismiss}
      />
      <Text style={styles.label}>{label}</Text>
      <Pressable
        style={styles.control}
        disabled={!editable}
        onPress={() => decrement(+value)}
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
    backgroundColor: "#FCFCFF",
    opacity: 0.8,
  },
  IsActive: {
    opacity: 1,
  },
  input: {
    fontSize: 12,
    lineHeight: 15,
    fontFamily: "RedHatDisplay_700Bold",
    color: "rgba(0, 0, 0, 0.5)",
    width: 46,
    height: 18,
    minHeight: 18,
    paddingHorizontal: 10,
    backgroundColor: "#FCFCFF",
    borderWidth: 1,
    borderColor: "#B3A4FF",
    borderRadius: 3.2,
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
    color: "rgba(88, 90, 102, 0.3)",
  },
});

export default NumberInput;
