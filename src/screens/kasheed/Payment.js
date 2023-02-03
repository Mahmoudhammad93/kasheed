import React, { useEffect, useState, useCallback } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Dimensions, Image, ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Loading from "../../components/Loading";
import LinearGradient from "react-native-linear-gradient";
import { COLORS, ROUTES } from "../../constants";
import PaypalLight from "../../assets/icons/paypal-light.png";
import PaypalDark from "../../assets/icons/paypal-dark.png";
import CreaditCardLight from "../../assets/icons/credit-card-ligth.png";
import CreaditCardDark from "../../assets/icons/credit-card-dark.png";
import VodafoneLight from "../../assets/icons/vodafone-light.png";
import VodafoneDark from "../../assets/icons/vodafone-dark.png";
import CashLight from "../../assets/icons/cash-light.png";
import CashDark from "../../assets/icons/cash-dark.png";
import { ProgressStep, ProgressSteps } from 'react-native-progress-steps';
import PaymentMethods from "../../components/PaymentMethods";
import { CreditCardInput, LiteCreditCardInput } from "react-native-credit-card-input";
import CreditForm from "../../components/CreditForm";
import Data from "../../data.json";

const FULL_WIDTH = Dimensions.get('window').width;
const FULL_HEIGHT = Dimensions.get('window').height;

const Payment = ({navigation, ...props}) => {
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [methodActive, setMethodActive] = useState('creadit');

    const getPaymentData = async () => {
        const total = await AsyncStorage.getItem('total');
        // console.log(props.route.params)
        if(props.route.params){
            const PARAMS = props.route.params;
            if(PARAMS.type == 'pending'){
                setTotal(PARAMS.invoice.price)
            }
        }else{
            setTotal(total)
        }
        setLoading(false)
    }

    const selectPaymentMethod = (name) => {
        setMethodActive(name)
    }

    const payMethodForm = () => {
        if(methodActive === 'creadit'){
            return(
                <View style={styles.creditWrapper}>
                    <CreditForm />
                </View>
            )
        }else if(methodActive === 'paypal'){
            return(
                <View style={styles.paypalForm}>
                    <Text>Paypal</Text>
                </View>
                                
            )
        }else if(methodActive === 'vodafone'){
            return(
                <View style={styles.vodafoneForm}>
                    <Text>Vodafone Cash</Text>
                </View>
            )
        }else{
            return(
                <View style={styles.cashForm}>
                    <Text>Cash On Delivery</Text>
                </View>
            )
        }
    }

    const getInvoiceStatus = () => {
        if(methodActive == 'cash'){
            return "pending"
        }else{
            return "paid"
        }
    }

    const submitPayment = async () => {
        var cart = await AsyncStorage.getItem('items');
        var currentInvoices = await AsyncStorage.getItem('invoices');
        var currentTotal = await AsyncStorage.getItem('total');
        const cartArray = JSON.parse(cart);
        const currentInvoicesArray = JSON.parse(currentInvoices)

        if(currentInvoicesArray != null){
            var itemIndex = currentInvoicesArray.length;
            var lastInvoice = currentInvoicesArray.slice(itemIndex-1, itemIndex);
            var invoiceID = lastInvoice[0].id+1;

        }else{
            var invoiceID = 1;
        }
        

        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();
        var hour = today.getHours();
        var minuts = today.getMinutes();
        var time = today.getUTCDay();

        const invoice = {
            id: invoiceID,
            title: "User Invoice",
            invoice_number: Math.floor(100000 + Math.random() * 900000),
            status: getInvoiceStatus(),
            price: parseFloat(currentTotal).toFixed(2),
            created_at: today,
            items: (props.route.params)?props.route.params.invoice.items:cartArray
        }

        if(props.route.params){
            const PARAMS = props.route.params;
            const newArr = currentInvoicesArray.filter(row => {
                if(row.id != PARAMS.invoice.id){
                    return row;
                }
            })

            PARAMS.invoice.status = "paid";

            await AsyncStorage.setItem('invoices', JSON.stringify([...newArr, PARAMS.invoice]));
            navigation.navigate(ROUTES.SUCCESS, {invoice: PARAMS.invoice})
        }else{
            if(currentInvoicesArray != null){
                if(currentInvoicesArray.length <= 0){
                    await AsyncStorage.setItem('invoices', JSON.stringify([invoice]));
                }else{
                    await AsyncStorage.setItem('invoices', JSON.stringify([...currentInvoicesArray, invoice]));
                }
            }else{
                await AsyncStorage.setItem('invoices', JSON.stringify([invoice]));
            }
            navigation.navigate(ROUTES.SUCCESS)
        }
    }

    useEffect(() => {
        getPaymentData()
    }, []);
    return(
        <>
            {
                (loading)?<Loading />:
                <SafeAreaView style={{height: FULL_HEIGHT-55}}>
                    <View style={styles.paymentHeader}>
                        <Text style={styles.totalText}>Total Price</Text>
                        <Text style={styles.totalNumber}>EGP {parseFloat(total).toFixed(2)}</Text>
                    </View>
                    <View style={styles.propgress}>
                        <ProgressSteps>
                            <ProgressStep label="First Step" nextBtnStyle={styles.nextBtn} nextBtnTextStyle={{color: COLORS.white}}>
                                <View style={{ alignItems: 'center' }}>
                                    <ScrollView horizontal={true} style={styles.paymentMethods} showsHorizontalScrollIndicator={false}>
                                        {/* // Creadit card payment method */}
                                        <PaymentMethods methodName={'creadit'} methodActive={methodActive} selectPaymentMethod={selectPaymentMethod} icon={(methodActive == 'creadit')?CreaditCardLight:CreaditCardDark} btnText={'Credit Card'}/>

                                        {/* // Paypal payment method */}
                                        <PaymentMethods methodName={'paypal'} methodActive={methodActive} selectPaymentMethod={selectPaymentMethod} icon={(methodActive == 'paypal')?PaypalLight:PaypalDark} btnText={'Paypal'}/>
                                        
                                        {/* // Vodafone cash payment method */}
                                        <PaymentMethods methodName={'vodafone'} methodActive={methodActive} selectPaymentMethod={selectPaymentMethod} icon={(methodActive == 'vodafone')?VodafoneLight:VodafoneDark} btnText={'Vodafone Cash'}/>

                                        {/* // Cash on delivery payment method */}
                                        {
                                            (props.route.params && props.route.params.invoice.status == 'pending')?'':
                                            <PaymentMethods methodName={'cash'} methodActive={methodActive} selectPaymentMethod={selectPaymentMethod} icon={(methodActive == 'cash')?CashLight:CashDark} btnText={'Cash On Delivery'}/>
                                        }
                                    </ScrollView>
                                </View>
                                {payMethodForm()}
                            </ProgressStep>
                            <ProgressStep label="Second Step" nextBtnStyle={styles.nextBtn} nextBtnTextStyle={{color: COLORS.white}} previousBtnStyle={styles.prevBtn} previousBtnTextStyle={{color: COLORS.main_color}}>
                                <View style={{ alignItems: 'center' }}>
                                    <Text>This is the content within step 2!</Text>
                                </View>
                            </ProgressStep>
                            <ProgressStep onSubmit={()=> submitPayment()} label="Third Step" nextBtnStyle={styles.nextBtn} nextBtnTextStyle={{color: COLORS.white}} previousBtnStyle={styles.prevBtn} previousBtnTextStyle={{color: COLORS.main_color}}>
                                <View style={{ alignItems: 'center' }}>
                                    <Text>This is the content within step 3!</Text>
                                </View>
                            </ProgressStep>
                        </ProgressSteps>
                    </View>
                    {/* <TouchableOpacity style={styles.processBtn}>
                        <Text style={styles.btnText}>Process</Text>
                    </TouchableOpacity> */}
                </SafeAreaView>
            }
        </>
    )
}

