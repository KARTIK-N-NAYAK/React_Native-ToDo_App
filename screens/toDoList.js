import React, {useState, useLayoutEffect, useEffect} from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList } from 'react-native';
import Colors from "../constants/colors";
import { Ionicons } from "@expo/vector-icons";
import ToDoItem from "../components/toDoItem";
import { onSnapshot, addDoc, removeDoc, updateDoc } from '../services/collections';
import firebase from "firebase";

const AddList = (addItemToLists) => {
    return (
      <TouchableOpacity onPress={()=>addItemToLists()}>
        <Text style={styles.icon}>+</Text>
      </TouchableOpacity>
    );
  }

export default ({navigation,route}) => {
    let [toDoItems, setToDoItems] = useState([]);
    const [newItem, setNewItem] = useState();
    const toDoItemsRef = firebase.firestore().collection("users").doc(firebase.auth().currentUser.uid)
    .collection("lists").doc(route.params.listId).collection("toDoItems");
    useEffect(()=>{
        onSnapshot(toDoItemsRef, 
            (newToDoItems)=> {
                setToDoItems(newToDoItems);
            },
            {
                sort: (a,b) => {
                    if(a.isChecked && !b.isChecked) {
                        return 1;
                    } else if(!a.isChecked && b.isChecked) {
                        return -1;
                    }
                    else {
                        return 0;
                    }
                }
            }
            );
    },[]);
    const addItemToLists = () => {
        setNewItem({text:"",isChecked:false,isnew: true});
    }
    const remove = (index) => {
        toDoItems.splice(index, 1);
        setToDoItems([...toDoItems]);
    }
    useLayoutEffect(()=> {
        navigation.setOptions({
          headerRight: ()=>AddList(addItemToLists),
        })
    });
    if(newItem) {
        toDoItems=[newItem,...toDoItems];
    }
    return (
        <View style={styles.container}>
            <FlatList 
                data={toDoItems}
                renderItem={({item:{text,isChecked, id, ...params},index}) => {
                    return(
                        <ToDoItem {...params} text={text} isChecked={isChecked}
                        onChecked={()=> {
                            let data = {text, isChecked: !isChecked};
                            if (id) {
                                data.id = id;
                            }
                            addDoc(toDoItemsRef, data);
                        }}
                        ChangeText={(newtext)=> {
                            if(params.isnew) {
                                setNewItem({
                                    text: newtext,
                                    isChecked,
                                    isnew: params.isnew,
                                });
                            } else {
                                toDoItems[index].text = newtext;
                                setToDoItems([...toDoItems]);
                            }
                        }}
                        onDelete= {()=> {
                            params.isnew? setNewItem(null):remove(index);
                            id && removeDoc(toDoItemsRef, id);
                        }}
                        onBlur={()=> {
                            if(text.length >1) {
                                let data = {text,isChecked};
                                if(id) {
                                    data.id=id;
                                }
                                addDoc(toDoItemsRef, data);
                                params.isnew && setNewItem(null);
                            } else {
                                params.new ? setNewItem(null): remove(index);
                            }
                        }} 
                        />
                    );
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    icon: {
        padding: 5,
        fontSize: 24,
    },
});