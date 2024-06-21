import React, { useMemo, useState } from 'react';
import {
  Pressable,
  PressableProps,
  StyleSheet,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';

import MediumText from './Text/MediumText';

interface PillsProps extends PressableProps {
  children: string | React.ReactNode;
  selected: boolean;
  onSelect: (selected: boolean) => void;
  withSelectState?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export default (props: PillsProps) => {
  const backgroundColor = useMemo(() => {
    if (props.selected) {
      return '#BF2229';
    }
    return '#FFD3D3';
  }, [props.selected]);

  return (
    <View style={styles.buttonContainer}>
      <Pressable
        {...props}
        style={{
          backgroundColor,
          ...styles.button,
          ...props.style,
        }}
        onPress={() => {
          props.onSelect(props.withSelectState ? props.selected : false);
        }}>
        {typeof props.children === 'string' ? (
          <MediumText
            type="label-large"
            color={props.selected ? '#FAFAFA' : '#001E2F'}
            style={props.textStyle}>
            {props.children}
          </MediumText>
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
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 30,
  },
});
