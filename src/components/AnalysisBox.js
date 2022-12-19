import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React, { useState } from 'react';
import {COLORS, ROUTES} from '../constants';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import EvilIcon from 'react-native-vector-icons/EvilIcons';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';

const AnalysisBox = (props) => {
    const [invoiceStatus, setInvoiceStatus] = useState('');
  return (
    <TouchableOpacity onPress={() => props.navigation.navigate(props.route)}>
        <LinearGradient style={styles.analysisBox} colors={['#326bc5', '#449dfe']}
            start={{ x: 0, y: 1 }}
            end={{ x: 1, y: 0 }}>
                <View style={styles.boxHeadrt}>
                    <EvilIcon name="arrow-left" style={styles.boxArrowIcon} size={25} color={COLORS.white} />
                    <Text style={styles.boxTitle}>{props.title}</Text>
                </View>
                <Text style={styles.boxDesc}>{(props.arr != null && props.arr.length > 0)?props.arr.length:0} {props.desc}</Text>
                <MaterialCommunityIcon name={props.icon} size={50} color={'#cccccc45'} style={styles.boxIcon} />
        </LinearGradient>
    </TouchableOpacity>
  );
};

export default AnalysisBox;

const styles = StyleSheet.create({
    analysisBox:{
        // backgroundColor: COLORS.main_color,
        borderRadius: 5,
        marginHorizontal: 5,
        width: 170,
        height: 80,
        padding: 10,
        overflow: 'hidden'
      },
      boxHeadrt:{
        marginBottom: 10,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
      },
      boxArrowIcon:{
        marginRight: 5
      },
      boxTitle:{
        color: COLORS.white,
        fontSize: 15,
        fontWeight: 'bold',
      },
      boxDesc:{
        color: COLORS.grayLight
      },
      boxIcon:{
        position: 'absolute',
        bottom: -5,
        right: -5
      },
});