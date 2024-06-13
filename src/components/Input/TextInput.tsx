import React, { LegacyRef, forwardRef, useMemo, useState } from 'react';
import {
  Image,
  Pressable,
  TextInput as RNTextInput,
  TextInputProps as RNTextInputProps,
  StyleSheet,
  TextStyle,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

import Spacer from '../Spacer';
import RegularText from '../Text/RegularText';

interface TextInputProps extends RNTextInputProps {
  label?: string;
  input?: string;
  error?: string | false;
  leftIcon?: string;
  rightIcons?: {
    password?: 'eye' | 'eye-off';
    custom?: string[];
  };
  rightLabel?: string;
  filledTextColor?: string | boolean;
  inputStyle?: TextStyle;
  showPassword?: () => void;
  onPress?: () => void;
  onChangeText?: (val: string) => void;
}

export default forwardRef(
  (props: TextInputProps, ref: LegacyRef<RNTextInput>) => {
    const [onBlur, setOnBlur] = useState(false);

    const borderColor = useMemo(() => {
      if (props.error) {
        return '#F64C4C';
      }
      if ((props.value?.length ?? 0) > 0) {
        return '#BF2229';
      }
      return '#E1E1E1';
    }, [props.value, props.error]);

    const color = useMemo(() => {
      if (onBlur && props.filledTextColor && (props.value?.length ?? 0) > 0) {
        if (typeof props.filledTextColor === 'string') {
          return props.filledTextColor ?? '#BF2229';
        }
        return '#BF2229';
      }
      return '#4B4B4B';
    }, [props.value, props.filledTextColor, onBlur]);

    return (
      <>
        {props.label ? (
          <>
            <RegularText type="body-medium" color="#4B4B4B">
              {props.label}
            </RegularText>
            <Spacer height={4} />
          </>
        ) : null}
        <Pressable onPress={props.onPress} style={styles.container}>
          {props.onPress ? <View style={styles.pressableOverlay} /> : null}
          {props.leftIcon ? (
            <View style={styles.leftIcon}>
              <Pressable style={styles.sideIcon} onPress={props.onPress}>
                <Icon name={props.leftIcon} size={20} color="#BF2229" />
              </Pressable>
            </View>
          ) : null}

          <RNTextInput
            {...props}
            ref={ref}
            placeholder={`${props.leftIcon ? '         ' : ''}${
              props.placeholder
            }`}
            placeholderTextColor="#8E8E8E"
            returnKeyType="next"
            onFocus={e => {
              props.onFocus?.(e);
              setOnBlur(false);
            }}
            onBlur={e => {
              props.onBlur?.(e);
              setOnBlur(true);
            }}
            // eslint-disable-next-line react-native/no-inline-styles
            style={{
              color,
              borderColor,
              height: props.multiline ? 'auto' : 40,
              ...styles.input,
              ...props.inputStyle,
            }}
          />
          <View style={styles.rightIcons}>
            {props.rightLabel ? (
              <RegularText type="body-medium" color="#001E2F">
                {props.rightLabel}
              </RegularText>
            ) : null}
            {props.editable && (props.value?.length ?? 0) > 0 ? (
              <Pressable
                style={styles.sideIcon}
                onPress={() => {
                  props.onChangeText?.('');
                }}>
                <Image source={require('../../../assets/icons/error.png')} />
              </Pressable>
            ) : null}
            {props.rightIcons?.password ? (
              <Pressable style={styles.sideIcon} onPress={props.showPassword}>
                <Icon
                  name={props.rightIcons.password}
                  size={16}
                  color="#CACACA"
                />
              </Pressable>
            ) : null}
            {props.rightIcons?.custom?.map(icon => (
              <Pressable
                key={`${icon}${Math.random()}`}
                style={styles.sideIcon}
                onPress={props.onPress}>
                <Icon name={icon} size={20} color="#BF2229" />
              </Pressable>
            ))}
          </View>
        </Pressable>
        {props.error ? (
          <>
            <Spacer height={4} />
            <RegularText color="#F64C4C">{props.error}</RegularText>
          </>
        ) : null}
      </>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  pressable: {
    position: 'absolute',
    zIndex: 1,
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    borderRadius: 4,
  },
  pressableOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 4,
    backgroundColor: '#FFF',
    paddingVertical: 8,
    paddingHorizontal: 12,
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    lineHeight: 20,
  },
  leftIcon: {
    position: 'absolute',
    left: 12,
    alignSelf: 'center',
    flexDirection: 'row',
    zIndex: 10,
  },
  rightIcons: {
    position: 'absolute',
    right: 12,
    alignSelf: 'center',
    flexDirection: 'row',
    zIndex: 10,
  },
  sideIcon: {
    padding: 4,
    alignSelf: 'center',
  },
});
