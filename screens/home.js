import React, {useLayoutEffect, useState, useEffect} from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList } from 'react-native';
import Colors from "../constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { addDoc, removeDoc, updateDoc, onSnapshot } from '../services/collections';
import firebase from 'firebase';

const ListButton = ({title,color, listId, navigation,onDelete,onOptions}) => {
  return (
    <TouchableOpacity onPress={()=>{navigation.navigate("ToDO List",{title,color,listId})}} style={[styles.itemContainer,{backgroundColor: color}]}>
      <View><Text style={styles.itemTitle}>{title}</Text></View>
        <View style={{flexDirection: "row"}}>
          <TouchableOpacity onPress={()=>{navigation.navigate("Edit List",{title,color, saveChanges: onOptions})}} >
            <Ionicons name="options-outline" size={24} color="white"/>
          </TouchableOpacity>
          <TouchableOpacity onPress={onDelete}>
            <Ionicons name="trash-outline" size={24} color="white"/>
          </TouchableOpacity>
        </View>
    </TouchableOpacity>
  );
}

const AddList = (navigation,addItemToLists) => {
  return (
    <View style={{flex:1, flexDirection: "row"}}>
      <TouchableOpacity onPress={()=>{navigation.navigate("Settings")}}>
        <Text style={styles.icon}>
          <Ionicons name="settings"/>
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={()=>{navigation.navigate("Edit List",{saveChanges: addItemToLists})}}>
        <Text style={styles.icon}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

export default ({navigation}) => {
  const [lists,setLists] = useState([]);
  const listsRef = firebase.firestore().collection("users").doc(firebase.auth().currentUser.uid).collection("lists");
  useEffect(()=>{
    onSnapshot(listsRef,
      (newList)=>{
        setLists(newList);
      },
      {
        sort: (a,b)=> {
          if(a.index>b.index) {
            return -1;
          } else if(a.index<b.index) {
            return 1;
          } else {
            return 0;
          }
        }
      }
      );
  },[]);

  const addItemToLists = ({title, color}) => {
    const index = lists.length>1? lists[lists.length-1].index+1:0;
    addDoc(listsRef,{title,color,index});
  }
  const remove = (id) => {
    removeDoc(listsRef, id);
  }
  const updateListItem = (id,data) => {
    updateDoc(listsRef, id, data);
  }
  useLayoutEffect(()=> {
    navigation.setOptions({
      headerRight: ()=>AddList(navigation,addItemToLists),
    })
  });
    return (
        <View style={styles.container}>
            <FlatList data={lists}
            renderItem={({item: {title,color,index,id}}) => {
              return (
                <ListButton title={title} color={color} listId={id} navigation={navigation} 
                onDelete={()=>remove(id)}
                onOptions={(newItem)=> updateListItem(id,{index,...newItem})}
                />
              );
            }}/>
        </View>
    );
}

const styles = StyleSheet.create({
  container: {
      flex: 1,
      backgroundColor: "#fff",
  },
  itemTitle: { fontSize: 24, padding: 5, color: "white" },
  itemContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      height: 100,
      flex: 1,
      borderRadius: 20,
      marginHorizontal: 20,
      marginVertical: 10,
      padding: 15,
      backgroundColor: Colors.blue,
  },
  icon: {
      padding: 5,
      fontSize: 24,
  },
  centeredView: {
      justifyContent: "center",
      alignItems: "center",
      marginTop: 50,
  },
  modalView: {
      backgroundColor: "white",
      borderRadius: 20,
      padding: 35,
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: {
          width: 0,
          height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
  },
});