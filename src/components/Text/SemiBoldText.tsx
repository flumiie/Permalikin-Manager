import React from 'react';
import {
  TextProps as RNTextProps,
  Text,
  TextStyle,
  ViewStyle,
} from 'react-native';

interface TextProps extends RNTextProps {
  color?: string;
  size?: number;
  weight?: TextStyle['fontWeight'];
  lineHeight?: number;
}

export default (props: TextProps) => {
  return (
    <Text
      {...props}
      // eslint-disable-next-line react-native/no-inline-styles
      style={{
        color: props.color ?? '#1F1F1F',
        fontFamily: 'Poppins-SemiBold',
        fontSize: props.size ?? 16,
        fontWeight: props.weight ?? '600',
        lineHeight: props.lineHeight ?? 24,
        ...(props.style as ViewStyle),
      }}>
      {props.children}
    </Text>
  );
};
