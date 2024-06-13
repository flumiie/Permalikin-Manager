import React from 'react';
import { View, ViewStyle } from 'react-native';

interface SpacerProps {
  width?: number;
  height?: number;
  color?: string;
  style?: ViewStyle;
}

export default (props: SpacerProps) => {
  return (
    <View
      style={{
        width: props.width ?? 0,
        height: props.height ?? 0,
        backgroundColor: props.color ?? 'transparent',
        ...props.style,
      }}
    />
  );
};
