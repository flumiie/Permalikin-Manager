import React, { useMemo } from 'react';
import {
  TextProps as RNTextProps,
  Text,
  TextStyle,
  ViewStyle,
} from 'react-native';

interface TextProps extends RNTextProps {
  type?:
    | 'display-large'
    | 'display-medium'
    | 'display-small'
    | 'body-large'
    | 'body-medium'
    | 'body-small'
    | 'label-medium'
    | 'label-small';
  size?: number;
  color?: string;
  weight?: TextStyle['fontWeight'];
  lineHeight?: number;
}

export default (props: TextProps) => {
  const getType = useMemo(() => {
    if (props.type === 'display-large') {
      return {
        fontSize: 57,
        lineHeight: 64,
      };
    }
    if (props.type === 'display-medium') {
      return {
        fontSize: 45,
        lineHeight: 52,
      };
    }
    if (props.type === 'display-small') {
      return {
        fontSize: 36,
        lineHeight: 44,
      };
    }

    if (props.type === 'body-large') {
      return {
        fontSize: 16,
        lineHeight: 24,
      };
    }
    if (props.type === 'body-medium') {
      return {
        fontSize: 14,
        lineHeight: 20,
      };
    }
    if (props.type === 'body-small') {
      return {
        fontSize: 12,
        lineHeight: 16,
      };
    }

    if (props.type === 'label-medium') {
      return {
        fontSize: 12,
        lineHeight: 16,
      };
    }
    if (props.type === 'label-small') {
      return {
        fontSize: 11,
        lineHeight: 16,
      };
    }

    return {
      fontSize: 14,
      lineHeight: 16,
    };
  }, [props.type]);

  return (
    <Text
      {...props}
      // eslint-disable-next-line react-native/no-inline-styles
      style={{
        fontFamily: 'Poppins-Regular',
        color: props.color ?? '#1F1F1F',
        fontWeight: props.weight ?? '400',
        fontSize: props.size ?? getType.fontSize,
        lineHeight: props.lineHeight ?? getType.lineHeight,
        ...(props.style as ViewStyle),
      }}>
      {props.children}
    </Text>
  );
};
