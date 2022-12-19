import React, { useState, useEffect, useCallback } from "react";
import { Text, View, Image, TextInput, StyleSheet, Dimensions, ScrollView, TouchableOpacity, Button, RefreshControl } from 'react-native';
import COLORS from "../constants/colors";
import Entypo from 'react-native-vector-icons/Entypo';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Visa from "../assets/icons/visa.png";
import MasterCard from "../assets/icons/master-card.png";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Data from "../data.json";
import Modal from "react-native-modal";
import PopupAlert from "./PopupAlert";

const CreditForm = (props) => {
    const [country, setCountry] = useState();
    const [cardSelected, setCardSelected] = useState(0);
    const [showCreditForm, setShowCreditForm] = useState(false);
    const [userID, setUserId] = useState(0);
    const [paymentData, setPaymentData] = useState({card_name: '', card_number: '', expire_date_m: '', expire_date_y: '', csv: ''});
    const [saveCardBtn, setSaveCardBtn] = useState(false);
    const [cardNameError, setCardNameError] = useState(false);
    const [cardNumberError, setCardNumberError] = useState(false);
    const [cardExpireMError, setCardExpireMError] = useState(false);
    const [cardExpireYError, setCardExpireYError] = useState(false);
    const [cardCsvError, setCardCsvError] = useState(false);
    const [isModalVisible, setModalVisible] = useState(false);
    let [ShowComment, setShowModelComment] = useState(false);
    const [creditCards, setCreditCards] = useState([]);
    const [refreshing, setRefreshing] = useState(false);

    const showAddCardForm = async () => {
        (showCreditForm)?setShowCreditForm(false):setShowCreditForm(true)
        setSaveCardBtn(false)
    }

    const getUserId = async () => {
        const user_id = await AsyncStorage.getItem('user_id')
        const CARDS = JSON.parse(await AsyncStorage.getItem('cards'))
        setUserId(user_id)
        if(CARDS != null && CARDS.length > 0){
            setCreditCards(CARDS)
        }else{
            setCreditCards([])
        }
    }

    const selectCard = async (value) => {
        const CARDS = JSON.parse(await AsyncStorage.getItem('cards'));
        CARDS.map(row => {
            if(row.id === value){
                // console.log(row)
                setPaymentData(row)
            }
        })

        setCardSelected(value)
        setShowCreditForm(true)
        setSaveCardBtn(true)
    }

    const saveCard = async () => {
        const USERID = JSON.parse(await AsyncStorage.getItem('user_id'));
        const CARDS = JSON.parse(await AsyncStorage.getItem('cards'));
        if(CARDS != null){
            var CARDs_LENGTH = CARDS.length;
        }else{
            var CARDs_LENGTH = 0;
        }

        const NEW_CARD = {
            id: CARDs_LENGTH+1,
            card_name: paymentData.card_name,
            card_number: paymentData.card_number,
            expire_date_m: paymentData.expire_date_m,
            expire_date_y: paymentData.expire_date_y,
            csv: paymentData.csv,
            user_id: USERID,
            card_type: (paymentData.card_number.slice(0, 1) <= 4)?"visa":"mastercard"
        }

        
        const keys = Object.keys(NEW_CARD).filter(key => {
            if(NEW_CARD[key] == ""){
                return key;
            }
        })


        if(keys.length <= 0){
            if(CARDS != null){
                if(CARDS.length <= 0){
                    await AsyncStorage.setItem('cards', JSON.stringify([NEW_CARD]))
                }else{
                    await AsyncStorage.setItem('cards', JSON.stringify([...CARDS, NEW_CARD]));
                }
            }else{
                await AsyncStorage.setItem('cards', JSON.stringify([NEW_CARD]))
            }
            openModalPopup()
        }else{
            keys.map(key => {
                if(keys.indexOf(key) == -1){

                }
                if(key == 'card_name'){
                    setCardNameError(true)
                }
                if(key == 'card_number'){
                    setCardNumberError(true)
                }
                if(key == 'expire_date_m'){
                    setCardExpireMError(true)
                }
                if(key == 'expire_date_y'){
                    setCardExpireYError(true)
                }
                if(key == 'csv'){
                    setCardCsvError(true)
                }

                if(keys.indexOf('card_name') == -1){
                    setCardNameError(false)
                }
                if(keys.indexOf('card_number') == -1){
                    setCardNumberError(false)
                }
                if(keys.indexOf('expire_date_m') == -1){
                    setCardExpireMError(false)
                }
                if(keys.indexOf('expire_date_y') == -1){
                    setCardExpireYError(false)
                }
                if(keys.indexOf('csv') == -1){
                    setCardCsvError(false)
                }


            })
        }
    }

    const openModalPopup = () => {
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false)
        setShowModelComment(false)
        onRefresh()
    }

    const wait = (timeout) => {
        return new Promise(resolve => setTimeout(resolve, timeout));
    }

    const onRefresh = useCallback(() => {
    setRefreshing(true);
    getUserId()
    wait(20).then(() => setRefreshing(false));
    }, []);

    useEffect(() => {
        getUserId()
    }, [])

    return(
        <>
        {
            (showCreditForm)?
            <View style={styles.creditForm}>
                <ScrollView
                    refreshControl={
                    <RefreshControl
                      refreshing={refreshing}
                      onRefresh={onRefresh}
                    />
                  }
                >
                    <View style={styles.row}>
                        <View style={styles.col_12}>
                            <TextInput placeholder="Card Name" style={[styles.formInput, (cardNumberError)?{borderWidth: 1, borderColor: COLORS.danger}:'']} placeholderTextColor={COLORS.gray}
                                onChangeText={(text) => {setPaymentData({...paymentData, card_name: text})}}
                                value={paymentData.card_name}
                            />
                        </View>
                        <View style={styles.col_12}>
                            <TextInput placeholder="Card Number" style={[styles.formInput, (cardNameError)?{borderWidth: 1, borderColor: COLORS.danger}:'']} placeholderTextColor={COLORS.gray}
                                onChangeText={(text) => {setPaymentData({...paymentData, card_number: text})}}
                                value={paymentData.card_number}
                            />
                        </View>
                        <View style={[styles.col_6, styles.expaireInputsRow]}>
                            <TextInput placeholder="MM" keyboardType="numeric" style={[[styles.formInput, (cardExpireMError)?{borderWidth: 1, borderColor: COLORS.danger}:''], styles.expaireInputs]} placeholderTextColor={COLORS.gray}
                                onChangeText={(text) => {setPaymentData({...paymentData, expire_date_m: text})}}
                                value={paymentData.expire_date_m}
                            />
                            <TextInput placeholder="YY" keyboardType="numeric" style={[[styles.formInput, (cardExpireYError)?{borderWidth: 1, borderColor: COLORS.danger}:''], styles.expaireInputs]} placeholderTextColor={COLORS.gray}
                                onChangeText={(text) => {setPaymentData({...paymentData, expire_date_y: text})}}
                                value={paymentData.expire_date_y}
                            />
                        </View>
                        <View style={styles.col_6}>
                            <TextInput placeholder="CSV" keyboardType="numeric" style={[styles.formInput, (cardCsvError)?{borderWidth: 1, borderColor: COLORS.danger}:'']} placeholderTextColor={COLORS.gray}
                                onChangeText={(text) => {setPaymentData({...paymentData, csv: text})}}
                                // value={paymentData.csv}
                            />
                        </View>
                        <View style={[styles.col_12]}>
                            {
                                (!saveCardBtn)?
                                <TouchableOpacity style={[styles.saveBtn]} onPress={()=> saveCard()}>
                                    <Text style={{color: COLORS.white}}>
                                    Save
                                    </Text>
                                </TouchableOpacity>:
                                ''
                            }
                        </View>
                    </View>
                </ScrollView>
            </View>:''
        }
        <TouchableOpacity style={styles.addCardBtn} onPress={() => {showAddCardForm()}}>
            <Text style={styles.addCardBtnText}>
                + Add New Card
            </Text>
            <EvilIcons name={`chevron-${showCreditForm?'up':'down'}`} size={25} color={COLORS.main_color} />
        </TouchableOpacity>
        <View style={styles.cardsAdded}>
            {
                creditCards.map((row, index) => {
                    if(row.user_id == userID){
                        return(
                            <TouchableOpacity key={index+1} style={[styles.card, (cardSelected === row.id)?styles.cardSelected:'']} onPress={() => selectCard(row.id)}>
                                <View style={styles.cardTypeImg}>
                                    <Image source={(row.card_type == 'visa')?Visa:MasterCard} style={styles.cardImage} />
                                </View>
                                <View style={styles.cardInfo}>
                                    <Text style={styles.cardNumber}>
                                        { "**** **** **** "+ row.card_number.slice(12,16)}
                                    </Text>
                                    <Text style={styles.expireDate}>
                                        Expire {row.expire_date_m}/{row.expire_date_y}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        )
                    }
                })
            }
            <PopupAlert model={'Card'} closeModal={closeModal} isModalVisible={isModalVisible}/>
        </View>
        </>
    )
}

