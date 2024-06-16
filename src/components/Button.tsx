import React, { useMemo } from 'react';
import {
  Pressable,
  PressableProps,
  StyleSheet,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';

import BoldText from './Text/BoldText';

interface ButtonProps extends PressableProps {
  onPress: () => void;
  type: 'primary' | 'secondary' | 'outline';
  children?: React.ReactNode | string;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export default (props: ButtonProps) => {
  const backgroundColor = useMemo(() => {
    if (props.disabled) {
      return '#DDD';
    }
    if (props.type === 'outline') {
      return '#FFF';
    }
    if (props.type === 'primary') {
      return '#BF2229';
    }
    if (props.type === 'secondary') {
      return '#FFD3D3';
    }
    return 'transparent';
  }, [props.disabled, props.type]);

  const borderColor = useMemo(() => {
    if (props.type === 'outline') {
      return '#BF2229';
    }
    return 'transparent';
  }, [props.type]);

  const color = useMemo(() => {
    if (props.disabled) {
      return '#1E1C1355';
    }
    if (props.type === 'outline') {
      return '#BF2229';
    }
    if (props.type === 'secondary') {
      return '#001C38';
    }
    return '#FFF';
  }, [props.disabled, props.type]);

  const androidRipple = useMemo(() => {
    if (props.disabled) {
      return null;
    }
    if (props.android_ripple) {
      return props.android_ripple;
    }
    return { color: '#84b5ff' };
  }, [props.disabled, props.android_ripple]);

  return (
    <View
      style={{
        backgroundColor,
        ...styles.buttonContainer,
      }}>
      <Pressable
        {...props}
        android_ripple={androidRipple}
        // eslint-disable-next-line react-native/no-inline-styles
        style={{
          borderColor,
          borderWidth: props.type === 'outline' ? 1 : 0,
          ...styles.button,
          ...props.style,
        }}
        onPress={props.onPress}>
        {typeof props.children === 'string' ? (
          <BoldText
            type="title-small"
            style={{
              color,
              ...props.textStyle,
            }}>
            {props.children}
          </BoldText>
        ) : (
          props.children
        )}
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    borderRadius: 30,
    overflow: 'hidden',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 30,
  },
});