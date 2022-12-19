import React, { useState, useEffect } from 'react';
import {StyleSheet, Text, SafeAreaView, View, Dimensions, ScrollView, TouchableOpacity} from 'react-native';
import { COLORS } from '../../constants';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
const FULL_WIDTH = Dimensions.get('window').width;
const FULL_HEIGHT = Dimensions.get('window').height;

const InvoiceDetails = (props) => {
  const [invoiceDetails, setInvoiceDetails] = useState({});
  const [showInvProducts, setShowInvProducts] = useState(false);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const invoice = props.route.params.invoice;

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "June",
      "July", "Aug", "Sept", "Oct", "Nov", "Dec"
  ];

  const getDate = () => {
    var DATE = new Date(invoice.created_at)
    var NEW_DATE = String(DATE.getDate()).padStart(2, '0')+" "+monthNames[DATE.getMonth()]+" "+DATE.getFullYear();
    var NEW_TIME = DATE.getHours()+":"+DATE.getMinutes()+(DATE.getHours() >= 12?"PM":"AM");
    setDate(NEW_DATE)
    setTime(NEW_TIME)
  }

  const showProducts =() => {
    (showInvProducts)?setShowInvProducts(false):setShowInvProducts(true)
  }

  useEffect(() => {
    getDate()
  }, [])

  return (
    <SafeAreaView>
      <View style={styles.wrapper}>
        <View style={styles.InvoiceDetailsHeader}>
          <View style={{display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20}}>
            <Text style={styles.headerText}>{(invoice.title).toUpperCase()}</Text>
            <Text style={styles.headerText}>#{invoice.invoice_number}</Text>
          </View>
          <Text style={[styles.invoiceStatus, {backgroundColor: (invoice.status != 'paid')?invoice.color+'56':COLORS.white+'56',borderLeftColor: (invoice.status != 'paid')?invoice.color:COLORS.white}]}>{(invoice.status).toUpperCase()}</Text>
        </View>
        <Text style={[styles.before, styles.beforeRight]}></Text>
        <View style={styles.invoiceDetails}>
          <View style={styles.headLine}>
            <Text style={styles.headLineText}>INVOICE</Text>
          </View>
          <View style={styles.headerDetails}>
            <View>
              <Text style={styles.label}>ORDER #</Text>
              <Text style={[styles.descText, {backgroundColor: '#'+invoice.invoice_number+'56', padding: 3, borderRadius: 5}]}>#{invoice.invoice_number}</Text>
            </View>
            <View>
              <Text style={styles.label}>DUE ON #</Text>
              <Text style={[styles.descText, {textAlign: 'center'}]}>{date}</Text>
              <Text style={[styles.descText, {textAlign: 'center'}]}>{time}</Text>
            </View>
          </View>
          <View style={styles.info}>
            <Text style={styles.infoBefore}>DETAILS +</Text>
            <View style={[styles.infoBox, {borderRightWidth: 1, borderRightColor: COLORS.grayLight}]}>
              <Text style={styles.label}>#RX</Text>
              <Text style={styles.descText}>02</Text>
            </View>
            <View style={styles.infoBox}>
              <Text style={styles.label}>#MEDICATIONS</Text>
              <Text style={styles.descText}>18</Text>
            </View>
          </View>
          <View style={styles.totalAmount}>
            <Text style={styles.totalText}>TOTAL AMOUNT</Text>
            <Text style={styles.totalPrice}>EGP {invoice.price}</Text>
          </View>
        </View>
        <View style={styles.invoiceItems}>
          <TouchableOpacity style={styles.sectionHead} onPress={()=> showProducts()}>
            <View style={styles.sectionTitle}>
              <Text style={styles.sectionTitleText}>Invoice Products ({invoice.items.length})</Text>
            </View>
            <EvilIcons name={`chevron-${showInvProducts?'up':'down'}`} size={25} color={COLORS.main_color} />
          </TouchableOpacity>
          {/* <View>
            <TouchableOpacity>
              <Text>
                Invoice Products
              </Text>
            </TouchableOpacity>
          </View> */}
          {
            (showInvProducts)?
            <View style={{height: 250}}>
              <ScrollView style={{backgroundColor: COLORS.white}}>
              {
                invoice.items.map((item, index) => {
                  return(
                    <View key={item.id} style={[styles.invoiceItem, (invoice.items.length == index+1)?{borderBottomWidth: 0}:'']}>
                      <Text style={{color:COLORS.black}}>{index+1}# {item.name}</Text>
                      <Text style={{color:COLORS.black}}>EGP {item.price*item.quantity} (x{item.quantity})</Text>
                    </View>
                  )
                })
                }
          </ScrollView>
            </View>:
          ''
          }
        </View>
      </View>
    </SafeAreaView>
  );
};