export default CreditForm;

const styles = StyleSheet.create({
    creditForm:{
    },
    row:{
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    col_12: {
        width: "100%",
        marginBottom: 10
    },
    col_6: {
        width: "50%",
        marginBottom: 10
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
        paddingHorizontal: 20
    },
    expaireInputsRow:{
        display: 'flex',
        flexDirection: 'row'
    },
    expaireInputs:{
        width: "35%",
        marginRight: 10
    },
    saveBtn:{
        backgroundColor: COLORS.main_color,
        padding: 15,
        borderRadius: 5,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      },
    addCardBtn:{
        backgroundColor: COLORS.white,
        padding: 20,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    addCardBtnText:{
        color: COLORS.main_color
    },
    cardsAdded: {
        
    },
    card: {
        display: 'flex',
        flexDirection: 'row',
        backgroundColor: COLORS.white,
        marginVertical: 10,
        padding: 20,
        borderRadius: 5,
    },
    cardTypeImg: {
        width: 50,
        height: 50,
    },
    cardImage: {
        width: "100%",
        height: "100%",
        resizeMode: 'contain'
    },
    cardInfo: {
        padding: 10,
        marginLeft: 10
    },
    cardNumber: {
        color: COLORS.main_color,
        fontWeight: 'bold'
    },
    expireDate: {
        color: COLORS.grayLight
    },
    cardSelected:{
        borderColor: COLORS.main_color,
        borderWidth: 1
    },
    successWrapper: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        paddingTop: 50,
        backgroundColor: COLORS.white
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
})