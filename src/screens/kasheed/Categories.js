import React, { useEffect, useState, useCallback } from "react";
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    Dimensions,
    StyleSheet,
    SafeAreaView,
    ScrollView,
    TextInput,
    RefreshControl
} from 'react-native';

import Entypo from 'react-native-vector-icons/Entypo';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import SwipeUpDownModal from 'react-native-swipe-modal-up-down';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import Loading from "../../components/Loading";
import LoadingMore from "../../components/LoadingMore";
import NoResult from "../../components/NoResult";
import { COLORS, ROUTES } from "../../constants";
import PopupAlert from "../../components/PopupAlert";
import { sort_by_id } from "../../constants/helper";

const FULL_WIDTH = Dimensions.get('window').width;
const FULL_HEIGHT = Dimensions.get('window').height;

import CATEIMG from '../../assets/icons/category-img.png';

const Categories = ({navigation, ...props}) => {
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [ifNoCategories, setIfNoCategories] = useState(true);
    const [categories, setCategories] = useState([]);
    let [ShowComment, setShowModelComment] = useState(false);
    let [animateModal, setanimateModal] = useState(false);
    const [isModalVisible, setModalVisible] = useState(false);
    const [statusChecked, setStatusChecked] = useState(1);
    const [offerStatusChecked, setOfferStatusChecked] = useState(1);
    const [searchValue, setSearchValue] = useState({value: ''});
    const [refreshing, setRefreshing] = useState(false);
    const [categoryData, setCategoryData] = useState({image: '', name: '', desc: '', price: '', offer_percent: '', status: 1, offer_status: 1});
    const [categoryImage, setCategoryImage] = useState("https://assets.gelecegenefes.com/images/no-image.jpeg");

    const getCategories = async () => {
        const CATEGORIES = JSON.parse(await AsyncStorage.getItem('categories'))
        if(CATEGORIES && CATEGORIES.length > 0){
          setCategories(CATEGORIES)
          setIfNoCategories(false)
        }else{
          setCategories([])
          setIfNoCategories(true)
        }

    }

    const closeModal = (value) => {
        setModalVisible(value)
        setShowModelComment(false)
    }

    const openModalFromNoResult = () => {
        openModal()
    }

    const openModal = () => {
        setShowModelComment(true)
    }

    const openModalPopup = () => {
        setModalVisible(true);
    };

    const selectRadioBtn = (value, type) => {
      if(type == 'status'){
        setCategoryData({...categoryData, status: value})
        setStatusChecked(value)
      }else{
        setCategoryData({...categoryData, offer_status: value})
        setOfferStatusChecked(value)
      }
    }

    const saveCategory = async () => {
        const CATEGORIES = JSON.parse(await AsyncStorage.getItem('categories'));
        const NEW_CATEGORY = {
          id: (CATEGORIES !== null)?CATEGORIES.length+1:1,
          name: categoryData.name,
          image: categoryData.image,
          price: categoryData.price,
          code: Math.floor(100000 + Math.random() * 900000),
          desc: categoryData.desc,
          status: categoryData.status,
          offer_status: categoryData.offer_status
        }


        if(CATEGORIES !== null && CATEGORIES.length > 0){
            await AsyncStorage.setItem('categories', JSON.stringify([...CATEGORIES, NEW_CATEGORY]))
        }else{
            await AsyncStorage.setItem('categories', JSON.stringify([NEW_CATEGORY]))
        }
        openModalPopup()
        onRefresh()
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
      setCategoryImage(image.assets[0].uri)
      setCategoryData({...categoryData, image: image.assets[0].uri})
    }

    const search = async () => {
        // setLoading(true)
        const DATA_CATEGORIES = JSON.parse(await AsyncStorage.getItem('categories'));
        if(searchValue.value != ''){
          var value = searchValue.value.toUpperCase();
          if(DATA_CATEGORIES != null){
            const searchData = DATA_CATEGORIES.filter(row => {
              if(row.name.toUpperCase().indexOf(value) !== -1){
                return row;
              }
            })
            setCategories(searchData)
            // setLoading(false)
          }else{
            setCategories([])
            // setLoading(false)
          }
        }else{
          setCategories(DATA_CATEGORIES)
        }
    
      }
    
    const wait = (timeout) => {
        return new Promise(resolve => setTimeout(resolve, timeout));
      }
    
      const onRefresh = useCallback(() => {
        setRefreshing(true);
        getCategories()
        wait(20).then(() => setRefreshing(false));
      }, []);
    
      useEffect(()=> {
        getCategories()
        wait(50).then(() => setLoading(false));
      }, []);

    return (
        <>
        {
            (loading)? <Loading />:
            <SafeAreaView>
                {
                    (loadingMore)?
                    <LoadingMore />:''
                }
                <View style={styles.categoriesWrapper}>
                    <View style={{height: "100%"}}>
                        <View style={[styles.searchHeaer, (ifNoCategories)?{height: 200}:""]}>
                        {
                            (!ifNoCategories)?
                            <View style={styles.search}>
                            <View style={styles.searchInput}>
                                <TextInput placeholderTextColor={COLORS.gray} style={styles.input} onChangeText={(text) => {setSearchValue({...searchValue, value: text})}} placeholder='Search Categories ...'/>
                                <TouchableOpacity style={styles.searchIcon} onPress={() => search()}>
                                <EvilIcons name='search' size={25} color={COLORS.black} />
                                </TouchableOpacity>
                            </View>
                            </View>:""
                        }
                        </View>
                        {
                        (ifNoCategories)?<View style={{width: "100%", height: 200}}>
                        <NoResult module={'Categories'} openModalFromNoResult={openModalFromNoResult}/>
                    </View>:''
                        }
                    <ScrollView
                        refreshControl={
                            <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            />
                        }

                    >
                        <View style={styles.categories}>
                        {
                            categories.map(row => {
                              if(row.status !== 0){
                                return(
                                      <TouchableOpacity key={row.id} style={styles.category} onPress={()=>navigation.navigate(ROUTES.CATEGORY_DETAILS, {category: row})}>
                                        <View style={styles.categoryImage}>
                                            <Image source={(row.image)?{uri: row.image}:CATEIMG} style={styles.img} />
                                        </View>
                                        <Text style={{textAlign: 'center', height: "40%",color: COLORS.gray}}>{row.name}</Text>
                                    </TouchableOpacity>
                                )
                              }
                            })
                        }

                        </View>
                    </ScrollView>
                    <SwipeUpDownModal
              modalVisible={ShowComment}
              PressToanimate={animateModal}
              // HeaderContent={
              //   <View style={styles.containerHeader}>
              //         <Text style={{color: COLORS.gray, fontWeight: 'bold', fontSize: 20}}>Add Category</Text>
              //   </View>
              // }
              //if you don't pass HeaderContent you should pass marginTop in view of ContentModel to Make modal swipeable
              ContentModal={
                <View style={styles.containerContent}>
                  <View style={[styles.row, {flexDirection: 'column', width: FULL_WIDTH-40}]}>
                        <View style={styles.col_6}>
                          <TouchableOpacity style={styles.selectImageBtn} onPress={() => openGallery()}>
                            <View style={styles.formImage}>
                              <Image style={{width: '100%', height: '100%', resizeMode: 'cover'}} source={{uri:categoryImage}} />
                            </View>
                            <Text style={{color: COLORS.gray, fontWeight: 'bold', position: 'relative', top: 50}}>Select Image</Text>
                          </TouchableOpacity>
                        </View>
                        {/* <View style={styles.col_12}>
                            <TextInput placeholder="Image URI" editable={false} selectTextOnFocus={false} returnKeyType={"next"} style={[styles.formInput, {backgroundColor: COLORS.main_bg}]} placeholderTextColor={COLORS.gray}
                              onChangeText={(text) => {setCategoryData({...categoryData, image: text})}}
                              value={(categoryData.image)?categoryData.image:''}
                            />
                        </View> */}
                        <View style={styles.col_12}>
                            <TextInput placeholder="Name" returnKeyType={"next"} style={styles.formInput} placeholderTextColor={COLORS.gray}
                              onChangeText={(text) => {setCategoryData({...categoryData, name: text})}}
                            />
                        </View>
                        <View style={styles.col_12}>
                            <TextInput placeholder="Description" returnKeyType={"next"} style={styles.formInput} placeholderTextColor={COLORS.gray}
                            onChangeText={(text) => {setCategoryData({...categoryData, desc: text})}}
                            />
                        </View>
                        <View style={styles.col_12}>
                            <TextInput placeholder="Offer Percent" returnKeyType={"next"} keyboardType='numeric' style={styles.formInput} placeholderTextColor={COLORS.gray}
                            onChangeText={(text) => {setCategoryData({...categoryData, offer_percent: text})}}
                            />
                        </View>
                        <View style={[styles.col_6, {marginBottom: 20}]}>
                          <Text style={styles.label}>Offer Status</Text>
                          <View style={[styles.radioBtns]}>
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
                        <View style={[styles.col_6, {marginBottom: 20}]}>
                          <Text style={styles.label}>Category Status</Text>
                          <View style={styles.radioBtns}>
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
                          <TouchableOpacity style={styles.saveBtn} onPress={()=> saveCategory()}>
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
             <PopupAlert modelText={'Category Added Susseful'} closeModal={closeModal} isModalVisible={isModalVisible}/>
             {
              (!ifNoCategories)?
              <View style={styles.addBrn}>
                <TouchableOpacity style={styles.btn} onPress={() => openModal()}>
                  <MaterialCommunityIcons name='view-grid-plus-outline' size={30} color={COLORS.white} />
                </TouchableOpacity>
              </View>:""
             }
                    </View>
                </View>
            </SafeAreaView>
        }
        </>
    )
}

export default Categories;

const styles = StyleSheet.create({
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
      formImage:{
        position: 'absolute',
        top: 0,
        left: 0,
        width: "100%",
        height: "100%"
      },
      searchIcon:{
        position: 'absolute',
        top: 5,
        left: 5,
        backgroundColor: COLORS.main_bg,
        padding: 10,
        borderRadius: 5
      },
    categories:{
        width: "100%",
        // backgroundColor: 'red',
        padding: 20,
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    category: {
        width: "30%",
        height: 100,
        marginRight: 10,
        backgroundColor: COLORS.white,
        borderRadius: 5,
        shadowColor: COLORS.gray,
        elevation: 8,
        marginBottom: 10,
        overflow: 'hidden'
    },
    categoryImage: {
        width: "100%",
        height: "60%",
        padding: 10,
        backgroundColor: COLORS.white
    },
    img: {
        width: "100%",
        height: "100%",
        resizeMode: 'contain'
    },
})