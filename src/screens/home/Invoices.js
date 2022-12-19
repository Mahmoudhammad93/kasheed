import {StyleSheet, Text, View, SafeAreaView, ScrollView, RefreshControl, TouchableOpacity, Image, TextInput, Dimensions} from 'react-native';
import React, { useEffect, useState, useCallback } from 'react';
import {COLORS} from '../../constants';
import KasheedIcon from '../../assets/icons/kasheed-icon.png';
import CreditCard from '../../assets/icons/credit-card.png';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from "@react-native-async-storage/async-storage";

import InvoiceList from '../../components/InvoiceList';

import InvoicesData from '../../data.json';

import Loading from '../../components/Loading';

import axios from 'axios';
const FULL_WIDTH = Dimensions.get('window').width;
const FULL_HEIGHT = Dimensions.get('window').height;

const Invoices = ({navigation}) => {
  const [loading, setLoading] = useState(true);
  const [invoices, setInvoices] = useState([]);
  const [searchValue, setSearchValue] = useState({value: ''});
  const [refreshing, setRefreshing] = useState(false);



  const search = async () => {
      if(searchValue.value != ''){
        var value = searchValue.value.toUpperCase();
        const DATA_INVOICES = JSON.parse(await AsyncStorage.getItem('invoices'));
        const searchData = DATA_INVOICES.filter(row => {
          if(row.invoice_number.toString().toUpperCase().indexOf(value) !== -1){
            return row;
          }
        })
        setInvoices(searchData)
      }

  }

  const getInvoices = async () => {
    const ALL_INVOICES = JSON.parse(await AsyncStorage.getItem('invoices'))
    if(ALL_INVOICES && ALL_INVOICES.length > 0){
      setInvoices(ALL_INVOICES)
    }else{
      setInvoices([])
    }
    setLoading(false)
    // console.log('test')
    // axios.get('http://192.168.1.7:8000/api/purchases',{
    //   headers: {
    //     'Access-Control-Allow-Origin': '*, http://192.168.1.7:8000',
    //     'Access-Control-Allow-Headers': '*, Origin, X-Requested-With, Content-Type, Accept',
    //   },
    // })
    // .then(res => {
    //   console.log('test in')
    //   console.log(res)
    // })
  }

  const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  }

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getInvoices()
    wait(20).then(() => setRefreshing(false));
  }, []);

  useEffect(() => {
    getInvoices();
  }, [])
  return (
    <View style={styles.invoices} >
          <ScrollView
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
              />
            }
          >
            {
              (loading)?<Loading />:
              <View style={styles.invoicesWrapper}>
                <View style={styles.kasheedHeaer}>
                  <View style={styles.search}>
                    <View style={styles.searchInput}>
                      <TextInput placeholderTextColor={COLORS.gray} style={styles.input} onChangeText={(text) => {setSearchValue({...searchValue, value: text})}} placeholder='Search Products ...'/>
                      <TouchableOpacity style={styles.searchIcon} onPress={() => search()}>
                        <EvilIcons name='search' size={25} color={COLORS.black} />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
                {
                  (invoices.length > 0)?
                  invoices.map(row => {
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
                  }):<View style={{width: "100%"}}>
                  <Text key={1} style={{borderWidth: 1, borderColor: COLORS.grayLight ,width: FULL_WIDTH-40 ,color: COLORS.gray,padding: 20, textAlign: 'center'}}>Products Not Found</Text>
                </View>
                }
              </View>
            }
          </ScrollView>
        </View>
  );
};

export default Invoices;

const styles = StyleSheet.create({
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
    marginHorizontal: 20,
  },
  kasheedHeaer:{
    width: "100%",
    display: 'flex',
    justifyContent: 'center',
    alignContent: 'center'
  },
  search:{
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    marginBottom: 20
  },
  searchInput:{
    width: "100%",
    marginRight: 10
  },
  input:{
    backgroundColor: COLORS.white,
    borderRadius: 5,
    paddingLeft: 60,
    color: COLORS.gray
  },
  searchIcon:{
    position: 'absolute',
    top: 5,
    left: 5,
    backgroundColor: COLORS.main_bg,
    padding: 10,
    borderRadius: 5
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
});
