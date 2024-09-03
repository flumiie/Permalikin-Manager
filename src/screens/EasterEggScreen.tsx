/* eslint-disable react-native/no-inline-styles */
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Linking, Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';

import { BoldText, Button, RegularText, Spacer } from '../components';

export default () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  // const colors = useDerivedValue(() => {
  //   return [
  //     '#fdf4c9',
  //     '#fbcdf2',
  //     '#e8befa',
  //     '#acbfff',
  //     '#bbf3bf',
  //     '#fdf4c9',
  //     '#fbcdf2',
  //   ];
  // }, []);

  return (
    <>
      {/* <Canvas style={StyleSheet.absoluteFillObject}>
        <Rect x={0} y={0} width={width} height={height}>
          <LinearGradient
            start={vec(0, 0)}
            end={vec(width, height)}
            colors={colors}
          />
        </Rect>
      </Canvas> */}
      <View
        style={{
          flex: 1,
          paddingTop: insets.top + 16,
          paddingBottom: insets.bottom + 16,
          paddingHorizontal: 16,
          backgroundColor: 'rgba(255, 255, 255, 0.3)',
        }}>
        <View
          style={{
            position: 'absolute',
            paddingTop: insets.top + 16,
            paddingBottom: insets.bottom + 16,
            paddingHorizontal: 16,
            zIndex: 3,
          }}>
          <Button type="primary" onPress={() => navigation.goBack()}>
            Back to App
          </Button>
        </View>
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <BoldText type="title-large">You found a hidden 🥚</BoldText>
          <Spacer height={64} />
          <RegularText>App developed by</RegularText>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <BoldText>Ferick Andrew</BoldText>
            <RegularText> a.k.a </RegularText>
            <BoldText>flumi</BoldText>
          </View>
          <View style={{ flexDirection: 'row' }}>
            <Pressable
              style={{ padding: 10, alignItems: 'center' }}
              onPress={() => {
                Linking.openURL('https://github.com/flumiie');
              }}>
              <Icon name="github" size={20} color="rgb(0, 0, 0)" />
              <Spacer height={4} />
              <View
                style={{
                  padding: 4,
                  borderRadius: 8,
                  backgroundColor: 'rgba(255, 255, 255, 0.8)',
                }}>
                <RegularText size={11} color="rgb(0, 0, 0)">
                  GitHub
                </RegularText>
              </View>
            </Pressable>
            <Spacer width={4} />
            <Pressable
              style={{ padding: 10, alignItems: 'center' }}
              onPress={() =>
                Linking.openURL('https://id.linkedin.com/in/ferick')
              }>
              <Icon name="linkedin" size={20} color="rgb(109, 176, 241)" />
              <Spacer height={4} />
              <View
                style={{
                  padding: 4,
                  borderRadius: 8,
                  backgroundColor: 'rgba(255, 255, 255, 0.8)',
                }}>
                <RegularText size={11} color="rgb(109, 176, 241)">
                  LinkedIn
                </RegularText>
              </View>
            </Pressable>
            <Spacer width={4} />
            <Pressable
              style={{ padding: 10, alignItems: 'center' }}
              onPress={() =>
                Linking.openURL('https://twitter.com/flumi_husky')
              }>
              <Icon name="twitter" size={20} color="rgb(0, 0, 0)" />
              <Spacer height={4} />
              <View
                style={{
                  padding: 4,
                  borderRadius: 8,
                  backgroundColor: 'rgba(255, 255, 255, 0.8)',
                }}>
                <RegularText size={11} color="rgb(0, 0, 0)">
                  X
                </RegularText>
              </View>
            </Pressable>
            <Spacer width={4} />
            <Pressable
              style={{ padding: 10, alignItems: 'center' }}
              onPress={() => Linking.openURL('https://t.me/flumiie')}>
              <Icon name="send" size={20} color="rgb(66, 141, 207)" />
              <Spacer height={4} />
              <View
                style={{
                  padding: 4,
                  borderRadius: 8,
                  backgroundColor: 'rgba(255, 255, 255, 0.8)',
                }}>
                <RegularText size={11} color="rgb(66, 141, 207)">
                  Telegram
                </RegularText>
              </View>
            </Pressable>
          </View>
        </View>
      </View>
    </>
  );
};
