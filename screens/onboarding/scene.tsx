import React, {createRef, useCallback, useState} from 'react';
import {Box, Button, FlatList, HStack, Image, Text, VStack} from 'native-base';
import {
  StyleSheet,
  useWindowDimensions,
  View,
  FlatList as RNFlatList,
  ListRenderItem,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';

type Slide = {title: string; image: any};

const slide = require('./assets/slide.png');

const slides: Array<Slide> = [
  {
    image: slide,
    title: 'Build your savings with ease & discipline',
  },
  {
    image: slide,
    title: 'Invest with ease in verified opportunities',
  },
  {
    image: slide,
    title: "Lock funds you don't want to be tempted to touch",
  },
];

export function Onboarding() {
  const navigator = useNavigation();
  const {width} = useWindowDimensions();
  const slidesRef = createRef<RNFlatList>();
  const [currentSlideIndex, setIndex] = useState(0);

  const renderSlide = useCallback<ListRenderItem<Slide>>(
    ({item}) => {
      return (
        <VStack space={2} style={[styles.slide, {width}]}>
          <Image
            alt={item.title}
            source={item.image}
            resizeMode="contain"
            style={styles.image}
          />

          <Box px={6}>
            <Text bold fontSize="2xl" textAlign="center" color="white">
              {item.title}
            </Text>
          </Box>
        </VStack>
      );
    },
    [width],
  );

  return (
    <VStack space={2} style={styles.scene}>
      <HStack p={4} justifyContent="center">
        <Text bold color="blue.500" fontSize="2xl">
          piggyvest
        </Text>
      </HStack>

      <VStack space={4} alignItems="center" justifyContent="center">
        <FlatList
          horizontal
          data={slides}
          ref={slidesRef}
          // style={{flex: 1}}
          pagingEnabled={true}
          renderItem={renderSlide}
          keyExtractor={(_, i) => i.toString()}
          showsHorizontalScrollIndicator={false}
          // contentContainerStyle={{minHeight: '100%'}}
          onMomentumScrollEnd={({nativeEvent}) => {
            const {contentOffset} = nativeEvent;
            setIndex(contentOffset.x / width);
          }}
        />

        <HStack space={2} justifyContent="center">
          {slides.map((_, i) => {
            return (
              <View
                key={i}
                style={[
                  styles.dot,
                  currentSlideIndex === i && styles.activeDot,
                ]}
              />
            );
          })}
        </HStack>
      </VStack>

      <HStack p={4} space={4}>
        <Button
          bg="blue.600"
          style={styles.btn}
          _text={{textTransform: 'uppercase'}}
          onPress={() => {
            navigator.navigate('');
          }}>
          Login
        </Button>

        <Button
          variant="outline"
          style={styles.btn}
          _text={{color: 'white', textTransform: 'uppercase'}}>
          Register
        </Button>
      </HStack>
    </VStack>
  );
}

const styles = StyleSheet.create({
  scene: {
    flex: 1,
    backgroundColor: '#111111',
    justifyContent: 'space-between',
  },
  slide: {
    alignItems: 'center',
  },
  image: {
    // width: '100%',
    maxWidth: '100%',
    height: 300,
  },
  dot: {
    width: 20,
    height: 5,
    borderRadius: 100,
    backgroundColor: '#282928',
  },
  activeDot: {
    backgroundColor: '#fff',
  },
  btn: {
    flex: 1,
    borderRadius: 7,
    borderBottomStartRadius: 2,
  },
});