export default Payment;

const styles = StyleSheet.create({
    paymentHeader:{
        width: "100%",
        height: 150,
        justifyContent:'center',
        alignItems: 'center',
        backgroundColor: COLORS.main_color
    },
    totalText:{
        fontSize: 25,
        color: COLORS.grayLight
    },
    totalNumber:{
        fontSize: 50,
        color: COLORS.white
    },
    propgress:{
        flex: 1
    },
    nextBtn:{
        backgroundColor: COLORS.main_color,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 5
    },
    prevBtn:{
        borderColor: COLORS.main_color,
        borderWidth: 1,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 5
    },
    paymentMethods: {
        display: 'flex',
        flexDirection: 'row',
        padding: 20,
        marginRight: 20
    },
    method: {
        width: (FULL_WIDTH - 140)/2,
        height: 80,
        backgroundColor: COLORS.white,
        marginRight: 20,
        display: 'flex',
        alignItems: 'center',
        padding: 10,
        borderRadius: 5,
        image:{
            width: "100%",
            height: "100%",
            resizeMode: 'contain',
        },
    },
    methodImage:{
        width: 30,
        height: 30,
        marginBottom: 10
    },
    text: {
        color: COLORS.gray,
        textAlign: 'center'
    },
    methodActive: {
        backgroundColor: COLORS.main_color,
        shadowColor: COLORS.black,
        shadowOpacity: 1,
        elevation: 4
    },
    processBtn:{
        margin: 20,
        backgroundColor: COLORS.main_color,
        padding: 15,
        borderRadius: 5,
        position: 'absolute',
        bottom: 0,
        width: FULL_WIDTH-40
    },
    btnText:{
        color: COLORS.white,
        fontSize: 15,
        fontWeight: 'bold',
        textAlign: 'center'
    },
    creditWrapper:{
        padding: 20
    },
})