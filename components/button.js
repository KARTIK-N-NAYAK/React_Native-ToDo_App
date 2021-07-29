import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import Colors from "../constants/colors";

export default ({buttonStyle, textStyle, onPress, text}) => {
    return (
        <TouchableOpacity style={[styles.saveButton, buttonStyle]} onPress={onPress}>
            <Text style={[styles.save,textStyle]}>{text}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
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
});