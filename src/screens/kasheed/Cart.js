import React, { useState, useEffect, useCallback } from "react";
import {Text, Image, TouchableOpacity, ScrollView, View, StyleSheet, TextInput, Dimensions, RefreshControl} from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { COLORS, ROUTES } from "../../constants";
import AntDesign from 'react-native-vector-icons/AntDesign';
import CartProduct from "../../components/CartProduct";
import Empty from "../../components/Empty";
import Loading from "../../components/Loading";


const FULL_WIDTH = Dimensions.get('window').width;
const FULL_HEIGHT = Dimensions.get('window').height;

const Cart = ({navigation}) => {
    const [cartItems, setCartItems] = useState([]);
    const [itemsTotal, setItemsTotal] = useState(0);
    const [empty, setEmpty] = useState(true);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [btnDisabled, setBtnDisabled] = useState(true);

    const getCartItems = async () => {
        const items = JSON.parse(await AsyncStorage.getItem('items'));
        const total = await AsyncStorage.getItem('total');
        setCartItems(items)
        if (total) {
            if(JSON.parse(total) != "" && JSON.parse(total) != null){
              setItemsTotal(total);
            }else{
              setItemsTotal(0)
            }
        }

        if(items.length > 0){
            setEmpty(false)
            setBtnDisabled(false)
        }

        setLoading(false)
    }

    const updateTotal = (value) => {
        setItemsTotal(value)
    }

    const clearItems = async () => {
        await AsyncStorage.setItem('total', JSON.stringify(0));
        await AsyncStorage.setItem('items', JSON.stringify([]));
        await AsyncStorage.setItem('cart_item', JSON.stringify(''));
        setItemsTotal(0);
        setCartItems([]);
        setEmpty(true)
      }

      const wait = (timeout) => {
        return new Promise(resolve => setTimeout(resolve, timeout));
      }

      const removeItem = async (item) => {
        var arr = cartItems.filter(row => {
            if(row.id != item.id){
                return row;
            }
        })

        setCartItems(arr)

        var count = cartItems.length - 1;
        if(count <= 0) {
            setEmpty(true)
        }
        await AsyncStorage.setItem('items', JSON.stringify(arr));
      }

      const onRefresh = useCallback(() => {
        setRefreshing(true);
        getCartItems()
        wait(20).then(() => setRefreshing(false));
      }, []);

    useEffect(() => {
        getCartItems()
        onRefresh()
    }, []);
    return(
        <>
            {
                (loading)
                ?
                    <Loading />
                :
                    <View style={styles.cartWrapper}>
                        {
                            (empty)?
                                <Empty navigation={navigation}/>
                            :
                            <ScrollView
                            refreshControl={
                                <RefreshControl
                                refreshing={refreshing}
                                onRefresh={onRefresh}
                                />
                            }
                        >
                            {
                                cartItems.map((item, index) => {
                                    return(
                                        <CartProduct navigation={navigation} item={item} key={index+1} index={index+1} updateTotal={updateTotal} removeItem={removeItem}/>
                                    )
                                })
                            }
                        </ScrollView>
                        }
                        <View style={styles.footer}>
                            <TouchableOpacity disabled={btnDisabled} style={[styles.clearBtn, (btnDisabled)?{backgroundColor: "#e37d87"}:'']} onPress={() => clearItems()}>
                                <AntDesign name='closecircle' size={30} color={COLORS.white}/>
                            </TouchableOpacity>
                            <TouchableOpacity disabled={btnDisabled} style={[styles.totalBtn, (btnDisabled)?{backgroundColor: "#70aef0"}:'']} onPress={() => navigation.navigate(ROUTES.PAYMENT)}>
                                <Text style={{color: COLORS.main_bg, fontWeight: 'bold'}}>EGP {parseFloat(itemsTotal).toFixed(2)} Process</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
            }
        </>
    )
}

export default Cart;

const styles = StyleSheet.create({
    cartWrapper: {
        padding: 10,
        height: FULL_HEIGHT,
        paddingBottom: 130
    },
    footer:{
        position: 'absolute',
        flex: 1,
        left: 0,
        right: 0,
        bottom: 56,
        width: FULL_WIDTH,
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