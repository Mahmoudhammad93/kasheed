import React, { useState, useEffect, useCallback } from 'react';
import {StyleSheet, Text, SafeAreaView, View, Image, Dimensions, TouchableOpacity, TextInput, RefreshControl, ScrollView} from 'react-native';
import { COLORS } from '../../constants';
import ProductImage from '../../assets/icons/shopping-cart.png';
import FontAwesome from "react-native-vector-icons/FontAwesome";
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import SwipeUpDownModal from 'react-native-swipe-modal-up-down';
import PopupAlert from '../../components/PopupAlert';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import { sort_by_id } from '../../constants/helper';

const FULL_WIDTH = Dimensions.get('window').width;
const FULL_HEIGHT = Dimensions.get('window').height;

const ProductDetails = (props) => {
  let [ShowComment, setShowModelComment] = useState(false);
  let [animateModal, setanimateModal] = useState(false);
  const [productData, setProductData] = useState({id: '',name: '', desc: '', price: '', offer_price: '', status: 2, offer_status: 1});
  const [isModalVisible, setModalVisible] = useState(false);
  const [statusChecked, setStatusChecked] = useState(1);
  const [offerStatusChecked, setOfferStatusChecked] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const [categoryName, setCategoryName] = useState('');
  const [showCategories, setShowCategories] = useState(false);
  const [categories, setCategories] = useState([]);
  const [productImage, setProductImage] = useState("https://assets.gelecegenefes.com/images/no-image.jpeg");

  const product = props.route.params.product;

  const getProduct = async () => {
    const CATEGORIES = JSON.parse(await AsyncStorage.getItem('categories'))

    const cate = CATEGORIES.filter(row => {
      if(row.id == product.category_id){
        return row
      }
    })
    
    if(CATEGORIES && CATEGORIES.length > 0){
      setCategories(CATEGORIES.sort(sort_by_id()))
    }else{
      setCategories([])
    }

    console.log(cate)
    if(cate.length > 0){
      setCategoryName(cate[0].name)
    }else{
      setCategoryName('')
    }
    setProductData(product)
    console.log(product)
  }

  const selectCategory = async (id) => {
    const CATEGORIES = JSON.parse(await AsyncStorage.getItem('categories'))

    const cate = CATEGORIES.filter(row => {
      if(row.id == id){
        return row
      }
    })
    setProductData({...productData, category_id:id})
    setCategoryName(cate[0].name)
    setShowCategories(false)
  }

  const editProduct = () => {
    if(product.image){
      setProductImage(product.image)
    }
    setProductData(product)
    setShowModelComment(true)
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

  const updateProduct = async () => {
    const PRODUCTS = JSON.parse(await AsyncStorage.getItem('products'));

    var NEW_ARR = PRODUCTS.filter(row => {
      if(row.id != productData.id){
        return row
      }
    })

    console.log(productData)

    await AsyncStorage.setItem('products', JSON.stringify([...NEW_ARR, productData]));

    openModalPopup()
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

  const openModalPopup = () => {
    setModalVisible(true);
  };

  const closeModal = (value) => {
    setModalVisible(value)
    setShowModelComment(false)
  }

  const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  }

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getProduct()
    wait(20).then(() => setRefreshing(false));
  }, []);

  useEffect(() => {
    getProduct()
  }, [])
  return (
    <SafeAreaView>
      <View style={styles.ProductDetailsWrapper}>
        <View style={styles.productBox}>
          <View style={styles.productImage}>
            {
              (productData.offer_status == 1)?
              <Text style={styles.priceBadge}>EGP {productData.offer_price}</Text>:''
            }
            <Image source={(productData.image)?{uri: productData.image}:ProductImage} style={styles.image}/>
          </View>
          <View style={styles.productDetails}>
            <View style={styles.nameAndPrice}>
              <Text style={styles.productName}>{productData.name}</Text>
              <View>
                {
                  (productData.offer_status == 1)?
                  <Text style={styles.productPrice}>EGP {parseFloat(productData.offer_price).toFixed(2)}</Text>:""
                }
              <Text style={[styles.productPrice, (productData.offer_status == 1)?{color: COLORS.grayLight, textDecorationLine: 'line-through', fontSize: 12}:'']}>EGP {parseFloat(productData.price).toFixed(2)}</Text>
              </View>
            </View>
            <Text style={styles.productDesc}>{productData.desc}</Text>
            <View style={styles.moreDetails}>
              <Text style={styles.detailsLabel}>
                Available Quantity
              </Text>
              <Text style={styles.detailsValue}>
                30 Product
              </Text>
              <Text style={styles.detailsLabel}>
                Barcode
              </Text>
              <Text style={styles.detailsValue}>
                {productData.code}
              </Text>
              <Text style={styles.detailsLabel}>
                Category
              </Text>
              <Text style={styles.detailsValue}>
                {categoryName} - {productData.category_id}
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.options}>
          <TouchableOpacity style={[styles.optionBtn, {backgroundColor: COLORS.active_color}]} onPress={()=> editProduct()}>
            <FontAwesome name='edit' size={25} color={COLORS.white} style={{marginRight: 15}}/>
            <Text style={{color: COLORS.white}}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.optionBtn, {backgroundColor: COLORS.danger}]}>
            <FontAwesome name='trash' size={25} color={COLORS.white} style={{marginRight: 15}}/>
            <Text style={{color: COLORS.white}}>Delete</Text>
          </TouchableOpacity>
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
                          <View style={styles.formImage}>
                              <Image style={{width: '100%', height: '100%', resizeMode: 'cover'}} source={{uri:productImage}} />
                            </View>
                            <Text style={{color: COLORS.grayLight}}>Select Image</Text>
                          </TouchableOpacity>
                        </View>
                        <View style={styles.col_12}>
                            <TextInput placeholder="Name" style={styles.formInput} placeholderTextColor={COLORS.gray}
                              onChangeText={(text) => {setProductData({...productData, name: text})}}
                              value={(productData.name)?productData.name:''}
                            />
                        </View>
                        <View style={styles.col_12}>
                            <TextInput placeholder="Description" style={styles.formInput} placeholderTextColor={COLORS.gray}
                            onChangeText={(text) => {setProductData({...productData, desc: text})}}
                            value={(productData.desc)?productData.desc:''}
                            />
                        </View>
                        <View style={[styles.col_6, styles.pr_10]}>
                            <TextInput placeholder="Price" keyboardType='numeric' style={styles.formInput} placeholderTextColor={COLORS.gray}
                            onChangeText={(text) => {setProductData({...productData, price: text})}}
                            value={(productData.price)?productData.price:''}
                            />
                        </View>
                        <View style={styles.col_6}>
                          <TextInput placeholder="Category" style={styles.formInput} placeholderTextColor={COLORS.gray}
                            onChangeText={(text) => {setProductData({...productData, category_id: text})}}
                            onFocus={()=> setShowCategories(true)}
                            value={categoryName}
                            />
                            {
                              (showCategories)?<View style={styles.cateResult}>
                              <ScrollView>
                              {
                                categories.map(cate => {
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
                            value={(productData.offer_price)?productData.offer_price:''}
                            />
                        </View>
                        <View style={[styles.col_6, {marginBottom: 20}]}>
                          <Text style={styles.label}>Offer Status</Text>
                          <View style={styles.radioBtns}>
                            <TouchableOpacity style={styles.radioBtn} onPress={()=> selectRadioBtn(1, 'offer_status')}>
                              <View style={styles.radioBtnCircle}>
                                {
                                  (productData.offer_status == 1)?<Text style={styles.radioBtnCircleBefore}></Text>:''
                                }
                              </View>
                              <Text style={{color: COLORS.gray}}>Active</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.radioBtn} onPress={()=> selectRadioBtn(0, 'offer_status')}>
                              <View style={styles.radioBtnCircle}>
                                {
                                  (productData.offer_status == 0)?<Text style={styles.radioBtnCircleBefore}></Text>:''
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
                                  (productData.status == 2)?<Text style={styles.radioBtnCircleBefore}></Text>:''
                                }
                              </View>
                              <Text style={{color: COLORS.gray}}>In Stock</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.radioBtn} onPress={()=> selectRadioBtn(3, 'status')}>
                              <View style={styles.radioBtnCircle}>
                                {
                                  (productData.status == 3)?<Text style={styles.radioBtnCircleBefore}></Text>:''
                                }
                              </View>
                              <Text style={{color: COLORS.gray}}>Out Of Stock</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.radioBtn} onPress={()=> selectRadioBtn(1, 'status')}>
                              <View style={styles.radioBtnCircle}>
                                {
                                  (productData.status == 1)?<Text style={styles.radioBtnCircleBefore}></Text>:''
                                }
                              </View>
                              <Text style={{color: COLORS.gray}}>Active</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.radioBtn} onPress={()=> selectRadioBtn(0, 'status')}>
                              <View style={styles.radioBtnCircle}>
                                {
                                  (productData.status == 0)?<Text style={styles.radioBtnCircleBefore}></Text>:''
                                }
                              </View>
                              <Text style={{color: COLORS.gray}}>Inactive</Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                        <View style={[styles.col_12]}>
                          <TouchableOpacity style={styles.saveBtn} onPress={()=> updateProduct()}>
                            <Text style={{color: COLORS.white}}>
                              Update
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
             <PopupAlert modelText={'Product Updated Successful'} closeModal={closeModal} isModalVisible={isModalVisible}/>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ProductDetails;

