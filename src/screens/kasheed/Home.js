import {Image, StyleSheet, Text, TouchableOpacity, View, SafeAreaView, ScrollView, TextInput, RefreshControl, Dimensions, Animated} from 'react-native';
import React, { useCallback, useEffect, useState, useRef } from 'react';
import {COLORS, ROUTES} from '../../constants';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import ProductComponent from '../../components/Product';
import Data from '../../data.json';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as RNFS from 'react-native-fs';
import CustomHeader from '../../components/CustomHeader';
import { sort_by_id } from '../../constants/helper';
import NotFound from '../../components/NotFound';
import Loading from '../../components/Loading';

const FULL_WIDTH = Dimensions.get('window').width;
const FULL_HEIGHT = Dimensions.get('window').height;

const KasheedHome = ({navigation}) => {
  const [selectPosition, setSelectPosition] = useState(-FULL_WIDTH);
  const [searchValue, setSearchValue] = useState({value: ''});
  const [categoryChecked, setCategoryChecked] = useState(1);
  const [btnDisabled, setBtnDisabled] = useState(true);
  const [loadMoreBtn, setLoadMoreBtn] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [priceChecked, setPriceChecked] = useState(1);
  const [sizeChecked, setSizeChecked] = useState(1);
  const [itemsTotal, setItemsTotal] = useState(0);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [sideLeft, setSideLeft] = useState(-FULL_WIDTH)
  var moveLeft = useRef(new Animated.Value(0)).current;

  const getItems = async () => {
    var PRODUCTS = JSON.parse(await AsyncStorage.getItem('products'));
    var CATEGORIES = JSON.parse(await AsyncStorage.getItem('categories'));

    if(CATEGORIES != null && CATEGORIES.length > 0){
      setCategories(CATEGORIES)
    }else{
      setCategories([])
    }

    if(PRODUCTS != null && PRODUCTS.length > 0){
      if(PRODUCTS.length > 12){
        setProducts(PRODUCTS.slice(0, 12)).sort(sort_by_id())
      }else{
        setProducts(PRODUCTS)
      }
    }else{
      setProducts([])
      PRODUCTS = [];
    }
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
    if(products.length >= PRODUCTS.length || products.length == 0){
      setLoadMoreBtn(false)
    }else{
      if(PRODUCTS.length > 12){
        setLoadMoreBtn(true)
      }
    }
    setLoading(false)
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
    setLoading(true)
    const DATA_PRODUCTS = JSON.parse(await AsyncStorage.getItem('products'));
    if(searchValue.value != ''){
      var value = searchValue.value.toUpperCase();
      if(DATA_PRODUCTS != null){
        const searchData = DATA_PRODUCTS.filter(row => {
          if(row.name.toUpperCase().indexOf(value) !== -1){
            return row;
          }
        })
        setProducts(searchData)
        setLoading(false)
      }else{
        setProducts([])
        setLoading(false)
      }
    }else{
      setProducts(DATA_PRODUCTS)
    }
  }

  const loadMore = async () => {
    const DATA_PRODUCTS = JSON.parse(await AsyncStorage.getItem('products'));
    const MORE_DATA = DATA_PRODUCTS.slice(products.length, products.length+6);
    setProducts(products.concat(MORE_DATA))
    if(DATA_PRODUCTS.length == products.length+MORE_DATA.length){
      setLoadMoreBtn(false)
    }
  }

  const selectRadioBtn = (value, type) => {
    if(type == 'category'){
      setCategoryChecked(value)
    }else if(type == 'size'){
      setSizeChecked(value)
    }else{
      setPriceChecked(value)
    }
  }

  const openFilterMenu = () => {
    Animated.timing(moveLeft, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false
    }).start();
    setSideLeft(moveLeft)
  }

  const closeFilterMenu = () => {
    Animated.timing(moveLeft, {
      toValue: -FULL_WIDTH,
      duration: 200,
      useNativeDriver: false
    }).start();
    console.log(moveLeft)
  }

  const applyFilter = async () => {
    const PRODUCTS = JSON.parse(await AsyncStorage.getItem('products'))

    const FILTER_PRODUCTS = PRODUCTS.filter(row => {
      if(row.category_id == categoryChecked){
        return row;
      }
    })
    setProducts(FILTER_PRODUCTS)
    closeFilterMenu()
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
      (loading)?<Loading />:
      <SafeAreaView style={styles.kasheedContainer}>
      <View style={styles.searchHeaer}>
        {/* <CustomHeader title="Kasheed" navigation={navigation} color={COLORS.white} /> */}
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
        <TouchableOpacity style={styles.filterBtn} onPress={()=> openFilterMenu()}>
          <MaterialCommunityIcon name="filter-menu-outline" size={30} color={COLORS.white} style={{marginRight: 10}}/>
          <Text style={{color: COLORS.white}}>Filter</Text>
        </TouchableOpacity>
        <Animated.View style={[styles.filterItems, {left: sideLeft}]}>
          <TouchableOpacity style={styles.filterOverlay} onPress={()=> closeFilterMenu()}></TouchableOpacity>
          <View style={{width: FULL_WIDTH/1.5, backgroundColor: COLORS.white, height: FULL_HEIGHT, elevation: 5}}>
          <View style={styles.filterHeader}>
              <Text style={{color: COLORS.black, fontSize: 25, fontWeight: 'bold'}}>Filter</Text>
              <TouchableOpacity onPress={() => closeFilterMenu()}>
                <AntDesign name={'close'} size={20} color={COLORS.gray} />
              </TouchableOpacity>
            </View>
            <View style={{padding: 20, height: FULL_HEIGHT-50}}>
              <View style={styles.filterRow}>
                <Text style={styles.filterTitle}>Categories</Text>
                <View style={styles.radioBtns}>
                  {
                    categories.map(cate => {
                      if(cate.status !== 0){
                      return(
                      <TouchableOpacity style={styles.radioBtn} key={cate.id} onPress={()=> selectRadioBtn(cate.id, 'category')}>
                        <View style={styles.radioBtnCircle}>
                          {
                            (categoryChecked == cate.id)?<Text style={styles.radioBtnCircleBefore}></Text>:''
                          }
                        </View>
                        <Text style={{color: COLORS.gray}}>{cate.name}</Text>
                      </TouchableOpacity>
                      )}
                    })
                  }
                </View>
              </View>
              {/* <View style={styles.filterRow}>
                <Text style={styles.filterTitle}>Size</Text>
                <View style={styles.radioBtns}>
                  <TouchableOpacity style={styles.radioBtn} onPress={()=> selectRadioBtn(1, 'size')}>
                    <View style={styles.radioBtnCircle}>
                      {
                        (sizeChecked == 1)?<Text style={styles.radioBtnCircleBefore}></Text>:''
                      }
                    </View>
                    <Text style={{color: COLORS.gray}}>Test Category</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.radioBtn} onPress={()=> selectRadioBtn(2, 'size')}>
                    <View style={styles.radioBtnCircle}>
                      {
                        (sizeChecked == 2)?<Text style={styles.radioBtnCircleBefore}></Text>:''
                      }
                    </View>
                    <Text style={{color: COLORS.gray}}>Test Category</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.radioBtn} onPress={()=> selectRadioBtn(3, 'size')}>
                    <View style={styles.radioBtnCircle}>
                      {
                        (sizeChecked == 3)?<Text style={styles.radioBtnCircleBefore}></Text>:''
                      }
                    </View>
                    <Text style={{color: COLORS.gray}}>Test Category</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.radioBtn} onPress={()=> selectRadioBtn(4, 'size')}>
                    <View style={styles.radioBtnCircle}>
                      {
                        (sizeChecked == 4)?<Text style={styles.radioBtnCircleBefore}></Text>:''
                      }
                    </View>
                    <Text style={{color: COLORS.gray}}>Test Category</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.radioBtn} onPress={()=> selectRadioBtn(5, 'size')}>
                    <View style={styles.radioBtnCircle}>
                      {
                        (sizeChecked == 5)?<Text style={styles.radioBtnCircleBefore}></Text>:''
                      }
                    </View>
                    <Text style={{color: COLORS.gray}}>Test Category</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.radioBtn} onPress={()=> selectRadioBtn(6, 'size')}>
                    <View style={styles.radioBtnCircle}>
                      {
                        (sizeChecked == 6)?<Text style={styles.radioBtnCircleBefore}></Text>:''
                      }
                    </View>
                    <Text style={{color: COLORS.gray}}>Test Category</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.filterRow}>
                <Text style={styles.filterTitle}>Price</Text>
                <View style={styles.radioBtns}>
                  <TouchableOpacity style={styles.radioBtn} onPress={()=> selectRadioBtn(1, 'price')}>
                    <View style={styles.radioBtnCircle}>
                      {
                        (priceChecked == 1)?<Text style={styles.radioBtnCircleBefore}></Text>:''
                      }
                    </View>
                    <Text style={{color: COLORS.gray}}>Test Category</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.radioBtn} onPress={()=> selectRadioBtn(2, 'price')}>
                    <View style={styles.radioBtnCircle}>
                      {
                        (priceChecked == 2)?<Text style={styles.radioBtnCircleBefore}></Text>:''
                      }
                    </View>
                    <Text style={{color: COLORS.gray}}>Test Category</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.radioBtn} onPress={()=> selectRadioBtn(3, 'price')}>
                    <View style={styles.radioBtnCircle}>
                      {
                        (priceChecked == 3)?<Text style={styles.radioBtnCircleBefore}></Text>:''
                      }
                    </View>
                    <Text style={{color: COLORS.gray}}>Test Category</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.radioBtn} onPress={()=> selectRadioBtn(4, 'price')}>
                    <View style={styles.radioBtnCircle}>
                      {
                        (priceChecked == 4)?<Text style={styles.radioBtnCircleBefore}></Text>:''
                      }
                    </View>
                    <Text style={{color: COLORS.gray}}>Test Category</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.radioBtn} onPress={()=> selectRadioBtn(5, 'price')}>
                    <View style={styles.radioBtnCircle}>
                      {
                        (priceChecked == 5)?<Text style={styles.radioBtnCircleBefore}></Text>:''
                      }
                    </View>
                    <Text style={{color: COLORS.gray}}>Test Category</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.radioBtn} onPress={()=> selectRadioBtn(6, 'price')}>
                    <View style={styles.radioBtnCircle}>
                      {
                        (priceChecked == 6)?<Text style={styles.radioBtnCircleBefore}></Text>:''
                      }
                    </View>
                    <Text style={{color: COLORS.gray}}>Test Category</Text>
                  </TouchableOpacity>
                </View>
              </View> */}
              <View style={styles.filterBtnRow}>
                <TouchableOpacity style={styles.filterSetBtn} onPress={() => applyFilter()}>
                  <Text style={{color: COLORS.main_color, fontWeight: 'bold', textAlign: 'center'}}>Apply</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>  
        </Animated.View>
      </View>
      
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
      >
        {
          (products.length <= 0)?<View style={{height: 200}}><NotFound module={'Products'}/></View>:
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
        }
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
  searchHeaer:{
    width: "100%",
    backgroundColor: COLORS.main_color,
    display: 'flex',
    justifyContent: 'center',
    alignContent: 'center',
    zIndex: 10000
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
    padding: 5,
    borderRadius: 10,
    backgroundColor: COLORS.second_bg
  },
  loadMoreText: {
    color: COLORS.grayLight,
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
  },

  filterItems: {
    // backgroundColor: COLORS.black+"56",
    position: 'absolute',
    top: -56,
    width: FULL_WIDTH,
    height: FULL_HEIGHT,
    shadowColor: COLORS.gray,
    zIndex: 1000,
    flex: 1,
  },
  filterHeader:{
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    paddingHorizontal: 20,
    backgroundColor: COLORS.main_bg
  },
  filterOverlay:{
    // backgroundColor: 'red',
    position: 'absolute',
    top: 0,
    left: 0,
    width: "100%",
    height: "100%"
},
  filterRow: {
    marginBottom: 30
  },
  filterTitle: {
    color: COLORS.black,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    borderBottomColor: COLORS.main_bg,
    borderBottomWidth: 1,
    paddingBottom: 5
  },
  filterBtnRow: {
    position: 'absolute', 
    bottom: 0, 
    width: FULL_WIDTH/1.5, 
    left: 0, 
    backgroundColor: COLORS.main_bg, 
    padding: 10
},
  radioBtns:{
    display: 'flex',
    // alignItems: 'center',
    // justifyContent: 'space-between',
    // flexDirection: 'row'
  },
  radioBtn:{
    display: 'flex',
    flexDirection: 'row',
    marginBottom: 5
  },
  radioBtnCircle:{
    borderWidth: 2,
    borderColor: COLORS.main_color,
    width: 15,
    height: 15,
    marginRight: 5,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  radioBtnCircleBefore:{
    width: 8,
    height: 8,
    backgroundColor: COLORS.main_color
  },
  filterSetBtn:{
    // backgroundColor: COLORS.main_color,
    padding: 15,
    borderRadius: 5,
    borderColor: COLORS.main_color,
    borderWidth: 1,
  }
});