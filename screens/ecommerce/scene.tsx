import React, {useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {
  Box,
  Button,
  Center,
  FlatList,
  Image,
  Spinner,
  Text,
  View,
  VStack,
} from 'native-base';
import {useCallback, useLayoutEffect} from 'react';

import axios from 'axios';
import {useQuery} from 'react-query';
import {ListRenderItem, StyleSheet, TouchableOpacity} from 'react-native';

type Category = {
  idCategory: string;
  strCategory: string;
  strCategoryThumb: string;
  strCategoryDescription: string;
};

type Meal = {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
};

async function getCategories() {
  const res = await fetch(
    'https://www.themealdb.com/api/json/v1/1/categories.php',
  );

  if (!res.ok) {
    throw new Error('An error occurred while fetching categories');
  }

  const json = await res.json();

  return (json as {categories: Array<Category>}).categories;
  // return [];
}

async function getMealsByCategory(category: Category['strCategory']) {
  // const res = await axios.get<{meals: Array<Meal>}>(
  //   'https://www.themealdb.com/api/json/v1/1/filter.php',
  //   {params: {c: category}},
  // );
  // return res.data.meals;
}

function Spacer() {
  return <Box w={3} />;
}

export function Ecommerce() {
  const navigator = useNavigation();

  const categories = useQuery(['categories'], getCategories, {
    select: data => data.slice(0, 6),
  });

  console.log(categories.data);

  const [selectedCategory, setSelectedCategory] =
    useState<Category['strCategory']>();

  const meals = useQuery(
    ['meals', selectedCategory],
    () => getMealsByCategory(selectedCategory!),
    {enabled: !!selectedCategory},
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
    <View>
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
    </View>
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
});
