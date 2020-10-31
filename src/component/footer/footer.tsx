import React from 'react';
import {Animated, Pressable, StyleSheet} from 'react-native';
import AntIcon from 'react-native-vector-icons/Feather';

interface onPress {
  id: string;
  onPress(): void;
}

interface props {
  scrollY: Animated.Value;
  componentId: string;
  left?: onPress;
  right?: onPress;
}

const Footer = (props: props) => {
  const translateY = props.scrollY.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 56],
  });


  return (
    <Animated.View style={[styles.container, {transform: [{translateY}]}]}>
      <Pressable
        disabled={props.left.id != null ? false : true}
        onPress={props.left.onPress}
        style={styles.btn}>
        <AntIcon
          name={'arrow-left'}
          size={24}
          color={props.left.id != null ? '#fff' : '#333'}
        />
      </Pressable>
      <Pressable
        disabled={props.right.id != null ? false : true}
        onPress={props.right.onPress}
        style={styles.btn}>
        <AntIcon
          name={'arrow-right'}
          size={24}
          color={props.right.id != null ? '#fff' : '#333'}
        />
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 56,
    backgroundColor: '#000',
  },
  btn: {
    justifyContent: 'center',
    height: 56,
    width: 56,
    alignItems: 'center',
  },
});

export default Footer;
