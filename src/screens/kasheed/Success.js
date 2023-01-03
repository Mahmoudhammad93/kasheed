import React, { useState, useEffect, useCallback } from "react";
import { View, Text, TouchableOpacity, Image, SafeAreaView, ScrollView, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { COLORS, ROUTES } from "../../constants";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import CheckIcon from "../../assets/icons/check.gif";
import Loading from "../../components/Loading";
import Cart from '../../assets/icons/shopping-cart.png';

const Success = ({navigation}) => {
    const [iconSize, setIconSize] = useState(0);
    const [invoiceData, setInvoiceData] = useState({});
    const [invoiceTotal, setInvoiceTotal] = useState('');
    const [loading, setLoading] = useState(true);
    const wait = (timeout) => {
        return new Promise(resolve => setTimeout(resolve, timeout));
    }
    const cartEmpty = async () => {
        await AsyncStorage.setItem('items', JSON.stringify([]))
        await AsyncStorage.setItem('total', JSON.stringify(0))
    }

    const getInvoiceData = async () => {
        const INVOICES = JSON.parse(await AsyncStorage.getItem('invoices'))
        setInvoiceData(INVOICES.slice(INVOICES.length-1, INVOICES.length)[0])
        setInvoiceTotal(INVOICES.slice(INVOICES.length-1, INVOICES.length)[0].price)
        setLoading()
    }

    useEffect(() => {
        cartEmpty()
        getInvoiceData()
        wait(100).then(() => setIconSize(100));
    }, [])
    return(
        <>{
            (loading)?<Loading />:
            <View style={styles.successWrapper}>
                <View style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 20
                }}>
                    <View style={[styles.circle1,styles.circle, {backgroundColor: COLORS.main_color+'25'}]}>
                        <View style={[styles.circle2,styles.circle, {backgroundColor: COLORS.main_color+'55'}]}>
                            <View style={[styles.circle3,styles.circle, {backgroundColor: COLORS.main_color+'75'}]}>
                                <View style={[styles.circle4,styles.circle, {backgroundColor: COLORS.main_color+'99'}]}>
                                    <View style={[styles.circle5,styles.circle, {backgroundColor: COLORS.main_color}]}>
                                        <FontAwesome name="check" size={iconSize} color={COLORS.active_color} style={styles.checkIcon} />
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
                <View style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <Text style={styles.paySuccess}>Payment Successful</Text>
                    <Text style={styles.payDesc}>Total amount paid by Mastercard</Text>
                    <Text style={styles.payDesc}>Please help us with our products reviews</Text>
                </View>
                <View style={styles.invoiceItems}>
                    <ScrollView>
                    {
                        invoiceData.items.map(row => {
                            return(
                                <View style={styles.row} key={row.id}>
                                    <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                                        <View style={{width: 30, height: 30, marginRight: 10, padding: 5, backgroundColor: COLORS.main_bg, borderRadius: 5}}>
                                            <Image source={(row.image)?{uri: row.image}:Cart} style={{width: '100%', height: '100%'}} />
                                        </View>
                                        <Text style={styles.label}>{row.name}</Text>
                                    </View>
                                    <Text style={styles.price}>EGP {parseFloat((row.offer_status == 1)?row.offer_price:row.price).toFixed(2)}</Text>
                                </View>
                            )
                        })
                    }
                    </ScrollView>
                    <View style={[styles.row, styles.total]}>
                        <Text style={styles.label}>Total</Text>
                        <Text style={styles.price}>EGP {invoiceTotal}</Text>
                    </View>
                </View>
                <View>
                    <TouchableOpacity style={styles.goTo} onPress={() => navigation.navigate(ROUTES.HOME)}>
                        <Text style={{color: COLORS.white}}>Back To Home</Text>
                    </TouchableOpacity>
                </View>
            </View>
        }
        </>
    )
}

export default Success;

const styles = StyleSheet.create({
    successWrapper: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        paddingTop: 50,
    },
    circle:{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 300,
        textAlign: 'center',
        lineHeight: 150
    },
    circle1: {
        width: 130+100,
        height: 130+100
    },
    circle2: {
        width: 110+100,
        height: 110+100
    },
    circle3: {
        width: 90+100,
        height: 90+100
    },
    circle4: {
        width: 70+100,
        height: 70+100
    },
    circle5: {
        width: 50+100,
        height: 50+100
    },
    checkIcon:{
        opacity: .5
    },
    paySuccess: {
        color: COLORS.main_color,
        fontWeight: 'bold',
        fontSize: 25,
        marginBottom: 10
    },
    payDesc: {
        color: COLORS.main_color
    },
    invoiceItems: {
        backgroundColor: COLORS.white,
        width: "90%",
        marginTop: 50,
        padding: 20,
        borderRadius: 5,
        shadowColor: COLORS.grayLight,
        elevation: 8,
        maxHeight: 350
    },
    row: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10
    },
    label: {
        color: COLORS.main_color,
        fontSize: 16
    },
    price: {
        color: COLORS.main_color,
        fontSize: 16
    },
    total: {
        marginBottom: 0,
        borderTopColor: COLORS.grayLight,
        borderTopWidth: 1,
        paddingTop: 10
    },
    emptyText: {
        color: COLORS.main_color,
        marginTop: 30,
        fontWeight: 'bold'
    },
    goTo:{
        backgroundColor: COLORS.main_color,
        padding: 15,
        borderRadius: 5,
        marginTop: 20
    }
})