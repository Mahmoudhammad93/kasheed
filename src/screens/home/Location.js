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
import MapView from "react-native-maps";
import { Marker } from "react-native-svg";

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
            <MapView
            initialRegion={initialRegion}
            onRegionChange={()=>onRegionChange()}
            >
                {markers.map((marker, index) => (
                    <Marker
                    key={index}
                    coordinate={marker.latlng}
                    title={marker.title}
                    description={marker.description}
                    />
                ))}
            </MapView>
        </SafeAreaView>
        </>
    )
}

export default Location;

const styles = StyleSheet.create({

});