import React from 'react';

import {NavigationContainer, useNavigation} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {Center, IconButton, NativeBaseProvider, Spinner} from 'native-base';

import * as onboarding from './screens/onboarding';
import * as ecommerce from './screens/ecommerce';
import * as meal from './screens/meal';

import {store as cart, persistor} from './screens/ecommerce/cart';

import {QueryClient, QueryClientProvider} from 'react-query';
import {Provider} from 'react-redux';

import ChevronLeft from './assets/chevron.left.svg';
import {HeaderBackButtonProps} from '@react-navigation/elements';

import {PersistGate} from 'redux-persist/integration/react';

const Root = createNativeStackNavigator();
const Stack = createNativeStackNavigator();

const client = new QueryClient();

function BackButton(props: HeaderBackButtonProps) {
  const nav = useNavigation();

  return (
    <IconButton
      style={props.style}
      disabled={props.disabled}
      onPress={() => nav.goBack()}
      _pressed={{bg: props.pressColor, opacity: props.pressOpacity}}
      icon={<ChevronLeft width={20} height={20} color={props.tintColor} />}
    />
  );
}

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
                  <PersistGate
                    persistor={persistor}
                    loading={
                      <Center flex={1}>
                        <Spinner size="lg" color="#529F83" />
                      </Center>
                    }>
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
                          headerLeft: props =>
                            props.canGoBack && <BackButton {...props} />,
                        }}
                      />
                    </Stack.Navigator>
                  </PersistGate>
                </Provider>
              </QueryClientProvider>
            )}
          </Root.Screen>
        </Root.Navigator>
      </NavigationContainer>
    </NativeBaseProvider>
  );
}
