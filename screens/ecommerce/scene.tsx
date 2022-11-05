import {Link, useNavigation} from '@react-navigation/native';
import {
  Box,
  Button,
  Center,
  FlatList,
  HStack,
  IconButton,
  Image,
  Input,
  ScrollView,
  Spinner,
  Text,
  VStack,
} from 'native-base';
import React, {useCallback, useLayoutEffect, useMemo, useState} from 'react';

import {cycle, RootState} from './cart';

import Clock from '../../assets/clock.svg';
import ShoppingBag from './assets/shopping.bag.svg';
import MagnifyingGlass from './assets/magnifying.glass.svg';
import AdjustmentsHorizontal from './assets/adjustments.horizontal.svg';

// import {MaterialIcons} from '@expo/vector-icons';

import {ListRenderItem, StyleSheet, TouchableOpacity} from 'react-native';
import {useQuery} from 'react-query';
import {useDispatch, useSelector} from 'react-redux';
import {Category, Meal} from './types';
import {getCategories, getMealsByCategory} from './query';

import {name as meal} from '../meal';

function Spacer() {
  return <Box w={3} />;
}

export function Ecommerce() {
  const navigator = useNavigation();

  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.items);

  const categories = useQuery(['categories'], getCategories, {
    select: data => data.slice(0, 6),
  });

  const [searchTerm, setSearchTerm] = useState<string>();

  const [_selectedCategory, setSelectedCategory] =
    useState<Category['strCategory']>();

  const initialSelectedCategory = categories.data?.[0].strCategory;

  const selectedCategory = _selectedCategory || initialSelectedCategory;

  // Only fetch items in selected category if a category is selected
  const meals = useQuery(
    ['meals', selectedCategory],
    () => getMealsByCategory(selectedCategory!),
    {
      enabled: !!selectedCategory,
      select: data => data.slice(0, 5),
    },
  );

  const searchResult = useMemo(() => {
    return searchTerm
      ? meals.data?.filter(meal => {
          return meal.strMeal
            .toLowerCase()
            .includes(searchTerm.toLocaleLowerCase());
        })
      : meals.data;
  }, [meals.data, searchTerm]);

  const renderCategory = useCallback<ListRenderItem<Category>>(
    ({item}) => {
      const selected = selectedCategory === item.strCategory;

      return (
        <TouchableOpacity
          onPress={() => setSelectedCategory(item.strCategory)}
          style={[styles.category, selected && styles.selectedCategory]}>
          <Image
            style={styles.categoryThumb}
            alt={item.strCategoryDescription}
            source={{uri: item.strCategoryThumb}}
          />

          <Text
            fontSize="md"
            style={[
              styles.categoryTitle,
              selected && styles.selectedCategoryTitle,
            ]}>
            {item.strCategory}
          </Text>
        </TouchableOpacity>
      );
    },
    [selectedCategory],
  );

  const renderMeal = useCallback<ListRenderItem<Meal>>(
    ({item}) => {
      return (
        <TouchableOpacity
          style={styles.meal}
          onPress={() => {
            // @ts-ignore
            navigator.navigate(meal, {
              item,
              category: categories.data?.find(
                item => item.strCategory === selectedCategory,
              ),
            });
          }}>
          <VStack space={6} justifyContent="space-between">
            <VStack py={2} space={1} alignItems="center">
              <Text
                fontSize="md"
                maxWidth={200}
                numberOfLines={2}
                style={styles.mealTitle}>
                {item.strMeal}
              </Text>

              <Text fontSize="md" style={styles.mealTitle}>
                <Text color="#529F83">$</Text>9.99
              </Text>
            </VStack>

            <Image
              alt={item.strMeal}
              alignSelf="center"
              style={styles.mealThumb}
              source={{uri: item.strMealThumb}}
            />

            <HStack
              space={2}
              alignItems="center"
              justifyContent="space-between">
              <VStack space={1}>
                <Text fontWeight="semibold">🔥 44 calories</Text>

                <HStack space={1} alignItems="center">
                  <Clock width={20} height={20} color="#7E7E7F" />
                  <Text color="#7E7E7F">20 min</Text>
                </HStack>
              </VStack>

              <IconButton
                bg="white"
                borderRadius="xl"
                onPress={() => dispatch(cycle(item))}
                icon={<ShoppingBag width={20} height={20} color="#000" />}
              />
            </HStack>
          </VStack>
        </TouchableOpacity>
      );
    },
    [categories.data, dispatch, navigator, selectedCategory],
  );

  useLayoutEffect(() => {
    navigator.setOptions({
      headerTitle: () => (
        <VStack py={4}>
          <Text bold fontSize="lg" color="gray.400">
            Hi Joshua
          </Text>
          <Text fontWeight="extraBlack" fontSize="2xl">
            Hungry Now? 🔥
          </Text>
        </VStack>
      ),
      headerRight: () => <Box w={10} h={10} bg="#529F83" borderRadius="full" />,
    });
  }, [navigator]);

  return (
    <VStack flex={1}>
      <ScrollView
        _contentContainerStyle={{py: '6'}}
        showsVerticalScrollIndicator={false}>
        <VStack flex={1} space={6}>
          <Box px="6">
            <Input
              // p="4"
              borderRadius={20}
              borderColor="#E6E5E5"
              placeholder="Search.."
              _stack={{px: '4', py: '2'}}
              onChangeText={setSearchTerm}
              InputLeftElement={
                <Box>
                  <MagnifyingGlass width={25} height={25} color="#000" />
                </Box>
              }
              InputRightElement={
                <Box>
                  <AdjustmentsHorizontal width={25} height={25} color="#000" />

                  <Center
                    w={6}
                    h={6}
                    top={-8}
                    right={-8}
                    bg="#529F83"
                    borderWidth={2}
                    borderRadius="full"
                    position="absolute"
                    borderColor="white">
                    <Text color="white" fontSize={12} textAlign="center">
                      2
                    </Text>
                  </Center>
                </Box>
              }
            />
          </Box>

          <VStack space={6}>
            {categories.data ? (
              <FlatList
                horizontal
                data={categories.data}
                renderItem={renderCategory}
                ItemSeparatorComponent={Spacer}
                _contentContainerStyle={{px: '6'}}
                keyExtractor={item => item.idCategory}
                showsHorizontalScrollIndicator={false}
              />
            ) : (
              <Center p={4}>
                {categories.isLoading ? (
                  <Spinner />
                ) : categories.isError ? (
                  <VStack space={2}>
                    <Text fontSize="lg">An error occurred</Text>
                    <Button
                      px="4"
                      size="sm"
                      variant="outline"
                      onPress={() => categories.refetch()}>
                      Retry
                    </Button>
                  </VStack>
                ) : null}
              </Center>
            )}

            {meals.data ? (
              <VStack space={4}>
                <HStack
                  px="6"
                  space={2}
                  alignItems="center"
                  justifyContent="space-between">
                  <Text bold fontSize="2xl">
                    Popular Items
                  </Text>

                  <Link to={{screen: ''}}>
                    <Text color="gray.400">See All</Text>
                  </Link>
                </HStack>

                <FlatList
                  horizontal
                  renderItem={renderMeal}
                  data={searchResult ?? meals.data}
                  keyExtractor={item => item.idMeal}
                  _contentContainerStyle={{px: '6', minW: '100%'}}
                  ListEmptyComponent={() => (
                    <Center p="4" w="full">
                      <Text fontSize="2xl" color="gray.300">
                        No matching result
                      </Text>
                    </Center>
                  )}
                  ItemSeparatorComponent={() => <Box w={5} />}
                />
              </VStack>
            ) : (
              <Center p={4}>
                {meals.isLoading ? (
                  <Spinner size="lg" />
                ) : meals.isError ? (
                  <VStack space={2}>
                    <Text fontSize="xl">An error occurred</Text>
                    <Button px="4" size="sm" onPress={() => meals.refetch()}>
                      Retry
                    </Button>
                  </VStack>
                ) : null}
              </Center>
            )}
          </VStack>
        </VStack>
      </ScrollView>

      <HStack
        p={6}
        mx="6"
        mb="6"
        bg="#529F83"
        borderRadius={25}
        alignItems="center"
        justifyContent="space-between">
        <VStack>
          <Text bold fontSize="2xl" color="white">
            Cart
          </Text>

          <Text fontWeight="medium" fontSize="md" color="gray.200">
            {cartItems.length} items
          </Text>
        </VStack>

        <HStack space={2}>
          {cartItems.slice(0, 2).map(item => {
            return (
              <Image
                borderWidth={4}
                borderRadius="full"
                borderColor="white"
                key={item.value.idMeal}
                alt={item.value.strMeal}
                style={{width: 50, height: 50}}
                source={{uri: item.value.strMealThumb}}
              />
            );
          })}
        </HStack>
      </HStack>
    </VStack>
  );
}

const styles = StyleSheet.create({
  category: {
    width: 90,
    borderWidth: 1,
    borderRadius: 20,
    alignItems: 'center',
    paddingVertical: 13,
    paddingHorizontal: 10,
    borderColor: '#E6E7E7',
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  selectedCategory: {
    borderWidth: 0,
    backgroundColor: '#529F83',
  },
  categoryThumb: {
    width: 30,
    height: 30,
  },
  categoryTitle: {
    marginTop: 5,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  selectedCategoryTitle: {
    color: '#fff',
  },
  meal: {
    minWidth: 230,
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 25,
    backgroundColor: '#F8F9F9',
  },
  mealThumb: {
    width: 120,
    height: 120,
    borderRadius: 100,
  },
  mealTitle: {
    // maxWidth: '70%',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
