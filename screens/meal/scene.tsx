import {useHeaderHeight} from '@react-navigation/elements';
import {useRoute} from '@react-navigation/native';
import {
  Box,
  Button,
  Center,
  HStack,
  Image,
  Radio,
  Text,
  View,
  VStack,
} from 'native-base';
import React from 'react';

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

  if (!params?.item) {
    return null;
  }

  const meal = params.item;
  const category = params.category;

  return (
    <View flex={1} style={{marginTop: headerHeight / 2}}>
      <Center zIndex={2} position="relative">
        <Image
          w={imageSize}
          h={imageSize}
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

          <VStack alignItems="center">
            <Text bold fontSize="2xl" textAlign="center">
              {meal.strMeal}
            </Text>

            {category && (
              <HStack alignItems="center" space={3}>
                <Image
                  w={10}
                  h={10}
                  source={{uri: category.strCategoryThumb}}
                />
                <Text>{category.strCategory}</Text>
              </HStack>
            )}

            <HStack space={4} alignItems="center">
              <Text>15 min</Text>

              <Box w="1" h="1" bg="gray.300" borderRadius="full" />

              <Text bold>4.8</Text>
            </HStack>
          </VStack>

          <Radio.Group name="price" value="12.99" onChange={() => {}}>
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
                      borderColor: 'gray.200',
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
              9.99
            </Text>

            <HStack space={2} alignItems="center">
              <Button py={1} variant="outline">
                -
              </Button>
              <Text>20</Text>
              <Button py={1} variant="outline">
                +
              </Button>
            </HStack>
          </HStack>

          <Button p="4" borderRadius="xl" bg="#529F83">
            Next
          </Button>
        </VStack>
      </VStack>
    </View>
  );
}
