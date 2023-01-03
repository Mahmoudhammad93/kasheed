import {StyleSheet, Text, Image, View, TouchableOpacity, Dimensions, ActivityIndicator} from 'react-native';
import React, { useState } from 'react';
import {COLORS, ROUTES} from '../constants';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import EvilIcon from 'react-native-vector-icons/EvilIcons';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
const FULL_WIDTH = Dimensions.get('window').width;
const FULL_HEIGHT = Dimensions.get('window').height;

import LOGO from '../assets/icons/LOGO.png';

const Loading = (props) => {
  return (
    <View style={styles.loadingPage}>
        <View style={[styles.container, styles.horizontal]}>
            <ActivityIndicator size="large" color={COLORS.main_color} style={styles.activity} />
            <Image source={LOGO} style={{width: "100%", height: "100%"}} />
        </View>
    </View>
  );
};

export default Loading;

const styles = StyleSheet.create({
    loadingPage:{
        position: 'absolute',
        top: 0,
        left: 0,
        width: FULL_WIDTH,
        height: FULL_HEIGHT,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 100000,
        zIndex: 100000000000
    },
    container: {
        flex: 1,
        justifyContent: "center",
        backgroundColor: COLORS.white,
        width: 150,
        height: 150,
        position: 'absolute',
        borderRadius: 15,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    activity:{
        position: 'absolute',
        zIndex: 9999999,
        backgroundColor: COLORS.white+'90',
        borderRadius: 5
    },
});