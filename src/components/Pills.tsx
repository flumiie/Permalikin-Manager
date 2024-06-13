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
  onSelect: (selected: boolean) => void;
  withSelectState?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export default (props: PillsProps) => {
  const [selected, setSelected] = useState(false);
  const backgroundColor = useMemo(() => {
    if (selected) {
      return '#1B72C0';
    }
    return '#D3E4FF';
  }, [selected]);

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
          if (props.withSelectState ?? true) {
            setSelected(!selected);
          }
          props.onSelect(selected);
        }}>
        {typeof props.children === 'string' ? (
          <MediumText
            type="label-large"
            color={selected ? '#FAFAFA' : '#001E2F'}
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
