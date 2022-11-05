import React from 'react';

import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {NativeBaseProvider} from 'native-base';

import * as onboarding from './screens/onboarding';
import * as ecommerce from './screens/ecommerce';

const Root = createNativeStackNavigator();
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NativeBaseProvider>
      <NavigationContainer>
        <Root.Navigator screenOptions={{headerShown: false}}>
          <Root.Screen name={onboarding.name} component={onboarding.Scene} />

          <Root.Screen name={ecommerce.name}>
            {() => (
              <Stack.Navigator
                screenOptions={{
                  headerShadowVisible: false,
                  contentStyle: {backgroundColor: '#fff'},
                }}>
                <Stack.Screen
                  name="root"
                  component={ecommerce.Scene}
                  options={{headerBackVisible: false}}
                />
              </Stack.Navigator>
            )}
          </Root.Screen>
        </Root.Navigator>
      </NavigationContainer>
    </NativeBaseProvider>
  );
}
