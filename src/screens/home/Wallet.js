import {Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View, Dimensions} from 'react-native';
import React, { useState } from 'react';
import {COLORS,ROUTES} from '../../constants';
import UserImg from '../../assets/user.jpg';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Octicons from 'react-native-vector-icons/Octicons';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Visa from '../../assets/icons/visa.png';

const FULL_WIDTH = Dimensions.get('window').width;
const FULL_HEIGHT = Dimensions.get('window').height;
const Wallet = ({navigation}) => {
  const [optionActive, setOptionActive] = useState('topup');

  const selectOption = (value) => {
    setOptionActive(value)
  }
  return (
    <SafeAreaView>
      <View
      style={styles.walletWrapper}>
        <View style={styles.userWelcome}>
          <View style={styles.userImg}>
            <Image source={UserImg} style={styles.img}/>
          </View>
          <View style={styles.userText}>
            <Text style={styles.welcome}>Hi, Mahmoud <MaterialCommunityIcons style={{marginLeft: 10}} name='hand-wave' color={'#f9c835'} size={25}/></Text>
            <Text style={styles.save}>Let's save your money!</Text>
          </View>
        </View>
        <LinearGradient style={styles.balanceCard} colors={['#326bc5', '#449dfe']}
              start={{ x: 0, y: 1 }}
              end={{ x: 1, y: 0 }}>
            <View style={styles.cardTop}>
              <Text style={{color: COLORS.white, fontSize: 17, marginBottom: 10}}>Balance</Text>
              <Text style={{color: COLORS.white, fontSize: 35, fontWeight: 'bold', marginBottom: 30}}>EGP 25,340,00</Text>
            </View>
            <View style={styles.cardBottom}>
              <Text style={{color: COLORS.white, fontSize: 20, fontWeight: 'bold'}}>Visa</Text>
              <Text style={{color: COLORS.white, fontSize: 20}}>4256 **** 2453</Text>
            </View>
            <Octicons name='credit-card' style={styles.cardIcon} />
        </LinearGradient>
        <View style={styles.options}>
          <TouchableOpacity style={[styles.optionBtn, (optionActive == 'topup')?styles.optionActive:'']} onPress={()=> {selectOption('topup')}}>
            <MaterialCommunityIcons name="credit-card-plus-outline" color={(optionActive == 'topup')?COLORS.white:COLORS.gray} size={35} style={{marginBottom: 5}} />
            <Text style={[{fontSize: 16 ,color:(optionActive == 'topup')?COLORS.white:COLORS.gray}]}>Top Up</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.optionBtn, (optionActive == 'transfer')?styles.optionActive:'']} onPress={()=> {selectOption('transfer')}}>
            <Ionicons name="md-paper-plane" color={(optionActive == 'transfer')?COLORS.white:COLORS.gray} size={35} style={{marginBottom: 5}} />
            <Text style={[{fontSize: 16 ,color:(optionActive == 'transfer')?COLORS.white:COLORS.gray}]}>Transfer</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.optionBtn, (optionActive == 'receive')?styles.optionActive:'']} onPress={()=> {selectOption('receive')}}>
            <Octicons name="download" color={(optionActive == 'receive')?COLORS.white:COLORS.gray} size={35} style={{marginBottom: 5}} />
            <Text style={[{fontSize: 16 ,color:(optionActive == 'receive')?COLORS.white:COLORS.gray}]}>Receive</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.transactionsWrapper}>
          <View style={styles.sectionHead}>
              <View style={styles.sectionTitle}>
                <Text style={styles.sectionTitleText}>Transactions</Text>
              </View>
              <TouchableOpacity style={styles.moreBtn} onPress={() => navigation.navigate(ROUTES.INVOICES)}>
                <Text style={{color: COLORS.main_color}}>See all</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.transactions}>
              <TouchableOpacity style={styles.transaction}>
                <View style={styles.left}>
                  <View style={styles.transImage}>
                    <Image source={Visa} style={styles.methodImg} />
                  </View>
                  <View style={styles.transInfo}>
                    <Text style={styles.methodName}>Visa</Text>
                    <Text style={styles.transDate}>08:45 PM, 5 Nov 2022</Text>
                  </View>
                </View>
                <View style={styles.transPrice}>
                  <Text style={[styles.priceText, {color:COLORS.active_color}]}>+EGP 5,658</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={styles.transaction}>
                <View style={styles.left}>
                  <View style={styles.transImage}>
                    <Image source={Visa} style={styles.methodImg} />
                  </View>
                  <View style={styles.transInfo}>
                    <Text style={styles.methodName}>Visa</Text>
                    <Text style={styles.transDate}>08:45 PM, 5 Nov 2022</Text>
                  </View>
                </View>
                <View style={styles.transPrice}>
                  <Text style={[styles.priceText, {color:COLORS.active_color}]}>+EGP 5,658</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={styles.transaction}>
                <View style={styles.left}>
                  <View style={styles.transImage}>
                    <Image source={Visa} style={styles.methodImg} />
                  </View>
                  <View style={styles.transInfo}>
                    <Text style={styles.methodName}>Visa</Text>
                    <Text style={styles.transDate}>08:45 PM, 5 Nov 2022</Text>
                  </View>
                </View>
                <View style={styles.transPrice}>
                  <Text style={[styles.priceText, {color:COLORS.danger}]}>-EGP 5,658</Text>
                </View>
              </TouchableOpacity>
            </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Wallet;

