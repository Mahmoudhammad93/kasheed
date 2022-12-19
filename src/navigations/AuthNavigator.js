import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {Login, ForgotPassword, Register, Invoices, invoiceDetails, KasheedHome, Products, ProductDetails, Clients, Profile, Cart, Payment, Success} from '../screens';
import {COLORS, ROUTES} from '../constants';
import DrawerNavigator from './DrawerNavigator';

const Stack = createStackNavigator();
// Navigator, Screen, Group

function AuthNavigator() {
  return (
    <Stack.Navigator screenOptions={{}} initialRouteName={ROUTES.LOGIN}>
      <Stack.Screen
        name={ROUTES.FORGOT_PASSWORD}
        component={ForgotPassword}
        options={({route}) => ({
          headerTintColor: COLORS.white,
          // headerBackTitle: 'Back',
          headerBackTitleVisible: false,
          headerStyle: {
            backgroundColor: COLORS.primary,
          },
          title: route.params.userId,
        })}
      />
      <Stack.Screen
        name={ROUTES.LOGIN}
        component={Login}
        options={{headerShown: false}}
      />
      <Stack.Screen name={ROUTES.REGISTER} component={Register} />
      <Stack.Screen
        name={ROUTES.HOME}
        component={DrawerNavigator}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={ROUTES.INVOICES}
        component={Invoices}
        options={{headerShown: true}}
      />
      <Stack.Screen
        name={ROUTES.INVOICE_DETAILS}
        component={invoiceDetails}
        options={{headerShown: true, headerStyle:{backgroundColor: COLORS.main_color}}}
      />
      <Stack.Screen
        name={ROUTES.KASHEED}
        component={KasheedHome}
        options={{headerShown: true}}
      />
      <Stack.Screen
        name={ROUTES.PRODUCTS}
        component={Products}
        options={{headerShown: true}}
      />

      <Stack.Screen
        name={ROUTES.PRODUCT_DETAILS}
        component={ProductDetails}
        options={{headerShown: true}}
      />

      <Stack.Screen
        name={ROUTES.CLIENTS}
        component={Clients}
        options={{headerShown: true}}
      />

      <Stack.Screen
        name={ROUTES.PROFILE}
        component={Profile}
        options={{headerShown: true}}
      />

      <Stack.Screen
        name={ROUTES.CART}
        component={Cart}
        options={{headerShown: true}}
      />
      <Stack.Screen
        name={ROUTES.PAYMENT}
        component={Payment}
        options={{headerShown: true, headerStyle:{backgroundColor: COLORS.main_color}}}
      />
      <Stack.Screen
        name={ROUTES.SUCCESS}
        component={Success}
        options={{headerShown: true, headerStyle:{backgroundColor: COLORS.main_color}, headerTitle: 'Payment Confirmation'}}
      />
    </Stack.Navigator>
  );
}

export default AuthNavigator;
