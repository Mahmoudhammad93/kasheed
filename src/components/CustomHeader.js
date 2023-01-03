import React, { useState, useEffect, useCallback } from "react";
import {
    View,
    Text,
    Image,
    Dimensions,
    StyleSheet,
    TouchableOpacity
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Ionicons from "react-native-vector-icons/Ionicons";
import Feather from "react-native-vector-icons/Feather"
import { COLORS } from "../constants";

const Header = (props) => {
    return(
        <>
         <View style={[styles.header, {backgroundColor: props.backgroundColor}]}>
            <View style={styles.left}>
                <TouchableOpacity>
                    <Feather name="arrow-left" size={20} color={props.color} />
                </TouchableOpacity>
                <Text style={{color: props.color, marginLeft: 5, fontSize: 18, fontWeight: 'bold'}}>{props.title}</Text>
            </View>
            <View style={styles.right}>
                <Text style={styles.cartCount}>80</Text>
                <Ionicons name={'cart-outline'} size={25} color={props.color} style={[styles.cartIcon]}/>
            </View>
         </View>
        </>
    )
}

export default Header;

const styles = StyleSheet.create({
    header: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 10,
        paddingHorizontal: 20
    },
    left: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center'
    },
    right: {

    },
    cartCount:{
        position: 'absolute',
        top: -10,
        right: 0,
        backgroundColor: COLORS.danger,
        color: COLORS.white,
        width: 15,
        height: 15,
        textAlign: 'center',
        lineHeight: 15,
        borderRadius: 5,
        padding: 1
    },
    cartIcon: {

    },
})