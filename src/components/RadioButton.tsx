import React from 'react';
import { StyleSheet, View } from 'react-native';

interface RadioButtonProps {
  selected: boolean;
}

export default (props: RadioButtonProps) => {
  return (
    <View
      // eslint-disable-next-line react-native/no-inline-styles
      style={{
        borderColor: props.selected ? '#1B72C0' : '#CACACA',
        ...styles.container,
      }}>
      {props.selected ? <View style={styles.inner} /> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inner: {
    padding: 4,
    width: 12,
    height: 12,
    borderRadius: 12,
    backgroundColor: '#1B72C0',
  },
});
