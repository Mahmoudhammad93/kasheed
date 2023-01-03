import React, { useState, useEffect, useCallback } from 'react';
import {StyleSheet, Image, Text, SafeAreaView, View, Dimensions, ScrollView, TouchableOpacity, RefreshControl} from 'react-native';
import { COLORS, ROUTES } from '../../constants';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import SwipeUpDownModal from 'react-native-swipe-modal-up-down';
import AsyncStorage from "@react-native-async-storage/async-storage";
import Loading from '../../components/Loading';
import Cart from '../../assets/icons/shopping-cart.png';


const FULL_WIDTH = Dimensions.get('window').width;
const FULL_HEIGHT = Dimensions.get('window').height;

const InvoiceDetails = ({navigation, ...props}) => {
  const [refreshing, setRefreshing] = useState(false);
  const [invoiceDetails, setInvoiceDetails] = useState({});
  const [showInvProducts, setShowInvProducts] = useState(false);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  let [showOptionsModal, setShowOptionsModal] = useState(false);
  let [animateOptionsModal, setanimateOptionsModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const invoice = props.route.params.invoice;

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "June",
      "July", "Aug", "Sept", "Oct", "Nov", "Dec"
  ];

  const getInvoiceData = async () => {
    const INVOICES = JSON.parse(await AsyncStorage.getItem('invoices'))
    const array = INVOICES.filter(row => {
      if(row.id == invoice.id){
        if(row.status === 'active'){
          row.color = COLORS.active_color
        }else if (row.status === 'paid'){
          row.color = COLORS.main_color
        }else if(row.status === 'pending'){
          row.color = COLORS.warning_color
        }else{
          row.color = COLORS.danger
        }
        return row;
      }
    })

    setInvoiceDetails(array[0])
    setLoading(false)
  }

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

  const openOptionsModal = () => {
    setShowOptionsModal(true)
  }

  const closePopupModal = () => {
    setShowOptionsModal(false);
    setanimateOptionsModal(false);
  }

  const cancelInvoice = async (obj) => {
    const INVOICES = JSON.parse(await AsyncStorage.getItem('invoices'))
    const array = INVOICES.filter(row => {
      if(row.id !== obj.id){
        return row;
      }
    })

    obj.status = 'faild';
    await AsyncStorage.setItem('invoices', JSON.stringify([...array, obj]))
    setShowOptionsModal(false)
    onRefresh()
  }

  const deleteInvoice = async (obj) => {
    const INVOICES = JSON.parse(await AsyncStorage.getItem('invoices'))
    const array = INVOICES.filter(row => {
      if(row.id !== obj.id){
        return row;
      }
    })

    navigation.navigate(ROUTES.HOME, {type: 'invoice_delete'})

    obj.status = 'faild';
    await AsyncStorage.setItem('invoices', JSON.stringify([...array]))
    setShowOptionsModal(false)
  }

  const downloadPDFInvoice = () => {
    alert('Download PDF Invoice')
  }

  const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  }

  const onRefresh = useCallback(() => {
    getInvoiceData()
    setRefreshing(true);
    wait(20).then(() => setRefreshing(false));
  }, []);

  useEffect(() => {
    getDate()
    getInvoiceData()
  }, [])

  return (
    <>
    {
      (loading)?<Loading />:
      <SafeAreaView>
      <ScrollView
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      }
       style={styles.wrapper}>
        <View style={styles.InvoiceDetailsHeader}>
          <TouchableOpacity style={styles.optionsBtn} onPress={()=>openOptionsModal()}>
            <Entypo name='dots-three-horizontal' color={COLORS.white} size={25} />
          </TouchableOpacity>
          <View style={{display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20}}>
            <Text style={styles.headerText}>{invoiceDetails.title.toUpperCase()}</Text>
            <Text style={styles.headerText}>#{invoiceDetails.invoice_number}</Text>
          </View>
          <Text style={[styles.invoiceStatus, {backgroundColor: (invoiceDetails.status != 'paid')?invoiceDetails.color+'56':COLORS.white+'56',borderLeftColor: (invoiceDetails.status != 'paid')?invoiceDetails.color:COLORS.white}]}>{((invoiceDetails.status == 'faild')?'Cancelled':invoiceDetails.status).toUpperCase()}</Text>
        </View>
        <Text style={[styles.before, styles.beforeRight]}></Text>
        <View style={styles.invoiceDetails}>
          <View style={styles.headLine}>
            <Text style={styles.headLineText}>INVOICE</Text>
          </View>
          <View style={styles.headerDetails}>
            <View>
              <Text style={styles.label}>ORDER #</Text>
              <Text style={[styles.descText, {backgroundColor: '#'+invoiceDetails.invoice_number+'56', padding: 3, borderRadius: 5}]}>#{invoiceDetails.invoice_number}</Text>
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
            <Text style={styles.totalPrice}>EGP {invoiceDetails.price}</Text>
          </View>
        </View>
        <View style={styles.invoiceItems}>
          <TouchableOpacity style={styles.sectionHead} onPress={()=> showProducts()}>
            <View style={styles.sectionTitle}>
              <Text style={styles.sectionTitleText}>Invoice Products ({invoiceDetails.items.length})</Text>
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
            <View style={{maxHeight: 250}}>
              <ScrollView style={{backgroundColor: COLORS.white}}>
              {
                invoiceDetails.items.map((item, index) => {
                  return(
                    <View key={item.id} style={[styles.invoiceItem, (invoiceDetails.items.length == index+1)?{borderBottomWidth: 0}:'']}>
                      <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                        <View style={{width: 30, height: 30, marginRight: 10, backgroundColor: COLORS.main_bg, padding: 5, borderRadius: 5}}>
                          <Image source={(item.image)?{uri: item.image}: Cart} style={{width: '100%', height: '100%'}}/>
                        </View>
                        <Text style={{color:COLORS.black}}>{index+1}# {item.name}</Text>
                      </View>
                      <Text style={{color:COLORS.black}}>EGP {(item.offer_status == 1)?item.offer_price:item.price*item.quantity} (x{item.quantity})</Text>
                    </View>
                  )
                })
                }
          </ScrollView>
            </View>:
          ''
          }
          {
            (invoiceDetails.status == 'pending')?
            <TouchableOpacity style={styles.payBtn} onPress={()=> navigation.navigate(ROUTES.PAYMENT, {invoice: invoice, type: 'pending'})}>
              <Text style={{color: COLORS.white, textAlign: 'center'}}>EGP {invoiceDetails.price} Containue to payment</Text>
            </TouchableOpacity>:""
          }
        </View>
        <SwipeUpDownModal
              modalVisible={showOptionsModal}
              PressToanimate={animateOptionsModal}
              // HeaderContent={
              //   <View style={styles.containerHeader}>
              //         <TouchableOpacity onPress={() => {
              //               setanimateModal(false);
              //               setShowModelComment(false);
              //             }}>
              //           <Entypo name='minus' color={COLORS.white} size={50} />
              //         </TouchableOpacity>
              //   </View>
              // }
              //if you don't pass HeaderContent you should pass marginTop in view of ContentModel to Make modal swipeable
              ContentModal={
                <View>
                  <View style={styles.containerContent}>
                      <TouchableOpacity style={styles.langBtn} onPress={() => downloadPDFInvoice()}>
                        <FontAwesome name='file-pdf-o' color={COLORS.gray} size={15} style={{marginRight: 15}} />
                        <Text style={{color: COLORS.gray}}>Download PDF</Text>
                      </TouchableOpacity>
                      {
                        (invoiceDetails.status == 'pending')?
                        <TouchableOpacity style={[styles.langBtn, {borderBottomWidth: 0}]} onPress={() => cancelInvoice(invoice)}>
                        <EvilIcons name='close' color={COLORS.danger} size={20} style={{marginRight: 10}} />
                        <Text style={{color: COLORS.gray}}>Cancel Invoice</Text>
                      </TouchableOpacity>:
                      <TouchableOpacity style={[styles.langBtn, {borderBottomWidth: 0}]} onPress={() => deleteInvoice(invoice)}>
                      <EvilIcons name='trash' color={COLORS.danger} size={25} style={{marginRight: 10}} />
                      <Text style={{color: COLORS.gray}}>Delete Invoice</Text>
                    </TouchableOpacity>
                      }
                  </View>
                  <TouchableOpacity style={styles.ModalBtnClose} onPress={()=> closePopupModal()}>
                    <Text style={{color: COLORS.white, textAlign: 'center',fontWeight: 'bold'}}>Close</Text>
                  </TouchableOpacity>
                </View>
              }
              HeaderStyle={styles.headerContent}
              ContentModalStyle={styles.Modal}
              onClose={() => {
                setShowOptionsModal(false);
                setanimateOptionsModal(false);
              }}
            />
      </ScrollView>
    </SafeAreaView>
    }
    </>
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
  payBtn:{
    backgroundColor: COLORS.main_color,
    padding: 15,
    borderRadius: 5,
    marginTop: 10
  },
  optionsBtn:{
    position: 'absolute',
    right: 20,
    top: 20
  },
  ///// Modal

  containerContent: {
    flex: 1,
    width: FULL_WIDTH-40,
    // height: 150,
    margin: 20,
    marginBottom: 10,
    backgroundColor: COLORS.white,
    borderRadius: 10
  },
  headerContent:{
    marginTop: 0,
    backgroundColor: COLORS.main_bg
  },
  Modal: {
    position: 'absolute',
    bottom: 0,
    left: 0,
  },
  langBtn:{
    padding: 20,
    borderBottomColor: COLORS.main_bg,
    borderBottomWidth: 1,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  ModalBtnClose:{
    backgroundColor: COLORS.danger,
    margin: 20,
    marginTop: 0,
    width: FULL_WIDTH-40,
    padding: 15,
    borderRadius: 10
  }
});
