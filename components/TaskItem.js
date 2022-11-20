import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import Checkbox from "expo-checkbox";
import {
  useFonts,
  RedHatDisplay_400Regular,
} from "@expo-google-fonts/red-hat-display";

const TaskItem = ({ task, deleteTask, toggleTaskCompleted }) => {
  let [fontsLoaded] = useFonts({
    RedHatDisplay_400Regular,
  });

  if (!fontsLoaded) {
    return null;
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
        <Text style={[styles.task, task.isCompleted && styles.taskCompleted]}>
          {task.text}
        </Text>
        {task.priority && (
          <AntDesign
            name="star"
            size={14}
            style={styles.priority}
            color="#806DFF"
          />
        )}
      </View>
      <TouchableOpacity style={styles.delete} onPress={() => deleteTask()}>
        <AntDesign name="delete" size={14} color="#ffffff" />
      </TouchableOpacity>
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
  priority: {
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