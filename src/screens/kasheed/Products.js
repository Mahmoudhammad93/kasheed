import React, { useCallback, useEffect, useState } from 'react';
import {StyleSheet, Text, SafeAreaView, View, ScrollView, RefreshControl, TouchableOpacity, TextInput, Dimensions, Button} from 'react-native';
import { COLORS } from '../../constants';
import ProductComponent from '../../components/ProductDetails';
import Data from '../../data.json';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';
import Loading from '../../components/Loading';
import SwipeUpDownModal from 'react-native-swipe-modal-up-down';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PopupAlert from '../../components/PopupAlert';

const FULL_WIDTH = Dimensions.get('window').width;
const FULL_HEIGHT = Dimensions.get('window').height;

const Products = ({navigation}) => {
  const [itemsTotal, setItemsTotal] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  let [ShowComment, setShowModelComment] = useState(false);
  let [animateModal, setanimateModal] = useState(false);
  const [productData, setProductData] = useState({name: '', desc: '', price: '', offer_price: '', status: 2, offer_status: 1});
  const [isModalVisible, setModalVisible] = useState(false);
  const [statusChecked, setStatusChecked] = useState(1);
  const [offerStatusChecked, setOfferStatusChecked] = useState(1);
  const [searchValue, setSearchValue] = useState({value: ''});

  const getProducts = async () => {
    const PRODUCTS = JSON.parse(await AsyncStorage.getItem('products'))
    if(PRODUCTS && PRODUCTS.length > 0){
      setProducts(PRODUCTS)
    }else{
      setProducts([])
    }
  }
  const openModalPopup = () => {
    setModalVisible(true);
  };

  const closeModal = (value) => {
    setModalVisible(value)
    setShowModelComment(false)
  }

  const options = {
    title: 'Select Image',
    type: 'library',
    options:{
      maxHeight: 200,
      maxWidth: 200,
      selectionLimit: 1,
      mediaType: 'photo',
      includeBase64: false,
    }
  }
  const openGallery = async () => {
    const image = await launchImageLibrary(options)
    console.log(image)
  }

  const openModal = () => {
    setShowModelComment(true)
  }

  const updateTotal = (value) => {
    setItemsTotal(value)
  }

  const saveProduct = async () => {
    const PRODUCTS = JSON.parse(await AsyncStorage.getItem('products'));
    if(PRODUCTS == null){
      await AsyncStorage.setItem('products', JSON.stringify([]))
    }
    console.log(PRODUCTS)
    const NEW_PRODUCT = {
      id: PRODUCTS.length+1,
      name: productData.name,
      price: productData.price,
      offer_price: productData.offer_price,
      code: Math.floor(100000 + Math.random() * 900000),
      desc: productData.desc,
      status: productData.status,
      offer_status: productData.offer_status
    }


    if(PRODUCTS.length <= 0){
      await AsyncStorage.setItem('products', JSON.stringify([NEW_PRODUCT]))
    }else{
      await AsyncStorage.setItem('products', JSON.stringify([...PRODUCTS, NEW_PRODUCT]))
    }
    openModalPopup()
    onRefresh()
  }

  const selectRadioBtn = (value, type) => {
    if(type == 'status'){
      setProductData({...productData, status: value})
      setStatusChecked(value)
    }else{
      setProductData({...productData, offer_status: value})
      setOfferStatusChecked(value)
    }
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

  const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  }

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getProducts()
    wait(20).then(() => setRefreshing(false));
  }, []);

  useEffect(()=> {
    getProducts();
    wait(50).then(() => setLoading(false));
  }, []);

  return (
    <SafeAreaView>
      {
        (loading)
        ?
          <Loading />
        :
          <View style={{height: "100%"}}>
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
            <ScrollView
            style={styles.productsContainer}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                />
              }
            >
              <View style={styles.products}>
                {
                  (products.length > 0)?
                  products.map((row, index) => {
                    return(
                      <ProductComponent key={index+1} product={row} updateTotal={updateTotal} navigation={navigation}/>
                    )
                  }):<View style={{width: "100%"}}>
                    <Text key={1} style={{borderWidth: 1, borderColor: COLORS.grayLight ,width: FULL_WIDTH-20 ,color: COLORS.gray,padding: 20, textAlign: 'center'}}>Products Not Found</Text>
                  </View>
                }
              </View>
            </ScrollView>
            <SwipeUpDownModal
              modalVisible={ShowComment}
              PressToanimate={animateModal}
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
                <View style={styles.containerContent}>
                  <View style={styles.row}>
                        <View style={styles.col_6}>
                          <TouchableOpacity style={styles.selectImageBtn} onPress={() => openGallery()}>
                            <Entypo name='image' size={30} color={COLORS.grayLight} />
                            <Text style={{color: COLORS.grayLight}}>Select Image</Text>
                          </TouchableOpacity>
                        </View>
                        <View style={styles.col_12}>
                            <TextInput placeholder="Name" style={styles.formInput} placeholderTextColor={COLORS.gray}
                              onChangeText={(text) => {setProductData({...productData, name: text})}}
                            />
                        </View>
                        <View style={styles.col_12}>
                            <TextInput placeholder="Description" style={styles.formInput} placeholderTextColor={COLORS.gray}
                            onChangeText={(text) => {setProductData({...productData, desc: text})}}
                            />
                        </View>
                        <View style={[styles.col_6, styles.pr_10]}>
                            <TextInput placeholder="Price" keyboardType='numeric' style={styles.formInput} placeholderTextColor={COLORS.gray}
                            onChangeText={(text) => {setProductData({...productData, price: text})}}
                            />
                        </View>
                        <View style={styles.col_6}>
                            <TextInput placeholder="Offer Price" keyboardType='numeric' style={styles.formInput} placeholderTextColor={COLORS.gray}
                            onChangeText={(text) => {setProductData({...productData, offer_price: text})}}
                            />
                        </View>
                        <View style={[styles.col_6, {marginBottom: 20}]}>
                          <Text style={styles.label}>Offer Status</Text>
                          <View style={styles.radioBtns}>
                            <TouchableOpacity style={styles.radioBtn} onPress={()=> selectRadioBtn(1, 'offer_status')}>
                              <View style={styles.radioBtnCircle}>
                                {
                                  (offerStatusChecked == 1)?<Text style={styles.radioBtnCircleBefore}></Text>:''
                                }
                              </View>
                              <Text style={{color: COLORS.gray}}>Active</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.radioBtn} onPress={()=> selectRadioBtn(0, 'offer_status')}>
                              <View style={styles.radioBtnCircle}>
                                {
                                  (offerStatusChecked == 0)?<Text style={styles.radioBtnCircleBefore}></Text>:''
                                }
                              </View>
                              <Text style={{color: COLORS.gray}}>Inactive</Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                        <View style={[styles.col_12, {marginBottom: 20}]}>
                          <Text style={styles.label}>Produc Status</Text>
                          <View style={styles.radioBtns}>
                            <TouchableOpacity style={styles.radioBtn} onPress={()=> selectRadioBtn(2, 'status')}>
                              <View style={styles.radioBtnCircle}>
                                {
                                  (statusChecked == 2)?<Text style={styles.radioBtnCircleBefore}></Text>:''
                                }
                              </View>
                              <Text style={{color: COLORS.gray}}>In Stock</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.radioBtn} onPress={()=> selectRadioBtn(3, 'status')}>
                              <View style={styles.radioBtnCircle}>
                                {
                                  (statusChecked == 3)?<Text style={styles.radioBtnCircleBefore}></Text>:''
                                }
                              </View>
                              <Text style={{color: COLORS.gray}}>Out Of Stock</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.radioBtn} onPress={()=> selectRadioBtn(1, 'status')}>
                              <View style={styles.radioBtnCircle}>
                                {
                                  (statusChecked == 1)?<Text style={styles.radioBtnCircleBefore}></Text>:''
                                }
                              </View>
                              <Text style={{color: COLORS.gray}}>Active</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.radioBtn} onPress={()=> selectRadioBtn(0, 'status')}>
                              <View style={styles.radioBtnCircle}>
                                {
                                  (statusChecked == 0)?<Text style={styles.radioBtnCircleBefore}></Text>:''
                                }
                              </View>
                              <Text style={{color: COLORS.gray}}>Inactive</Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                        <View style={[styles.col_12]}>
                          <TouchableOpacity style={styles.saveBtn} onPress={()=> saveProduct()}>
                            <Text style={{color: COLORS.white}}>
                              Save
                            </Text>
                          </TouchableOpacity>
                        </View>
                    </View>
                </View>
              }
              HeaderStyle={styles.headerContent}
              ContentModalStyle={styles.Modal}
              onClose={() => {
                setShowModelComment(false);
                  setanimateModal(false);
              }}
            />
             <PopupAlert modelText={'Product Added Susseful'} closeModal={closeModal} isModalVisible={isModalVisible}/>
            <View style={styles.addBrn}>
              <TouchableOpacity style={styles.btn} onPress={() => openModal()}>
                <AntDesign name='plus' size={30} color={COLORS.white} />
              </TouchableOpacity>
            </View>
          </View>
      }
    </SafeAreaView>
  );
};