const styles = StyleSheet.create({
  ProductDetailsWrapper:{
    padding: 20,
    height: FULL_HEIGHT
  },
  productBox:{
    backgroundColor: COLORS.white,
    height: FULL_HEIGHT/1.38,
    borderRadius: 5,
    overflow: 'hidden',
    position: 'relative',
    shadowColor: COLORS.gray,
    shadowOpacity: 1,
    elevation: 4,
  },
  priceBadge:{
    backgroundColor: COLORS.main_color,
    position: 'absolute',
    top: 50,
    left: 0,
    fontWeight: 'bold',
    fontSize: 20,
    padding: 10,
    color: COLORS.white,
    zIndex: 99999
  },
  productImage:{
    width: "100%",
    height: "60%",
    padding: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.grayLight,
  },
  image:{
    width: "100%",
    height: "100%",
    resizeMode: 'cover',
    
  },
  productDetails:{
    padding: 20
  },
  nameAndPrice:{
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10
  },
  productName:{
    color: COLORS.black,
    fontWeight: 'bold',
    fontSize: 25
  },
  productDesc:{
    color: COLORS.main_color,
    marginBottom: 10
  },
  detailsLabel:{
    color: COLORS.main_color,
    fontWeight: 'bold',
    marginBottom: 10
  },
  detailsValue:{
    color: COLORS.gray,
    fontWeight: 'bold',
    marginBottom: 10
  },
  productPrice:{
    color: COLORS.main_color
  },
  options: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: 20
  },
  optionBtn: {
    width: "49%",
    marginRight: "2%",
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 5,
    shadowColor: COLORS.gray,
    elevation: 4
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
cateResult:{
  position: 'absolute',
  backgroundColor: COLORS.white,
  top: 52,
  width: "100%",
  zIndex: 9999,
  shadowColor: COLORS.gray,
  elevation: 5,
  height: 200,
  borderRadius: 5
},
resultOption:{
  padding: 10
}
});
