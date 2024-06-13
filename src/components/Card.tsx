import React from 'react';
import {
  Image,
  ImageSourcePropType,
  Pressable,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';

import Spacer from './Spacer';
import MediumText from './Text/MediumText';
import RegularText from './Text/RegularText';

interface CardProps {
  icon: ImageSourcePropType | undefined;
  title: string;
  subtitle: string;
  disabled?: boolean;
  style?: ViewStyle;
  onPress: () => void;
}

export default (props: CardProps) => {
  return (
    <View style={{ ...styles.container, ...props.style }}>
      <Pressable
        disabled={props.disabled}
        android_ripple={{ color: props.disabled ? 'transparent' : '#BF222966' }}
        // eslint-disable-next-line react-native/no-inline-styles
        style={{
          borderColor: props.disabled ? 'transparent' : '#EEE',
          backgroundColor: props.disabled ? 'transparent' : '#F8EFEF',
          ...styles.pressable,
        }}
        onPress={props.onPress}>
        {props.disabled ? (
          <View />
        ) : (
          <Image style={styles.image} source={props.icon} />
        )}

        <Spacer height={8} />
        <View>
          <MediumText
            size={16}
            lineHeight={24}
            color={props.disabled ? 'transparent' : '#1F1F1F'}
            style={styles.text}>
            {props.title}
          </MediumText>
          <Spacer height={2} />
          <RegularText type="body-small" color="#74777F" style={styles.text}>
            {props.subtitle}
          </RegularText>
        </View>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 8,
    overflow: 'hidden',
  },
  pressable: {
    flex: 1,
    paddingTop: 8,
    paddingBottom: 20,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderRadius: 8,
    alignItems: 'center',
  },
  image: {
    width: 120,
    height: 120,
  },
  imageDisabled: {
    opacity: 0.5,
  },
  text: {
    textAlign: 'center',
  },
});
