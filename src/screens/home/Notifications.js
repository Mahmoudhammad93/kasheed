import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {COLORS} from '../../constants';

const Notifications = () => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.main_color,
      }}>
      <Text>Notification!</Text>
    </View>
  );
};

export default Notifications;

const styles = StyleSheet.create({});
