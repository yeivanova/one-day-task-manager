import React, { useState } from "react";
import { StyleSheet, Text, View, Pressable } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import Checkbox from "expo-checkbox";
import {
  useFonts,
  RedHatDisplay_400Regular,
} from "@expo-google-fonts/red-hat-display";
import TimerModal from "../screens/TimerModal"

const TaskItem = ({ task, deleteTask, toggleTaskCompleted }) => {
  const [modalIsVisible, setModalIsVisible] = useState(false);
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
  }

  return (
    <View style={styles.container}>
      <View style={styles.taskContainer}>
        <Checkbox
          style={styles.checkbox}
          color={task.isCompleted ? "#806DFF" : undefined}
          value={task.isCompleted}
          onValueChange={() => toggleTaskCompleted(task.id)}
        />
        <Pressable style={styles.taskTextWrapper} onPress={() => toggleTaskCompleted(task.id)}>
          <Text style={[styles.task, task.isCompleted && styles.taskCompleted]}>
            {task.text}
          </Text>
        </Pressable>
        <View style={styles.iconsContainer}>
        {task.timer && (
          <Pressable style={styles.showTimerModal} onPress={showTimerModal} disabled={task.isCompleted}>
            <Ionicons
                name="ios-timer"
                size={14}
                style={styles.icon}
                color={task.isCompleted ? "#B3A4FF" : "#806DFF"}
              />
          </Pressable>
        )}
        {task.priority && (
          <AntDesign
            name="star"
            size={14}
            style={styles.icon}
            color="#806DFF"
          />
        )}
        </View>
      </View>
      <Pressable style={styles.delete} onPress={() => deleteTask()}>
        <AntDesign name="delete" size={14} color="#ffffff" />
      </Pressable>
      <TimerModal
        visible={modalIsVisible}
        task={task}
        hideModal={hideTimerModal}
        toggleTaskCompleted={toggleTaskCompleted}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
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
  icon: {
    marginLeft: 5
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
    marginLeft: 10,
  },
});

export default TaskItem;
