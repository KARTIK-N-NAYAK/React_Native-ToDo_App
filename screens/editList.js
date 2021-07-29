import React, {useState, useLayoutEffect} from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, TextInput } from 'react-native';
import Colors from "../constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { CommonActions } from '@react-navigation/native';
import ColorSelector from '../components/colorSelector';
import Button from "../components/button";

const colorList =[
    "black",
    "darkGray",
    "gray",
    "lightGray",
    "teal",
    "green",
    "blue",
    "purple",
    "blueGray",
    "orange",
    "red",
    "pink",
    "olive",
    "yellow",
];

export default ({navigation,route}) => {
    const [title,setTitle] = useState(route.params.title || "");
    const [color,setColor] = useState(route.params.color || Colors.blue);
    const [isValid,setValid] = useState(true);

    return (
        <View style={styles.container}>
            <View>
                <View style={{flexDirection:"row"}}>
                    <Text style={styles.label}>List name</Text>
                    {!isValid && <Text style={{color: Colors.red, marginLeft: 4,fontSize: 12}}>*Required</Text>}
                </View>
                <TextInput
                    underlineColorAndroid={"transparent"}
                    selectionColor={"transaprent"}
                    autoFocus={true}
                    value={title}
                    onChangeText={(text) => {
                        setTitle(text);
                        setValid(true);
                    }}
                    placeholder={"New List Name"}
                    maxLength={30}
                    style={[styles.input,{outline: "none"}]}
                />
                <Text style={styles.label}>Color Selector</Text>
                <ColorSelector
                onSelect={(color)=> {
                    setColor(color);
                    navigation.dispatch(CommonActions.setParams({color}));
                }}
                selectedColor={color}
                colorOptions={colorList}
                />
            </View>
            <Button onPress={()=>{
                if(title.length>1) {
                    route.params.saveChanges({title,color});
                    navigation.dispatch(CommonActions.goBack());
                } else {
                    setValid(false);
                }
            }} text="Save" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        padding: 5,
        justifyContent: "space-between",
    },
    input: {
        color: Colors.darkGray,
        borderBottomColor: Colors.lightGray,
        borderBottomWidth: 0.5,
        marginHorizontal: 5,
        padding: 3,
        height: 30,
        fontSize: 24,
    },
    saveButton: {
        borderRadius: 25,
        backgroundColor: Colors.darkGray,
        height: 48,
        margin: 16,
        justifyContent: "center",
        alignItems: "center",
    },
    save: {
        fontSize: 24,
        fontWeight: "bold",
        color: "white",
    },
    label: {
        color: Colors.black,
        fontWeight: "bold",
        fontSize: 16,
        marginBottom: 8,
    },
});