import {StyleSheet, Text, View, TouchableOpacity, Image, ToastAndroid} from 'react-native';
import React, { useState, useEffect } from 'react';
import {COLORS, ROUTES} from '../constants';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import EvilIcon from 'react-native-vector-icons/EvilIcons';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import Cart from '../assets/icons/shopping-cart.png';
import Toast from "react-native-toast-notifications";
import AsyncStorage from '@react-native-async-storage/async-storage';

const Product = (props) => {
    const [total, setTotal] = useState(0);
    const handleAddProduct = async (item) => {
      var currentTotal = await AsyncStorage.getItem('total');
      var totalPrice;
      if(currentTotal){
        totalPrice = parseFloat(currentTotal) + parseFloat(item.price);
      }else{
        totalPrice = parseFloat(item.price)
      }
      await AsyncStorage.setItem('total', JSON.stringify(totalPrice));
      setTotal(totalPrice)
      props.updateTotal(totalPrice)
    }

  return (
    <TouchableOpacity style={styles.product} onPress={() => props.navigation.navigate(ROUTES.PRODUCT_DETAILS, {product: props.product})}>
        <View >
            <View style={styles.productImg}>
                <Image source={Cart} style={styles.Image}/>
            </View>
            <View style={styles.productDetails}>
                <Text style={styles.productName} numberOfLines={1}>
                  {props.product.name}
                </Text>
                <Text style={styles.productPrice}>
                  EGP {props.product.price}
                </Text>
            </View>
        </View>
        <Toast/>
    </TouchableOpacity>
  );
};

export default Product;

const styles = StyleSheet.create({
    product:{
        width: "30%",
        height: 170,
        borderRadius: 5,
        shadowColor: COLORS.dark,
        shadowOpacity: 1,
        elevation: 3,
        marginBottom: 10,
        marginRight: 10,
        overflow: 'hidden'
      },
      productImg:{
        width: "100%",
        height: "70%",
        padding: 10,
        backgroundColor: COLORS.main_bg
      },
      Image:{
        width: "100%",
        height: "100%"
      },
      productDetails:{
        backgroundColor: COLORS.white,
        height: "30%",
        padding: 5
      },
      productName:{
        color: COLORS.black,
        fontWeight: 'bold'
      },
      productPrice:{
        color: COLORS.black,
        fontWeight: 'bold',
        textAlign: 'right'
      }
});