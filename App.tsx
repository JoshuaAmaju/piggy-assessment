import React from 'react';

import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {NativeBaseProvider} from 'native-base';

import * as onboarding from './screens/onboarding';
import * as ecommerce from './screens/ecommerce';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NativeBaseProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{headerShadowVisible: false}}>
          <Stack.Screen
            name={onboarding.name}
            component={onboarding.Scene}
            options={{headerShown: false}}
          />

          <Stack.Screen name={ecommerce.name}>
            {() => <ecommerce.Scene />}
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    </NativeBaseProvider>
  );
}
