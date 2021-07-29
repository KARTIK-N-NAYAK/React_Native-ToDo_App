import React, {useState} from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput} from 'react-native';
import Colors from "../constants/colors";
import { Ionicons } from "@expo/vector-icons";
import CheckBox from "./checkBox";

const EditableText = ({isChecked,text,ChangeText,...props}) => {
    const [isEditMode, setIsEditMode] = useState(props.isnew);
    return (
    <TouchableOpacity style={{flex:1}} onPress={()=>!isChecked && setIsEditMode(true)}>
        {isEditMode?
            <TextInput
                underlineColorAndroid={"transparent"}
                selectionColor={"transaprent"}
                autoFocus={true}
                value={text}
                onChangeText={ChangeText}
                placeholder={"Add new"}
                onSubmitEditing={()=>{}}
                maxLength={30}
                style={[styles.input,{outline: "none"}]}
                onBlur={()=>{
                    props.onBlur && props.onBlur();
                    setIsEditMode(false);
                }}
            />
            :
            <Text style={[styles.text,{color: isChecked? Colors.lightGray: Colors.black}]}>{text}</Text>
        }
     </TouchableOpacity>
    );
}

export default ({text, isChecked, onChecked, ChangeText, onDelete,...props}) => {
    return (
        <View style={styles.container}>
            <View style={{flexDirection:"row",flex:1}}>
                <CheckBox isChecked={isChecked} onChecked={onChecked}/>
                <EditableText isChecked={isChecked} text={text} ChangeText={ChangeText} {...props}/>
            </View>
            <TouchableOpacity onPress={()=>onDelete()}>
                <Text style={styles.icon}>X</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "row",
        justifyContent:"space-between",
        alignItems: "center",
        padding: 10,
    },
    icon: {
        padding: 5,
        fontSize: 16,
    },
    input: {
        color: Colors.black,
        borderBottomColor: Colors.lightGray,
        borderBottomWidth: 0.5,
        marginHorizontal: 5,
        padding: 3,
        height: 25,
        fontSize: 16,
    },
    text: {
        padding:3,
        fontSize: 16,
    },
});