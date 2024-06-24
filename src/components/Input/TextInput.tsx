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
  disabled?: boolean;
  label?: string;
  input?: string;
  error?: string | false;
  leftIcon?: string;
  leftLabel?: string;
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
        return '#B60000';
      }
      if ((props.value?.length ?? 0) > 0) {
        return '#00AB41';
      }
      return '#E1E1E1';
    }, [props.value, props.error]);

    const color = useMemo(() => {
      if (onBlur && props.filledTextColor && (props.value?.length ?? 0) > 0) {
        if (typeof props.filledTextColor === 'string') {
          return props.filledTextColor ?? '#00AB41';
        }
        return '#00AB41';
      }
      return '#4B4B4B';
    }, [props.value, props.filledTextColor, onBlur]);

    const LeftIcon = () => {
      if (props.leftLabel) {
        return (
          <View style={styles.leftIcon}>
            <RegularText>{props.leftLabel}</RegularText>
          </View>
        );
      }
      if (props.leftIcon) {
        return (
          <View style={styles.leftIcon}>
            <Pressable style={styles.sideIcon} onPress={props.onPress}>
              <Icon name={props.leftIcon} size={20} color="#00AB41" />
            </Pressable>
          </View>
        );
      }
      return null;
    };

    return (
      <>
        {props.label ? (
          <>
            <RegularText
              type="body-medium"
              color={props.disabled ? '#BBB' : '#4B4B4B'}>
              {props.label}
            </RegularText>
            <Spacer height={4} />
          </>
        ) : null}
        <Pressable
          onPress={!props.disabled ? props.onPress : null}
          style={styles.container}>
          {props.onPress ? <View style={styles.pressableOverlay} /> : null}
          <LeftIcon />
          <RNTextInput
            {...props}
            ref={ref}
            editable={!props.disabled || props.editable}
            placeholder={`${props.leftIcon ? '         ' : ''}${
              props.placeholder
            }`}
            placeholderTextColor={props.disabled ? '#BBB' : '#8E8E8E'}
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
              paddingLeft: props.leftIcon || props.leftLabel ? 36 : 12,
              ...(props.disabled ? styles.darkerInput : null),
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
                <Icon
                  name={icon}
                  size={20}
                  color={props.disabled ? '#BBB' : '#00AB41'}
                />
              </Pressable>
            ))}
          </View>
        </Pressable>
        {props.error ? (
          <>
            <Spacer height={4} />
            <RegularText color="#B60000">{props.error}</RegularText>
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
  darkerInput: {
    backgroundColor: '#EFF1F8',
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
    height: 48,
    borderWidth: 1,
    borderRadius: 4,
    backgroundColor: '#FFF',
    paddingVertical: 12,
    paddingRight: 12,
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
    right: 0,
    zIndex: 10,
    alignSelf: 'center',
    flexDirection: 'row',
  },
  sideIcon: {
    alignSelf: 'center',
    padding: 14,
  },
});
