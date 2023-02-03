import React, { useState, useEffect, useCallback } from "react";
import {
    View,
    Text,
    Image,
    TextInput,
    TouchableOpacity,
    ScrollView,
    SafeAreaView,
    StyleSheet,
    Dimensions
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import MapView, { AnimatedRegion, Animated } from 'react-native-maps';
import { Marker } from "react-native-svg";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { COLORS } from "../../constants";
import { color } from "react-native-reanimated";
import EvilIcons from "react-native-vector-icons/EvilIcons";

const FULL_WIDTH = Dimensions.get('window').width;
const FULL_HEIGHT = Dimensions.get('window').height;

const Location = ({navigation, ...props}) => {
    const [initialRegion, setInitialRegion] = useState({
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    })
    const [markers, setMarkers] = useState([]);

    const onRegionChange = (region) => {
        setInitialRegion({...initialRegion, latitude: region.latitude, longitude: region.longitude});
    }
    return(
        <>
        <SafeAreaView>
            <View style={{height: FULL_HEIGHT, width: FULL_WIDTH}}>
                <GooglePlacesAutocomplete
                    placeholder='Search location ...'
                    textInputProps={{
                        placeholderTextColor: COLORS.gray,
                        returnKeyType: "search",
                      }}
                    minLength={2}
                    listViewDisplayed="auto"
                    onPress={(data, details = null) => {
                        // 'details' is provided when fetchDetails = true
                        console.log(data, details);
                    }}
                    query={{
                        key: 'AIzaSyDE15nmyhjQjIvUg9dQjEN6ugnY4xEKLjM',
                        language: 'en',
                    }}
                    styles={styles}
                />
                <EvilIcons name="search" size={25} color={COLORS.gray} style={styles.searchIcon} />
            </View>
        </SafeAreaView>
        </>
    )
}

export default Location;

const styles = StyleSheet.create({
    textInput:{color: COLORS.gray, shadowColor: COLORS.gray, elevation: 2, paddingLeft: 50},
    textInputContainer:{padding: 20},
    searchIcon:{
        position: 'absolute',
        top: 32,
        left: 30,
        zIndex: 999999
    }
});