import React, { useState, useEffect, useCallback } from "react";
import { Text, View, Image, TouchableOpacity, ScrollView, SafeAreaView, Dimensions, StyleSheet, TextInput } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import FontAwesome from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import UserImage from '../assets/user.jpg'
import { COLORS } from "../constants";

const Profile = (props) => {
    const [sessionId, setSessionId] = useState();
    const user = props.user;
    
    const getUserSession = async () => {
        const user_id = await AsyncStorage.getItem('user_id');
        if(user_id){
            setSessionId(user_id)
        }
    }

    useEffect(() => {
        getUserSession();
    }, [])
    return(
        <>
            <View style={styles.profileImg}>
                <View style={styles.userImage}>
                    <Image source={UserImage} style={styles.image}/>
                </View>
                {
                    (parseInt(sessionId) === user.id)
                    ?
                        <Text style={{color: 'red'}}>MY PROFILE</Text>
                    :
                        ''
                }
            </View>
            <View style={styles.form}>
                <View style={styles.row}>
                    <View style={styles.col_12}>
                        <Text style={styles.label}>First Name {user.id}</Text>
                        <TextInput placeholder="First Name" style={styles.formInput} placeholderTextColor={COLORS.gray} value={(user)?user.first_name:''}/>
                    </View>
                    <View style={styles.col_12}>
                        <Text style={styles.label}>Last Name</Text>
                        <TextInput placeholder="Last Name" style={styles.formInput} placeholderTextColor={COLORS.gray} value={(user)?user.last_name:''}/>
                    </View>
                    <View style={styles.col_12}>
                        <Text style={styles.label}>Username</Text>
                        <TextInput placeholder="Username" style={styles.formInput} placeholderTextColor={COLORS.gray} value={(user)?user.username:''}/>
                    </View>
                    <View style={styles.col_12}>
                        <Text style={styles.label}>Email</Text>
                        <TextInput placeholder="Email" style={styles.formInput} placeholderTextColor={COLORS.gray} value={(user)?user.email:''}/>
                    </View>
                </View>
            </View>
        </>
    )
}

export default Profile;

const styles = StyleSheet.create({
    profileImg:{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20
    },
    userImage:{
        width: 120,
        height: 120,
        borderRadius: 120,
        overflow: 'hidden',
        borderColor: COLORS.grayLight,
        borderWidth: 3,
        padding: 5,
        margin: 20
    },
    image:{
        width: "100%",
        height: "100%",
        borderRadius: 50
    },
    form:{
        padding: 20
    },
    row:{
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    col_12: {
        width: "94%",
        margin: 10
    },
    col_6: {
        width: "44%",
        margin: 10
    },
    label: {
        color: COLORS.gray,
        marginBottom: 10
    },
    formInput:{
        borderColor: COLORS.grayLight,
        borderWidth: 1,
        borderRadius: 1,
        borderRadius: 5,
        color: COLORS.gray,
        paddingHorizontal: 20,
        backgroundColor: COLORS.grayLight
    },
})