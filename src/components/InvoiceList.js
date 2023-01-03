import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React, { useState, useEffect } from 'react';
import {COLORS, ROUTES} from '../constants';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import EvilIcon from 'react-native-vector-icons/EvilIcons';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';

const InvoiceList = (props) => {
    const [invoiceStatus, setInvoiceStatus] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "June",
      "July", "Aug", "Sept", "Oct", "Nov", "Dec"
    ];

    const getDate = () => {
      var DATE = new Date(props.data.created_at)
      var NEW_DATE = String(DATE.getDate()).padStart(2, '0')+" "+monthNames[DATE.getMonth()]+" "+DATE.getFullYear();
      var NEW_TIME = DATE.getHours()+":"+DATE.getMinutes()+(DATE.getHours() >= 12?"PM":"AM");
      setDate(NEW_DATE)
      setTime(NEW_TIME)
    }

    useEffect(() => {
      getDate()
    }, [])

  return (
    <TouchableOpacity style={[styles.invoice, {borderLeftColor: props.data.color}]} key={props.data.id}
    onPress={() => props.navigation.navigate(ROUTES.INVOICE_DETAILS, {invoice:props.data})}
    >
        <View style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between'
        }}>
            <View style={{
            marginRight: 20
            }}>
                <MaterialCommunityIcon name='file-document-multiple' size={20} color={COLORS.gray} style={[styles.sectionTitleIcon, styles.invoiceIcon,{marginBottom: 10}]} />
                <Text style={[styles.invoiceNumber, {backgroundColor: "#"+props.data.invoice_number+'56'}]}>#{props.data.invoice_number}</Text>
            </View>
            <View style={styles.invoiceDetails}>
                <Text style={styles.invoiceTitle} numberOfLines={2}>{props.data.title}</Text>
                <Text style={[styles.invoiceStatus, styles.paidStatus, {backgroundColor: props.data.color, color: (props.data.status === 'pending')?COLORS.black:COLORS.white}]}>{(props.data.status == 'faild')?'Cancelled':props.data.status}</Text>
            </View>
        </View>
        <View style={styles.invoicePrice}>
            <Text style={styles.price}>EGP {props.data.price}</Text>
            <Text style={styles.date}>{date}</Text>
            <Text style={styles.date}>{time}</Text>
        </View>
    </TouchableOpacity>
  );
};

export default InvoiceList;

const styles = StyleSheet.create({
    invoice:{
        backgroundColor: COLORS.white,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
        // borderBottomColor: COLORS.grayLight,
        // borderBottomWidth: 2,
        borderLeftWidth: 3,
        marginBottom: 10,
        // borderRadius: 5
        shadowColor: COLORS.gray,
        shadowOffset: {
          width: 0,
          height: 4,
        },
        shadowOpacity: 0.30,
        shadowRadius: 4.65,
    
        elevation: 1,
        borderTopRightRadius: 5,
        borderBottomRightRadius: 5
      },
      invoiceIcon:{
        color: COLORS.main_color
      },
      invoiceNumber:{
        color: COLORS.gray,
        fontWeight: 'bold',
        padding: 2,
        borderRadius: 3
      },
      invoiceTitle:{
        color: COLORS.gray,
        fontWeight: 'bold',
        marginBottom: 10,
        width: 120
      },
      invoiceStatus:{
        color: COLORS.white,
        textAlign: 'center',
        padding: 5,
        borderRadius: 5,
        fontSize: 12,
        width: 60,
        fontWeight: 'bold',
        textTransform: 'capitalize'
      },
      invoicePrice:{
        display: 'flex',
        alignItems: 'flex-end'
      },
      price:{
        color: COLORS.gray,
        fontWeight: 'bold',
        marginBottom: 10
      },
      date:{
        color: COLORS.main_color
      },
      activeStatus:{
        backgroundColor: COLORS.active_color
      },
      paidStatus:{
        backgroundColor: COLORS.main_color
      },
      pendingStatus: {
        backgroundColor: COLORS.warning_color
      }
});