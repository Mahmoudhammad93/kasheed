import React, {useState, useEffect, useCallback} from 'react';
import {StyleSheet, Text, SafeAreaView, TouchableOpacity, View, Image, Dimensions, ScrollView, RefreshControl, DevSettings} from 'react-native';
import {COLORS, ROUTES} from '../../constants';
import Ionicons from "react-native-vector-icons/Ionicons";
import EvilIcon from "react-native-vector-icons/EvilIcons";
import Octicons from "react-native-vector-icons/Octicons";
import UserImg from "../../assets/user.jpg";
import SwipeUpDownModal from 'react-native-swipe-modal-up-down';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNRestart from "react-native-restart";
import routes from '../../constants/routes';
import Data from "../../data.json";
import Loading from '../../components/Loading';

const FULL_WIDTH = Dimensions.get('window').width;
const FULL_HEIGHT = Dimensions.get('window').height;

const Settings = ({navigation}) => {
  let [ShowComment, setShowModelComment] = useState(false);
  let [animateModal, setanimateModal] = useState(false);
  let [ShowThemeComment, setShowThemeModelComment] = useState(false);
  let [animateThemeModal, setanimateThemeModal] = useState(false);
  const [lang, setLang] = useState('');
  const [theme, setTheme] = useState('light');
  const [refreshing, setRefreshing] = useState(false);
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(true);

  const getData = async () => {
    const LANG = JSON.parse(await AsyncStorage.getItem('lang'))
    const THEME = JSON.parse(await AsyncStorage.getItem('theme'))
    const USERID = JSON.parse(await AsyncStorage.getItem('user_id'))

    const userData = Data.users.filter(user => {
      if(user.id == USERID){
        return user;
      }
    })

    setLang(LANG)
    setTheme(THEME)
    setUserData(userData[0])
    wait(200).then(() => setLoading(false));
  }

  const changeLanguage = async (value) => {
    await AsyncStorage.setItem('lang', JSON.stringify(value))
    setShowModelComment(false)
    onRefresh()
    // RNRestart.Restart();
  }

  const changeTheme = async (value) => {
    
    await AsyncStorage.setItem('theme', JSON.stringify(value))
    setShowThemeModelComment(false)
    onRefresh()
    // RNRestart.Restart();
  }

  const openModal = () => {
    setShowModelComment(true)
  }

  const openThemeModal = () => {
    setShowThemeModelComment(true)
  }

  const signOut = async () => {
    navigation.navigate(routes.LOGIN);
    await AsyncStorage.removeItem('user_id');
  }

  const closePopupModal = () => {
    setShowModelComment(false);
    setanimateModal(false);
  }

  const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  }

  const onRefresh = useCallback(() => {
    getData()
    setRefreshing(true);
    wait(20).then(() => setRefreshing(false));
  }, []);

  useEffect(() => {
    getData()
  }, [])
  return (
  <>
    <SafeAreaView>
      {
        (loading)?<Loading />:
        <View>
          <ScrollView
      style={{height: "100%"}}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
      >
        <View style={styles.settingWrapper}>
          <View style={[styles.box, styles.userInfoBox, (lang == 'ar')?{flexDirection: 'row-reverse'}:'']}>
            <View style={[styles.userImg, (lang == 'ar')?{marginRight: 0, marginLeft: 20}:'']}>
              <Image source={UserImg} style={styles.img} />
            </View>
            <View style={styles.userInfo}>
              <Text style={[styles.userName, (lang == 'ar')?{textAlign: 'right'}:'']}>{userData.first_name} {userData.last_name}</Text>
              <Text style={[styles.userMail, (lang == 'ar')?{textAlign: 'right'}:'']}>{userData.email}</Text>
              <TouchableOpacity style={styles.userBtnEdit} onPress={() => navigation.navigate(ROUTES.My_PROFILE, {user: userData})}>
              {
                  (lang == 'ar')?
                  <Text style={{color: COLORS.main_color}}>تعديل بيانات الصفحة الشخصية</Text>
                  :
                <Text style={{color: COLORS.main_color}}>Edit Profile Infotmation</Text>
                }
              </TouchableOpacity>
            </View>
          </View>
          <View style={[styles.box]}>
            <TouchableOpacity style={[styles.settingRow, (lang == 'ar')?{flexDirection: 'row-reverse'}:'']} onPress={() => openModal()}>
              <View style={[{display: 'flex', flexDirection: 'row', alignItems: 'center'}, (lang == 'ar')?{flexDirection: 'row-reverse'}:'']}>
                <Ionicons name="globe-outline" size={18} color={COLORS.main_color} style={[{fontWeight: 'bold', marginRight: 20},(lang == 'ar')?{marginRight: 0, marginLeft: 20}:'']} />
                {
                  (lang == 'ar')?
                  <Text style={{fontWeight: 'bold', color: COLORS.gray}}>لغة التطبيق</Text>:
                  <Text style={{fontWeight: 'bold', color: COLORS.gray}}>App Language</Text>
                }
              </View>
              <View style={[styles.settingOption, (lang == 'ar')?{flexDirection: 'row-reverse'}:'']}>
                {
                  (lang == 'ar')?
                  <Text style={{color: COLORS.gray}}>عربي</Text>:
                  <Text style={{color: COLORS.gray}}>English</Text>
                }
                <EvilIcon name={(lang == 'ar')?"chevron-left":"chevron-right"} size={25} color={COLORS.main_color} />
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.settingRow, {borderBottomWidth: 0}, (lang == 'ar')?{flexDirection: 'row-reverse'}:'']} onPress={() => openThemeModal()}>
              <View style={[{display: 'flex', flexDirection: 'row', alignItems: 'center'}, (lang == 'ar')?{flexDirection: 'row-reverse'}:'']}>
                <Ionicons name="color-palette" size={18} color={COLORS.main_color} style={[{fontWeight: 'bold', marginRight: 20},(lang == 'ar')?{marginRight: 0, marginLeft: 20}:'']} />
                {
                  (lang == 'ar')?
                  <Text style={{fontWeight: 'bold', color: COLORS.gray}}>الوان التطبيق</Text>:
                  <Text style={{fontWeight: 'bold', color: COLORS.gray}}>Theme</Text>
                }
              </View>
              <View style={[styles.settingOption, (lang == 'ar')?{flexDirection: 'row-reverse'}:'']}>
                {
                  (theme == 'light')?
                  <Text style={{color: COLORS.gray}}>Light</Text>:
                  <Text style={{color: COLORS.gray}}>Dark</Text>
                }
                <EvilIcon name={(lang == 'ar')?"chevron-left":"chevron-right"} size={25} color={COLORS.main_color} />
              </View>
            </TouchableOpacity>
          </View>
          <View style={[styles.box]}>
            <TouchableOpacity style={[styles.settingRow, {borderBottomWidth: 0}, (lang == 'ar')?{flexDirection: 'row-reverse'}:'']} onPress={() => signOut()}>
              <View style={[{display: 'flex', flexDirection: 'row', alignItems: 'center'}, (lang == 'ar')?{flexDirection: 'row-reverse'}:'']}>
                <Octicons name="sign-out" size={18} color={COLORS.main_color} style={[{fontWeight: 'bold', marginRight: 20},(lang == 'ar')?{marginRight: 0, marginLeft: 20}:'']} />
                {
                  (lang == 'ar')?
                  <Text style={{fontWeight: 'bold', color: COLORS.gray}}>تسجيل خروج</Text>:
                  <Text style={{fontWeight: 'bold', color: COLORS.gray}}>Sign Out</Text>
                }
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      <SwipeUpDownModal
              modalVisible={ShowComment}
              PressToanimate={animateModal}
              // HeaderContent={
              //   <View style={styles.containerHeader}>
              //         <TouchableOpacity onPress={() => {
              //               setanimateModal(false);
              //               setShowModelComment(false);
              //             }}>
              //           <Entypo name='minus' color={COLORS.white} size={50} />
              //         </TouchableOpacity>
              //   </View>
              // }
              //if you don't pass HeaderContent you should pass marginTop in view of ContentModel to Make modal swipeable
              ContentModal={
                <View>
                  <View style={styles.containerContent}>
                      <TouchableOpacity style={styles.langBtn} onPress={() => changeLanguage('ar')}>
                        <Text style={{color: COLORS.gray}}>Arabic</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={[styles.langBtn, {borderBottomWidth: 0}]} onPress={() => changeLanguage('en')}>
                        <Text style={{color: COLORS.gray}}>English</Text>
                      </TouchableOpacity>
                  </View>
                  <TouchableOpacity style={styles.ModalBtnClose} onPress={()=> closePopupModal()}>
                    <Text style={{color: COLORS.white, textAlign: 'center',fontWeight: 'bold'}}>Close</Text>
                  </TouchableOpacity>
                </View>
              }
              HeaderStyle={styles.headerContent}
              ContentModalStyle={styles.Modal}
              onClose={() => {
                setShowModelComment(false);
                  setanimateModal(false);
              }}
            />

      <SwipeUpDownModal
              modalVisible={ShowThemeComment}
              PressToanimate={animateThemeModal}
              // HeaderContent={
              //   <View style={styles.containerHeader}>
              //         <TouchableOpacity onPress={() => {
              //               setanimateModal(false);
              //               setShowModelComment(false);
              //             }}>
              //           <Entypo name='minus' color={COLORS.white} size={50} />
              //         </TouchableOpacity>
              //   </View>
              // }
              //if you don't pass HeaderContent you should pass marginTop in view of ContentModel to Make modal swipeable
              ContentModal={
                <View>
                  <View style={styles.containerContent}>
                      <TouchableOpacity style={styles.langBtn} onPress={() => changeTheme('light')}>
                        <Text style={{color: COLORS.gray}}>Light</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={[styles.langBtn, {borderBottomWidth: 0}]} onPress={() => changeTheme('dark')}>
                        <Text style={{color: COLORS.gray}}>Dark</Text>
                      </TouchableOpacity>
                  </View>
                  <TouchableOpacity style={styles.ModalBtnClose} onPress={()=> closePopupModal()}>
                    <Text style={{color: COLORS.white, textAlign: 'center',fontWeight: 'bold'}}>Close</Text>
                  </TouchableOpacity>
                </View>
              }
              HeaderStyle={styles.headerContent}
              ContentModalStyle={styles.Modal}
              onClose={() => {
                setShowThemeModelComment(false);
                  setanimateThemeModal(false);
              }}
            />
        </View>
      }
    </SafeAreaView>
  </>
  );
};

