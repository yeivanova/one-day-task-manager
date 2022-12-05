import React, {
  useCallback,
  useEffect,
  useState,
  createRef,
  useRef,
} from "react";
import {
  Keyboard,
  Pressable,
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { mockData } from "../mockData";
import * as SplashScreen from "expo-splash-screen";
import * as Font from "expo-font";
import Header from "../components/Header";
import TaskModal from "./TaskModal";
import TaskItem from "../components/TaskItem";
import ControlPanel from "../components/ControlPanel";
import ActionButton from "../components/ActionButton";
import Colors from "../constants/colors";
import { LinearGradient } from "expo-linear-gradient";
import DraggableFlatList from "react-native-draggable-flatlist";
import {
  useFonts,
  RedHatDisplay_300Light,
  RedHatDisplay_400Regular,
  RedHatDisplay_500Medium,
  RedHatDisplay_600SemiBold,
  RedHatDisplay_700Bold,
  RedHatDisplay_800ExtraBold,
  RedHatDisplay_900Black,
  RedHatDisplay_300Light_Italic,
  RedHatDisplay_400Regular_Italic,
  RedHatDisplay_500Medium_Italic,
  RedHatDisplay_600SemiBold_Italic,
  RedHatDisplay_700Bold_Italic,
  RedHatDisplay_800ExtraBold_Italic,
  RedHatDisplay_900Black_Italic,
} from "@expo-google-fonts/red-hat-display";

SplashScreen.preventAutoHideAsync();

export default function Main() {
  const [appIsReady, setAppIsReady] = useState(false);
  const [modalIsVisible, setModalIsVisible] = useState(false);
  const [tasks, setTasks] = useState(mockData);
  const [tasksList, setTasksList] = useState(mockData);
  const [isEditing, setIsEditing] = useState(false);
  const [editingTask, setEditingTask] = useState(undefined);
  const itemRefs = useRef(new Map());
  const [isClearButtonActive, setisClearButtonActive] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [activeTab, setActiveTab] = useState("All");

  const sortTasks = (data) => {
    const priorityIncompleteData = [...data].filter(task => task.priority === true && task.isCompleted === false);
    const nonPriorityIncompleteData = [...data].filter(task => task.priority === false && task.isCompleted === false);
    const completeData = [...data].filter(task => task.isCompleted === true);
    return [...priorityIncompleteData, ...nonPriorityIncompleteData, ...completeData];
  };

  useEffect(() => {
    const sortedTasks = sortTasks(tasks);
    setTasks(sortedTasks);
    setTasksList(sortedTasks);
  }, []);

  const setStatusFilter = (tab) => {
    switch (tab) {
      case "Active":
        setTasksList([...tasks.filter((task) => task.isCompleted === false)]);
        break;
      case "Completed":
        setTasksList([...tasks.filter((task) => task.isCompleted === true)]);
        break;
      default:
        setTasksList([...tasks]);
    }
    setActiveTab(tab);
  };

  const ref = createRef();
  const flatListRef = useRef(null);

  const showModal = () => {
    setModalIsVisible(true);
  };

  const hideModal = () => {
    setModalIsVisible(false);
  };

  const pickTask = (index) => {
    setEditingTask(tasks.find((task, id) => task.id === index));
    setIsEditing(true);
    showModal(true);
  };

  const dropTask = () => {
    setEditingTask(undefined);
    setIsEditing(false);
    showModal(true);
  };

  const addTask = (task) => {
    if (tasks === null) return;
    setTasks((currentTasks) => sortTasks([...currentTasks, task]));
    setTasksList((currentTasks) => sortTasks([...currentTasks, task]));
    Keyboard.dismiss();
    hideModal();
  };

  const deleteTask = (deleteIndex) => {
    const tempArr = [].concat(tasks.filter((task) => task.id != deleteIndex));
    setTasks(tempArr);
    setTasksList(tempArr);
    setisClearButtonActive(tempArr.some((task) => task.isCompleted === true));
  };

  const editTask = (task) => {
    if (tasks === null) return;
    const tempArr = [].concat(tasks);
    let foundIndex = tempArr.findIndex((x) => x.id == editingTask.id);
    tempArr[foundIndex] = task;
    setTasks(sortTasks(tempArr));
    setTasksList(sortTasks(tempArr));
    Keyboard.dismiss();
    hideModal();
  };

  const clearCompetedTasks = () => {
    const tempArr = [].concat(
      tasks.filter((task) => task.isCompleted === false)
    );
    setTasks(tempArr);
    setTasksList(tempArr);
    setActiveTab("All");
    setisClearButtonActive(tempArr.some((task) => task.isCompleted === true));
  };

  const toggleTaskCompleted = (id) => {
    const updatedTasks = tasks.map((task) => {
      if (id === task.id) {
        return { ...task, isCompleted: !task.isCompleted };
      }
      return task;
    });

    setTasks(sortTasks(updatedTasks));
    setTasksList(sortTasks(updatedTasks));
    setisClearButtonActive(
      updatedTasks.some((task) => task.isCompleted === true)
    );
  };

  useEffect(() => {
    (async () => {
      try {
        await SplashScreen.preventAutoHideAsync();
        await Font.loadAsync({
          RedHatDisplay_500Medium,
          RedHatDisplay_700Bold,
          RedHatDisplay_900Black,
        });
      } catch {
        console.log("error");
      } finally {
        setAppIsReady(true);
      }
    })();
  }, []);

  const onLayout = useCallback(() => {
    if (appIsReady) {
      SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  const tabsList = [
    {
      text: "All",
    },
    {
      text: "Active",
    },
    {
      text: "Completed",
    },
  ];

  let clearIcon = isClearButtonActive
    ? require("../assets/icons/clear.png")
    : require("../assets/icons/clear-inactive.png");

  const renderItem = ({ item, drag, isActive }) => {
    return (
      <TouchableOpacity
        activeOpacity={1}
        onLongPress={drag}
        disabled={isActive}
        style={isActive && styles.draggableItem}
      >
        <View style={styles.taskContainer}>
          <TaskItem
            itemRefs={itemRefs}
            onCheckboxChange={() => setIsCompleted(!item.isCompleted)}
            task={item}
            deleteTask={() => deleteTask(item.id)}
            pickTask={() => pickTask(item.id)}
            toggleTaskCompleted={() => toggleTaskCompleted(item.id)}
          />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.page} onLayout={onLayout}>
      <Header text="list" />
      <View style={styles.container}>
        <View style={styles.tabsContainer}>
          {tabsList.map((tab, index) => (
            <Pressable
              style={[styles.tab, activeTab === tab.text && styles.tabIsActive]}
              key={index}
              onPress={() => setStatusFilter(tab.text)}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === tab.text && styles.tabIsActiveText,
                ]}
              >
                {tab.text}
              </Text>
            </Pressable>
          ))}
        </View>
        <LinearGradient
          colors={[Colors.background, Colors.gradientStart]}
          locations={[0.0413, 0.26]}
          style={styles.mainPanel}
        >
          <View style={styles.clearContainer}>
            <Pressable
              style={styles.clearCompetedButton}
              onPress={clearCompetedTasks}
              disabled={!isClearButtonActive}
            >
              <Text
                style={[
                  styles.clearCompetedText,
                  isClearButtonActive && styles.clearCompetedButtonActive,
                ]}
              >
                Clear completed
              </Text>
              <Image style={styles.clearIcon} source={clearIcon} />
            </Pressable>
            <Text style={styles.itemsCount}>
              {tasks.filter((task) => !task.isCompleted).length} items left
            </Text>
          </View>
          <DraggableFlatList
            ref={ref}
            onRef={(ref) => {
              flatListRef.current = ref;
            }}
            data={tasksList}
            onDragEnd={({ data }) => {
              setTasks(data);
              setTasksList(data);
            }}
            renderItem={renderItem}
            alwaysBounceVertical={false}
            keyExtractor={(item, index) => item.id}
          />
        </LinearGradient>
      </View>
      <ControlPanel>
        <ActionButton style={styles.button} onPress={() => dropTask()}>
          <Image
            style={styles.addIcon}
            source={require("../assets/icons/add.png")}
          />
        </ActionButton>
      </ControlPanel>
      <TaskModal
        editMode={isEditing}
        setEditMode={setIsEditing}
        visible={modalIsVisible}
        addTask={addTask}
        editingTask={editingTask}
        editTask={editTask}
        hideModal={hideModal}
      />
      {/* <EditTaskModal
        visible={modalEditTaskIsVisible}
        task={editingTask}
        editTask={editTask}
        hideModal={hideEditTaskModal}
      /> */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  splash: {
    flex: 1,
    alighItems: "center",
    margin: 0,
  },
  page: {
    flex: 1,
    fontFamily: "RedHatDisplay_500Medium",
  },
  container: {
    maxWidth: 780,
    width: "100%",
    flex: 1,
    margin: "auto",
  },
  mainPanel: {
    flex: 1,
    justifyContent: "flex-start",
    alignContent: "stretch",
    padding: 30,
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
  taskContainer: {
    padding: 4,
  },
  tabsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  tab: {
    paddingHorizontal: 15,
    paddingVertical: 5,
  },
  tabIsActive: {
    borderBottomWidth: 3,
    borderBottomColor: Colors.primary,
    textShadowColor: "transparent",
  },
  tabText: {
    fontSize: 14,
    lineHeight: 19,
    color: Colors.inActiveText,
    textShadowColor: Colors.textShadow,
    textShadowOffset: { width: -0.3, height: -0.3 },
    textShadowRadius: 0.5,
    textAlign: "center",
  },
  tabIsActiveText: {
    color: Colors.primary,
  },
  clearContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignContent: "center",
    marginBottom: 14,
  },
  clearCompetedButton: {
    flexDirection: "row",
    justifyContent: "start",
    alignContent: "flex-start",
  },
  clearIcon: {
    width: 10,
    height: 10,
    marginLeft: 2,
    marginTop: 2,
  },
  clearCompetedText: {
    color: Colors.inActiveText,
    textShadowColor: Colors.textShadow,
    textShadowOffset: { width: -0.3, height: -0.3 },
    textShadowRadius: 0.5,
    fontSize: 8,
    lineHeight: 11,
    fontFamily: "RedHatDisplay_500Medium",
    textDecorationLine: "underline",
  },
  clearCompetedButtonActive: {
    color: Colors.activeText,
    textShadowColor: "transparent",
  },
  itemsCount: {
    fontSize: 9,
    lineHeight: 12,
    color: Colors.inActiveText,
    textShadowColor: Colors.textShadow,
    textShadowOffset: { width: -0.3, height: -0.3 },
    textShadowRadius: 0.5,
  },
  addIcon: {
    width: 18.5,
    height: 18.5,
    alignSelf: "center",
    marginVertical: 5,
    marginRight: 1,
  },
  draggableItem: {
    shadowColor: Colors.primary,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    borderRadius: 4,
  },
});
