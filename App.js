import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import home from "./screens/home";
import ToDoList from "./screens/toDoList";
import EditList from "./screens/editList";
import Colors from "./constants/colors";
import firebase from "firebase";
import Login from "./screens/Login";
import settings from './screens/settings';

const Stack = createStackNavigator();
const AuthStack = createStackNavigator();

const AuthScreens = () => {
  return (
    <AuthStack.Navigator>
      <AuthStack.Screen name="Login" component={Login}/>
    </AuthStack.Navigator>
  );
}

const Screens = () => {
  return (
    <Stack.Navigator>
          <Stack.Screen name="Fire Todo" component={home}/>
          <Stack.Screen name="Settings" component={settings}/>
          <Stack.Screen name="ToDO List" component={ToDoList}
          options={({route})=> {
            return ({
              title: route.params.title,
              headerStyle: {
                backgroundColor: route.params.color,
              },
              headerTintColor: "white",
            });
          }}/>
          <Stack.Screen name="Edit List" component={EditList}
          options={({route})=> {
            return ({
              title: route.params.title? `Edit ${route.params.title} List`: "New List",
              headerStyle: {
                backgroundColor: route.params.color || Colors.blue,
              },
              headerTintColor: "white",
            });
          }}/>
      </Stack.Navigator>
  );
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  useEffect(()=> {
    if(firebase.auth().currentUser) {
      setIsAuthenticated(true);
    }
    firebase.auth().onAuthStateChanged(user => {
      if(user) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    });
  },[]);
  return (
    <NavigationContainer>
      {isAuthenticated?<Screens/>:<AuthScreens/>}
    </NavigationContainer>
  );
}

var firebaseConfig = {
  apiKey: "abc",
  authDomain: "abc",
  projectId: "abc",
  storageBucket: "abc",
  messagingSenderId: "abc",
  appId: "abc"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);