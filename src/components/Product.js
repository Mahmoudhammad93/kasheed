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
    const product = props.product;

    const handleAddProduct = async (item, index) => {
      var currentTotal = await AsyncStorage.getItem('total');
      var currentItems = await AsyncStorage.getItem('items');
      var cartItem = await AsyncStorage.getItem('cart_item');
      var currentQ = await AsyncStorage.getItem('item_quantity')

      if(JSON.parse(currentItems) != null && JSON.parse(currentItems).length > 0){
        JSON.parse(currentItems).forEach(async function(row, index) {
            if(row.id === item.id){
              await AsyncStorage.setItem('item_quantity', JSON.stringify(row.quantity))
              item.quantity = row.quantity+1;
              const newArray = JSON.parse(currentItems).filter(e => {
                if(e.id !== item.id){
                  return e;
                }
              })
              // var arr = JSON.parse(currentItems).splice(row, index);
              
              await AsyncStorage.setItem('items', JSON.stringify([...newArray, item]));
            }else{
              item.quantity = 1;
              var arr = JSON.parse(currentItems);
              await AsyncStorage.setItem('items', JSON.stringify([...arr, item]));
            }
            // await AsyncStorage.setItem('items', JSON.stringify(items));
        });
      }else{
        item.quantity = 1;
        await AsyncStorage.setItem('items', JSON.stringify([item]));
      }
      // console.log(index)

      
      var newItems;
      // if(currentItems && JSON.parse(currentItems).length > 0){
      //   const ids = JSON.parse(currentItems).map(row => {
      //     return row.id;
      //   })

      //   console.log(ids.indexOf(item.id))

      //   if(ids.indexOf(item.id) === -1){
      //     item.quantity = 1;
      //     var arr = JSON.parse(currentItems);
      //     await AsyncStorage.setItem('items', JSON.stringify([...arr, item]));
      //   }else{
      //     JSON.parse(currentItems).map(async row => {
      //       if(row.id === item.id){
      //         item.quantity = row.quantity+1;
      //         var arr = JSON.parse(currentItems).splice(item, 1);
      //         await AsyncStorage.setItem('items', JSON.stringify([...arr, item]));
      //       }
      //     })
      //   }
      // }else{
      //   item.quantity = 1;
      //   await AsyncStorage.setItem('items', JSON.stringify([item]));
      // }
      
      var totalPrice;
      if(currentTotal){
        if(item.offer_status == 1){
          totalPrice = parseFloat(currentTotal) + parseFloat(item.offer_price);
        }else{
          totalPrice = parseFloat(currentTotal) + parseFloat(item.price);
        }
      }else{
        totalPrice = parseFloat(item.price)
      }

      await AsyncStorage.setItem('total', JSON.stringify(totalPrice));
      setTotal(totalPrice)
      props.updateTotal(totalPrice)
      if(JSON.parse(currentItems).length >= 0){
        props.setBtnActive(false)
      }
    }

  return (
    <TouchableOpacity style={styles.product} onPress={() => handleAddProduct(props.product, props.index)}>
        <View >
            <View style={styles.productImg}>
                <Image source={(product.image)?{uri: product.image}:Cart} style={styles.Image}/>
                {
                  (product.offer_status == 1)?
                  <Text style={styles.offerMark}></Text>:''
                }
            </View>
            <View style={styles.productDetails}>
                <Text style={styles.productName} numberOfLines={1}>
                {product.name} 
                </Text>
                <Text style={[styles.productPrice, (product.offer_status == 1)?{color: COLORS.grayLight, textDecorationLine: 'line-through', fontSize: 12}:'']}>
                EGP {parseFloat(product.price).toFixed(2)}
                </Text>
                {
                  (product.offer_status == 1)?<Text style={styles.productPrice}>
                  EGP {parseFloat(product.offer_price).toFixed(2)}
                  </Text>:''
                }
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
        height: 190,
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
        height: "100%",
        resizeMode: 'cover'
      },
      offerMark:{
        position: 'absolute',
        top: -5,
        right: -20,
        width: 50,
        height: 20,
        backgroundColor: '#fab60b',
        transform: [{rotate: '42deg'}]
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