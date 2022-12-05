import React, { useState } from "react";
import { StyleSheet, Text, Image, View, Pressable } from "react-native";
import Checkbox from "expo-checkbox";
import {
  useFonts,
  RedHatDisplay_400Regular,
} from "@expo-google-fonts/red-hat-display";
import TimerModal from "../screens/TimerModal";
import CheckBox from "./CheckBox";
import Colors from "../constants/colors";
import Animated, { LightSpeedOutRight, Layout } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";

const TaskItem = ({ task, deleteTask, pickTask, toggleTaskCompleted }) => {
  const [modalIsVisible, setModalIsVisible] = useState(false);
  const [descriptionIsVisible, setDescriptionIsVisible] = useState(false);
  const [repeatCounter, setRepeatCounter] = useState(0);

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

  return (
    <Animated.View
      style={styles.container}
      exiting={LightSpeedOutRight}
      layout={Layout.springify()}
    >
      <View style={styles.taskContainerWrapper}>
        <View style={styles.taskContainer}>
          <CheckBox
            isCompleted={task.isCompleted}
            repeat={task.repeat}
            onPress={completeTask}
            title={task.text}
            repeatCounter={repeatCounter}
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
      </View>
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
      <TimerModal
        visible={modalIsVisible}
        task={task}
        hideModal={hideTimerModal}
        completeTask={completeTask}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "top",
  },
  taskContainerWrapper: {
    flex: 1,
  },
  taskContainer: {
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
});

export default TaskItem;
