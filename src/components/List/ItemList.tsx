import React from 'react';
import { Pressable, PressableProps, StyleSheet, View } from 'react-native';
import FastImage, { Source } from 'react-native-fast-image';
import Icon from 'react-native-vector-icons/Feather';

import Badge, { BadgeProps } from '../Badge';
import Button from '../Button';
import Spacer from '../Spacer';
import MediumText from '../Text/MediumText';
import RegularText from '../Text/RegularText';

type SubtitleType = {
  subtitle: string;
  desc: string;
};

interface ItemListProps extends PressableProps {
  showNavigator: { code: string } | undefined;
  navigators: {
    label: string;
    onPress: () => void;
  }[];
  leftImage: number | Source;
  code: string;
  title: string;
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
        <View style={styles.contents}>
          <View style={styles.listLeftContents}>
            <View
              // eslint-disable-next-line react-native/no-inline-styles
              style={{
                width: 56,
                height: 56,
                ...styles.imageContainer,
              }}>
              <FastImage
                defaultSource={require('../../../assets/images/gears.jpeg')}
                source={props.leftImage}
                resizeMode={FastImage.resizeMode.cover}
                style={styles.largeImage}
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
          <Icon
            name={
              props.showNavigator?.code === props.code
                ? 'chevron-down'
                : 'chevron-up'
            }
            size={24}
            color="#44474E"
          />
        </View>
        {props.showNavigator?.code === props.code ? (
          <View>
            <Spacer height={8} />
            <View style={styles.row}>
              {props.navigators.map(nav => (
                <>
                  <Button type="secondary" onPress={nav.onPress}>
                    {nav.label}
                  </Button>
                  <Spacer width={8} />
                </>
              ))}
            </View>
          </View>
        ) : null}
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  badgeContainer: {
    alignSelf: 'flex-start',
  },
  container: {
    flex: 1,
    overflow: 'hidden',
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  contents: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  imageContainer: {
    borderRadius: 30,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  largeImage: {
    width: '100%',
    height: '100%',
  },
  listLeftContents: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pressable: {
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  row: {
    flexDirection: 'row',
  },
});
