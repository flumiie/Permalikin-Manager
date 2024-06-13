import LottieView from 'lottie-react-native';
import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';

export default () => {
  return (
    <View style={styles.container}>
      <LottieView
        source={require('../../assets/icons/lottie-loading.json')}
        style={styles.lottie}
        autoPlay
        loop
        renderMode="SOFTWARE"
        resizeMode="cover"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: Dimensions.get('window').height - 180,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lottie: {
    width: 70,
    height: 70,
  },
});
