import React, {
  createRef,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import {Box, Button, FlatList, HStack, Image, Text, VStack} from 'native-base';
import {
  StyleSheet,
  useWindowDimensions,
  View,
  FlatList as RNFlatList,
  ListRenderItem,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import {name as ecommerce} from '../ecommerce';

import Logo from './assets/logo.svg';

type Slide = {title: string; image: any};

const slides: Array<Slide> = [
  {
    image: require('./assets/slide-one.png'),
    title: 'Build your savings with ease & discipline',
  },
  {
    image: require('./assets/slide-two.png'),
    title: 'Invest with ease in verified opportunities',
  },
  {
    image: require('./assets/slide-three.png'),
    title: "Lock funds you don't want to be tempted to touch",
  },
  {
    image: require('./assets/slide-three.png'),
    title: "Lock funds you don't want to be tempted to touch",
  },
];

export function Onboarding() {
  const navigator = useNavigation();
  const {width} = useWindowDimensions();
  const slidesRef = createRef<RNFlatList>();
  const [currentSlideIndex, setIndex] = useState(0);

  const interval = useRef<number>();
  const [userActive, setUserActive] = useState(false);

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

  useEffect(() => {
    if (interval.current) {
      clearInterval(interval.current);
    }

    if (userActive) {
      return;
    }

    const id = setInterval(() => {
      setIndex(i => (i >= slides.length - 1 ? 0 : i + 1));
    }, 2500);

    interval.current = id;

    return () => {
      clearInterval(id);
    };
  }, [userActive]);

  useLayoutEffect(() => {
    if (!userActive) {
      slidesRef.current?.scrollToIndex({
        index: currentSlideIndex,
        viewPosition: width * currentSlideIndex,
      });
    }
  }, [width, currentSlideIndex, slidesRef, userActive]);

  return (
    <VStack space={2} style={styles.scene}>
      <HStack p={6} justifyContent="center">
        {/* <Text bold color="blue.500" fontSize="2xl">
          piggyvest
        </Text> */}

        <Logo color="#0B60D8" />
      </HStack>

      <VStack space={4} alignItems="center" justifyContent="center">
        <FlatList
          horizontal
          data={slides}
          ref={slidesRef}
          pagingEnabled={true}
          renderItem={renderSlide}
          keyExtractor={(_, i) => i.toString()}
          showsHorizontalScrollIndicator={false}
          onTouchEnd={() => setUserActive(false)}
          onTouchStart={() => setUserActive(true)}
          getItemLayout={(_, index) => {
            return {index, length: width, offset: width * index};
          }}
          onMomentumScrollEnd={({nativeEvent}) => {
            const {contentOffset} = nativeEvent;
            setIndex(contentOffset.x / width);
            setUserActive(false);
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

      <HStack p={6} space={4}>
        <Button
          bg="#0B60D8"
          style={styles.btn}
          _text={{textTransform: 'uppercase'}}
          onPress={() => navigator.navigate(ecommerce as never)}>
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
    height: 300,
    maxWidth: '100%',
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
