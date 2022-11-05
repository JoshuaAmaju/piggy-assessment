import React from 'react';

import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {NativeBaseProvider} from 'native-base';

import * as onboarding from './screens/onboarding';
import * as ecommerce from './screens/ecommerce';
import * as meal from './screens/meal';

import {store as cart} from './screens/ecommerce/cart';

import {QueryClient, QueryClientProvider} from 'react-query';
import {Provider} from 'react-redux';

const Root = createNativeStackNavigator();
const Stack = createNativeStackNavigator();

const client = new QueryClient();

export default function App() {
  return (
    <NativeBaseProvider>
      <NavigationContainer>
        <Root.Navigator screenOptions={{headerShown: false}}>
          <Root.Screen name={onboarding.name} component={onboarding.Scene} />

          <Root.Screen name={ecommerce.name}>
            {() => (
              <QueryClientProvider client={client}>
                <Provider store={cart}>
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
                    <Stack.Screen
                      name={meal.name}
                      component={meal.Scene}
                      options={{
                        title: '',
                        headerTintColor: '#fff',
                        headerTransparent: true,
                        contentStyle: {backgroundColor: '#529F83'},
                      }}
                    />
                  </Stack.Navigator>
                </Provider>
              </QueryClientProvider>
            )}
          </Root.Screen>
        </Root.Navigator>
      </NavigationContainer>
    </NativeBaseProvider>
  );
}
