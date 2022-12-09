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
  TouchableWithoutFeedback,
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
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
  withDelay,
  Easing,
} from "react-native-reanimated";
import { BlurView } from "expo-blur";

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
  const [detailsAreVisible, setDetailsAreVisible] = useState(
    new Array(tasks.length).fill(false)
  );
  const [randomTask, setRandomTask] = useState();
  const [blurIsVisible, setBlurIsVisible] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const opacity = useSharedValue(0);

  const animatedStyles = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  const sortTasks = (data, shuffle = false) => {
    const priorityIncompleteData = [...data].filter(
      (task) => task.priority === true && task.isCompleted === false
    );
    const nonPriorityIncompleteData = [...data].filter(
      (task) => task.priority === false && task.isCompleted === false
    );
    if (shuffle) {
      for (let i = nonPriorityIncompleteData.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [nonPriorityIncompleteData[i], nonPriorityIncompleteData[j]] = [nonPriorityIncompleteData[j], nonPriorityIncompleteData[i]];
      }
    }
    const completeData = [...data].filter((task) => task.isCompleted === true);
    return [
      ...priorityIncompleteData,
      ...nonPriorityIncompleteData,
      ...completeData,
    ];
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
    hideDetails();
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

  let diceIcon = blurIsVisible ? require("../assets/icons/dice-active.png") : require("../assets/icons/dice-inactive.png");

  let shuffleIcon = shuffle ? require("../assets/icons/shuffle-active.png") : require("../assets/icons/shuffle-inactive.png");

  const hideDetails = () => {
    setDetailsAreVisible(new Array(tasks.length).fill(false));
  };

  const shuffleTasks = () => {
    const nonPriorityIncompleteData = tasks.filter(
      (task) => task.priority === false && task.isCompleted === false
    );
    if (nonPriorityIncompleteData.length > 1) {
      const sortedTasks = sortTasks(tasks, true);
      setTasks(sortedTasks);
      setTasksList(sortedTasks);
    }
    setShuffle(true);
    let shuffleTimer = setTimeout(() => setShuffle(false), 2000);
  };

  const highLightRandomTask = () => {
    const inCompleteTasksLength = [
      ...tasks.filter((task) => task.isCompleted === false),
    ].length;
    if (inCompleteTasksLength > 0) {
      const randomTask = tasks[Math.floor(Math.random() * inCompleteTasksLength)];
      setRandomTask(randomTask);
      setBlurIsVisible(true);
      let blurTimer = setTimeout(() => setBlurIsVisible(false), 3200);
      opacity.value = withSequence(
        withTiming(1, {
          duration: 800,
          easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        }),
        withDelay(
          1800,
          withTiming(0, {
            duration: 800,
            easing: Easing.bezier(0.25, 0.1, 0.25, 1),
          })
        )
      );
    }
  };

  const renderItem = ({ item, drag, isActive }) => {
    return (
      <TouchableOpacity
        activeOpacity={1}
        onLongPress={drag}
        disabled={isActive}
        style={isActive && styles.draggableItem}
      >
        <View
          style={[
            styles.taskContainer,
            {
              zIndex:
                blurIsVisible && randomTask && randomTask.id === item.id
                  ? 10
                  : 1,
            },
          ]}
        >
          <TaskItem
            highLighted={
              blurIsVisible && randomTask && randomTask.id === item.id
            }
            itemRefs={itemRefs}
            onCheckboxChange={() => setIsCompleted(!item.isCompleted)}
            task={item}
            orderNumber={tasks.findIndex((el) => el.id === item.id)}
            deleteTask={() => deleteTask(item.id)}
            pickTask={() => pickTask(item.id)}
            toggleTaskCompleted={() => toggleTaskCompleted(item.id)}
            detailsAreVisible={detailsAreVisible}
            setDetailsAreVisible={setDetailsAreVisible}
          />
        </View>
        <Animated.View
          style={[
            styles.blurWrapper,
            animatedStyles,
            {
              zIndex:
                blurIsVisible && randomTask && randomTask.id !== item.id
                  ? 1
                  : -1,
            },
          ]}
        >
          <BlurView
            intensity={15}
            style={[
              styles.blurView,
              styles.nonBlurredContent,
              {
                zIndex:
                  blurIsVisible && randomTask && randomTask.id !== item.id
                    ? 1
                    : -1,
              },
            ]}
          />
        </Animated.View>
      </TouchableOpacity>
    );
  };

  return (
    <TouchableWithoutFeedback onPress={hideDetails} style={styles.view}>
        <SafeAreaView style={styles.page} onLayout={onLayout}>
          <Header text="list">
            <Animated.View
              style={[
                styles.blurWrapper,
                animatedStyles,
                {
                  zIndex: blurIsVisible ? 1 : -1,
                },
              ]}
            >
              <BlurView
                intensity={15}
                style={[
                  styles.blurView,
                  styles.nonBlurredContent,
                  {
                    zIndex: blurIsVisible ? 1 : -1,
                  },
                ]}
              />
            </Animated.View>
          </Header>
          <View style={styles.container}>
            <View style={styles.tabsContainer}>
              {tabsList.map((tab, index) => (
                <Pressable
                  style={[
                    styles.tab,
                    activeTab === tab.text && styles.tabIsActive,
                  ]}
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
                style={styles.unBlur}
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
            <Animated.View
              style={[
                styles.blurWrapperBorder,
                animatedStyles,
                {
                  zIndex: blurIsVisible ? 30 : -1,
                },
              ]}
            >
              <BlurView
                intensity={15}
                style={[
                  styles.blurView,
                  styles.nonBlurredContent,
                  {
                    zIndex: blurIsVisible ? 30 : -1,
                  },
                ]}
              />
            </Animated.View>
            <Animated.View
              style={[
                styles.blurWrapper,
                animatedStyles,
                {
                  zIndex: blurIsVisible ? 1 : -1,
                },
              ]}
            >
              <BlurView
                intensity={15}
                style={[
                  styles.blurView,
                  styles.nonBlurredContent,
                  {
                    zIndex: blurIsVisible ? 1 : -1,
                  },
                ]}
              />
            </Animated.View>
          </View>
          <ControlPanel>
            <View style={styles.controlView}>
              <Animated.View
                style={[
                  styles.blurWrapperBottom,
                  animatedStyles,
                  {
                    zIndex: blurIsVisible ? 1 : -1,
                  },
                ]}
              >
                <BlurView
                  tint={"light"}
                  intensity={15}
                  style={[
                    styles.blurView,
                    {
                      zIndex: blurIsVisible ? 1 : -1,
                      opacity: blurIsVisible ? 1 : 0,
                    },
                  ]}
                />
              </Animated.View>
              <Pressable style={styles.shuffleButton} onPress={shuffleTasks}>
                <Image
                  style={styles.shuffleIcon}
                  source={shuffleIcon}
                />
              </Pressable>
              <ActionButton onPress={() => dropTask()}>
                <Image
                  style={styles.addIcon}
                  source={require("../assets/icons/add.png")}
                />
              </ActionButton>
              <Pressable
                style={styles.diceButton}
                onPress={highLightRandomTask}
              >
                <Image
                  style={styles.diceIcon}
                  source={diceIcon}
                />
              </Pressable>
            </View>
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
        </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  splash: {
    flex: 1,
    alighItems: "center",
    margin: 0,
  },
  view: {
    position: "relative",
    flex: 1,
    borderWidth: 1,
    zIndex: 14,
    backgroundColor: Colors.lightPrimary
  },
  page: {
    flex: 1,
  },
  blurWrapper: {
    flex: 1,
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(255, 255, 255, 0.17)",
  },
  blurWrapperBorder: {
    flex: 1,
    height: 70,
    position: "absolute",
    top: 20,
    left: 0,
    right: 0,
  },
  blurWrapperBottom: {
    flex: 1,
    position: "absolute",
    top: -35,
    bottom: 0,
    left: 0,
    right: 0,
  },
  blurView: {
    flex: 1,
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  blurViewBorder: {
    flex: 1,
    height: 40,
    position: "absolute",
    top: 20,
    left: 0,
    right: 0,
  },
  blurViewBottom: {
    flex: 1,
    position: "absolute",
    top: -35,
    bottom: 0,
    left: 0,
    right: 0,
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
    paddingVertical: 30,
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
    position: "relative",
    zIndex: 12,
  },
  taskContainer: {
    padding: 4,
  },
  unBlur: {
    position: "relative",
    zIndex: 12,
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
    paddingLeft: 30,
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
    paddingRight: 30,
  },
  controlView: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignContent: "center",
    position: "relative",
    zIndex: 10,
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
  shuffleButton: {
    width: 50,
    marginRight: 25,
    justifyContent: "center",
    alignContent: "flex-end",
  },
  shuffleIcon: {
    width: 17.5,
    height: 15,
    marginHorizontal: 15,
  },
  diceButton: {
    width: 50,
    marginLeft: 25,
    justifyContent: "center",
    alignContent: "center",
  },
  diceIcon: {
    width: 31,
    height: 27,
    marginHorizontal: 9,
  },
});
