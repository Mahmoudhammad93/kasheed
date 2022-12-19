import React, { useState, useEffect, useCallback } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { COLORS } from "../constants";
import PaypalLight from "../assets/icons/paypal-light.png";
import PaypalDark from "../assets/icons/paypal-dark.png";
import CreaditCardLight from "../assets/icons/credit-card-ligth.png";
import CreaditCardDark from "../assets/icons/credit-card-dark.png";
import VodafoneLight from "../assets/icons/vodafone-light.png";
import VodafoneDark from "../assets/icons/vodafone-dark.png";
import CashLight from "../assets/icons/cash-light.png";
import CashDark from "../assets/icons/cash-dark.png";
const FULL_WIDTH = Dimensions.get('window').width;
const FULL_HEIGHT = Dimensions.get('window').height;

const PaymentMethods = (props) => {
    const [methodActive, setMethodActive] = useState('creadit');
    const selectPaymentMethod = (value) => {
        props.selectPaymentMethod(value)
    }
    return(
        <>
        <TouchableOpacity style={[styles.method, (props.methodName === props.methodActive)?styles.methodActive:'']} onPress={() => selectPaymentMethod(props.methodName)}>
            <View style={styles.methodImage}>
                <Image source={props.icon} style={styles.image}/>
            </View>
            <Text style={[styles.text, (props.methodName === props.methodActive)?{color: COLORS.white}:'']}>{props.btnText}</Text>
        </TouchableOpacity>
        </>
    )
}

export default PaymentMethods;

const styles = StyleSheet.create({
    method: {
        width: (FULL_WIDTH - 140)/2,
        height: 80,
        backgroundColor: COLORS.white,
        marginRight: 20,
        display: 'flex',
        alignItems: 'center',
        padding: 10,
        borderRadius: 5
    },
    methodImage:{
        width: 30,
        height: 30,
        marginBottom: 10
    },
    image:{
        width: "100%",
        height: "100%",
        resizeMode: 'contain',
    },
    text: {
        color: COLORS.gray,
        textAlign: 'center',
        fontWeight: 'bold'
    },
    methodActive: {
        shadowColor: COLORS.black,
        borderColor: COLORS.main_color,
        backgroundColor: COLORS.main_color,
        borderWidth: 1,
        shadowOpacity: 1,
        elevation: 4
    },
})