import React from 'react';
import {Animated} from 'react-native';
import {BannerAd as Banner} from 'react-native-sdkx';

interface props {
  adUnit: string;
}

const BannerAd = (props: props) => {
  const showRef = React.useRef<Animated.Value>(new Animated.Value(0)).current;

  const loadAd = React.useCallback(() => {
    Animated.timing(showRef, {
      useNativeDriver: false,
      toValue: 1,
      duration: 1000,
    }).start();
  }, [showRef]);

  return (
    <Animated.View
      style={{
        height: showRef.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 100],
        }),
      }}>
      <Banner
        onAdLoaded={loadAd}
        adUnit={props.adUnit}
        style={{height: 100, width: '100%'}}
      />
    </Animated.View>
  );
};

export default BannerAd;
