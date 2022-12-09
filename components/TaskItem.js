import React, { useState, useEffect } from "react";
import { StyleSheet, Text, Image, View, Pressable } from "react-native";
import {
  useFonts,
  RedHatDisplay_400Regular,
} from "@expo-google-fonts/red-hat-display";
import TimerModal from "../screens/TimerModal";
import CheckBox from "./CheckBox";
import Colors from "../constants/colors";
import Animated, {
  LightSpeedOutRight,
  Layout,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import GestureRecognizer from "react-native-swipe-gestures";

const TaskItem = ({
  task,
  orderNumber,
  deleteTask,
  pickTask,
  toggleTaskCompleted,
  detailsAreVisible,
  setDetailsAreVisible,
  highLighted,
}) => {
  const [modalIsVisible, setModalIsVisible] = useState(false);
  const [descriptionIsVisible, setDescriptionIsVisible] = useState(false);
  const [repeatCounter, setRepeatCounter] = useState(
    task.isCompleted ? task.repeat : 0
  );

  const offset = useSharedValue(0);
  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: offset.value }],
    };
  });

  const toggleDetails = () => {
    offset.value = withTiming(offset.value < 0 ? 0 : -65, {
      duration: 250,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    });
    const tempArr = [].concat(detailsAreVisible);
    if (offset.value < 0) {
      tempArr[orderNumber] = false;
    } else {
      tempArr[orderNumber] = true;
    }
    setDetailsAreVisible(tempArr);
  };

  useEffect(() => {
    if (detailsAreVisible[orderNumber] === false) {
      offset.value = withTiming(0, {
        duration: 250,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      });
    }
  }, [detailsAreVisible[orderNumber]]);

  let [fontsLoaded] = useFonts({
    RedHatDisplay_400Regular,
  });

  if (!fontsLoaded) {
    return null;
  }

  const hideTimerModal = () => {
    setModalIsVisible(false);
  };

  const showTimerModal = () => {
    setModalIsVisible(true);
  };

  const completeTask = () => {
    if (task.repeat > 1 && repeatCounter < task.repeat) {
      setRepeatCounter(repeatCounter + 1);
      if (repeatCounter === task.repeat - 1) {
        toggleTaskCompleted();
      }
    } else {
      toggleTaskCompleted();
    }
    if (repeatCounter === task.repeat) {
      setRepeatCounter(0);
    }
  };

  const swipeLeft = () => {
    offset.value = withTiming(offset.value > 0 ? 0 : -65, {
      duration: 350,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    });
  };

  const swipeRight = () => {
    offset.value = withTiming(0, {
      duration: 250,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    });
  };

  return (
    <GestureRecognizer
      onSwipeLeft={() => swipeLeft()}
      onSwipeRight={() => swipeRight()}
    >
      <Animated.View
        style={[styles.container, highLighted && styles.highLightedContainer]}
        exiting={LightSpeedOutRight}
        layout={Layout.springify()}
      >
        <View style={styles.buttons}>
          <Pressable style={styles.delete} onPress={() => deleteTask()}>
            <Image
              style={styles.deleteIcon}
              source={require("../assets/icons/delete.png")}
            />
          </Pressable>
          <Pressable style={styles.edit} onPress={pickTask}>
            <Image
              style={styles.editIcon}
              source={require("../assets/icons/edit.png")}
            />
          </Pressable>
        </View>
        <Animated.View style={[styles.taskContainerWrapper, animatedStyles]}>
          <View
            style={[
              styles.taskContainer,
              highLighted && styles.highLightedItem,
            ]}
          >
            <CheckBox
              highLighted={highLighted}
              onPress={completeTask}
              title={task.text}
              repeatCounter={repeatCounter}
              repeat={task.repeat}
            />
            <View style={styles.iconsContainer}>
              {task.timer && (
                <Pressable
                  style={styles.showTimerModal}
                  onPress={showTimerModal}
                  disabled={task.isCompleted}
                >
                  <Image
                    style={[
                      styles.timerIcon,
                      task.isCompleted && styles.iconIsInactive,
                    ]}
                    source={require("../assets/icons/timer_icon.png")}
                  />
                </Pressable>
              )}
              {task.repeat > 1 && (
                <Image
                  style={[
                    styles.repeatIcon,
                    task.isCompleted && styles.iconIsInactive,
                  ]}
                  source={require("../assets/icons/repeat.png")}
                />
              )}
              {task.priority && (
                <Image
                  style={[
                    styles.priorityIcon,
                    task.isCompleted && styles.iconIsInactive,
                  ]}
                  source={require("../assets/icons/priority.png")}
                />
              )}
              <Pressable style={styles.details} onPress={() => toggleDetails()}>
                <Image
                  style={styles.detailsIcon}
                  source={require("../assets/icons/details.png")}
                />
              </Pressable>
            </View>
          </View>
          {task.description && descriptionIsVisible && (
            <LinearGradient
              style={styles.taskDescriptionContainer}
              colors={[Colors.background, Colors.gradientStart]}
              locations={[0.06, 1]}
            >
              <Text
                style={[
                  styles.taskDescriptionText,
                  task.isCompleted && styles.taskCompleted,
                ]}
              >
                {task.description}
              </Text>
            </LinearGradient>
          )}
        </Animated.View>
        <TimerModal
          visible={modalIsVisible}
          task={task}
          hideModal={hideTimerModal}
          completeTask={completeTask}
        />
      </Animated.View>
    </GestureRecognizer>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "top",
    paddingHorizontal: 30,
  },
  taskContainerWrapper: {
    flex: 1,
  },
  taskContainer: {
    position: "relative",
    minHeight: 33,
    flex: 1,
    flexDirection: "row",
    justifyContent: "start",
    alignItems: "center",
    flexDirection: "row",
    padding: 9,
    backgroundColor: Colors.background,
    shadowColor: Colors.primary,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    borderRadius: 4,
    zIndex: 1,
  },
  highLightedContainer: {
    position: "relative",
    zIndex: 12,
  },
  highLightedItem: {
    backgroundColor: Colors.primary,
    position: "relative",
    zIndex: 12,
  },
  checkbox: {
    width: 16,
    height: 16,
    marginRight: 12,
    borderWidth: 1,
    borderColor: Colors.lightPrimary,
  },
  taskTextWrapper: {
    flex: 1,
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
  taskDescriptionContainer: {
    paddingTop: 13,
    paddingHorizontal: 36,
    paddingBottom: 10,
    marginBottom: -4,
    borderColor: Colors.gradientStart,
    borderWidth: 1,
    borderBottomLeftRadius: 3.5,
    borderBottomRightRadius: 3.5,
  },
  taskDescriptionText: {
    color: Colors.lightPrimary,
    fontSize: 10,
    lineHeight: 13,
  },
  timerIcon: {
    width: 14,
    height: 17.5,
    marginLeft: 5,
  },
  priorityIcon: {
    width: 15.5,
    height: 15,
    marginLeft: 5,
  },
  repeatIcon: {
    width: 14,
    height: 14,
    marginLeft: 5,
  },
  iconIsInactive: {
    opacity: 0.5,
  },
  iconsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: "auto",
  },
  buttons: {
    flexDirection: "row",
    position: "absolute",
    right: 30,
    zIndex: 0,
  },
  delete: {
    width: 26,
    height: 26,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.primary,
    borderRadius: 4,
    marginTop: 4,
    marginLeft: 6,
  },
  deleteIcon: {
    width: 12,
    height: 12.5,
  },
  edit: {
    width: 26,
    height: 26,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.primary,
    borderRadius: 4,
    marginTop: 4,
    marginLeft: 6,
  },
  editIcon: {
    width: 10.5,
    height: 10,
  },
  details: {
    padding: 5,
    marginLeft: 6,
  },
  detailsIcon: {
    width: 2.5,
    height: 9,
  },
});

export default TaskItem;
