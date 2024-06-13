import React, { useMemo, useState } from 'react';
import {
  Image,
  Pressable,
  StyleSheet,
  TextInputProps,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

import Spacer from '../Spacer';
import RegularText from '../Text/RegularText';
import TextInput from './TextInput';

interface DateInputProps extends TextInputProps {
  label?: string;
  input?: string;
  error?: string | false;
  rightIcons?: {
    password?: 'eye' | 'eye-off';
  };
  showPassword?: () => void;
  onPress?: () => void;
  onChangeText?: (val: string) => void;
}

export default (props: DateInputProps) => {
  const [input, setInput] = useState(props.input);

  const borderColor = useMemo(() => {
    if (props.error) {
      return '#F64C4C';
    }
    if ((input?.length ?? 0) > 0) {
      return '#BF2229';
    }
    return '#E1E1E1';
  }, [input, props.error]);

  return (
    <>
      {props.label ? (
        <>
          <RegularText color="#4B4B4B">{props.label}</RegularText>
          <Spacer height={4} />
        </>
      ) : null}
      <View style={styles.container}>
        <TextInput
          {...props}
          style={{
            borderColor,
            ...styles.input,
          }}
          placeholderTextColor="#8E8E8E"
          value={input}
          returnKeyType="search"
          onChangeText={v => {
            setInput(v);
            if (props.onChangeText) {
              props.onChangeText(v);
            }
          }}
        />
        <View style={styles.rightIcons}>
          {(input?.length ?? 0) > 0 ? (
            <Pressable style={styles.clearIcon} onPress={() => setInput('')}>
              <Image source={require('../../../assets/icons/error.png')} />
            </Pressable>
          ) : null}
          {props.rightIcons?.password ? (
            <Pressable style={styles.passwordIcon} onPress={props.showPassword}>
              <Icon
                name={props.rightIcons.password}
                size={16}
                color="#CACACA"
              />
            </Pressable>
          ) : null}
        </View>
      </View>
      {props.error ? (
        <>
          <Spacer height={4} />
          <RegularText color="#F64C4C">{props.error}</RegularText>
        </>
      ) : null}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderRadius: 4,
    backgroundColor: '#FFF',
    paddingVertical: 8,
    paddingHorizontal: 12,
    fontFamily: 'Poppins-Regular',
    color: '#4B4B4B',
    fontSize: 16,
  },
  rightIcons: {
    position: 'absolute',
    right: 12,
    alignSelf: 'center',
    flexDirection: 'row',
  },
  clearIcon: {
    padding: 4,
    alignSelf: 'center',
  },
  passwordIcon: {
    padding: 4,
  },
});
