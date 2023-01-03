import {StyleSheet, Text, View, SafeAreaView, ScrollView, TouchableOpacity, Image, RefreshControl, Dimensions, Animated, Button} from 'react-native';
import React, { useEffect, useState, useCallback, useRef } from 'react';
import {COLORS, ROUTES} from '../../constants';
import KasheedIcon from '../../assets/icons/kasheed-icon.png';
import CreditCard from '../../assets/icons/credit-card.png';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import EvilIcon from 'react-native-vector-icons/EvilIcons';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import SwipeUpDownModal from 'react-native-swipe-modal-up-down';
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomHeader from "../../components/CustomHeader";
import Loading from '../../components/Loading';
import { sort_by_id } from '../../constants/helper';
import NotFound from '../../components/NotFound';
import LocationPin from '../../assets/icons/location.png';

import Data from '../../data.json';
import InvoiceList from '../../components/InvoiceList';
import AnalysisBox from '../../components/AnalysisBox';
import axios from 'axios';
const FULL_WIDTH = Dimensions.get('window').width;
const FULL_HEIGHT = Dimensions.get('window').height;

const Home = ({navigation, ...props}) => {
  const [refreshing, setRefreshing] = useState(false);
  const [latestInvoices, setLatestInvoices] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [allInvoices, setAllInvoices] = useState([]);
  const [lang, setLang] = useState('');
  const [loading, setLoading] = useState(true);
  let [ShowLocation, setShowModelLocation] = useState(false);
  let [animateModal, setanimateModal] = useState(false);


  const getData = async () => {
    const invoices = JSON.parse(await AsyncStorage.getItem('invoices'));
    const PRODUCS = JSON.parse(await AsyncStorage.getItem('products'));
    const CATEGORIES = JSON.parse(await AsyncStorage.getItem('categories'));
    const LANG = JSON.parse(await AsyncStorage.getItem('lang'))

    if(LANG != null){
      setLang(LANG)
    }else{
      setLang('en')
    }
    if(PRODUCS != null && PRODUCS.length > 0){
      setProducts(PRODUCS);
    }else{
      setProducts([]);
    }

    if(CATEGORIES != null && CATEGORIES.length > 0){
      setCategories(CATEGORIES);
    }else{
      setCategories([]);
    }

    if(invoices != null && invoices.length > 0){
      setAllInvoices(invoices)
      if(invoices.length > 5){
        setLatestInvoices(invoices.slice(invoices.length-6, invoices.length).sort(sort_by_id()))
      }else{
        setLatestInvoices(invoices.sort(sort_by_id()))
      }
    }else{
      setAllInvoices([])
    }
    setLoading(false)
  }

  const openModal = () => {
    setShowModelLocation(true)
  }

  const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  }

  const onRefresh = useCallback(() => {
    getData()
    setRefreshing(true);
    wait(20).then(() => setRefreshing(false));
  }, []);

  useEffect(() => {
    onRefresh();
    getData();
  },[])
  return (
    (loading)?<Loading />:
    <SafeAreaView style={styles.container}>
      <View style={styles.wrapper}>
        <View style={[styles.header, (lang == 'ar')?{flexDirection: 'row-reverse'}:'']}>
        <TouchableOpacity onPress={() => navigation.navigate(ROUTES.WALLET)}>
            <LinearGradient style={[styles.headerBtns, {width:40,height:40, justifyContent:'center'}]} colors={['#326bc5', '#449dfe']}
              start={{ x: 0, y: 1 }}
              end={{ x: 1, y: 0 }}>
                
                <Image source={CreditCard} style={styles.btnIcon}/>
              </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate(ROUTES.KASHEED) }>
            <LinearGradient style={[styles.headerBtns, {marginLeft: 0}, (lang == 'ar')?{flexDirection: 'row-reverse'}:'']} colors={['#326bc5', '#449dfe']}
              start={{ x: 0, y: 1 }}
              end={{ x: 1, y: 0 }}>

                <Image source={KasheedIcon} style={styles.btnIcon}/>
                {(lang == 'ar')?
                <Text style={[styles.btnText,{marginRight: 10, fontSize: 20}]}>أبدا كاشيد</Text>:
                <Text style={[styles.btnText,{marginRight: 10}]}>Start Kasheed</Text>
                }
              </LinearGradient>
            </TouchableOpacity>
          
        </View>
        <View style={styles.analysisRow}>
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} contentOffset={(lang == 'ar')?{x:1315}:{x:0}}>
            <AnalysisBox title="Total Invoices" arr={allInvoices} desc="Invoice" navigation={navigation} icon="file-document-multiple" route={ROUTES.INVOICES}/>
            <AnalysisBox title="Products" arr={products} desc="Product" navigation={navigation} icon="cube-outline" route={ROUTES.PRODUCTS}/>
            <AnalysisBox title="Categories" arr={categories} desc="Category" navigation={navigation} icon="view-grid-outline" route={ROUTES.CATEGORIES}/>
            <AnalysisBox title="Clients" arr={Data.users} desc="Client" navigation={navigation} icon="account-multiple-outline" route={ROUTES.CLIENTS}/>
          </ScrollView>
        </View>
        <View style={styles.location}>
          <TouchableOpacity style={styles.locationSelect} onPress={() => openModal()}>
            <View style={{width: 30, height: 30, marginRight: 20}}>
              <Image source={LocationPin} style={{width: "100%", height: "100%"}} />
            </View>
            <Text style={{color: COLORS.gray, fontWeight: 'bold', width: 250}} numberOfLines={1}>
              Select Your Location
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.invoices}>
          <View style={styles.sectionHead}>
            <View style={styles.sectionTitle}>
              <MaterialCommunityIcon name='file-document-multiple' size={20} color={COLORS.gray} style={styles.sectionTitleIcon} />
              <Text style={styles.sectionTitleText}>Latest Invoices</Text>
            </View>
            <TouchableOpacity style={styles.moreBtn} onPress={() => navigation.navigate(ROUTES.INVOICES)}>
              <Text style={{color: COLORS.main_color}}>View More</Text>
              <EvilIcon name='chevron-right' size={25} color={COLORS.main_color} />
            </TouchableOpacity>
          </View>
          <ScrollView
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
              />
            }
          >
            <View style={styles.invoicesWrapper}>
              {
                (latestInvoices && latestInvoices.length > 0)?latestInvoices.map(row => {
                if(row.status === 'active'){
                  row.color = COLORS.active_color
                }else if (row.status === 'paid'){
                  row.color = COLORS.main_color
                }else if(row.status === 'pending'){
                  row.color = COLORS.warning_color
                }else{
                  row.color = COLORS.danger
                }
                return(
                  <InvoiceList data={row} key={row.id} navigation={navigation}/>
                )
              }):<View style={{width: "100%", height: 200}}>
                  {/* <Text key={1} style={{borderWidth: 1, borderColor: COLORS.grayLight ,width: FULL_WIDTH-35 ,color: COLORS.gray,padding: 20, textAlign: 'center'}}>Not Invoices Found</Text> */}
                  <NotFound module={"Invoices"}/>
                  {/* <Text>{leftValue}</Text> */}
                </View>
              }
            </View>
          </ScrollView>
        </View>
        <SwipeUpDownModal
              modalVisible={ShowLocation}
              PressToanimate={animateModal}
              // HeaderContent={
              //   <View style={styles.containerHeader}>
              //         <Text style={{color: COLORS.gray, fontWeight: 'bold', fontSize: 20}}>Add Product</Text>
              //   </View>
              // }
              //if you don't pass HeaderContent you should pass marginTop in view of ContentModel to Make modal swipeable
              ContentModal={
                <View style={styles.containerContent}>
                  <View style={{minHeight: 50, maxHeight: 500}}>
                    <ScrollView>
                      <View style={{padding: 20, backgroundColor: COLORS.main_bg, borderBottomColor: COLORS.second_bg, borderBottomWidth: 1}}>
                        <Text style={{color: COLORS.gray}}>
                          Arab Elhisar, Saf, Giza First
                        </Text>
                      </View>
                    </ScrollView>
                  </View>
                  <View style={{paddingTop: 20}}>
                    <TouchableOpacity style={{backgroundColor: COLORS.main_color, padding: 15, borderRadius:5}} onPress={()=> navigation.navigate(ROUTES.LOCATION)}>
                      <Text style={{color: COLORS.white, textAlign: 'center'}}>Select New Location</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              }
              HeaderStyle={styles.headerContent}
              ContentModalStyle={styles.Modal}
              onClose={() => {
                setShowModelLocation(false);
                  setanimateModal(false);
              }}
            />
      </View>
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container:{
    height: '100%',
    width: '100%',
  },
  wrapper:{
    flex: 1,
    backgroundColor: COLORS.main_bg,
    padding: 10
  },
  header:{
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  headerBtns:{
    backgroundColor: COLORS.main_color,
    height: 40,
    display: 'flex',
    flexDirection: 'row',
    padding: 10,
    display: 'flex',
    alignItems: 'center',
    borderRadius: 50
  },
  btnText:{
    color: COLORS.white,
    fontSize: 15,
    fontWeight: 'bold'
  },
  btnIcon:{
    width: 25,
    height: 25,
  },
  analysisRow:{
    marginTop: 10,
    marginBottom: 20
  },
  location: {
    paddingHorizontal: 5,
    marginBottom: 30
  },
  locationSelect: {
    borderColor: COLORS.main_bg,
    borderWidth: 1,
    padding: 10,
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    borderRadius: 5,
    alignItems: 'center',
    backgroundColor: COLORS.white,
    shadowColor: COLORS.gray,
    elevation: 2
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
    color: COLORS.gray,
    fontWeight: 'bold'
  },
  moreBtn:{
    display: 'flex',
    flexDirection: 'row',
  },
  invoicesWrapper:{
    marginTop: 20,
    marginHorizontal: 5,
    marginBottom: 230,
  },
  // invoice:{
  //   backgroundColor: COLORS.white,
  //   display: 'flex',
  //   flexDirection: 'row',
  //   justifyContent: 'space-between',
  //   padding: 10,
  //   // borderBottomColor: COLORS.grayLight,
  //   // borderBottomWidth: 2,
  //   borderLeftWidth: 3,
  //   marginBottom: 5,
  //   // borderRadius: 5
  //   shadowColor: "#000",
  //   shadowOffset: {
  //     width: 0,
  //     height: 4,
  //   },
  //   shadowOpacity: 0.30,
  //   shadowRadius: 4.65,

  //   elevation: 2,
  // },
  // invoiceIcon:{
  //   color: COLORS.main_color
  // },
  // invoiceNumber:{
  //   color: COLORS.gray,
  //   fontWeight: 'bold'
  // },
  // invoiceTitle:{
  //   color: COLORS.gray,
  //   fontWeight: 'bold',
  //   marginBottom: 10
  // },
  // invoiceStatus:{
  //   color: COLORS.white,
  //   textAlign: 'center',
  //   padding: 5,
  //   borderRadius: 5,
  //   fontSize: 12,
  //   width: 50,
  //   fontWeight: 'bold'
  // },
  // price:{
  //   color: COLORS.gray,
  //   fontWeight: 'bold',
  //   marginBottom: 10
  // },
  // date:{
  //   color: COLORS.main_color
  // },
  // activeStatus:{
  //   backgroundColor: COLORS.active_color
  // },
  // paidStatus:{
  //   backgroundColor: COLORS.main_color
  // },
  // pendingStatus: {
  //   backgroundColor: COLORS.warning_color
  // }

  /// Modal

  containerContent: {
    flex: 1, 
    maxHeight: 650,
    minHeight: 100,
    width: FULL_WIDTH,
    padding: 20 
  },
  Modal: {
    backgroundColor: COLORS.white,
    marginTop: 0,
    position: 'absolute',
    bottom: 0,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    overflow: 'hidden'
  },
});
