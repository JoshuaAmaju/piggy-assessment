import {useHeaderHeight} from '@react-navigation/elements';
import {useRoute} from '@react-navigation/native';
import {
  Box,
  Button,
  Center,
  HStack,
  Image,
  Radio,
  ScrollView,
  Text,
  VStack,
} from 'native-base';
import React, {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import {
  decrementQuantity,
  incrementQuantity,
  RootState,
} from '../ecommerce/cart';

import {Category, Meal as IMeal} from '../ecommerce/types';

const imageSize = 40;

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

  const headerHeight = useHeaderHeight();

  const dispatch = useDispatch();

  const cartItems = useSelector((state: RootState) => state.cart.items);

  const [selectedPrice, setSelectedPrice] = useState<number>(12.99);

  if (!params?.item) {
    return null;
  }

  const meal = params.item;
  const category = params.category;

  const item = cartItems.find(item => item.value.idMeal === meal.idMeal);

  const quantity = item?.quantity ?? 0;

  // Use a scrollview to make the screen scrollable in landscape orientation
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      _contentContainerStyle={{minH: 'full', paddingTop: headerHeight / 2}}>
      <Center zIndex={2} position="relative">
        <Image
          w={imageSize}
          h={imageSize}
          alt={meal.strMeal}
          borderRadius="full"
          source={{uri: meal.strMealThumb}}
        />
      </Center>

      <VStack
        p={6}
        flex={1}
        space={6}
        bg="white"
        mt={-(imageSize / 2)}
        borderTopRadius="3xl">
        <VStack flex={1} space={6}>
          {/* Put a placeholder here to fill in the required space for the image above
            to give accurate result when we offset this container it upwards to five the desired effect */}
          <Box w={imageSize / 2} h={imageSize / 2} />

          <VStack space={4} alignItems="center">
            <Text bold fontSize="2xl" textAlign="center" numberOfLines={3}>
              {meal.strMeal}
            </Text>

            {category && (
              <HStack alignItems="center" space={3}>
                <Image
                  w={7}
                  h={7}
                  alt={category.strCategoryDescription}
                  source={{uri: category.strCategoryThumb}}
                />
                <Text color="gray.400">{category.strCategory}</Text>
              </HStack>
            )}

            <HStack space={4} alignItems="center">
              <Text>15 min</Text>

              <Box w="1" h="1" bg="gray.300" borderRadius="full" />

              <Text bold>4.8</Text>
            </HStack>
          </VStack>

          <Radio.Group
            name="price"
            value={selectedPrice?.toString()}
            onChange={val => {
              setSelectedPrice(parseFloat(val));
            }}>
            <HStack space={3}>
              {prices.map((price, i) => {
                return (
                  <Radio
                    key={i}
                    value={price.value.toString()}
                    _stack={{
                      p: 4,
                      borderWidth: 1,
                      borderRadius: 20,
                      flexDirection: 'column',
                      borderColor:
                        selectedPrice === price.value ? '#529F83' : 'gray.200',
                    }}>
                    <VStack mt={4} space={2}>
                      <Text textAlign="center">{price.label}</Text>
                      <Text textAlign="center">${price.value}</Text>
                    </VStack>
                  </Radio>
                );

                // return (
                //   <VStack
                //     p={4}
                //     key={i}
                //     space={4}
                //     borderWidth={1}
                //     borderRadius={20}
                //     alignItems="center"
                //     borderColor="gray.200">
                //     <Radio value={price.value.toString()} />

                //     <VStack space={2}>
                //       <Text textAlign="center">{price.label}</Text>
                //       <Text textAlign="center">
                //         <Text color="#529F83">$</Text>
                //         {price.value}
                //       </Text>
                //     </VStack>
                //   </VStack>
                // );
              })}
            </HStack>
          </Radio.Group>

          <Text textAlign="center" color="gray.400">
            {meal.strMeal}
          </Text>
        </VStack>

        <VStack space={4}>
          <HStack space={2} alignItems="center" justifyContent="space-between">
            <Text bold>
              Total: <Text color="#529F83">$</Text>
              {selectedPrice * quantity}
            </Text>

            <HStack space={2} alignItems="center">
              <Button
                py={1}
                px={2.5}
                borderRadius="lg"
                variant="outline"
                onPress={() => {
                  dispatch(decrementQuantity(meal.idMeal));
                }}>
                -
              </Button>
              <Text>{quantity}</Text>
              <Button
                py={1}
                px={2.5}
                borderRadius="lg"
                variant="outline"
                onPress={() => {
                  dispatch(incrementQuantity(meal.idMeal));
                }}>
                +
              </Button>
            </HStack>
          </HStack>

          <Button p="4" borderRadius="xl" bg="#529F83">
            Next
          </Button>
        </VStack>
      </VStack>
    </ScrollView>
  );
}
