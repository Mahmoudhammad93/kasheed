import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useEffect } from 'react';
import {StyleSheet, Text, SafeAreaView, View} from 'react-native';
import { COLORS } from '../../constants';
import Data from '../../data.json';
import ProfileComponent from '../../components/Profile';

const Profile = (props) => {
  var [userData, setUserData] = useState({});
  
  const getUser = async () => {
    const user_id = await AsyncStorage.getItem('user_id');
    if(user_id){
        Data.users.map(user => {
          if(user.id == user_id){
            setUserData(user)
          }
        })
      }
  }

  useEffect(() => {
    getUser()
  }, []);
  
  return (
    <SafeAreaView>
      <View style={styles.wrapper}>
        <ProfileComponent user={userData} />
      </View>
    </SafeAreaView>
  );
};

export default Profile;

const styles = StyleSheet.create({});
