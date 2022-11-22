import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  Modal,
  Pressable,
  KeyboardAvoidingView,
  TextInput,
} from "react-native";
import ControlPanel from "../components/ControlPanel";
import Header from "../components/Header";
import ActionButton from "../components/ActionButton";
import DefaultButton from "../components/DefaultButton";
import { LinearGradient } from "expo-linear-gradient";
import {
  useFonts,
  RedHatDisplay_400Regular,
  RedHatDisplay_500Medium,
  RedHatDisplay_700Bold,
  RedHatDisplay_900Black,
} from "@expo-google-fonts/red-hat-display";

const NewTaskModal = (props) => {
  const [taskText, setTaskText] = useState();
  const [priority, setPriority] = useState(false);
  const [timer, setTimer] = useState(false);

  let [fontsLoaded] = useFonts({
    RedHatDisplay_400Regular,
    RedHatDisplay_500Medium,
    RedHatDisplay_700Bold,
    RedHatDisplay_900Black,
  });

  if (!fontsLoaded) {
    return null;
  }

  const handleAddTask = (value) => {
    props.addTask(value);
    setTaskText("");
  };

  const handleCancelTask = () => {
    props.hideModal();
    setTaskText("");
  };

  let timerIcon = timer
    ? require("../assets/icons/timer.png")
    : require("../assets/icons/timer-inactive.png");

  let priorityIcon = priority
    ? require("../assets/icons/priority.png")
    : require("../assets/icons/priority-inactive.png");

  return (
    <Modal visible={props.visible} animationType="fade">
      <View style={styles.page}>
        <Pressable style={styles.cancel} onPress={handleCancelTask}>
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
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
          >
            <TextInput
              style={styles.inputField}
              value={taskText || ""}
              onChangeText={(text) => setTaskText(text)}
              placeholder={"What needs to be done?"}
              placeholderTextColor={"#585A66"}
            />
          </KeyboardAvoidingView>
          <View style={styles.buttonsContainer}>
            <View style={styles.defaultButton}>
              <DefaultButton onPress={() => setTimer(!timer)}>
                <Image style={styles.timerIcon} source={timerIcon} />
                <Text style={styles.defaultButtonText}>Add timer</Text>
              </DefaultButton>
            </View>
            <View style={styles.defaultButton}>
              <DefaultButton onPress={() => setPriority(!priority)}>
                <Image style={styles.priorityIcon} source={priorityIcon} />
                <Text style={styles.defaultButtonText}>Prioprity</Text>
              </DefaultButton>
            </View>
          </View>
        </LinearGradient>
        <ControlPanel>
          <ActionButton
            style={styles.button}
            onPress={() =>
              handleAddTask({
                text: taskText,
                id: new Date().toISOString(),
                isCompleted: false,
                priority: priority,
                timer: timer,
                timerDuration: 60,
                repeat: 1,
              })
            }
            isDisabled={!taskText}
          >
            <Text style={styles.addButtonText}>Ok</Text>
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
    alignContent: "stretch",
    paddingTop: 53,
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
  inputField: {
    fontSize: 12,
    lineHeight: 14,
    fontFamily: "RedHatDisplay_400Regular",
    color: "#585A66",
    height: 40,
    minHeight: 40,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: "#FCFCFF",
    borderWidth: 1,
    borderColor: "#B3A4FF",
    borderRadius: 6.8,
  },
  addButtonText: {
    alignSelf: "center",
    fontSize: 11,
    lineHeight: 30,
    fontFamily: "RedHatDisplay_700Bold",
    color: "#ffffff",
  },
  buttonsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 12,
  },
  defaultButton: {
    width: "48%",
    height: 40,
  },
  defaultButtonText: {
    fontSize: 12,
    lineHeight: 16,
    fontFamily: "RedHatDisplay_400Regular",
    marginLeft: 10,
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

export default NewTaskModal;
