import React, { useState, useEffect } from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {StyleSheet, Platform, TouchableOpacity, Text, Image, View} from 'react-native';
import {COLORS, ROUTES} from '../constants';
import {Home, Wallet, Notifications, Settings, MyProfile, Cart} from '../screens';
import Icon from 'react-native-vector-icons/Ionicons';
import SettingsNavigator from './SettingsNavigator';
import CustomTabBarButton from '../components/CustomTabBarButton';
import CustomTabBar from '../components/CustomTabBar';
import {useNavigation} from '@react-navigation/native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Profile from '../screens/home/Profile';
import ProfileImg from '../assets/user.jpg';
import Data from '../data.json';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Tab = createBottomTabNavigator();

function BottomTabNavigator() {
  const navigation = useNavigation();
  const [user, setUser] = useState({});
  const [cartCount, setCartCount] = useState(0);

  const getCartCount = async () => {
    const cart = await AsyncStorage.getItem('items');
    setCartCount(JSON.parse(cart).length)
  }

  useEffect(() => {
    getCartCount()
  }, [])

  return (
    <Tab.Navigator
      tabBar={props => <CustomTabBar {...props} />}
      screenOptions={({route}) => ({
        headerShown: false,
        tabBarShowLabel: true,
        tabBarInactiveTintColor: COLORS.dark,
        tabBarStyle: styles.tabBarStyle,
        tabBarActiveTintColor: COLORS.main_color,
        tabBarIcon: ({color, size, focused}) => {
          let iconName;

          if (route.name === ROUTES.HOME_TAB) {
            iconName = focused ? 'ios-home-sharp' : 'ios-home-outline';
          } else if (route.name === ROUTES.SETTINGS) {
            iconName = focused ? 'settings' : 'settings-outline';
          } else if (route.name === ROUTES.WALLET) {
            iconName = focused ? 'wallet' : 'wallet-outline';
          } else if (route.name === ROUTES.My_PROFILE) {
            iconName = focused ? 'person' : 'person-outline';
          } else if (route.name === ROUTES.CART) {
            iconName = focused
              ? 'cart'
              : 'cart-outline';
          }

          return <Icon name={iconName} size={25} color={color} style={[styles.navIcon]}/>;
        },
      })}>
      <Tab.Screen
        name={ROUTES.HOME_TAB}
        component={Home}
      />
      <Tab.Screen
        name={ROUTES.WALLET}
        component={Wallet}
      />
      <Tab.Screen
        name={ROUTES.CART}
        component={Cart}
        options={{
          tabBarButton: props => <CustomTabBarButton route="cart" cartCount={cartCount} {...props} />,
        }}
      />
      <Tab.Screen
        name={ROUTES.My_PROFILE}
        component={MyProfile}
        // options={{
        //   tabBarButton: () => {
        //     return(
        //       <View style={styles.profileImg}>
        //         <Image source={ProfileImg} style={styles.img}/>
        //       </View>
        //     )
        //   }
        // }}
      />
      <Tab.Screen
        name={ROUTES.SETTINGS}
        component={Settings}
        // options={{
        //   tabBarLabel: 'Settings',
        //   title: 'Settings',
        //   headerShown: true,
        //   headerRight: () => {
        //     return (
        //       <TouchableOpacity onPress={() => navigation.openDrawer()}>
        //         <Icon
        //           name={Platform.OS === 'ios' ? 'ios-menu' : 'md-menu'}
        //           size={30}
        //           color={COLORS.dark}
        //           style={{marginRight: 10}}
        //         />
        //       </TouchableOpacity>
        //     );
        //   },
        // }}
      />
    </Tab.Navigator>
  );
}

export default BottomTabNavigator;

const styles = StyleSheet.create({
  tabBarStyle: {
    height: 60,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    position: 'absolute'
  },
  navIcon:{
  },
  profileImg:{
    width: 60,
    height: "100%",
    padding: 10,
  },
  img:{
    width: "100%",
    height: "100%",
    borderRadius: 50,
    borderWidth: 2,
    borderColor: COLORS.grayLight,
    margin: 2
  }
});
