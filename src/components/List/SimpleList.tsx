import { useNavigation } from '@react-navigation/core';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useEffect, useMemo, useState } from 'react';
import {
  Pressable,
  PressableProps,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { useMMKVStorage } from 'react-native-mmkv-storage';
import Icon from 'react-native-vector-icons/Feather';

import { asyncStorage } from '../../../store';
import { RootStackParamList } from '../../Routes';
import Spacer from '../Spacer';
import MediumText from '../Text/MediumText';
import RegularText from '../Text/RegularText';

interface SimpleListProps extends PressableProps {
  icon: string;
  title: string;
  subtitle?: string;
  color?: {
    icon?: string;
    title?: string;
    subtitle?: string;
    chevron?: string;
  };
  easterEgg?: boolean;
  onPress?: () => void;
}

export default (props: SimpleListProps) => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [increment, setIncrement] = useState(0);
  const [eggFound, setEggFound] = useMMKVStorage(
    'theEggWasFound',
    asyncStorage,
    false,
  );

  const eggCounter = useMemo(() => {
    if (increment === 4) {
      return 'Press it 3 more times';
    }
    if (increment === 5) {
      return 'Press it 2 more times';
    }
    if (increment === 6) {
      return 'Press it 1 more time';
    }
    return '';
  }, [increment]);

  useEffect(() => {
    if (increment > 0) {
      const eggTimeout = setTimeout(() => {
        setIncrement(0);
      }, 7000);

      return () => clearTimeout(eggTimeout);
    }
  }, [increment]);

  return (
    <>
      <View style={styles.container}>
        {props.easterEgg ? (
          <TouchableOpacity
            style={styles.easterEgg}
            onPress={() => {
              if (!eggFound && increment < 6) {
                setIncrement(prev => prev + 1);
              } else {
                setEggFound(true);
                setIncrement(0);
                navigation.navigate('EasterEgg');
              }
            }}
          />
        ) : null}
        <Pressable
          android_ripple={
            props.android_ripple ?? {
              color: props.onPress ? '#BF222966' : '',
            }
          }
          // eslint-disable-next-line react-native/no-inline-styles
          style={{
            paddingVertical: props.subtitle ? 12 : 16,
            ...styles.pressable,
          }}
          onPress={props.onPress}>
          <View style={styles.contents}>
            <View style={styles.listLeftContents}>
              <View style={styles.iconContainer}>
                <Icon
                  name={props.icon}
                  size={24}
                  color={props.color?.icon ?? '#BF2229'}
                />
              </View>
              <Spacer width={8} />
              <View>
                <MediumText
                  type="label-large"
                  color={props.color?.title ?? '#000'}
                  style={styles.text}>
                  {props.title}
                </MediumText>
                {props.subtitle ? (
                  <>
                    <Spacer height={4} />
                    <RegularText
                      type="body-small"
                      color={props.color?.subtitle ?? '#4B4B4B'}
                      style={styles.text}>
                      {props.subtitle}
                    </RegularText>
                  </>
                ) : null}
              </View>
            </View>
            {props.onPress ? (
              <Icon
                name="chevron-right"
                size={24}
                color={props.color?.chevron ?? '#44474E'}
              />
            ) : null}
            {props.easterEgg ? <RegularText>{eggCounter}</RegularText> : null}
          </View>
        </Pressable>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  pressable: {
    paddingHorizontal: 12,
    backgroundColor: '#FFF',
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
  iconContainer: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    textAlign: 'left',
  },
  easterEgg: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },
});
