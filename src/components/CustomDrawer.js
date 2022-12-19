import React, {useState, useEffect} from 'react';
import {
  ImageBackground,
  StyleSheet,
  Image,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import {
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import {COLORS, IMGS, ROUTES} from '../constants';
import colors from '../constants/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Data from '../data.json';

const {width} = Dimensions.get('screen');
const FULL_WIDTH = Dimensions.get('window').width;
const FULL_HEIGHT = Dimensions.get('window').height;

const CustomDrawer = (props, {navigation}) => {
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

  const signOut = async () => {
    props.navigation.navigate(ROUTES.LOGIN);
    await AsyncStorage.removeItem('user_id');
  }

  useEffect(() => {
    getUser()
  }, []);
  return (
    <DrawerContentScrollView {...props}>
      <ImageBackground style={[styles.drawerHeader, {height: 140}]} source={IMGS.bgPattern}>
        <Image source={IMGS.user} style={styles.userImg} />
        <View style={styles.userInfo}>
          <TouchableOpacity onPress={()=> props.navigation.navigate(ROUTES.My_PROFILE)}>
            <Text style={[styles.infoText, {top: 0, fontWeight: 'bold'}]}>{userData.first_name} {userData.last_name}</Text>
          </TouchableOpacity>
          <Text style={[styles.infoText, {top: 20}]}>@{userData.username}</Text>
        </View>
      </ImageBackground>
      <View style={styles.drawerListWrapper}>
        <DrawerItemList {...props} />
      </View>
      <TouchableOpacity style={styles.signouttn} onPress={() => signOut()}>
        <FontAwesome name="sign-out" size={25} color={COLORS.grayLight} style={{marginRight: 10}} />
        <Text style={{color: COLORS.grayLight, fontWeight: 'bold'}}>Signout</Text>
      </TouchableOpacity>
    </DrawerContentScrollView>
  );
};

export default CustomDrawer;

const styles = StyleSheet.create({
  userImg: {
    width: 110,
    height: 110,
    borderRadius: 110 / 2,
    position: 'absolute',
    left: width / 3 - 120,
    bottom: -110 / 3,
    borderWidth: 4,
    borderColor: COLORS.white,
    elevation: 8,
    flex: 1,
    zIndex: 10
  },
  drawerListWrapper: {
    marginTop: 65,
    // backgroundColor: 'red',
    height: FULL_HEIGHT-208
  },
  userInfo:{
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.gray+'80',
    width: "100%",
    textAlign: 'left',
    height: 40,
    elevation: 0,
  },
  infoText:{
    position: 'absolute',
    left: 140,
    elevation: 0
  },
  signouttn:{
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    // justifyContent: 'center'
    padding: 10,
    backgroundColor: COLORS.second_bg,
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: "100%"
  }
});
