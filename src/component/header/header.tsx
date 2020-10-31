import React from 'react';
import {Animated, Pressable, StyleSheet, Text, View} from 'react-native';
import AntIcon from 'react-native-vector-icons/Feather';
import {Navigation} from 'react-native-navigation';

interface props {
  id: string;
  scrollY: Animated.Value;
  componentId: string;
}

const Header = (props: props) => {
  const translateY = props.scrollY.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -56],
  });

  const title = () => {
    return 'Chapter ' + props.id.match(/\d+/gi).toString();
  };

  return (
    <Animated.View style={[styles.container, {transform: [{translateY}]}]}>
      <View style={styles.btn}>
        <Pressable
          onPress={() => {
            Navigation.pop(props.componentId);
          }}
          style={styles.button}>
          <AntIcon name={'arrow-left'} size={24} color={'white'} />
        </Pressable>
        <Text numberOfLines={1} style={styles.title}>
          {title()}
        </Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    paddingHorizontal: 10,
    position: 'absolute',
    top: 0,
    width: '100%',
    height: 56,
    backgroundColor: '#000',
  },
  btn: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  button: {
    justifyContent: 'center',
    width: 56,
    height: 56,
  },
  title: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Header;
