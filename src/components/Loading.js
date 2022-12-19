import {StyleSheet, Text, View, TouchableOpacity, Dimensions, ActivityIndicator} from 'react-native';
import React, { useState } from 'react';
import {COLORS, ROUTES} from '../constants';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import EvilIcon from 'react-native-vector-icons/EvilIcons';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
const FULL_WIDTH = Dimensions.get('window').width;
const FULL_HEIGHT = Dimensions.get('window').height;

const Loading = (props) => {
  return (
    <View style={styles.loadingPage}>
        <View style={[styles.container, styles.horizontal]}>
            <ActivityIndicator size="large" color={COLORS.main_color} />
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
        justifyContent: 'center'
    },
    container: {
        flex: 1,
        justifyContent: "center"
      },
      horizontal: {
        flexDirection: "row",
        justifyContent: "space-around",
      }
});