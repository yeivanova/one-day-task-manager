import React, { useState } from "react";
import { StyleSheet, Text, Image, View, Pressable } from "react-native";
import Checkbox from "expo-checkbox";
import {
  useFonts,
  RedHatDisplay_400Regular,
} from "@expo-google-fonts/red-hat-display";
import TimerModal from "../screens/TimerModal";
import Animated, { LightSpeedOutRight, Layout } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";

const TaskItem = ({ task, deleteTask, pickTask, toggleTaskCompleted }) => {
  const [modalIsVisible, setModalIsVisible] = useState(false);
  const [descriptionIsVisible, setDescriptionIsVisible] = useState(false);
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

  return (
    <Animated.View
      style={styles.container}
      exiting={LightSpeedOutRight}
      layout={Layout.springify()}
    >
      <View style={styles.taskContainerWrapper}>
        <View style={styles.taskContainer}>
          <Checkbox
            style={styles.checkbox}
            color={task.isCompleted ? "#806DFF" : undefined}
            value={task.isCompleted}
            onValueChange={() => toggleTaskCompleted(task.id)}
          />
          <Pressable
            style={styles.taskTextWrapper}
            onPress={() => toggleTaskCompleted(task.id)}
          >
            <Text
              style={[styles.task, task.isCompleted && styles.taskCompleted]}
            >
              {task.text}
            </Text>
          </Pressable>
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
          <LinearGradient style={styles.taskDescriptionContainer}
            colors={["rgba(255, 255, 255, 1)", "#F9F9FF"]}
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
        toggleTaskCompleted={toggleTaskCompleted}
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
    backgroundColor: "#ffffff",
    shadowColor: "rgb(128, 109, 255)",
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
    borderColor: "#B3A4FF",
  },
  taskTextWrapper: {
    flex: 1,
  },
  task: {
    maxWidth: "80%",
    color: "#000000",
    fontSize: 12,
    lineHeight: 14,
    fontFamily: "RedHatDisplay_400Regular",
  },
  taskCompleted: {
    color: "rgba(123, 97, 255, 0.4)",
    textDecorationLine: "line-through",
  },
  taskDescriptionContainer: {
    paddingTop: 13,
    paddingHorizontal: 36,
    paddingBottom: 10,
    marginBottom: -4,
    borderColor: "#F9F9FF",
    borderWidth: 1,
    borderBottomLeftRadius: 3.5,
    borderBottomRightRadius: 3.5,
  },
  taskDescriptionText: {
    color: "#7B61FF",
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
  iconIsInactive: {
    opacity: 0.5,
  },
  iconsContainer: {
    flexDirection: "row",
    marginLeft: "auto",
  },
  delete: {
    width: 26,
    height: 26,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#806DFF",
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
    backgroundColor: "#806DFF",
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
