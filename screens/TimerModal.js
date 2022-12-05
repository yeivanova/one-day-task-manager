import React, { useState, useCallback, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  ImageBackground,
  Modal,
  Pressable,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ControlPanel from "../components/ControlPanel";
import Header from "../components/Header";
import ActionButton from "../components/ActionButton";
import Colors from "../constants/colors";
import { LinearGradient } from "expo-linear-gradient";
import {
  useFonts,
  RedHatDisplay_300Light,
  RedHatDisplay_400Regular,
  RedHatDisplay_500Medium,
  RedHatDisplay_700Bold,
  RedHatDisplay_900Black,
} from "@expo-google-fonts/red-hat-display";
import { useClock } from "react-native-timer-hooks";
import CircularProgress from "react-native-circular-progress-indicator";

const TimerModal = ({ visible, task, hideModal, completeTask }) => {
  const insets = useSafeAreaInsets();
  const [counter, start, pause, reset, isRunning] = useClock({
    from: 0,
    to: task.timerDuration,
    stopOnFinish: true,
  });

  const [value, setValue] = useState(0);
  const progressRef = useRef(null);

  const isCountdownFinish = useCallback(() => {
    return !isRunning && counter === task.timerDuration;
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
    hideModal();
    pause();
    reset();
    setValue(0);
  };

  const timerFormat = (counter) =>
    new Date(counter * 1000).toISOString().slice(14, 19);

  return (
    <Modal visible={visible} animationType="fade">
      <View
        style={[
          { paddingTop: insets.top, paddingBottom: insets.bottom },
          styles.page,
        ]}
      >
        <Pressable
          style={[{ paddingTop: insets.top }, styles.cancel]}
          onPress={handleCancelTimer}
        >
          <Image
            style={styles.backIcon}
            source={require("../assets/icons/back.png")}
          />
          <Text style={styles.cancelText}>Forget it</Text>
        </Pressable>
        <Header text="timer" />
        <LinearGradient
          colors={[Colors.background, Colors.gradientStart]}
          locations={[0.0413, 0.26]}
          style={styles.mainPanel}
        >
          <View style={styles.timerWrapper}>
            <Text style={styles.taskText}>{task.text}</Text>
            <ImageBackground
              source={require("../assets/images/timer-bg.png")}
              style={styles.bgImage}
            >
              <View style={styles.timerContainer}>
                <CircularProgress
                  ref={progressRef}
                  radius={93}
                  value={value}
                  rotation={-180}
                  progressValueColor={"transparent"}
                  activeStrokeWidth={6}
                  inActiveStrokeWidth={15}
                  activeStrokeColor={Colors.primary}
                  inActiveStrokeColor={"transparent"}
                  inActiveStrokeOpacity={0.5}
                  duration={task.timerDuration * 1000 + 1000}
                  onAnimationComplete={() => {
                    console.log("timer finished");
                  }}
                />
                <View style={styles.timerInner}>
                  <Image
                    style={styles.timerIcon}
                    source={require("../assets/icons/timer.png")}
                  />
                  <Text style={styles.timerText}> {timerFormat(counter)}</Text>
                </View>
              </View>
            </ImageBackground>
          </View>
        </LinearGradient>
        <ControlPanel>
          <ActionButton
            style={styles.button}
            onPress={() => {
              if (isRunning) {
                progressRef.current.pause();
                pause();
              } else {
                setValue(100);
                progressRef.current.play();
                start();
              }
              if (!isRunning & isCountdownFinish()) {
                completeTask();
                handleCancelTimer();
              }
            }}
          >
            {isRunning ? (
              <Image
                style={styles.pauseIcon}
                source={require("../assets/icons/pause.png")}
              />
            ) : !isCountdownFinish() ? (
              <Text style={styles.buttonText}>Start</Text>
            ) : (
              <Image
                style={styles.doneIcon}
                source={require("../assets/icons/done.png")}
              />
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
    borderColor: Colors.border,
    shadowColor: Colors.background,
    shadowOpacity: 0.36,
    shadowOffset: {
      width: -10,
      height: -10,
    },
    shadowRadius: 20,
  },
  cancel: {
    flexDirection: "row",
    justifyContent: "center",
    alignContent: "center",
    position: "absolute",
    top: 25,
    left: 25,
  },
  cancelText: {
    fontFamily: "RedHatDisplay_900Black",
    fontSize: 12,
    lineHeight: 16,
    color: Colors.primary,
    marginLeft: 6,
  },
  backIcon: {
    width: 18.5,
    height: 13.5,
  },
  bgImage: {
    width: 239,
    height: 239,
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
    color: Colors.background,
  },
  pauseIcon: {
    width: 11,
    height: 17,
    alignSelf: "center",
    marginVertical: 6,
  },
  doneIcon: {
    width: 16,
    height: 12.5,
    alignSelf: "center",
    marginVertical: 8,
  },
  timerWrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 29,
  },
  timerContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  timerInner: {
    flex: 1,
    alignItems: "stretch",
    justifyContent: "stretch",
    position: "absolute",
  },
  timerText: {
    fontSize: 37,
    fontFamily: "RedHatDisplay_300Light",
    color: Colors.text,
  },
  timerIcon: {
    width: 37,
    height: 46,
    marginBottom: 9,
    alignSelf: "center",
  },
});

export default TimerModal;
