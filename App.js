import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  FlatList,
  ToastAndroid,
} from "react-native";
import { useFonts } from "expo-font";
import { useEffect, useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function App() {
  const [loaded] = useFonts({
    DreamAvenue: require("./assets/fonts/Dream-Avenue.ttf"),
    "RaleWay-Regular": require("./assets/fonts/Raleway-Regular.ttf"),
  });

  const [todoInput, setTodoInput] = useState("");
  const [todos, setTodos] = useState([]);

  const getTodos = async () => {
    const allTodos = await AsyncStorage.getItem("newtodos");
    if (allTodos.length > 0) {
      setTodos(JSON.parse(allTodos));
    }
  };

  useEffect(() => {
    getTodos();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem("newtodos", JSON.stringify(todos));
  }, [todos]);

  const onPressButton = () => {
    if (todoInput.length > 0) {
      setTodos([...todos, { id: Date.now(), todo: todoInput, isDone: false }]);
      setTodoInput("");
    } else {
      ToastAndroid.show("add todo!", ToastAndroid.SHORT);
    }
  };

  const handleDelete = (id) => {
    setTodos(todos.filter((t) => t.id !== id));
    // AsyncStorage.setItem("newtodos", JSON.stringify(todos));
    ToastAndroid.show("TODO deleted!", ToastAndroid.SHORT);
  };

  const handleDone = (item) => {
    setTodos(
      todos.map((data) =>
        data.id === item.id
          ? {
              id: item.id,
              todo: item.todo,
              isDone: !item.isDone,
            }
          : data
      )
    );
    // AsyncStorage.setItem("newtodos", JSON.stringify(todos));
    ToastAndroid.show("WoW task compeleted", ToastAndroid.SHORT);
  };

  if (!loaded) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <View>
        <View style={{ alignContent: "center", justifyContent: "center" }}>
          <Text style={styles.heading}>TODO.dev</Text>
        </View>
        <View style={styles.inputTextContainer}>
          <TextInput
            style={styles.inputText}
            placeholderTextColor="#0e0a0a"
            placeholder="Add todo task..."
            value={todoInput}
            onChangeText={setTodoInput}
          />
          <TouchableOpacity style={styles.inputButton} onPress={onPressButton}>
            <Text style={styles.inputButtonText}>Go</Text>
          </TouchableOpacity>
        </View>
        {todos.length > 0 ? (
          <FlatList
            data={todos}
            renderItem={({ item }) => {
              return (
                <View style={styles.listContainer}>
                  <Text
                    style={{
                      flex: 1,
                      fontFamily: "RaleWay-Regular",
                      fontSize: 16,
                      textDecorationLine: item.isDone ? "line-through" : "none",
                    }}
                  >
                    {item.todo}
                  </Text>
                  {item.isDone ? (
                    <MaterialIcons
                      name="horizontal-rule"
                      size={24}
                      color="#0e0a0a"
                      onPress={() => handleDone(item)}
                      style={{
                        marginHorizontal: 2,
                      }}
                    />
                  ) : (
                    <MaterialIcons
                      name="done"
                      size={24}
                      color="#0e0a0a"
                      onPress={() => handleDone(item)}
                      style={{
                        marginHorizontal: 2,
                      }}
                    />
                  )}
                  <MaterialIcons
                    name="delete-outline"
                    size={24}
                    color="0e0a0a"
                    onPress={() => handleDelete(item.id)}
                    style={{
                      marginHorizontal: 2,
                    }}
                  />
                </View>
              );
            }}
            keyExtractor={(item) => item.id.toString()}
          />
        ) : (
          <View
            style={{
              height: "100%",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontFamily: "DreamAvenue",
                fontSize: 28,
                marginTop: 60,
              }}
            >
              No Thing
            </Text>
            <Text
              style={{
                fontFamily: "DreamAvenue",
                fontSize: 52,
                // marginTop: 6,
              }}
            >
              TODO
            </Text>
          </View>
        )}
      </View>
      <View style={styles.footer}>
        <Text style={styles.footerText}>Created by Pratham Sharma</Text>
        <Text style={styles.footerDot}>.</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: "#eeeee6",
    alignItems: "center",
    // justifyContent: "center",
  },
  heading: {
    fontFamily: "DreamAvenue",
    fontSize: 34,
    color: "#0e0a0a",
    marginLeft: "auto",
    marginRight: "auto",
    marginBottom: 8,
  },
  footer: {
    marginTop: "auto",
    paddingBottom: 10,
    flexDirection: "row",
  },
  footerText: {
    fontFamily: "DreamAvenue",
    fontSize: 18,
    color: "#0e0a0a",
  },
  footerDot: {
    color: "#F0A500",
    fontFamily: "DreamAvenue",
    fontSize: 18,
  },
  inputTextContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 10,
    marginRight: 10,
    backgroundColor: "#aba9a8",
    padding: 12,
    borderRadius: 50,
    elevation: 12,
  },
  inputText: {
    flex: 1,
    fontSize: 16,
    fontFamily: "RaleWay-Regular",
    color: "#0e0a0a",
    marginLeft: 6,
  },
  inputButton: {
    borderRadius: 360,
    marginVertical: 4,
    marginRight: 6,
  },
  inputButtonText: {
    fontFamily: "DreamAvenue",
    fontSize: 18,
  },
  listContainer: {
    backgroundColor: "#fff",
    padding: 12,
    marginVertical: 6,
    marginHorizontal: 8,
    borderRadius: 50,
    flexDirection: "row",
  },
});
