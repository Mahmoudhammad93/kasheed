import React, { useState, useEffect, useCallback } from "react";
import {
    View,
    Text,
    Image,
    TextInput,
    StyleSheet,
    Dimensions,
    TouchableOpacity
} from 'react-native';

import EvilIcons from 'react-native-vector-icons/EvilIcons';
import { COLORS } from "../constants";

const Search = ({navigation ,...props}) => {

    return(
        <>
        <View style={styles.search}>
            <View style={styles.searchInput}>
            <TextInput placeholderTextColor={COLORS.gray} style={styles.input} onChangeText={(text) => props.getSearchText(text)} placeholder={`Search ${props.module} ...`}/>
            <TouchableOpacity style={styles.searchIcon} onPress={() => props.search()}>
                <EvilIcons name='search' size={25} color={COLORS.black} />
            </TouchableOpacity>
            </View>
        </View>
        </>
    )
}

export default Search;

const styles = StyleSheet.create({
    search:{
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        padding: 10
      },
      searchInput:{
        width: "100%",
        marginRight: 10
      },
      input:{
        backgroundColor: COLORS.white,
        borderRadius: 5,
        paddingLeft: 60,
        color: COLORS.gray
      },
      searchIcon:{
        position: 'absolute',
        top: 5,
        left: 5,
        backgroundColor: COLORS.main_bg,
        padding: 10,
        borderRadius: 5
      },
})