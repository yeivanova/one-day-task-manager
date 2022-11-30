import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  Modal,
  Pressable,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import Header from "../components/Header";
import ControlPanel from "../components/ControlPanel";
import ActionButton from "../components/ActionButton";
import DefaultButton from "../components/DefaultButton";
import Input from "../components/Input";
import NumberInput from "../components/NumberInput";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import {
  useFonts,
  RedHatDisplay_400Regular,
  RedHatDisplay_500Medium,
  RedHatDisplay_700Bold,
  RedHatDisplay_900Black,
} from "@expo-google-fonts/red-hat-display";

const TaskModal = ({ editMode, setEditMode, visible, addTask, editingTask, editTask, hideModal }) => {
  const insets = useSafeAreaInsets();
  const [taskText, setTaskText] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [priority, setPriority] = useState(false);
  const [timer, setTimer] = useState(false);
  const [timerDurationMinutes, setTimerDurationMinutes] = useState(0);
  const [timerDurationSeconds, setTimerDurationSeconds] = useState(0);

  useEffect(() => {
    if (editMode && editingTask) {
      setTaskText(editingTask.text ?? "");
      setTaskDescription(editingTask.description ?? "")
      setPriority(editingTask.priority ?? "");
      setTimer(editingTask.timer ?? "");
      setTimerDurationMinutes(editingTask.timerDuration ? Math.floor(editingTask.timerDuration / 60).toString() : "0");
      setTimerDurationSeconds(editingTask.timerDuration ? (editingTask.timerDuration % 60).toString() : "0");
    }
  }, [editingTask, editMode, visible]);

  let [fontsLoaded] = useFonts({
    RedHatDisplay_400Regular,
    RedHatDisplay_500Medium,
    RedHatDisplay_700Bold,
    RedHatDisplay_900Black,
  });

  if (!fontsLoaded) {
    return null;
  }

  const clearFields = () => {
    setTaskText("");
    setTaskDescription("");
    setPriority(false);
    setTimer(false);
    setTimerDurationMinutes(0);
    setTimerDurationSeconds(0);
  }

  const handleTask = (task) => {
    if (editMode) {
      editTask(task);
    }
    else {
      addTask(task);
    }
    clearFields();
    setEditMode(false);
  };

  const handleCancelTask = () => {
    hideModal();
    clearFields();
    setEditMode(false);
  };

  const handleMinutes = (value) => {
    number = parseInt(value);
    if (value.length === 0) {
      setTimerDurationMinutes("");
    } else {
      setTimerDurationMinutes(number);
      if (number >= 59) {
        setTimerDurationMinutes(59);
      } else if (number < 0) {
        setTimerDurationMinutes(0);
      } else setTimerDurationMinutes(number);
    }
  };

  const handleSeconds = (value) => {
    number = parseInt(value);
    if (value.length === 0) {
      setTimerDurationSeconds("");
    } else {
      setTimerDurationSeconds(number);
      if (number >= 59) {
        setTimerDurationSeconds(59);
      } else if (number < 0) {
        setTimerDurationSeconds(0);
      } else setTimerDurationSeconds(number);
    }
  };

  let timerIcon = timer
    ? require("../assets/icons/timer.png")
    : require("../assets/icons/timer-inactive.png");

  let priorityIcon = priority
    ? require("../assets/icons/priority.png")
    : require("../assets/icons/priority-inactive.png");

  return (
    <Modal visible={visible} animationType="fade">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View
          style={[
            { paddingTop: insets.top, paddingBottom: insets.bottom },
            styles.page,
          ]}
        >
          <Pressable
            style={[{ paddingTop: insets.top }, styles.cancel]}
            onPress={handleCancelTask}
          >
            <Image
              style={styles.backIcon}
              source={require("../assets/icons/back.png")}
            />
            <Text style={styles.cancelText}>Forget it</Text>
          </Pressable>
          <Header text="task" />
          <LinearGradient
            colors={["#ffffff", "#F9F9FF"]}
            locations={[0.0413, 0.26]}
            style={styles.mainPanel}
          >
            <Input
              value={taskText ?? ""}
              onChangeText={(text) => setTaskText(text)}
              placeholder={"What needs to be done?"}
            />
            <View style={styles.row}>
              <View style={styles.cell}>
                <DefaultButton onPress={() => setPriority(!priority)}>
                  <Image style={styles.priorityIcon} source={priorityIcon} />
                  <Text style={styles.defaultButtonText}>Prioprity</Text>
                </DefaultButton>
              </View>
              <View
                style={[
                  styles.cell,
                  styles.note,
                  priority && styles.noteIsActive,
                ]}
              >
                <Image
                  style={styles.noteIcon}
                  source={require("../assets/icons/note.png")}
                />
                <Text style={styles.noteText}>
                  This task will not be shuffled
                </Text>
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.cell}>
                <DefaultButton onPress={() => setTimer(!timer)}>
                  <Image style={styles.timerIcon} source={timerIcon} />
                  <Text style={styles.defaultButtonText}>Add timer</Text>
                </DefaultButton>
              </View>
              <View style={styles.timeField}>
                <NumberInput
                  editable={timer}
                  maxLength={2}
                  value={timerDurationMinutes}
                  onChangeHandle={handleMinutes}
                  setValue={setTimerDurationMinutes}
                  placeholder={"0"}
                  label={"min"}
                />
              </View>
              <Text style={styles.separator}>:</Text>
              <View style={styles.timeField}>
                <NumberInput
                  editable={timer}
                  maxLength={2}
                  value={timerDurationSeconds}
                  onChangeHandle={handleSeconds}
                  setValue={setTimerDurationSeconds}
                  placeholder={"0"}
                  label={"sec"}
                />
              </View>
            </View>
            <Input
              value={taskDescription || ""}
              multiline={true}
              onChangeText={(taskDescription) =>
                setTaskDescription(taskDescription)
              }
              placeholder={"Details"}
            />
          </LinearGradient>
          <ControlPanel>
            <ActionButton
              style={styles.button}
              onPress={() =>
                handleTask({
                  id: editMode ? editingTask.id : new Date().toISOString(),
                  text: taskText,
                  description: taskDescription,
                  isCompleted: editMode ? editingTask.isCompleted : false,
                  priority: priority,
                  timer: timer,
                  timerDuration:
                    timerDurationMinutes * 60 + timerDurationSeconds,
                  repeat: 1,
                })
              }
              isDisabled={!taskText}
            >
              <Text style={styles.addButtonText}>Ok</Text>
            </ActionButton>
          </ControlPanel>
        </View>
      </TouchableWithoutFeedback>
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
    alignContent: "stretch",
    paddingTop: 27,
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
    color: "#806DFF",
    marginLeft: 6,
  },
  backIcon: {
    width: 18.5,
    height: 13.5,
  },
  separator: {
    fontSize: 10,
    lineHeight: 10,
    fontFamily: "RedHatDisplay_700Bold",
    color: "rgba(123, 97, 255, 0.5)",
  },
  addButtonText: {
    alignSelf: "center",
    fontSize: 11,
    lineHeight: 30,
    fontFamily: "RedHatDisplay_700Bold",
    color: "#ffffff",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  timerow: {
    width: "48%%",
  },
  cell: {
    width: "48%",
    justifyContent: "center",
  },
  defaultButtonText: {
    fontSize: 12,
    lineHeight: 16,
    fontFamily: "RedHatDisplay_400Regular",
    marginLeft: 10,
  },
  note: {
    flexDirection: "row",
    justifyContent: "center",
    alignContent: "center",
    opacity: 0.5,
  },
  noteIsActive: {
    opacity: 1,
  },
  noteIcon: {
    width: 6,
    height: 6,
    marginRight: 6,
  },
  noteText: {
    fontSize: 8,
    lineHeight: 8,
    color: "#585A66",
  },
  timerIcon: {
    width: 14,
    height: 17.5,
  },
  priorityIcon: {
    width: 15.5,
    height: 15,
  },
});

export default TaskModal;
