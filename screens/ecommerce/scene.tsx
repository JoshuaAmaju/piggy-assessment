import {useNavigation} from '@react-navigation/native';
import {Box, Text, VStack} from 'native-base';
import {useLayoutEffect} from 'react';

export function Ecommerce() {
  const navigator = useNavigation();

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

  return <></>;
}
