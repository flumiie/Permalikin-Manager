import React, { useMemo } from 'react';
import {
  TextProps as RNTextProps,
  Text,
  TextStyle,
  ViewStyle,
} from 'react-native';

interface TextProps extends RNTextProps {
  type?: 'title-large' | 'title-medium' | 'title-small';
  color?: string;
  size?: number;
  weight?: TextStyle['fontWeight'];
  lineHeight?: number;
}

export default (props: TextProps) => {
  const getType = useMemo(() => {
    if (props.type === 'title-large') {
      return {
        fontSize: 22,
        lineHeight: 28,
      };
    }
    if (props.type === 'title-medium') {
      return {
        fontSize: 16,
        lineHeight: 24,
      };
    }
    return {
      fontSize: 14,
      lineHeight: 20,
    };
  }, [props.type]);
  return (
    <Text
      {...props}
      // eslint-disable-next-line react-native/no-inline-styles
      style={{
        color: props.color ?? '#1F1F1F',
        fontFamily: 'Poppins-Bold',
        fontWeight: props.weight ?? '600',
        fontSize: props.size ?? getType.fontSize,
        lineHeight: props.lineHeight ?? getType.lineHeight,
        ...(props.style as ViewStyle),
      }}>
      {props.children}
    </Text>
  );
};