export default Products;

const styles = StyleSheet.create({
  products:{
    margin: 10,
    width: "100%",
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  addBrn:{
    position: 'absolute',
    flex: 1,
    right: 40,
    bottom: 60,
    shadowColor: COLORS.black,
    shadowOpacity: .5,
    elevation: 8,
    backgroundColor: COLORS.main_color,
    padding: 15,
    borderRadius: 50
  },
  containerContent: {
    flex: 1, 
    marginTop: 40,
    padding: 20,
    height: 650
  },
  containerHeader: {
    flex: 1,
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 350,
    width: "100%",
    backgroundColor: COLORS.main_bg,
    zIndex: 10,
  },
  headerContent:{
    marginTop: 0,
    backgroundColor: COLORS.main_bg
  },
  Modal: {
    backgroundColor: COLORS.white,
    marginTop: 0,
    position: 'absolute',
    bottom: 0
  },
  selectImageBtn:{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderRadius: 1,
    borderColor: COLORS.gray,
    width: 150,
    height: 150
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
    marginBottom: 10,
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
pr_10:{
  paddingRight: 10
},
saveBtn:{
  backgroundColor: COLORS.main_color,
  padding: 15,
  borderRadius: 5,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
},
payDesc: {
  color: COLORS.main_color
},
radioBtns:{
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  flexDirection: 'row'
},
radioBtn:{
  display: 'flex',
  flexDirection: 'row'
},
radioBtnCircle:{
  borderWidth: 2,
  borderColor: COLORS.main_color,
  width: 20,
  height: 20,
  marginRight: 5,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
},
radioBtnCircleBefore:{
  width: 12,
  height: 12,
  backgroundColor: COLORS.main_color
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
});
