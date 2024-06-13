import React from 'react';
import { Pressable, PressableProps, StyleSheet, View } from 'react-native';
import FastImage, { Source } from 'react-native-fast-image';
import Icon from 'react-native-vector-icons/Feather';

import Badge, { BadgeProps } from '../Badge';
import Spacer from '../Spacer';
import MediumText from '../Text/MediumText';
import RegularText from '../Text/RegularText';

type SubtitleType = {
  subtitle: string;
  desc: string;
};

interface ItemListProps extends PressableProps {
  leftImage: number | Source;
  imageType: 'large-image' | 'small-icon';
  title: string;
  date?: string;
  sub?: SubtitleType | BadgeProps;
  onPress: () => void;
}

export default (props: ItemListProps) => {
  return (
    <View style={styles.container}>
      <Pressable
        android_ripple={props.android_ripple ?? { color: '#BF222966' }}
        style={styles.pressable}
        onPress={props.onPress}>
        {props.date ? (
          <>
            <RegularText size={11} color="#4B4B4B">
              {props.date}
            </RegularText>
            <Spacer height={8} />
          </>
        ) : null}

        <View style={styles.contents}>
          <View style={styles.listLeftContents}>
            <View
              // eslint-disable-next-line react-native/no-inline-styles
              style={{
                width: props.imageType === 'large-image' ? 68 : 56,
                height: props.imageType === 'large-image' ? 68 : 56,
                ...styles.imageContainer,
              }}>
              <FastImage
                defaultSource={require('../../../assets/images/gears.jpeg')}
                source={props.leftImage}
                resizeMode={FastImage.resizeMode.cover}
                style={
                  props.imageType === 'large-image'
                    ? styles.largeImage
                    : styles.image
                }
              />
            </View>
            <Spacer width={12} />
            <View
              // eslint-disable-next-line react-native/no-inline-styles
              style={{
                alignSelf: props.sub ? 'flex-start' : 'center',
              }}>
              <MediumText color="#000">{props.title}</MediumText>
              {(props.sub as SubtitleType)?.subtitle ? (
                <>
                  <RegularText size={12} color="#4B4B4B">
                    {(props.sub as SubtitleType).subtitle}
                  </RegularText>
                  <RegularText size={12} color="#4B4B4B">
                    {(props.sub as SubtitleType).desc}
                  </RegularText>
                </>
              ) : null}
              {(props.sub as BadgeProps)?.label ? (
                <View style={styles.badgeContainer}>
                  <Badge
                    type={(props.sub as BadgeProps).type}
                    label={(props.sub as BadgeProps).label}
                  />
                </View>
              ) : null}
            </View>
          </View>
          <Icon name="chevron-right" size={24} color="#44474E" />
        </View>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  pressable: {
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  contents: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  listLeftContents: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageContainer: {
    borderRadius: 8,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EFF1F8',
  },
  largeImage: {
    width: '100%',
    height: '100%',
  },
  image: {
    width: 40,
    height: 40,
  },
  badgeContainer: {
    alignSelf: 'flex-start',
  },
});
