import React from 'react';
import { StyleSheet, View } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

interface CheckboxProps {
  selected: boolean;
}

export default (props: CheckboxProps) => {
  return (
    <View
      // eslint-disable-next-line react-native/no-inline-styles
      style={{
        borderColor: props.selected ? '#BF2229' : '#CACACA',
        ...styles.container,
      }}>
      {props.selected ? (
        <View style={styles.inner}>
          <Icon name="check" size={14} color="white" />
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderRadius: 3,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  inner: {
    width: '100%',
    height: '100%',
    backgroundColor: '#BF2229',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
