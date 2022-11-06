import {configureStore, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {persistStore, persistReducer} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {Meal} from './types';

type Item = {
  value: Meal;
  quantity: number;
};

export type State = {
  items: Array<Item>;
};

const cartSlice = createSlice({
  name: 'cart',
  initialState: {items: []} as State,
  reducers: {
    add: (state, action: PayloadAction<Meal>) => {
      state.items.push({value: action.payload, quantity: 1});
    },
    remove: (state, action: PayloadAction<Meal['idMeal']>) => {
      state.items = state.items.filter(
        meal => meal.value.idMeal !== action.payload,
      );
    },
    cycle: (state, action: PayloadAction<Meal>) => {
      // Add item to cart if not present. Or remove from cart if present

      const existingItem = state.items.find(
        meal => meal.value.idMeal === action.payload.idMeal,
      );

      if (existingItem) {
        state.items = state.items.filter(
          meal => meal.value.idMeal !== action.payload.idMeal,
        );
      } else {
        state.items.push({value: action.payload, quantity: 1});
      }
    },
    incrementQuantity: (state, action: PayloadAction<Meal['idMeal']>) => {
      const existingItem = state.items.findIndex(
        meal => meal.value.idMeal === action.payload,
      );

      if (existingItem > -1) {
        const item = state.items[existingItem];
        state.items[existingItem] = {...item, quantity: item.quantity + 1};
      }
    },
    decrementQuantity: (state, action: PayloadAction<Meal['idMeal']>) => {
      const existingItem = state.items.findIndex(
        meal => meal.value.idMeal === action.payload,
      );

      if (existingItem > -1) {
        const item = state.items[existingItem];

        if (item.quantity > 0) {
          state.items[existingItem] = {...item, quantity: item.quantity - 1};
        }
      }
    },
  },
});

export const {add, remove, cycle, incrementQuantity, decrementQuantity} =
  cartSlice.actions;

const persistedReducer = persistReducer(
  {
    key: 'cart',
    storage: AsyncStorage,
  },
  cartSlice.reducer,
);

export const store = configureStore({
  reducer: {cart: persistedReducer},
});

// let _store = createStore(persistedReducer);

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
