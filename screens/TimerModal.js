import React, { useState, useCallback } from "react";
import {
  StyleSheet,
  View,
  Text,
  Modal,
  Pressable,
} from "react-native";

import ControlPanel from "../components/ControlPanel";
import Header from "../components/Header";
import ActionButton from "../components/ActionButton";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import {
  useFonts,
  RedHatDisplay_300Light,
  RedHatDisplay_400Regular,
  RedHatDisplay_500Medium,
  RedHatDisplay_700Bold,
  RedHatDisplay_900Black,
} from "@expo-google-fonts/red-hat-display";
import { useClock } from "react-native-timer-hooks";

const TimerModal = (props) => {
  const [counter, start, pause, reset, isRunning] = useClock({
    from: 0,
    to: props.task.timerDuration,
    stopOnFinish: true,
  });

  const isCountdownFinish = useCallback(() => {
    return !isRunning && counter === props.task.timerDuration;
  }, [isRunning, counter]);

  let [fontsLoaded] = useFonts({
    RedHatDisplay_300Light,
    RedHatDisplay_400Regular,
    RedHatDisplay_500Medium,
    RedHatDisplay_700Bold,
    RedHatDisplay_900Black,
  });

  if (!fontsLoaded) {
    return null;
  }

  const handleCancelTimer = () => {
    props.hideModal();
    pause();
    reset();
  };

  const timerFormat = (counter) => new Date(counter * 1000).toISOString().slice(14, 19);

  return (
    <Modal visible={props.visible} animationType="fade">
      <View style={styles.page}>
        <Pressable style={styles.cancel} onPress={handleCancelTimer}>
          <Ionicons name="arrow-back-sharp" size={20} color="#806DFF" />
          <Text style={styles.cancelText}>Forget it</Text>
        </Pressable>
        <Header text="timer" />
        <LinearGradient
          colors={["#ffffff", "#F9F9FF"]}
          locations={[0.0413, 0.26]}
          style={styles.mainPanel}
        >
          <Text style={styles.taskText}>{props.task.text}</Text>
          <View style={styles.timerContainer}>
            <Text style={styles.timerText}>
              {timerFormat(counter)}
            </Text>
          </View>
        </LinearGradient>
        <ControlPanel>
          <ActionButton
            style={styles.button}
            onPress={() => {
              isRunning ? pause() : start();
              if (!isRunning & isCountdownFinish()) {
                props.toggleTaskCompleted(props.task.id);
                handleCancelTimer();
              };
            }}
          >
            {isRunning ? (
              <Ionicons style={styles.buttonIcon} name="ios-pause" size={24} color="#ffffff" />
            ) : (
              !isCountdownFinish() ? (<Text style={styles.buttonText}>Start</Text>) : (
                <Ionicons style={styles.buttonIcon} name="checkmark-done-sharp" size={24} color="#ffffff" />
              )
            )}
          </ActionButton>
        </ControlPanel>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  page: {
    flex: 1,
    flexDirection: "column",
    flexBasis: "100%",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "RedHatDisplay_500Medium",
  },
  mainPanel: {
    width: "100%",
    flex: 1,
    justifyContent: "flex-start",
    alignContent: "center",
    paddingVertical: 32,
    paddingHorizontal: 30,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E9E5FF",
    borderRadius: 20,
    shadowColor: "#ffffff",
    shadowOpacity: 0.36,
    shadowOffset: {
      width: -10,
      height: -10,
    },
    shadowRadius: 20,
  },
  cancel: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignContent: "center",
    position: "absolute",
    top: 25,
    left: 25,
  },
  cancelText: {
    fontFamily: "RedHatDisplay_900Black",
    fontSize: 12,
    lineHeight: 20,
    color: "#806DFF",
    marginLeft: 6,
  },
  taskText: {
    fontSize: 16,
    lineHeight: 21,
    fontFamily: "RedHatDisplay_400Regular",
    textAlign: "center",
    marginBottom: 29,
  },
  buttonText: {
    alignSelf: "center",
    fontSize: 11,
    lineHeight: 30,
    fontFamily: "RedHatDisplay_700Bold",
    color: "#ffffff",
  },
  buttonIcon: {
    alignSelf: "center",
    lineHeight: 30
  },
  timerContainer: {
    flex: 1,
    padding: 5,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  timerText: {
    fontSize: 37,
    fontFamily: "RedHatDisplay_300Light",
    color: "#000000",
    marginLeft: 7,
  },
});

export default TimerModal;