const styles = StyleSheet.create({
  walletWrapper: {
    padding: 20,
    backgroundColor: COLORS.second_bg,
    height: "100%"
  },
  userWelcome: {
    borderBottomColor: COLORS.main_bg,
    borderBottomWidth: 1,
    paddingBottom: 20,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  userImg: {
    width: 70,
    height: 70,
    borderRadius: 50,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: COLORS.grayLight,
    padding: 2,
    marginRight: 10
  },
  img: {
    width: "100%",
    height: "100%",
    borderRadius: 50
  },
  userText: {

  },
  welcome: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.black
  },
  save: {
    fontSize: 17,
    fontWeight: 'bold',
    color: COLORS.grayLight
  },
  balanceCard: {
    backgroundColor: COLORS.main_color,
    padding: 30,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: COLORS.gray,
    elevation: 1
  },
  cardTop: {

  },
  cardBottom: {

  },
  cardIcon:{
    fontSize: 180,
    color: COLORS.main_bg+'23',
    position: 'absolute',
    top: -40,
    right: -40,
    transform: [{rotate: '-220deg'}]
  },
  options: {
    display: 'flex',
    flexDirection: 'row'
  },
  optionBtn: {
    width: (FULL_WIDTH-80)/3,
    backgroundColor: COLORS.white,
    padding: 20,
    marginRight: 20,
    borderRadius: 5,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: COLORS.gray,
    elevation: 1,
    shadowColor: COLORS.gray
  },
  optionActive:{
    backgroundColor: COLORS.main_color
  },
  transactionsWrapper:{
    marginTop: 20
  },
  sectionHead:{
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  sectionTitle:{
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingBottom: 10
  },
  sectionTitleIcon:{
    marginRight: 5
  },
  sectionTitleText:{
    color: COLORS.black,
    fontWeight: 'bold',
    fontSize: 20
  },
  moreBtn:{
    display: 'flex',
    flexDirection: 'row',
  },
  transaction:{
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    shadowColor: COLORS.gray,
    elevation: 1
  },
  transImage: {
    width: 50,
    height: 50,
    marginRight: 20,
    backgroundColor: COLORS.main_bg,
    padding: 5,
    borderRadius: 50
  },
  methodImg: {
    width: "100%",
    height: "100%",
  },
  transInfo: {

  },
  methodName: {
    color: COLORS.black,
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 5
  },
  transDate: {

  },
  left: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  transPrice: {

  },
  priceText: {
    fontWeight: 'bold'
  }
})