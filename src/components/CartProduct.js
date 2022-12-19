import {StyleSheet, Text, View, TouchableOpacity, Image, ToastAndroid} from 'react-native';
import React, { useState, useEffect } from 'react';
import {COLORS, ROUTES} from '../constants';
import productImage from "../assets/icons/shopping-cart.png";
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import routes from '../constants/routes';

const CartProduct = (props) => {
    const [quantity, setQuantity] = useState("1");

    const plus = async (item) => {
        var cart = await AsyncStorage.getItem('items');
        var currentTotal = await AsyncStorage.getItem('total');
        var arr = JSON.parse(cart)

        var newArr = arr.filter(row => {
            if(row.id != item.id){
                return row
            }

            if(row.id === item.id){
                item.quantity = row.quantity+1
            }
        })
        await AsyncStorage.setItem('items', JSON.stringify([...newArr, item]));

        setQuantity(parseInt(quantity) + 1)

        var totalPrice;
        if(currentTotal){
            totalPrice = parseFloat(currentTotal) + parseFloat(item.price);
        }else{
            totalPrice = parseFloat(item.price)
        }
        await AsyncStorage.setItem('total', JSON.stringify(totalPrice));
        props.updateTotal(totalPrice)
    }

    const minus = async (item) => {
        if(parseInt(quantity) > 1){
            var cart = await AsyncStorage.getItem('items');
            var currentTotal = await AsyncStorage.getItem('total');
            var arr = JSON.parse(cart)

            var newArr = arr.filter(row => {
                if(row.id != item.id){
                    return row
                }

                if(row.id === item.id){
                    item.quantity = row.quantity-1
                }
            })
            await AsyncStorage.setItem('items', JSON.stringify([...newArr, item]));

            setQuantity(parseInt(quantity) - 1)

            var totalPrice;
            if(currentTotal){
                totalPrice = parseFloat(currentTotal) - parseFloat(item.price);
            }else{
                totalPrice = parseFloat(item.price)
            }
            await AsyncStorage.setItem('total', JSON.stringify(totalPrice));
            props.updateTotal(totalPrice)
        }
    }

    const removeItem = async (item) => {
        var cart = await AsyncStorage.getItem('items');
        var currentTotal = await AsyncStorage.getItem('total');
        var arr = JSON.parse(cart)

        var newArr = arr.filter(row => {
            if(row.id != item.id){
                return row
            }
        })

        await AsyncStorage.setItem('items', JSON.stringify(newArr));
        var totalPrice;
        if(currentTotal){
            var productPrice = parseFloat(item.price) * parseFloat(item.quantity);
            totalPrice = parseFloat(currentTotal) - productPrice;
        }
        await AsyncStorage.setItem('total', JSON.stringify(totalPrice));
        props.updateTotal(totalPrice)
        props.removeItem(item)
    }

    useEffect(() => {
        setQuantity(props.item.quantity)
    }, []);

  return (
    <View style={styles.cartProduct}>
        <View style={styles.imageRow}>
            <TouchableOpacity onPress={() => props.navigation.navigate(routes.PRODUCT_DETAILS, {product: props.item})} style={styles.productImage}>
                <Image source={productImage} style={styles.image}/>
            </TouchableOpacity>
        </View>
        <View style={styles.productDetails}>
            <View style={styles.nameRow}>
                <Text style={styles.productName} numberOfLines={1}>{props.item.id}# {props.item.name}</Text>
                <Text style={styles.productprice}>EGP {parseFloat((quantity == 1)?props.item.price: props.item.price*quantity).toFixed(2)}</Text>
            </View>
            <View style={styles.quantity}>
                <View style={styles.quantityBtns}>
                    <TouchableOpacity style={[styles.qBtns ,styles.minusBtn]} onPress={() => minus(props.item)}>
                        <AntDesign name='minus' size={15} color={COLORS.white} style={[styles.quantityBtn]}/>
                    </TouchableOpacity>
                    <Text style={styles.quantityInput}>{quantity}</Text>
                    <TouchableOpacity style={[styles.qBtns ,styles.plusBtn]} onPress={() => plus(props.item)}>
                        <AntDesign name='plus' size={15} color={COLORS.white} style={[styles.quantityBtn]}/>
                    </TouchableOpacity>
                </View>
                <View style={styles.removeBtnRow}>
                    <TouchableOpacity style={styles.removeBtn} onPress={() => removeItem(props.item)}>
                        <Entypo name='trash' size={25} color={COLORS.main_color} style={styles.removeBtnIcon} />
                        <Text style={styles.removeText}>Remove</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    </View>
  );
};

export default CartProduct;

const styles = StyleSheet.create({
    cartProduct: {
        backgroundColor: COLORS.white,
        marginBottom: 10,
        display: 'flex',
        flexDirection: 'row',
        shadowColor: COLORS.gray,
        shadowOpacity: .5,
        elevation: 1,
        borderRadius: 5
    },
    imageRow: {
        width: "20%",
        padding: 10
    },
    productImage: {
        width: 70,
        height: 70,
        backgroundColor: COLORS.main_bg,
        padding: 5,
        borderRadius: 5
    },
    image: {
        width: "100%",
        height: "100%",
        resizeMode: 'contain'
    },
    productDetails: {
        width: "80%"
    },
    nameRow: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 10
    },
    productName: {
        fontWeight: 'bold',
        fontSize: 15,
        width: "50%",
        color: COLORS.gray,
    },
    productprice: {
        color: COLORS.main_color,
        fontWeight: 'bold',
        width: "40%",
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        textAlign: 'center'
    },
    quantity: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        width: "100%"
    },
    quantityBtns:{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        width: "40%"
    },
    quantityBtn: {
        color: COLORS.white,
        padding: 2,
        borderRadius: 5,
    },
    qBtns:{
        borderRadius: 5,
        width: 25,
        height: 25,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    quantityInput: {
        color: COLORS.gray
    },
    removeBtnRow: {
        width: "60%",
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-end'
    },
    removeBtn: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-end',
        paddingRight: 10
    },
    removeBtnIcon: {
        marginRight: 5
    },
    removeText: {
        color: COLORS.main_color,
        fontWeight: 'bold'
    },
    minusBtn: {
        backgroundColor: COLORS.danger
    },
    plusBtn: {
        backgroundColor: COLORS.active_color
    },
});