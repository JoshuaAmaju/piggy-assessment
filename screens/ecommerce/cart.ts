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
        state.items.push(action.payload);
      }
    },
    incrementQuantity: (state, action: PayloadAction<Meal['idMeal']>) => {},
    decrementQuantity: (state, action: PayloadAction<Meal['idMeal']>) => {},
  },
});

export const {add, remove, incrementQuantity, decrementQuantity} =
  cartSlice.actions;

export const store = configureStore({
  reducer: {cart: cartSlice.reducer},
});
