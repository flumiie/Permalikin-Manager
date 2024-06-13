import { BottomTabHeaderProps } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/core';
import { StackHeaderProps } from '@react-navigation/stack';
import { Formik } from 'formik';
import React, { useRef } from 'react';
import {
  Pressable,
  TextInput as RNTextInput,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import { useMMKVStorage } from 'react-native-mmkv-storage';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import * as Yup from 'yup';

import { asyncStorage } from '../../store';
import TextInput from './Input/TextInput';
import Spacer from './Spacer';
import BoldText from './Text/BoldText';

export interface BottomTabNavigationHeaderProps extends BottomTabHeaderProps {
  useSearch?: boolean;
}

export interface NavigationHeaderProps extends StackHeaderProps {
  useSearch?: boolean;
  search?: (output: string) => void;
  headerRight?: React.ReactNode;
  style?: ViewStyle;
}

export default ({ useSearch = false, ...props }: NavigationHeaderProps) => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const searchInputRef = useRef<RNTextInput>(null);
  const [searchMode, setSearchMode] = useMMKVStorage(
    'searchMode',
    asyncStorage,
    false,
  );

  const ValidationSchema = Yup.object().shape({
    search: Yup.string(),
  });

  if (useSearch && searchMode) {
    return (
      <View
        // eslint-disable-next-line react-native/no-inline-styles
        style={{
          ...navHeaderStyles.navigationContainer,
          paddingTop: insets.top,
          backgroundColor: '#FFF',
        }}>
        <View style={navHeaderStyles.buttonContainer}>
          <Pressable
            onPress={() => searchInputRef.current?.focus()}
            android_ripple={{ color: '#DADADA' }}>
            <Icon
              name="search"
              size={24}
              color="#000"
              style={navHeaderStyles.backButtonIcon}
            />
          </Pressable>
        </View>
        <Formik
          initialValues={{ search: '' }}
          validateOnBlur
          validateOnChange
          validationSchema={ValidationSchema}
          onSubmit={values => {
            props.search?.(values.search);
          }}>
          {({ values, handleChange, handleBlur, handleSubmit }) => (
            <View style={navHeaderStyles.flex}>
              <TextInput
                ref={searchInputRef}
                id="nav-search"
                placeholder="Search..."
                onBlur={handleBlur('search')}
                onChangeText={handleChange('search')}
                onChange={() => handleSubmit()}
                value={values.search}
                inputStyle={styles.searchInput}
              />
            </View>
          )}
        </Formik>
        <View style={{ paddingTop: insets.top }}>
          <Pressable onPress={() => setSearchMode(true)}>
            <Icon
              name="x"
              size={24}
              color="#74777F"
              style={navHeaderStyles.backButtonIcon}
            />
          </Pressable>
        </View>
      </View>
    );
  }

  if (useSearch && !searchMode) {
    return (
      <View
        // eslint-disable-next-line react-native/no-inline-styles
        style={{
          ...navHeaderStyles.navigationContainer,
          paddingTop: insets.top,
          backgroundColor: '#FFF',
        }}>
        <View style={navHeaderStyles.buttonContainer}>
          <Pressable
            onPress={() => navigation.goBack()}
            android_ripple={{ color: '#DADADA' }}>
            <Icon
              name="arrow-left"
              size={24}
              color="#000"
              style={navHeaderStyles.backButtonIcon}
            />
          </Pressable>
        </View>
        <BoldText
          type="title-small"
          numberOfLines={2}
          // eslint-disable-next-line react-native/no-inline-styles
          style={{
            paddingLeft: props.headerRight ? 46 : 0,
            paddingRight: props.headerRight ? 90 : 0,
            ...navHeaderStyles.headerTitle,
          }}>
          {props.options.title}
        </BoldText>
        <View style={{ paddingTop: insets.top }}>
          <Pressable onPress={() => setSearchMode(true)}>
            <Icon
              name="search"
              size={24}
              color="#74777F"
              style={navHeaderStyles.backButtonIcon}
            />
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View
      style={{
        paddingTop: insets.top,
        ...navHeaderStyles.navigationContainer,
        ...props.style,
      }}>
      <View style={navHeaderStyles.buttonContainer}>
        <Pressable
          onPress={() => props.navigation.pop()}
          android_ripple={{ color: '#DADADA' }}>
          <Icon
            name="arrow-left"
            size={24}
            color="#000"
            style={navHeaderStyles.backButtonIcon}
          />
        </Pressable>
      </View>
      <BoldText
        type="title-small"
        numberOfLines={2}
        // eslint-disable-next-line react-native/no-inline-styles
        style={{
          paddingLeft: props.headerRight ? 46 : 0,
          paddingRight: props.headerRight ? 90 : 0,
          ...navHeaderStyles.headerTitle,
        }}>
        {props.options.title}
      </BoldText>
      {props.headerRight ?? (
        <View style={navHeaderStyles.buttonContainer}>
          <Spacer width={40} />
        </View>
      )}
    </View>
  );
};

export const navHeaderStyles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  navigationContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
    backgroundColor: '#FCFCFF',
  },
  buttonContainer: {
    borderRadius: 24,
    paddingVertical: 2,
    overflow: 'hidden',
  },
  backButtonIcon: {
    padding: 12,
  },
  headerTitle: {
    flex: 1,
    paddingHorizontal: 16,
    textAlign: 'center',
  },
});

const styles = StyleSheet.create({
  contentContainer: {
    paddingVertical: 24,
  },
  filterPill: {
    flexDirection: 'row',
  },
  filterIcon: {
    alignSelf: 'center',
  },
  navHeader: {
    backgroundColor: '#FFF',
  },
  pillsContainer: {
    paddingBottom: 12,
    paddingHorizontal: 20,
  },
  saveButtonContainer: {
    position: 'absolute',
    right: 16,
  },
  saveText: {
    margin: -6,
    lineHeight: 21,
  },
  searchInput: {
    borderWidth: 0,
    backgroundColor: 'transparent',
  },
});
