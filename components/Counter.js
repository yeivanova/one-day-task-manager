import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Image,
  ImageBackground,
} from "react-native";
import Colors from "../constants/colors";

const Counter = ({ value, setValue }) => {
  const increment = (value) => {
    if (value < 10) setValue(value + 1);
  };

  const decrement = (value) => {
    if (value > 0) setValue(value - 1);
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../assets/images/counter-bg.png")}
        style={styles.innerContainer}
        resizeMode={"stretch"}
      >
        <Pressable
          style={({ pressed }) => [
            {
              backgroundColor: pressed
                ? Colors.inActiveText
                : Colors.background,
            },
            styles.control,
            value > 1 && styles.IsActive,
          ]}
          disabled={value <= 1}
          onPress={() => decrement(value)}
        >
          <Image
            style={styles.iconMinus}
            source={require("../assets/icons/minus.png")}
          />
        </Pressable>
        <View style={styles.count}>
          <Text style={styles.countText}>{value}</Text>
        </View>
        <Pressable
          style={({ pressed }) => [
            {
              backgroundColor: pressed
                ? Colors.inActiveText
                : Colors.background,
            },
            styles.control,
            value < 10 && styles.IsActive,
          ]}
          disabled={value >= 10}
          onPress={() => increment(value)}
        >
          <Image
            style={styles.iconPlus}
            source={require("../assets/icons/plus.png")}
          />
        </Pressable>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignContent: "center",
    borderRadius: 14,
    backgroundColor: Colors.background,
  },
  innerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignContent: "center",
    borderRadius: 14,
    padding: 1,
    justifyContent: "flex-start",
    alignContent: "stretch",
  },
  count: {
    width: 30,
  },
  countText: {
    fontSize: 11,
    lineHeight: 30,
    fontFamily: "RedHatDisplay_700Bold",
    textAlign: "center",
  },
  control: {
    width: 28,
    height: 28,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignContent: "center",
    alignSelf: "center",
    padding: 5,
    borderRadius: 14,
    shadowColor: Colors.primary,
    shadowOpacity: 0.23,
    shadowOffset: {
      width: 0.6,
      height: 0.6,
    },
    shadowRadius: 2,
    opacity: 0.5,
  },
  IsActive: {
    opacity: 1,
  },
  iconMinus: {
    width: 8,
    height: 2,
    marginVertical: 8,
  },
  iconPlus: {
    width: 8,
    height: 8,
    marginVertical: 5,
  },
});

export default Counter;
