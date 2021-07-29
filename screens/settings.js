import React from 'react';
import { StyleSheet, View } from 'react-native';
import Button from "../components/button";
import firebase from "firebase";

export default () => {
    return (
        <View style={styles.container}>
            <Button onPress={()=>{firebase.auth().signOut()}} text="Logout" />
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
});