import React, { useState, useEffect, useCallback } from "react";
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    ScrollView,
    SafeAreaView,
    RefreshControl
} from 'react-native';
import ProductComponent from '../../components/ProductDetails';
import AsyncStorage from '@react-native-async-storage/async-storage';
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import Loading from "../../components/Loading";
import LoadingMore from "../../components/LoadingMore";

import BANNER from '../../assets/banners/banner.jpg';
import { COLORS } from "../../constants";
import NotFound from "../../components/NotFound";
const FULL_WIDTH = Dimensions.get('window').width;
const FULL_HEIGHT = Dimensions.get('window').height;

const Category = ({navigation, ...props}) => {
    const [products, setProducts] = useState([]);
    const [categoryData, setCategoryData] = useState({});
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);

    const CATEGORY = props.route.params.category;

    const getCategoryData = async () => {
        const PRODUCS = JSON.parse(await AsyncStorage.getItem('products'));
        setCategoryData(props.route.params.category)
        if(PRODUCS !== null && PRODUCS.length > 0){
            const CATE_PRODUCTS = PRODUCS.filter(row => {
                if(row.category_id == CATEGORY.id){
                    return row;
                }
            })

            setProducts(CATE_PRODUCTS)
            setLoading(false)
            setLoadingMore(false)
        }

    }

    const prevCategory = async (id) => {
        setLoadingMore(true)
        const CATEGORIES = JSON.parse(await AsyncStorage.getItem('categories'))
        const CATE_IDS = CATEGORIES.map(elem => elem.id);

        (id > 1)?setCategoryData(CATEGORIES[id-2]):setCategoryData(CATEGORIES[CATEGORIES.length-1])

        const PRODUCS = JSON.parse(await AsyncStorage.getItem('products'));
        if(PRODUCS !== null && PRODUCS.length > 0){
            const CATE_PRODUCTS = PRODUCS.filter(row => {
                if(id > 1){
                    if(row.category_id == (categoryData.id - 1)){
                        return row;
                    }
                }else{
                    if(row.category_id == CATEGORIES[CATEGORIES.length-1].id){
                        return row;
                    }
                }
            })

            if(CATE_PRODUCTS.length > 0){
                setProducts(CATE_PRODUCTS)
            }else{
                setProducts([])
            }
            setLoadingMore(false)
        }

        console.log(id)

    }

    const nextCategory = async (id) => {
        setLoadingMore(true)
        const CATEGORIES = JSON.parse(await AsyncStorage.getItem('categories'))

        const CATE_IDS = CATEGORIES.map(elem => elem.id);

        (id < CATEGORIES.length)?setCategoryData(CATEGORIES[id]):setCategoryData(CATEGORIES[0])

        const PRODUCS = JSON.parse(await AsyncStorage.getItem('products'));
        if(PRODUCS !== null && PRODUCS.length > 0){
            if(id == CATEGORIES.length){
                const CATE_PRODUCTS = PRODUCS.filter(row => {
                    if(row.category_id == CATEGORIES[0]){
                        return row;
                    }
                })

                if(CATE_PRODUCTS.length > 0){
                    setProducts(CATE_PRODUCTS)
                }else{
                    setProducts([])
                }
            }else{
                const CATE_PRODUCTS = PRODUCS.filter(row => {
                    if(row.category_id == categoryData.id + 1){
                        return row;
                    }
                })
                if(CATE_PRODUCTS.length > 0){
                    setProducts(CATE_PRODUCTS)
                }else{
                    setProducts([])
                }
            }
            setLoadingMore(false)
        }
    }

    const wait = (timeout) => {
        return new Promise(resolve => setTimeout(resolve, timeout));
    }

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        getCategoryData()
        wait(20).then(() => setRefreshing(false));
    }, []);


    useEffect(() => {
        getCategoryData()
    }, [])
    return(
        <>
        {
            (loading)?<Loading />:
            <SafeAreaView>
                <View style={styles.categoryWrapper}>
                    <View style={styles.head}>
                        <View style={styles.bannerImg}>
                            <Image source={(categoryData.image)?{uri: categoryData.image}:BANNER} style={styles.image} />
                        </View>
                    </View>
                    <View style={styles.categoryTitle}>
                        <View style={styles.categorySelect}>
                            <TouchableOpacity style={[styles.nextPrevBtns ,styles.prev]} onPress={()=> prevCategory(categoryData.id)}>
                                <EvilIcons name="chevron-left" size={25} color={COLORS.main_color} />
                            </TouchableOpacity>
                            <Text style={{color: COLORS.gray, textAlign: 'center'}}>{categoryData.name} - {categoryData.id}</Text>
                            <TouchableOpacity style={[styles.nextPrevBtns ,styles.next]} onPress={()=> nextCategory(categoryData.id)}>
                                <EvilIcons name="chevron-right" size={25} color={COLORS.main_color} />
                            </TouchableOpacity>
                        </View>
                    </View>
                    {
                        (loadingMore)? <LoadingMore />:""
                    }
                    <View style={{height: FULL_HEIGHT-250}}>
                        <ScrollView
                            refreshControl={
                                <RefreshControl
                                refreshing={refreshing}
                                onRefresh={onRefresh}
                                />
                            }
                        >
                            {
                                (products.length <= 0)? <NotFound module={'Products'} />:
                                <View style={styles.products}>
                                {
                                    products.map(item => {
                                        return(
                                            <ProductComponent key={item.id} product={item} navigation={navigation}/>
                                        )
                                    })
                                }
                                </View>
                            }
                        </ScrollView>
                    </View>
                </View>
            </SafeAreaView>
        }
        </>
    )
}

export default Category;

const styles = StyleSheet.create({
    categoryWrapper:{

    },
    head:{
        height: 150,
        shadowColor: COLORS.black,
        elevation: 8,
        margin: 10,
        borderRadius: 5,
        overflow: 'hidden'
    },
    bannerImg:{
        width: FULL_WIDTH,
    },
    image:{
        width: "100%",
        height: "100%",
        resizeMode: 'cover'
    },
    categoryTitle: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20
    },
    categorySelect: {
        backgroundColor: COLORS.white,
        width: "80%",
        borderRadius: 5,
        // padding: 15,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        shadowColor: COLORS.gray,
        elevation: 5,
        margin: 10
    },
    nextPrevBtns:{
        backgroundColor: COLORS.second_bg,
        padding: 10,
        paddingHorizontal: 2,
        borderRadius: 5
    },
    prev:{
        
    },
    next:{
        
    },
    products:{
        margin: 10,
        width: "100%",
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 10,
    },
    
})