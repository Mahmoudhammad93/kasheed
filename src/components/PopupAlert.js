import React, { useState, useEffect, useCallback } from "react";
import { Text, View, Button, StyleSheet } from "react-native";
import Modal from "react-native-modal";
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { COLORS } from "../constants";

const PopupAlert = (props) => {
    // const [isModalVisible, setModalVisible] = useState(true);
    const closeModal = (value) => {
        props.closeModal(value)
    }
    return(
        <Modal style={{display: 'flex', paddingTop: 150}} isVisible={props.isModalVisible} >
              <View style={{ flex: 1 }}>
                <View style={styles.successWrapper}>
                  <View style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: 20
                  }}>
                      <View style={[styles.circle1,styles.circle, {backgroundColor: COLORS.main_color+'25'}]}>
                          <View style={[styles.circle2,styles.circle, {backgroundColor: COLORS.main_color+'55'}]}>
                              <View style={[styles.circle3,styles.circle, {backgroundColor: COLORS.main_color+'75'}]}>
                                  <View style={[styles.circle4,styles.circle, {backgroundColor: COLORS.main_color+'99'}]}>
                                      <Text style={[styles.circle5,styles.circle, {backgroundColor: COLORS.main_color}]}>
                                          <FontAwesome name="check" size={80} color={COLORS.active_color} style={styles.checkIcon} />
                                      </Text>
                                  </View>
                              </View>
                          </View>
                      </View>
                  </View>
                  <View style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                            <Text style={styles.paySuccess}>{props.modelText}</Text>
                        </View>
                      <View>
                      </View>
                    <Button title="Close" onPress={()=>closeModal(false)} />
                  </View>
              </View>
            </Modal>
    )
}

export default PopupAlert;

const styles = StyleSheet.create({
    successWrapper: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        paddingTop: 50,
        backgroundColor: COLORS.white,
        borderRadius: 15
      },
      circle:{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 300,
        textAlign: 'center',
        lineHeight: 150
      },
      circle1: {
        width: 130+100,
        height: 130+100
      },
      circle2: {
        width: 110+100,
        height: 110+100
      },
      circle3: {
        width: 90+100,
        height: 90+100
      },
      circle4: {
        width: 70+100,
        height: 70+100
      },
      circle5: {
        width: 50+100,
        height: 50+100
      },
      checkIcon:{
        opacity: .5
      },
      paySuccess: {
        color: COLORS.main_color,
        fontWeight: 'bold',
        fontSize: 25,
        marginBottom: 10
      },
})