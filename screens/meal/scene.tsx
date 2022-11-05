import {useRoute} from '@react-navigation/native';
import {
  Box,
  Button,
  Checkbox,
  HStack,
  Image,
  Text,
  View,
  VStack,
} from 'native-base';
import React from 'react';
import {Category, Meal as IMeal} from '../ecommerce/types';

const prices = [
  {
    value: 9.99,
    label: 'Small 8"',
  },
  {
    value: 12.99,
    label: 'Medium 12"',
  },
  {
    value: 16.99,
    label: 'Large 18"',
  },
];

export function Meal() {
  const params = useRoute().params as
    | {item: IMeal; category: Category}
    | undefined;

  if (!params?.item) {
    return null;
  }

  const meal = params.item;
  const category = params.category;

  return (
    <View bg="white" borderTopRadius="xl">
      <Image source={{uri: meal.strMealThumb}} />

      <VStack>
        <Text>{meal.strMeal}</Text>

        {category && <Text>{category.strCategory}</Text>}

        <HStack space={4}>
          <Text>15 min</Text>

          <Box w={2} h={2} bg="gray.500" borderRadius="full" />

          <Text>4.8</Text>
        </HStack>
      </VStack>

      <HStack space={3}>
        {prices.map(price => {
          return (
            <VStack
              p={4}
              borderWidth={1}
              borderRadius={20}
              borderColor="gray.200">
              <Checkbox isChecked value={price.value.toString()} />

              <VStack>
                <Text>{price.label}</Text>
                <Text>
                  <Text color="#529F83">$</Text>
                  {price.value}
                </Text>
              </VStack>
            </VStack>
          );
        })}
      </HStack>

      <Text textAlign="center" color="gray.300">
        {meal.strMeal}
      </Text>

      <VStack>
        <HStack space={2} alignItems="center" justifyContent="space-between">
          <Text>
            Total: <Text color="#529F83">$</Text>
            9.99
          </Text>

          <HStack space={2} alignItems="center">
            <Button>-</Button>
            <Text>20</Text>
            <Button>+</Button>
          </HStack>
        </HStack>

        <Button borderRadius="lg" bg="#529F83">
          Next
        </Button>
      </VStack>
    </View>
  );
}
