import React from "react";
import { View, Image, Text, StyleSheet, Dimensions, TouchableOpacity } from "react-native";
import EmptyIcon from "../assets/icons/no-results.png";
import { COLORS, ROUTES } from "../constants";

const FULL_WIDTH = Dimensions.get('window').width;
const FULL_HEIGHT = Dimensions.get('window').height;

const NoResult = (props) => {
    return(
        <View style={styles.empty}>
            <View style={styles.iconRow}>
                <Image source={EmptyIcon} style={styles.emptyIcon}/>
            </View>
            <Text style={styles.emptyText}>No {props.module} Found</Text>
            <TouchableOpacity style={styles.btnAdd} onPress={()=>(props.module == 'Invoices')? props.navigation.navigate(ROUTES.KASHEED):props.openModalFromNoResult()}>
                <Text style={{color: COLORS.white}}>Add New {props.module}</Text>
            </TouchableOpacity>
        </View>
    )
}

export default NoResult;

const styles = StyleSheet.create({
    empty: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingTop: 20,
        backgroundColor: COLORS.white,
        position: 'absolute',
        top: -150,
        borderRadius: 5,
        elevation: 8,
        shadowColor: COLORS.gray,
        width: "90%",
        left: "5%"
    },
    iconRow:{
        width: 100,
        height: 100,
        resizeMode: 'contain',
        // marginTop: 100
    },
    emptyIcon: {
        width: "100%",
        height: "100%"

    },
    emptyText: {
        color: COLORS.main_color,
        marginTop: 30,
        fontWeight: 'bold'
    },
    goTo:{
        backgroundColor: COLORS.main_color,
        padding: 15,
        borderRadius: 5,
        marginTop: 20
    },
    btnAdd:{
        backgroundColor: COLORS.main_color,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 15,
        borderRadius: 5,
        width: "80%",
        marginVertical: 20
    }
});