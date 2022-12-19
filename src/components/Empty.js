import React from "react";
import { View, Image, Text, StyleSheet, Dimensions, TouchableOpacity } from "react-native";
import EmptyIcon from "../assets/icons/empty-cart.png";
import { COLORS, ROUTES } from "../constants";

const FULL_WIDTH = Dimensions.get('window').width;
const FULL_HEIGHT = Dimensions.get('window').height;

const Empty = (props) => {
    return(
        <View style={styles.empty}>
            <View style={styles.iconRow}>
                <Image source={EmptyIcon} style={styles.emptyIcon}/>
            </View>
            <Text style={styles.emptyText}>Sorry Your Cart Is Empty</Text>
            <TouchableOpacity style={styles.goTo} onPress={() => props.navigation.navigate(ROUTES.KASHEED)}>
                <Text style={{color: COLORS.white}}>Go To Add Products</Text>
            </TouchableOpacity>
        </View>
    )
}

export default Empty;

const styles = StyleSheet.create({
    empty: {
        height: FULL_HEIGHT,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    iconRow:{
        width: 300,
        height: 300,
        resizeMode: 'contain',
        marginTop: 100
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
    }
});