export default Settings;

const styles = StyleSheet.create({
  settingWrapper: {
    padding: 20
  },
  box: {
    backgroundColor: COLORS.white,
    shadowColor: COLORS.gray,
    elevation: 8,
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  userInfoBox: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20
  },
  userImg: {
    width: 50,
    height: 50,
    borderRadius: 50,
    overflow: 'hidden',
    marginRight: 20
  },
  img: {
    width: "100%",
    height: "100%",
    resizeMode: "contain"
  },
  userInfo: {

  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.blackLight,
    marginBottom: 10
  },
  userMail: {
    marginBottom: 10,
    color: COLORS.gray
  },
  userBtnEdit: {
    
  },
  settingRow:{
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomColor: COLORS.main_bg,
    borderBottomWidth: 1
  },
  settingOption:{
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  containerContent: {
    flex: 1,
    width: FULL_WIDTH-40,
    // height: 150,
    margin: 20,
    marginBottom: 10,
    backgroundColor: COLORS.white,
    borderRadius: 10
  },
  headerContent:{
    marginTop: 0,
    backgroundColor: COLORS.main_bg
  },
  Modal: {
    position: 'absolute',
    bottom: 0,
    left: 0,
  },
  langBtn:{
    padding: 20,
    borderBottomColor: COLORS.main_bg,
    borderBottomWidth: 1,
  },
  ModalBtnClose:{
    backgroundColor: COLORS.danger,
    margin: 20,
    marginTop: 0,
    width: FULL_WIDTH-40,
    padding: 15,
    borderRadius: 10
  }
});
