import React, { useState, useEffect, useCallback } from "react";
import { View, Text, TouchableOpacity, Image, SafeAreaView, StyleSheet, Dimensions } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import KasheedIcon from "../../assets/icons/kasheed_icon.png";
import { COLORS, ROUTES } from "../../constants";
import LinearGradient from 'react-native-linear-gradient';
import Data from "../../data.json";
import Loading from "../../components/Loading";

const Welcome = ({navigation}) => {
    const [userID, setUserID] = useState();
    const [loading, setLoading] = useState(true);

    const getUser = async () => {
        const USERID = JSON.parse(await AsyncStorage.getItem('user_id'));
        if(USERID != null){
            navigation.navigate(ROUTES.HOME)
        }else{
            setLoading(false)
        }
    }


    useEffect(() => {
        getUser()
    }, [])
    return(
        <>
         {
            (loading)?<Loading />:
            <LinearGradient style={[styles.welcomeWrapper ,{backgroundColor: COLORS.main_color}]}
            colors={['#326bc5', '#449dfe']}
            start={{ x: 0, y: 1 }}
            end={{ x: 1, y: 0 }}
            >
               <View style={styles.logoIcon}>
                   <Image source={KasheedIcon} style={styles.icon} />
               </View>
               <Text style={styles.logoText}>Kasheed</Text>
               <View style={styles.authBtns}>
                   <TouchableOpacity style={styles.authBtn} onPress={()=> navigation.navigate(ROUTES.LOGIN)}>
                       <Text style={{color: COLORS.white}}>Sign In</Text>
                   </TouchableOpacity>
                   <TouchableOpacity style={styles.authBtn} onPress={()=> navigation.navigate(ROUTES.REGISTER)}>
                       <Text style={{color: COLORS.white}}>Sign Up</Text>
                   </TouchableOpacity>
               </View>
            </LinearGradient>
         }
        </>
    )
}

export default Welcome;

const styles = StyleSheet.create({
    welcomeWrapper: {
        height: "100%",
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start'
    },
    logoIcon: {
        width: 300,
        height: 300,
        marginTop: 100
    },
    icon: {
        width: "100%",
        height: "100%"
    },
    logoText: {
        fontSize: 60,
        fontWeight: 'bold',
        color: COLORS.white
    },
    authBtns: {
        width: "100%",
        paddingHorizontal: 80,
        marginTop: 20
    },
    authBtn: {
        backgroundColor: COLORS.white+"50",
        marginBottom: 10,
        width: "100%",
        padding: 15,
        borderRadius: 5,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    btnText: {
        color: COLORS.white,
        textAlign: 'center',
        width: "100%"
    },
    btn: {

    },
    btnText: {

    },
});