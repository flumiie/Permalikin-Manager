import React, { useMemo } from 'react';
import {
  TextProps as RNTextProps,
  Text,
  TextStyle,
  ViewStyle,
} from 'react-native';

interface TextProps extends RNTextProps {
  type?: 'label-large';
  size?: number;
  color?: string;
  weight?: TextStyle['fontWeight'];
  lineHeight?: number;
}

export default (props: TextProps) => {
  const getType = useMemo(() => {
    if (props.type === 'label-large') {
      return {
        fontSize: 14,
        lineHeight: 20,
      };
    }
    return {
      fontSize: props.size,
      lineHeight: props.lineHeight,
    };
  }, [props.type, props.size, props.lineHeight]);

  return (
    <Text
      {...props}
      // eslint-disable-next-line react-native/no-inline-styles
      style={{
        fontFamily: 'Poppins-Medium',
        color: props.color ?? '#1F1F1F',
        fontWeight: props.weight ?? '500',
        fontSize: getType.fontSize,
        lineHeight: getType.lineHeight,
        ...(props.style as ViewStyle),
      }}>
      {props.children}
    </Text>
  );
};
