import React, {useLayoutEffect, useState} from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList } from 'react-native';
import Colors from "../constants/colors";
import Button from "../components/button";
import LabeledInput from "../components/labeledInput";
import validator from 'validator';
import firebase from "firebase";

const validateFields = (email, password) => {
    const isValid = {
        email: validator.isEmail(email),
        password: validator.isStrongPassword(password,{
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1,
        }),
    };
    return isValid;
}

const login = (email,password,SetErrorMessages) => {
    firebase.auth().signInWithEmailAndPassword(email,password)
    .catch((error)=>{
        SetErrorMessages("Email or password is not correct.");
    });
}

const createAccount = (email, password) => {
    firebase.auth().createUserWithEmailAndPassword(email,password)
    .then(({user})=> {
        firebase.firestore().collection("users").doc(user.uid).set({});
    })
    .catch((error)=> {
        SetErrorMessages("Error occured while creating account.");
    });
}

export default () => {
    const [isCreateMode, setIsCreateMode] = useState(false);
    const [emailField, setEmailField] = useState({
        text: "", errorMessage:"",
    });
    const [pswdField, setpswdField] = useState({
        text: "", errorMessage:"",
    });
    const [repswdField, setrepswdField] = useState({
        text: "", errorMessage:"",
    });
    const [errorMessages,setErrorMessages] = useState();
    return(
        <View style={styles.container}>
            <Text style={styles.header}>🔥ToDo</Text>
            <View style={{flex: 1}}>
                <Text style={styles.error}>{errorMessages && `${errorMessages}`}</Text>
                <LabeledInput
                    label="Email"
                    text={emailField.text}
                    errorMessage={emailField.errorMessage}
                    onChangeText={(text)=>{
                        setEmailField({text});
                    }}
                    labelStyle={styles.label}
                    autoCompleteType="email"
                />
                <LabeledInput
                    label="Password"
                    text={pswdField.text}
                    errorMessage={pswdField.errorMessage}
                    onChangeText={(text)=>{
                        setpswdField({text});
                    }}
                    labelStyle={styles.label}
                    secureTextEntry={true}
                />
                {isCreateMode && (
                <LabeledInput
                    label="Re-enter Password"
                    text={repswdField.text}
                    errorMessage={repswdField.errorMessage}
                    onChangeText={(text)=>{
                        setrepswdField({text});
                    }}
                    labelStyle={styles.label}
                    secureTextEntry={true}
                />
                )}
                <TouchableOpacity onPress={()=>{setIsCreateMode(!isCreateMode)}}>
                    <Text style={{alignSelf:"center",color: Colors.blue, fontSize: 16, margin: 4,}}>
                        {isCreateMode?"Already have an account":"Create new account"}
                    </Text>
                </TouchableOpacity>
            </View>
            <Button onPress={()=>{
                const isValid = validateFields(emailField.text, pswdField.text);
                let isAllValid = true;
                if(!isValid.email) {
                    emailField.errorMessage = "Please enter a valid email";
                    setEmailField({...emailField});
                    isAllValid=false;
                }
                if(!isValid.password) {
                    pswdField.errorMessage = "Password must be atleast 8 characters long with numbers, symbols, uppercase and lowercase";
                    setpswdField({...pswdField});
                    isAllValid=false;
                }
                if(isCreateMode && pswdField.text!=repswdField.text) {
                    repswdField.errorMessage = "Passwords do not match";
                    setrepswdField({...repswdField});
                    isAllValid=false;
                }
                if(isAllValid) {
                    isCreateMode? 
                    createAccount(emailField.text,pswdField.text,setErrorMessages): 
                    login(emailField.text,pswdField.text,setErrorMessages);
                }
            }} 
            text= {isCreateMode?"Create Account":"Login"} 
            buttonStyle={{backgroundColor: Colors.red}}/>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor: "#fff",
        justifyContent: "space-between",
        alignItems: "stretch",
    },
    label: {
        fontSize: 16,
        fontWeight: "bold",
        color: Colors.black,
    },
    header: {
        fontSize: 72,
        color: Colors.red,
        alignSelf: "center",
    },
    error: {
        color: Colors.red,
        fontSize: 12,
        marginLeft: 4,
    },
});