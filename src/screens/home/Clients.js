import React, { useEffect, useState } from 'react';
import {StyleSheet, Text, SafeAreaView, View, ScrollView, ListViewBase, Image, TextInput, TouchableOpacity, Dimensions} from 'react-native';
import { COLORS, ROUTES } from '../../constants';
import Data from '../../data.json';
import UserImg from '../../assets/user.jpg';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import LinearGradient from 'react-native-linear-gradient';

const FULL_WIDTH = Dimensions.get('window').width;
const FULL_HEIGHT = Dimensions.get('window').height;
const Clients = ({navigation}) => {
    const [searchValue, setSearchValue] = useState({value: ''});
    const [users, setUsers] = useState([]);
    const getUsersData = () => {
        setUsers(Data.users)
    }

    const search = () => {
        if(searchValue.value != ''){
          var value = searchValue.value.toUpperCase();
        //   const DATA_PRODUCTS = JSON.parse(await AsyncStorage.getItem('users'));
          const DATA_USERS = Data.users;
          const searchData = DATA_USERS.filter(row => {
            if(row.first_name.toUpperCase().indexOf(value) !== -1){
              return row;
            }
          })
          setUsers(searchData)
        }
    
      }


    useEffect(() => {
        getUsersData();
    }, []);
  return (
    <SafeAreaView>
      <View>
        <View style={[styles.wrapper, {marginLeft: 0}]} >
            <View style={styles.search}>
                <View style={styles.searchInput}>
                    <TextInput placeholderTextColor={COLORS.gray} style={styles.input} placeholder='Search Users ...'
                    onChangeText={(text) => {setSearchValue({...searchValue, value: text})}}
                    />
                    <TouchableOpacity style={styles.searchIcon} onPress={() => search()}>
                        <EvilIcons name='search' size={25} color={COLORS.black} />
                    </TouchableOpacity>
                </View>
            </View>
            <ScrollView>
                
                {
                    users.map((user, index) => {
                        var status;
                        var color;
                        if(user.status === 1){
                            status = 'Active';
                            color = COLORS.active_color
                        }else if(user.status === 0){
                            status = 'Inactive';
                            color = COLORS.danger
                        }else{
                            status = 'Pending';
                            color = COLORS.warning_color
                        }
                        return(
                            <TouchableOpacity key={index+1} onPress={() => navigation.navigate(ROUTES.PROFILE, {user: user, route: 'clients'})}>
                                <View style={styles.userRow}>
                                    <View style={styles.userImage}>
                                        <Image source={UserImg} style={styles.img} />
                                    </View>
                                    <View style={styles.userInfo}>
                                        <Text style={styles.name}>{user.first_name} {user.last_name}</Text>
                                        <Text style={styles.email}>{user.email}</Text>
                                        <Text style={[styles.status, {backgroundColor: color}]}>{status}</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        )
                    })
                }
            </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Clients;

const styles = StyleSheet.create({
    wrapper:{
        height: FULL_HEIGHT,
        paddingBottom: 60
    },
    search:{
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        padding: 10,
        marginBottom: 10
      },
      searchInput:{
        width: "100%",
        marginRight: 10,
        
      },
      input:{
        backgroundColor: COLORS.white,
        borderRadius: 5,
        paddingLeft: 65,
        color: COLORS.gray,
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 4,
        },
        shadowOpacity: 0.30,
        shadowRadius: 4.65,
    
        elevation: 6,
      },
      searchIcon:{
        position: 'absolute',
        top: 5,
        left: 5,
        elevation: 8,
        backgroundColor: COLORS.main_bg,
        padding: 10,
        borderRadius: 5
      },
    userRow:{
        display: 'flex',
        flexDirection: 'row',
        backgroundColor: COLORS.white,
        padding: 10,
        marginHorizontal: 10,
        marginBottom: 10,
        borderRadius: 5,
    },
    userImage: {
        width: 90,
        height: 90
    },
    img: {
        width: "100%",
        height: "100%"
    },
    userInfo: {
        padding: 10
    },
    name:{
      fontWeight: 'bold',
      color: COLORS.gray
    },
    email:{
        color: COLORS.main_color
    },
    status:{
        color: COLORS.white,
        borderRadius: 5,
        padding: 3,
        alignSelf: 'flex-start',
        marginTop: 10
    }
});
