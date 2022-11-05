import React, {createRef, useState} from 'react';
import {Box, Button, FlatList, HStack, Image, Text, VStack} from 'native-base';
import {
  StyleSheet,
  useWindowDimensions,
  View,
  FlatList as RNFlatList,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';

// const slides = [
//   {
//     title: 'Hello',
//   },
// ];

const slides = Array.from(new Array(10)).map((_, i) => ({title: `Hello ${i}`}));

export function Onboarding() {
  const navigator = useNavigation();
  const ref = createRef<RNFlatList>();
  const [index, setIndex] = useState(0);
  const {width} = useWindowDimensions();

  return (
    <View style={styles.scene}>
      <HStack p={4} justifyContent="center">
        <Text bold color="blue.800" fontSize="2xl">
          piggyvest
        </Text>
      </HStack>

      <VStack flex={1}>
        <FlatList
          ref={ref}
          horizontal
          data={slides}
          style={{flex: 1}}
          pagingEnabled={true}
          keyExtractor={(_, i) => i.toString()}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{minHeight: '100%'}}
          onMomentumScrollEnd={({nativeEvent}) => {
            const {contentOffset} = nativeEvent;
            setIndex(contentOffset.x / width);
          }}
          renderItem={({item}) => {
            return (
              <VStack space={2} style={[styles.slide, {width}]}>
                {/* <Image
                  source={item.image}
                  resizeMode="contain"
                  style={styles.image}
                /> */}

                <Box p={6} maxW={80}>
                  <Text bold fontSize="xl">
                    {item.title}
                  </Text>
                </Box>
              </VStack>
            );
          }}
        />

        {/* <HStack>
          {slides}
        </HStack> */}
      </VStack>

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
  slide: {},
  image: {},
});
