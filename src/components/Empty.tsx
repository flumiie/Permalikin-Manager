import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

import Spacer from './Spacer';
import RegularText from './Text/RegularText';

export default () => {
  return (
    <View style={styles.container}>
      <Image
        style={styles.image}
        source={require('../../assets/images/not-found.png')}
      />
      <Spacer height={12} />
      <RegularText weight="800" color="#222">
        Result not found
      </RegularText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  image: {
    width: 180,
    height: 180,
  },
});
