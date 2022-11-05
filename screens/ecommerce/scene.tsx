import {useNavigation} from '@react-navigation/native';
import {
  Box,
  Button,
  Center,
  FlatList,
  Spinner,
  Text,
  View,
  VStack,
} from 'native-base';
import {useLayoutEffect} from 'react';

import axios from 'axios';
import {useQuery} from 'react-query';

type Category = {
  idCategory: string;
  strCategory: string;
  strCategoryThumb: string;
  strCategoryDescription: string;
};

async function getCategories() {
  const res = await axios.get<Array<Category>>(
    'https://www.themealdb.com/api/json/v1/1/categories.php',
  );

  return res.data;
}

export function Ecommerce() {
  const navigator = useNavigation();

  const categories = useQuery(['categories'], getCategories);

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
  }, []);

  return (
    <View>
      {categories.data ? (
        <FlatList data={categories.data} renderItem={() => <></>} />
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
