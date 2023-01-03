import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  SafeAreaView,
  TouchableOpacity,
  Image,
  ToastAndroid
} from 'react-native';
import { useToast } from 'react-native-toast-notifications';
import Toast from "react-native-toast-notifications";
import ToastProvider from 'react-native-toast-notifications';
import LinearGradient from 'react-native-linear-gradient';
import {COLORS, ROUTES} from '../../constants';
import Logo from '../../assets/icons/LOGO.png';
import {useNavigation} from '@react-navigation/native';
import Axios from 'react-native-axios/lib/core/Axios';
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Data from '../../data.json';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loading from '../../components/Loading';

const Login = props => {
  // const {navigation} = props;
  const navigation = useNavigation();
  const [dataLogin, setDataLogin] = useState({email: '', password: ''});
  const [loading, setLoading] = useState(true);
  const [secureTextEntry, setSecureTextEntry] = useState(true);

  const handleLogin = async () => {
    if(dataLogin.email != '' && dataLogin.password != ''){
      Data.users.map(async user => {
        if(user.email != dataLogin.email && user.password != dataLogin.password){
          ToastAndroid.show('Email or password invalid',ToastAndroid.LONG);
        }else{
          if(user.email == dataLogin.email && user.password == dataLogin.password){
            const user_data = user;
            if(user_data){
              await AsyncStorage.setItem('user_id', JSON.stringify(user_data.id));
              navigation.navigate(ROUTES.HOME)
              ToastAndroid.show('Login Success and session started',ToastAndroid.LONG);
            }
          }
        }
      })
    }else{
      ToastAndroid.show('Fill your data',ToastAndroid.SHORT);
    }
  }

  const checkUser = async () => {
    const user_id = await AsyncStorage.getItem('user_id');
    if(user_id){
      Data.users.map(user => {
        if(user.id == user_id){
          const user_data = user;
          if(user_data.status == 1){
            navigation.navigate(ROUTES.HOME)
            setLoading(false)
          }
        }
      });
    }else{
      setLoading(false)
    }
  }


  const showToast = (message, types) => {
    useToast.show({
      text: message,
      buttonText: "Okay",
      type: types == "warning" ? "warning":"success",
      duration: 5000,
      position: "bottom"
    })
  }

  const toggleSecureTextEntry = () => {
    (secureTextEntry)?setSecureTextEntry(false):setSecureTextEntry(true)
  }

  useEffect(() => {
    checkUser();
  }, [])
  return (
    <SafeAreaView style={styles.main}>
      {
      (loading)?<Loading />:
      <View style={styles.container}>
        <View style={styles.wFull}>
          <View style={styles.row}>
            <Image source={Logo} style={styles.logo}/>
            {/* <Text style={styles.brandName}>Kasheed</Text> */}
          </View>

          <Text style={styles.loginContinueTxt}>Login to continue</Text>
          <TextInput style={styles.input} placeholder="Email" 
          onChangeText={(text) => {setDataLogin({...dataLogin, email: text})}}
          placeholderTextColor="#333"
          />
          <View>
            <TextInput style={styles.input} placeholder="Password" 
            onChangeText={(text) => {setDataLogin({...dataLogin, password: text})}}
            placeholderTextColor="#333"
            textContentType={'password'}
            secureTextEntry={secureTextEntry}
            />
            <TouchableOpacity style={styles.eye} onPress={()=> toggleSecureTextEntry()}>
              <FontAwesome name={(secureTextEntry)?"eye":"eye-slash"} size={20} />
            </TouchableOpacity>
          </View>
          <View style={styles.loginBtnWrapper}>
            <TouchableOpacity
                onPress={() =>handleLogin()}
                activeOpacity={0.7}
                style={styles.loginBtn}>
                <Text style={styles.loginText}>Log In</Text>
            </TouchableOpacity>
          </View>

          {/***************** FORGOT PASSWORD BUTTON *****************/}
          <TouchableOpacity
            onPress={() =>
              navigation.navigate(ROUTES.FORGOT_PASSWORD, {
                userId: 'X0001',
              })
            }
            style={styles.forgotPassBtn}>
            <Text style={styles.forgotPassText}>Forgot Password?</Text>
          </TouchableOpacity>
        </View>
        <Toast/>
        <View style={styles.footer}>
          <Text style={styles.footerText}> Don't have an account? </Text>
          {/******************** REGISTER BUTTON *********************/}
          <TouchableOpacity
            onPress={() => navigation.navigate(ROUTES.REGISTER)}>
            <Text style={styles.signupBtn}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
      }
    </SafeAreaView>
  );
};

export default Login;

const styles = StyleSheet.create({
  logo:{
    width: 150,
    height: 150,  
  },
  main: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    // backgroundColor: COLORS.white
  },
  container: {
    padding: 15,
    width: '100%',
    position: 'relative',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandName: {
    fontSize: 42,
    textAlign: 'center',
    fontWeight: 'bold',
    color: COLORS.primary,
    opacity: 0.9,
  },
  loginContinueTxt: {
    fontSize: 21,
    textAlign: 'center',
    color: COLORS.gray,
    marginBottom: 16,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.grayLight,
    padding: 15,
    marginVertical: 10,
    borderRadius: 5,
    height: 55,
    paddingVertical: 0,
    color: '#333',
  },
  eye:{
    position: 'absolute',
    top: 25,
    right: 20,
  },
  // Login Btn Styles
  loginBtnWrapper: {
    height: 55,
    marginTop: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.4,
    shadowRadius: 3,
    elevation: 5,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  linearGradient: {
    width: '100%',
    borderRadius: 50,
  },
  loginBtn: {
    backgroundColor: COLORS.main_color,
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    width: '90%',
    height: 55,
    borderRadius: 10

  },
  loginText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '400',
  },
  forgotPassText: {
    color: COLORS.main_color,
    textAlign: 'center',
    fontWeight: 'bold',
    marginTop: 15,
  },
  // footer
  footer: {
    position: 'absolute',
    bottom: 20,
    textAlign: 'center',
    flexDirection: 'row',
  },
  footerText: {
    color: COLORS.gray,
    fontWeight: 'bold',
  },
  signupBtn: {
    color: COLORS.main_color,
    fontWeight: 'bold',
  },
  // utils
  wFull: {
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  mr7: {
    marginRight: 7,
  },
});
