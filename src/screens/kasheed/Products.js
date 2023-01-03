import React, { useCallback, useEffect, useState } from 'react';
import {StyleSheet, Image, Text, SafeAreaView, View, ScrollView, RefreshControl, TouchableOpacity, TextInput, Dimensions, Button} from 'react-native';
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
import { sort_by_id } from '../../constants/helper';
import NoResult from '../../components/NoResult';
import Search from '../../components/Search';

const FULL_WIDTH = Dimensions.get('window').width;
const FULL_HEIGHT = Dimensions.get('window').height;

const Products = ({navigation}) => {
  const [itemsTotal, setItemsTotal] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [products, setProducts] = useState([]);
  const [ifNoProducts, setIfNoProducts] = useState(true);
  const [loading, setLoading] = useState(true);
  let [ShowComment, setShowModelComment] = useState(false);
  let [animateModal, setanimateModal] = useState(false);
  const [productData, setProductData] = useState({name: '', image: '', desc: '', price: '', offer_price: '', status: 2, offer_status: 1, category_id: ''});
  const [isModalVisible, setModalVisible] = useState(false);
  const [statusChecked, setStatusChecked] = useState(1);
  const [offerStatusChecked, setOfferStatusChecked] = useState(1);
  const [searchValue, setSearchValue] = useState('');
  const [categories, setCategories] = useState([]);
  const [showCategories, setShowCategories] = useState(false);
  const [categoryName, setCategoryName] = useState('');
  const [productImage, setProductImage] = useState("https://assets.gelecegenefes.com/images/no-image.jpeg");

  const getProducts = async () => {
    const PRODUCTS = JSON.parse(await AsyncStorage.getItem('products'))
    if(PRODUCTS && PRODUCTS.length > 0){
      setProducts(PRODUCTS.sort(sort_by_id()))
      setIfNoProducts(false)
    }else{
      setProducts([])
      setIfNoProducts(true)
    }

    const CATEGORIES = JSON.parse(await AsyncStorage.getItem('categories'))
        if(CATEGORIES && CATEGORIES.length > 0){
          setCategories(CATEGORIES.sort(sort_by_id()))
        }else{
          setCategories([])
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
    setProductImage(image.assets[0].uri)
    setProductData({...productData, image: image.assets[0].uri})
  }

  const openModalFromNoResult = () => {
    openModal()
  }

  const openModal = () => {
    setShowModelComment(true)
  }

  const updateTotal = (value) => {
    setItemsTotal(value)
  }

  const saveProduct = async () => {
    const PRODUCTS = JSON.parse(await AsyncStorage.getItem('products'));
    console.log(PRODUCTS)
    const NEW_PRODUCT = {
      id: (PRODUCTS !== null)?PRODUCTS.length+1:1,
      name: productData.name,
      image: productData.image,
      price: productData.price,
      offer_price: productData.offer_price,
      code: Math.floor(100000 + Math.random() * 900000),
      desc: productData.desc,
      status: productData.status,
      offer_status: productData.offer_status,
      category_id: productData.category_id
    }

console.log(NEW_PRODUCT)
    if(PRODUCTS.length <= 0){
      await AsyncStorage.setItem('products', JSON.stringify([NEW_PRODUCT]))
    }else{
      await AsyncStorage.setItem('products', JSON.stringify([...PRODUCTS, NEW_PRODUCT]))
    }
    openModalPopup()
    setProductImage('https://assets.gelecegenefes.com/images/no-image.jpeg')
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

  const getSearchText = (value) => {
    setSearchValue(value)
  }

  const search = async () => {
    // setLoading(true)
    const DATA_PRODUCTS = JSON.parse(await AsyncStorage.getItem('products'));
    if(searchValue !== ''){
      var value = searchValue.toUpperCase();
      if(DATA_PRODUCTS != null){
        const searchData = DATA_PRODUCTS.filter(row => {
          if(row.name.toUpperCase().indexOf(value) !== -1){
            return row;
          }
        })
        setProducts(searchData)
        // setLoading(false)
      }else{
        setProducts([])
        // setLoading(false)
      }
    }

  }

  const selectCategory = async (id) => {
    const CATEGORIES = JSON.parse(await AsyncStorage.getItem('categories'))

    const cate = CATEGORIES.filter(row => {
      if(row.id == id){
        return row
      }
    })
    console.log(cate)
    setProductData({...productData, category_id:id})
    setCategoryName(cate[0].name)
    setShowCategories(false)
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
            <View style={[styles.searchHeaer, (ifNoProducts)?{height: 200}:""]}>
              {
                (!ifNoProducts)?
                <Search search={search} module={'Products'} getSearchText={getSearchText}/>
                :""
              }
            </View>
            {
              (ifNoProducts)?<View style={{width: "100%", height: 200}}>
              <NoResult module={'Products'} openModalFromNoResult={openModalFromNoResult}/>
          </View>:''
            }
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
                      <ProductComponent key={row.id} product={row} updateTotal={updateTotal} navigation={navigation}/>
                    )
                  }):""
                }
              </View>
            </ScrollView>
            <SwipeUpDownModal
              modalVisible={ShowComment}
              PressToanimate={animateModal}
              // HeaderContent={
              //   <View style={styles.containerHeader}>
              //         <Text style={{color: COLORS.gray, fontWeight: 'bold', fontSize: 20}}>Add Product</Text>
              //   </View>
              // }
              //if you don't pass HeaderContent you should pass marginTop in view of ContentModel to Make modal swipeable
              ContentModal={
                <View style={styles.containerContent}>
                  <View style={styles.row}>
                        <View style={styles.col_6}>
                          <TouchableOpacity style={styles.selectImageBtn} onPress={() => openGallery()}>
                            <View style={styles.formImage}>
                              <Image style={{width: '100%', height: '100%', resizeMode: 'cover'}} source={{uri:productImage}} />
                            </View>
                            <Text style={{color: COLORS.gray, fontWeight: 'bold', position: 'relative', top: 50}}>Select Image</Text>
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
                          <TextInput placeholder="Category" style={styles.formInput} placeholderTextColor={COLORS.gray}
                            onChangeText={(text) => {setProductData({...productData, category_id: text})}}
                            onFocus={()=> setShowCategories(true)}
                            // onBlur={()=> setShowCategories(false)}
                            value={categoryName}
                            />
                            {
                              (showCategories)?<View style={styles.cateResult}>
                              <ScrollView>
                              {
                                categories.map(cate => {
                                  if(cate.status !== 0)
                                    return(
                                      <TouchableOpacity key={cate.id} style={styles.resultOption} onPress={()=> selectCategory(cate.id)}>
                                        <Text style={{color: COLORS.gray}}>{cate.name}</Text>
                                      </TouchableOpacity>
                                    )
                                })
                              }
                              </ScrollView>
                            </View>:''
                            }
                        </View>
                        <View style={styles.col_12}>
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
             {
              (!ifNoProducts)?
              <View style={styles.addBrn}>
                <TouchableOpacity style={styles.btn} onPress={() => openModal()}>
                  <AntDesign name='plus' size={30} color={COLORS.white} />
                </TouchableOpacity>
              </View>:""
             }
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
    top: FULL_HEIGHT-700,
    width: "100%",
    backgroundColor: COLORS.main_bg,
    zIndex: 10,
    padding: 10
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
formImage:{
  position: 'absolute',
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  zIndex: 99999
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
searchHeaer:{
  width: "100%",
  backgroundColor: COLORS.main_color,
  display: 'flex',
  justifyContent: 'center',
  alignContent: 'center',
  // overflow: 'hidden'
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
cateResult:{
  position: 'absolute',
  backgroundColor: COLORS.white,
  top: 52,
  width: "100%",
  zIndex: 9999,
  shadowColor: COLORS.gray,
  elevation: 5,
  height: 200,
  borderRadius: 5,
  overflow: 'hidden'
},
resultOption:{
  padding: 10,
  marginBottom: 1
}
});
