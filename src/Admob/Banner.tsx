import React from 'react';
import {BannerAd, TestIds, BannerAdSize} from '@react-native-firebase/admob';
import {Animated, StyleSheet} from 'react-native';

const adUnitId = __DEV__
  ? TestIds.BANNER
  : 'ca-app-pub-8637010206853096/6219893100';

const AdsBanner = () => {
  const showRef = React.useRef<Animated.Value>(new Animated.Value(0)).current;

  const translateY = showRef.interpolate({
    inputRange: [0, 1],
    outputRange: [50, 0],
  });

  return (
    <Animated.View
      style={[styles.bannerContainer, {transform: [{translateY}]}]}>
      <BannerAd
        unitId={adUnitId}
        size={BannerAdSize.BANNER}
        onAdLoaded={() => {
          Animated.timing(showRef, {
            useNativeDriver: true,
            duration: 1000,
            toValue: 1,
          }).start();
        }}
        requestOptions={{
          requestNonPersonalizedAdsOnly: true,
          location: [-33.865143, 151.2099],
        }}
        onAdClosed={() => {}}
        onAdFailedToLoad={() => {}}
        onAdLeftApplication={() => {}}
        onAdOpened={() => {}}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  bannerContainer: {
    position: 'absolute',
    bottom: 0,
    height: 50,
    width: '100%',
  },
});

export default AdsBanner;
