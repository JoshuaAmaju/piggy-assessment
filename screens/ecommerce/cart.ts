import {configureStore, createSlice, PayloadAction} from '@reduxjs/toolkit';
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
  initialState: {items: []},
  reducers: {
    add: (state, action: PayloadAction<Meal>) => {},
    remove: (state, action: PayloadAction<Meal['idMeal']>) => {},
    incrementQuantity: (state, action: PayloadAction<Meal['idMeal']>) => {},
    decrementQuantity: (state, action: PayloadAction<Meal['idMeal']>) => {},
  },
});

export const {add, remove} = cartSlice.actions;

export const store = configureStore({
  reducer: {cart: cartSlice.reducer},
});
