import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { StyleSheet, 
         Text, 
         View,
         TouchableOpacity,
         TextInput,
         ScrollView,
         Alert,
         LogBox,
         Platform,
       } from 'react-native';
import { theme } from './colors';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Fontisto, Foundation } from '@expo/vector-icons';


const STORAGE_KEY = "@toDos";
const STORAGE_STAT = "@stat";



LogBox.ignoreLogs(['Remote debugger']);

export default function App() {
  const [working, setWorking] = useState(true);
  const [text, setText] = useState("");
  const [toDos, setToDos] = useState({});
  const travel = async() => {
    setWorking(false);
    setWantUpdate(false);
    setAddress("");
    await AsyncStorage.setItem(STORAGE_STAT, JSON.stringify(false));
  };
  const work = async() => {
    setWorking(true);
    setWantUpdate(false);
    setAddress("");
    await AsyncStorage.setItem(STORAGE_STAT, JSON.stringify(true));
  };
  const onChangeText = (event) => setText(event);
  const onChangeUpdate = (event) => setUpdateText(event);
  const saveToDos = async(toSave) => {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  };
  const loadToDos = async() => {
    const s = await AsyncStorage.getItem(STORAGE_KEY);
    const t = await AsyncStorage.getItem(STORAGE_STAT);
    s !== null ?
    setToDos(JSON.parse(s))
    : null;
    t === null ?
    setToDos(true) :
    setWorking(JSON.parse(t));
  };
  useEffect(() => {
    loadToDos();
  },[])
  const addToDo = async() => {
    if(text === ""){
      return;
    }
    const newToDos = {
      ...toDos,
      [Date.now()]: {
        text, 
        working, 
        completed: false,
      },
    };
    // const newToDos = Object.assign(
    //   {}, 
    //   toDos, 
    //   {[Date.now()]: {text, working}},
    //   );
    setToDos(newToDos);
    await saveToDos(newToDos);
    setText("");
  };
  const deleteToDo = async(key) => {
    if(Platform.OS === "web"){
      const ok = confirm("Do you want to delete this To Do?");
      if(ok){
        if(key === address){
          alert("It's being updated");
          return;
        }
        const newToDos = {...toDos};
        delete newToDos[key];
        setToDos(newToDos);
        await saveToDos(newToDos);
      }
    } else{
    Alert.alert(
      "Delete To Do", 
      "Are you sure?", 
      [
      {text: "Cancel"},
      {text: "I'm Sure", 
          onPress: async() => {
            if(key === address){
              alert("It's being updated");
              return;
            }
            const newToDos = {...toDos};
            delete newToDos[key];
            setToDos(newToDos);
            await saveToDos(newToDos);
        },
      },
    ]);
    } 
  };
  const completedToDo = async(key) => {
    if(Platform.OS === "web"){
      const ok = confirm("Do you want to complete this To Do?");
      if(ok){
        if(key === address){
          alert("It's being updated");
          return;
        }
        const newToDos = {...toDos};
        delete newToDos[key].completed;
        newToDos[key] = {
          ...newToDos[key], 
          completed: true
        };
        setToDos(newToDos);
        await saveToDos(newToDos);
      }
      }else {
    Alert.alert(
      "Complete To Do",
      "Are you sure?",
      [
        {text: "Cancel"},
        {text: "I Completed",
          onPress: async() => {
            if(key === address){
              alert("It's being updated");
              return;
            }
            const newToDos = {...toDos};
            delete newToDos[key].completed;
            newToDos[key] = {
              ...newToDos[key], 
              completed: true
            };
            setToDos(newToDos);
            await saveToDos(newToDos);
          },
      },
      ]
    );
    }
  };
  const completedToDoC = async(key) => {
    if(Platform.OS === "web"){
      const ok = confirm("Do you want to cancel the completion this To Do?");
      if(ok){
        if(key === address){
          alert("It's being updated");
          return;
        }
        const newToDos = {...toDos};
        delete newToDos[key].completed;
        newToDos[key] = {
          ...newToDos[key], 
          completed: false
        };
        setToDos(newToDos);
        await saveToDos(newToDos);
      }
    }else{
    Alert.alert(
      "Cancel the completion",
      "Will you?",
      [
        {text: "Cancel"},
        {text: "I want",
          onPress: async() => {
            if(key === address){
              alert("It's being updated");
              return;
            }
            const newToDos = {...toDos};
            delete newToDos[key].completed;
            newToDos[key] = {
              ...newToDos[key], 
              completed: false
            };
            setToDos(newToDos);
            await saveToDos(newToDos);
          },
      },
      ]
    );
    }
  };
  const [wantUpdate, setWantUpdate] = useState(false);
  const [address,setAddress] = useState("");
  const updateToDo = async(key) => {
    if(Platform.OS === "web"){
      const ok = confirm("Do you want to update this To Do?");
      if(ok){
        if(toDos[key].completed){
          alert("It's already completed");
          return;
        }
        setWantUpdate(true);
        setAddress(key);
      }
     } else{
    Alert.alert(
      "Update To Do",
      "Are you sure?",
      [
        {text: "Cancel"},
        {text: "I want to update",
          onPress: async() => {
            if(toDos[key].completed){
              alert("It's already completed");
              return;
            }
            setWantUpdate(true);
            setAddress(key);
          },
      },
      ]
    );
    }
  };
  const updateToDoC = async(key) => {
    setWantUpdate(false);
    setAddress("");
  };
  const updateAndSubmit = async(key) => {
    if(Platform.OS === "web"){
      const ok = confirm("Do you want to update this To Do?");
      if(ok){
        if(text === ""){
          return;
        }
        setWantUpdate(false);
        const newToDos = {...toDos};
        delete newToDos[address].text;
        newToDos[address] = {
          ...newToDos[address], 
          text,
        };
        setToDos(newToDos);
        await saveToDos(newToDos);
        setText("");
        setAddress("");
      }
    }else{
      Alert.alert(
        "Update To Do",
        "Are you sure?",
        [
          {text: "Cancel"},
          {text: "I'm Sure",
            onPress: async() => {
              if(text === ""){
                return;
              }
              setWantUpdate(false);
              const newToDos = {...toDos};
              delete newToDos[address].text;
              newToDos[address] = {
                ...newToDos[address], 
                text,
              };
              setToDos(newToDos);
              await saveToDos(newToDos);
              setText("");
              setAddress("");
            },
        },
        ]
        );
      }
  };
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.header}>
        <TouchableOpacity
          onPress={work}
        >
          <Text 
            style={{fontSize: 40,
                    fontWeight: "600", 
                    color: working ? "white" : theme.grey}}
          >Work
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={travel}
        >
          <Text 
            style={{fontSize: 40,
                    fontWeight: "600", 
                    color: !working ? "white" : theme.grey}}
          >Travel
          </Text>
        </TouchableOpacity>
      </View>
          {wantUpdate ?
          <TextInput 
          value={text}
          style={styles.input}
          onChangeText={onChangeText}
          onSubmitEditing={updateAndSubmit}
          placeholder="Update To Do"
          />
        :<TextInput 
          onSubmitEditing={addToDo}
          onChangeText={onChangeText}
          value={text}
          style={styles.input} 
          placeholder={working ? "Add a To Do" : "Where do you want go ?"}
          />
          }
        <ScrollView>
          {Object.keys(toDos).map((key) => (
            toDos[key].working === working ?
            <View style={styles.toDo} key={key}>
              <Text style={styles.toDoText}>
                {toDos[key].text}
              </Text>
                <Text>
                    {toDos[key].completed ? 
                      <TouchableOpacity
                        onPress={() => completedToDoC(key)}
                      >
                      <Fontisto name="check" size={24} color="green" />
                      </TouchableOpacity>
                      :
                      <TouchableOpacity
                        onPress={() => completedToDo(key)}
                      >
                      <Fontisto name="check" size={24} color={theme.grey} />  
                      </TouchableOpacity>
                    }
                  
                    {key === address ?
                      <TouchableOpacity
                        onPress={() => updateToDoC(key)}
                      >
                      <Foundation name="pencil" size={28} color="green" />
                      </TouchableOpacity>
                      :
                      <TouchableOpacity
                        onPress={() => updateToDo(key)}
                      >
                      <Foundation name="pencil" size={28} color={theme.grey} />
                      </TouchableOpacity>
                    }
                  <TouchableOpacity
                    onPress={() => deleteToDo(key)}
                  >
                    <Fontisto name="trash" size={24} color={theme.grey} />
                  </TouchableOpacity>
                </Text>
            </View> : null
          ))}
        </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.bg,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection:"row",
    marginTop: 100,
    justifyContent: "space-between",
  },
  input: {
    backgroundColor: "white",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginVertical: 20,
    fontSize: 20,
  },
  toDo: {
    backgroundColor: theme.toDoBg,
    marginBottom: 10,
    paddingVertical: 20,
    paddingHorizontal: 40,
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  toDoText: {
    color: "white",
    fontSize: 20,
    fontWeight: "500",
  },
});
