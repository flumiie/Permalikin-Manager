import React from 'react';
import { StyleSheet, View } from 'react-native';

export default () => {
  return <View style={styles.dot} />;
};

const styles = StyleSheet.create({
  dot: {
    position: 'absolute',
    right: -2,
    top: 0,
    width: 8,
    height: 8,
    borderRadius: 30,
    backgroundColor: '#D40101',
  },
});