export default InvoiceDetails;

const styles = StyleSheet.create({
  wrapper: {
    height: FULL_HEIGHT-70,
  },
  InvoiceDetailsHeader: {
    width: "100%",
    height: 200,
    backgroundColor: COLORS.main_color,
    display: 'flex',
    alignItems: 'center',

  },
  headerText: {
    color: COLORS.white,
    fontSize: 30,
  },
  invoiceDetails: {
    backgroundColor: COLORS.white,
    position: 'absolute',
    top: 157,
    width: "85%",
    left: "7.5%",
    flex: 1,
    shadowColor: COLORS.gray,
    elevation: 4
  },
  before:{
    backgroundColor: "#2b497890",
    position: 'absolute',
    width: "92%",
    height: 15,
    top: 155,
    left: "4%",
    borderRadius: 10
  },
  headLine: {
    backgroundColor: COLORS.grayLight,
    height: 35,
    zIndex: 10,
    borderBottomColor: COLORS.white,
    borderBottomWidth: 2
  },
  headLineText: {
    color: COLORS.gray,
    fontWeight: 'bold',
    backgroundColor: COLORS.white,
    borderRadius: 10,
    position: 'absolute',
    width: 80,
    height: 20,
    textAlign: 'center',
    left: (FULL_WIDTH-150)/2,
    bottom: -10,
  },
  headerDetails: {
    backgroundColor: COLORS.main_bg,
    zIndex: 1,
    elevation: 0,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 40,
    paddingVertical: 20
  },
  label: {
    color: COLORS.grayLight,
    fontWeight: 'bold',
    marginBottom: 5
  },
  descText: {
    color: COLORS.black,
    fontWeight: 'bold'
  },
  info:{
    display: 'flex',
    flexDirection: 'row'
  },
  infoBox:{
    width: "50%",
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.grayLight
  },
  infoBefore:{
    position: 'absolute',
    color: COLORS.gray,
    fontWeight: 'bold',
    borderWidth: 1,
    borderColor: COLORS.grayLight,
    padding: 3,
    paddingHorizontal: 10,
    borderRadius: 20,
    bottom: -12,
    left: (FULL_WIDTH-140)/2,
    backgroundColor: COLORS.white,
    zIndex: 10
  },
  totalAmount: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20
  },
  totalText: {
    color: COLORS.grayLight,
    fontWeight: 'bold',
    fontSize: 20
  },
  totalPrice: {
    color: COLORS.black,
    fontWeight: 'bold',
    fontSize: 35
  },
  invoiceStatus:{
    borderLeftWidth: 3,
    paddingHorizontal: 15,
    paddingVertical: 5
  },
  invoiceItems:{
    marginTop: 270,
    padding: 20,
  },
  invoiceItem:{
    padding: 20,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: COLORS.grayLight,
    borderBottomColor: COLORS.main_bg,
    borderBottomWidth: 1
  },
  sectionHead:{
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: COLORS.white,
    padding: 10,
    width: "100%",
    borderBottomColor: COLORS.main_bg,
    borderBottomWidth: 1
  },
  sectionTitle:{
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  sectionTitleIcon:{
    marginRight: 5
  },
  sectionTitleText:{
    color: COLORS.main_color,
    fontSize: 15
  },
  moreBtn:{
    display: 'flex',
    flexDirection: 'row',
  },
});
