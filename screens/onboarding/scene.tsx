import {Box, Button, HStack, Text, VStack} from 'native-base';
import {StyleSheet, View} from 'react-native';

export function Title() {
  return (
    <HStack>
      <Text>piggyvest</Text>
    </HStack>
  );
}

export function Onboarding() {
  return (
    <View style={styles.scene}>
      <HStack>
        <Text>piggyvest</Text>
      </HStack>

      <VStack flex={1}></VStack>

      <HStack p={4} space={2}>
        <Button flex={1}>Login</Button>
        <Button flex={1}>Register</Button>
      </HStack>
    </View>
  );
}

const styles = StyleSheet.create({
  scene: {
    flex: 1,
    justifyContent: 'space-between',
  },
});
