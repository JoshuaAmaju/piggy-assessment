import {Link, useNavigation} from '@react-navigation/native';
import {
  Box,
  Button,
  Center,
  FlatList,
  HStack,
  Image,
  Spinner,
  Text,
  VStack,
} from 'native-base';
import React, {useCallback, useLayoutEffect, useState} from 'react';

import {add, remove, State} from './cart';

// import {MaterialIcons} from '@expo/vector-icons';

import {ListRenderItem, StyleSheet, TouchableOpacity} from 'react-native';
import {useQuery} from 'react-query';
import {useDispatch, useSelector} from 'react-redux';
import {Category} from './types';
import {getCategories, getMealsByCategory} from './query';

function Spacer() {
  return <Box w={3} />;
}

export function Ecommerce() {
  const navigator = useNavigation();

  const dispatch = useDispatch();
  const cartItems = useSelector((state: State) => state.items);

  const categories = useQuery(['categories'], getCategories, {
    select: data => data.slice(0, 6),
  });

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

  const renderMeal = useCallback<ListRenderItem<Meal>>(({item}) => {
    return (
      <TouchableOpacity style={styles.meal} onPress={() => {}}>
        <VStack space={6} justifyContent="space-between">
          <VStack>
            <Text fontSize="md" style={styles.mealTitle}>
              {item.strMeal}
            </Text>

            <Text fontSize="md" style={styles.mealTitle}>
              <Text color="#529F83">$</Text>9.99
            </Text>
          </VStack>

          <Image
            alt={item.strMeal}
            style={styles.mealThumb}
            source={{uri: item.strMealThumb}}
          />

          <HStack space={2} alignItems="center" justifyContent="space-between">
            <VStack>
              <Text>🔥 44 calories</Text>
              <Text>20 mins</Text>
            </VStack>

            {/* <IconButton
              icon={<Icon as={MaterialIcons} name="add-shopping-cart" />}
            /> */}

            <Button onPress={() => {}}>Add</Button>
          </HStack>
        </VStack>
      </TouchableOpacity>
    );
  }, []);

  useLayoutEffect(() => {
    navigator.setOptions({
      headerTitle: () => (
        <VStack py={4}>
          <Text bold fontSize="lg" color="gray.400">
            Hi Joshua
          </Text>
          <Text bold fontSize="2xl">
            Hungry Now? 🔥
          </Text>
        </VStack>
      ),
      headerRight: () => (
        <Box w={10} h={10} bg="gray.400" borderRadius="full" />
      ),
    });
  }, [navigator]);

  return (
    <VStack flex={1}>
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
                <Text>An error occurred</Text>
                <Button onPress={() => categories.refetch()}>Retry</Button>
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
                <Text>See All</Text>
              </Link>
            </HStack>

            <FlatList
              horizontal
              data={meals.data}
              renderItem={renderMeal}
              ItemSeparatorComponent={Spacer}
              _contentContainerStyle={{px: '6'}}
              keyExtractor={item => item.idMeal}
            />
          </VStack>
        ) : (
          <Center p={4} flex={1}>
            {meals.isLoading ? (
              <Spinner size="lg" />
            ) : meals.isError ? (
              <VStack space={2}>
                <Text>An error occurred</Text>
                <Button onPress={() => meals.refetch()}>Retry</Button>
              </VStack>
            ) : null}
          </Center>
        )}
      </VStack>
    </VStack>
  );
}

const styles = StyleSheet.create({
  category: {
    width: 90,
    borderWidth: 1,
    borderRadius: 20,
    borderColor: '#ccc',
    alignItems: 'center',
    paddingVertical: 13,
    paddingHorizontal: 10,
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
    borderRadius: 20,
    paddingVertical: 30,
    paddingHorizontal: 25,
    backgroundColor: '#F8F9F9',
  },
  mealThumb: {
    width: 120,
    height: 120,
    borderRadius: 100,
  },
  mealTitle: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
