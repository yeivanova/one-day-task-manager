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
import { mockData } from "../mockData";
import * as SplashScreen from "expo-splash-screen";
import * as Font from "expo-font";
import Header from "../components/Header";
import NewTaskModal from "./NewTaskModal";
import TaskItem from "../components/TaskItem";
import ControlPanel from "../components/ControlPanel";
import ActionButton from "../components/ActionButton";
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
  const itemRefs = useRef(new Map());
  const [isClearButtonActive, setisClearButtonActive] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const ref = createRef();
  const flatListRef = useRef(null);

  const showModal = () => {
    setModalIsVisible(true);
  };

  const hideModal = () => {
    setModalIsVisible(false);
  };

  const addTask = (task) => {
    if (tasks === null) return;
    setTasks((currentTasks) => [...currentTasks, task]);
    Keyboard.dismiss();
    hideModal();
  };

  const deleteTask = (deleteIndex) => {
    setTasks(tasks.filter((value) => value.id != deleteIndex));
  };

  const clearCompetedTasks = () => {
    const tempArr = [].concat(
      tasks.filter((task) => task.isCompleted === false)
    );
    setTasks(tempArr);
    setisClearButtonActive(tempArr.some((task) => task.isCompleted === true));
  };

  const toggleTaskCompleted = (id) => {
    const updatedTasks = tasks.map((task) => {
      if (id === task.id) {
        return { ...task, isCompleted: !task.isCompleted };
      }
      return task;
    });

    setTasks(updatedTasks);
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
            toggleTaskCompleted={toggleTaskCompleted}
          />
        </View>
      </TouchableOpacity>
    );
  };

  let clearIcon = isClearButtonActive
    ? require("../assets/icons/clear.png")
    : require("../assets/icons/clear-inactive.png");

  return (
    <View style={styles.page} onLayout={onLayout}>
      <Header text="list" />
      <View style={styles.container}>
        <LinearGradient
          colors={["#ffffff", "#F9F9FF"]}
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
            data={tasks}
            onDragEnd={({ data }) => setTasks(data)}
            renderItem={renderItem}
            alwaysBounceVertical={false}
            keyExtractor={(item, index) => item.id}
          />
        </LinearGradient>
      </View>
      <ControlPanel>
        <ActionButton style={styles.button} onPress={showModal}>
          <Image
            style={styles.addIcon}
            source={require("../assets/icons/add.png")}
          />
        </ActionButton>
      </ControlPanel>
      <NewTaskModal
        visible={modalIsVisible}
        tasks={tasks}
        addTask={addTask}
        hideModal={hideModal}
      />
    </View>
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
  taskContainer: {
    padding: 4,
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
    color: "#FAFBFF",
    textShadowColor: "rgba(54, 54, 183, 0.38)",
    textShadowOffset: { width: -0.3, height: -0.3 },
    textShadowRadius: 0.5,
    fontSize: 8,
    lineHeight: 11,
    fontFamily: "RedHatDisplay_500Medium",
    textDecorationLine: "underline",
  },
  clearCompetedButtonActive: {
    color: "#626262",
    textShadowColor: "rgba(54, 54, 183, 0)",
  },
  itemsCount: {
    fontSize: 9,
    lineHeight: 12,
    color: "#FAFBFF",
    textShadowColor: "rgba(54, 54, 183, 0.38)",
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
    shadowColor: "rgb(128, 109, 255)",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    borderRadius: 4,
  },
});
