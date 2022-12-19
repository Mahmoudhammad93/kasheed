import {Image, StyleSheet, Text, TouchableOpacity, View, SafeAreaView, ScrollView, TextInput, RefreshControl, Dimensions} from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import {COLORS, ROUTES} from '../../constants';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import ProductComponent from '../../components/Product';
import Data from '../../data.json';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as RNFS from 'react-native-fs';

const FULL_WIDTH = Dimensions.get('window').width;
const FULL_HEIGHT = Dimensions.get('window').height;

const KasheedHome = ({navigation}) => {
  const [itemsTotal, setItemsTotal] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [btnDisabled, setBtnDisabled] = useState(true);
  const [products, setProducts] = useState([]);
  const [searchValue, setSearchValue] = useState({value: ''});
  const [loadMoreBtn, setLoadMoreBtn] = useState(true);

  const getItems = async () => {
    const PRODUCTS = JSON.parse(await AsyncStorage.getItem('products'))
    setProducts(PRODUCTS.slice(0, 12))
    const total = await AsyncStorage.getItem('total');
    if (total) {
      if(JSON.parse(total) != "" && JSON.parse(total) != null){
        setItemsTotal(total);
        if(JSON.parse(total) > 0){
          setBtnDisabled(false)
        }
      }else{
        setItemsTotal(0)
      }
    }
    if(products.length >= PRODUCTS.length){
      setLoadMoreBtn(false)
    }else{
      setLoadMoreBtn(true)
    }
  }

  const updateTotal = (value) => {
    setItemsTotal(value)
  }

  const setBtnActive = (value) => {
    setBtnDisabled(value)
  }

  const clearItems = async () => {
    await AsyncStorage.setItem('total', JSON.stringify(0));
    await AsyncStorage.setItem('items', JSON.stringify([]));
    setItemsTotal(0);
    setBtnDisabled(true)
  }

  const search = async () => {
    if(searchValue.value != ''){
      var value = searchValue.value.toUpperCase();
      const DATA_PRODUCTS = JSON.parse(await AsyncStorage.getItem('products'));
      const searchData = DATA_PRODUCTS.filter(row => {
        if(row.name.toUpperCase().indexOf(value) !== -1){
          return row;
        }
      })
      setProducts(searchData)
    }

  }

  const loadMore = async () => {
    const DATA_PRODUCTS = JSON.parse(await AsyncStorage.getItem('products'));
    const MORE_DATA = DATA_PRODUCTS.slice(products.length, products.length+6);
    setProducts(products.concat(MORE_DATA))
    if(DATA_PRODUCTS.length == products.length+MORE_DATA.length){
      setLoadMoreBtn(false)
    }
    // if(products.length <= 0){
    //   setProducts(MORE_DATA)
    // }else{
    //   setProducts([...products, MORE_DATA])
    // }
    // const searchData = DATA_PRODUCTS.filter(row => {
    //   if(row.name.toUpperCase().indexOf(value) !== -1){
    //     return row;
    //   }
    // })
    // setProducts(searchData)
  }

  const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  }

  const onRefresh = useCallback(() => {
    getItems()
    setRefreshing(true);
    wait(20).then(() => setRefreshing(false), setLoadMoreBtn(true));
  }, []);

  useEffect(() => {
    onRefresh()
    getItems()
  }, []);
  return (
    <SafeAreaView style={styles.kasheedContainer}>
      <View style={styles.kasheedHeaer}>
        <View style={styles.search}>
          <View style={styles.searchInput}>
            <TextInput placeholderTextColor={COLORS.gray} style={styles.input} onChangeText={(text) => {setSearchValue({...searchValue, value: text})}} placeholder='Search Products ...'/>
            <TouchableOpacity style={styles.searchIcon} onPress={() => search()}>
              <EvilIcons name='search' size={25} color={COLORS.black} />
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.qrCodeBtn}>
            <MaterialCommunityIcon style={styles.qrCode} name='qrcode-scan' size={30} color={COLORS.black} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.filterBtn}>
          <MaterialCommunityIcon name="filter-menu-outline" size={30} color={COLORS.white} style={{marginRight: 10}}/>
          <Text style={{color: COLORS.white}}>Filter</Text>
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
        <View style={styles.products}>
          {
            products.map((row, index) => {
              return(
                <ProductComponent key={index+1} index={index+1} product={row} updateTotal={updateTotal} setBtnActive={setBtnActive}/>
              )
            })
          }
          <View style={styles.loadMore}>
            {
              (loadMoreBtn)?
                <TouchableOpacity style={styles.loadMoreBtn} onPress={()=> loadMore()}>
                  <Text style={styles.loadMoreText}>Load More</Text>
                </TouchableOpacity>:''
            }
          </View>
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <TouchableOpacity disabled={btnDisabled} style={[styles.clearBtn, (btnDisabled)?{backgroundColor: "#e37d87"}:'']} onPress={() => clearItems()}>
          <AntDesign name='closecircle' size={30} color={COLORS.white}/>
        </TouchableOpacity>
        <TouchableOpacity style={styles.totalBtn} onPress={() => navigation.navigate(ROUTES.CART)}>
          <Text style={{color: COLORS.main_bg, fontWeight: 'bold'}}>EGP {parseFloat(itemsTotal).toFixed(2)} Containue To Pay</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default KasheedHome;

const styles = StyleSheet.create({
  kasheedContainer:{
    height: FULL_HEIGHT,
  },
  kasheedHeaer:{
    width: "100%",
    backgroundColor: COLORS.main_color,
    display: 'flex',
    justifyContent: 'center',
    alignContent: 'center'
  },
  search:{
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    padding: 10
  },
  searchInput:{
    width: "82%",
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
  qrCodeBtn:{
    backgroundColor: COLORS.white,
    width: "15%",
    borderRadius: 5,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  qrCode:{},
  filterBtn:{
    width: "95%",
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    margin: 10,
    marginHorizontal: "2.5%",
    backgroundColor: '#2f5084',
    marginTop: 0,
    borderRadius: 5
  },
  products:{
    margin: 10,
    width: "100%",
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 150,
  },
  loadMore: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: "100%",
    marginTop: 20
  },
  loadMoreBtn: {
    // borderWidth: 1,
    // borderColor: COLORS.main_color,
    padding: 5,
    borderRadius: 10
  },
  loadMoreText: {
    color: COLORS.main_color
  },
  footer:{
    position: 'absolute',
    flex: 1,
    left: 0,
    right: 0,
    bottom: 56,
    width: "100%",
    backgroundColor: COLORS.white,
    display: 'flex',
    flexDirection: 'row',
    padding: 10,
    justifyContent: 'space-between',
    elevation: 3,
  },
  clearBtn:{
    backgroundColor: COLORS.danger,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '20%'
  },
  totalBtn:{
    backgroundColor: COLORS.main_color,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '75%'
  }
});