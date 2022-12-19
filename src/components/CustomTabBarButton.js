import React, { useState, useEffect } from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import {COLORS} from '../constants';
import Svg, {Path} from 'react-native-svg';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CustomTabBarButton = props => {
  const {route, children, accessibilityState, onPress} = props;

  if (accessibilityState.selected) {
    return (
      <View style={styles.btnWrapper}>
        <TouchableOpacity
          onPress={onPress}
          style={[styles.activeBtn]}>
          <Ionicons name={'cart'} size={25} color={COLORS.main_color} style={[styles.navIcon]}/>
          <Text style={styles.cartCount}>{props.cartCount}</Text>
        </TouchableOpacity>
      </View>
    );
  } else {
    return (
      <TouchableOpacity
        activeOpacity={1}
        onPress={onPress}
        style={styles.inactiveBtn}>
          <Ionicons name={'cart-outline'} size={25} color={COLORS.black} style={[styles.navIcon]}/>
          <Text style={styles.cartCount}>{props.cartCount}</Text>
      </TouchableOpacity>
    );
  }
};

export default CustomTabBarButton;

const styles = StyleSheet.create({
  btnWrapper: {
    flex: 1,
    alignItems: 'center',
  },
  activeBtn: {
    flex: 1,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inactiveBtn: {
    flex: 1,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navIcon:{
    fontSize: 30
  },
  cartCount:{
    color: COLORS.white,
    backgroundColor: COLORS.danger,
    borderRadius: 5,
    fontSize: 10,
    width: 13,
    height: 13,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center'
  }
});
