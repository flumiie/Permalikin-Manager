import { useNavigation } from '@react-navigation/core';
import { StackNavigationProp } from '@react-navigation/stack';
import { Formik } from 'formik';
import React, { useRef, useState } from 'react';
import {
  Pressable,
  TextInput as RNTextInput,
  StyleSheet,
  View,
} from 'react-native';
import { useMMKVStorage } from 'react-native-mmkv-storage';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Yup from 'yup';

import { asyncStorage } from '../../store';
import { getAuth } from '../../store/actions';
import { useAppDispatch } from '../../store/hooks';
import { AuthStackParamList } from '../Routes';
import {
  Button,
  MediumText,
  RegularText,
  Snackbar,
  Spacer,
  TextInput,
} from '../components';

export default () => {
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();
  const navigation = useNavigation<StackNavigationProp<AuthStackParamList>>();
  const [_, setCredentials] = useMMKVStorage(
    'userCredentials',
    asyncStorage,
    null,
  );
  const emailInputRef = useRef<RNTextInput>(null);
  const passwordInputRef = useRef<RNTextInput>(null);
  const [passwordInvisible, setPasswordInvisible] = useState(true);
  const [isSnackbarVisible, setSnackbarVisible] = useState(false);

  const ValidationSchema = Yup.object().shape({
    email: Yup.string()
      .required('This field is mandatory')
      .email('Invalid email address'),
    password: Yup.string().required('This field is mandatory'),
  });

  return (
    <>
      <View style={{ paddingTop: insets.top }}>
        <Snackbar
          visible={isSnackbarVisible}
          onHide={() => setSnackbarVisible(false)}
          type="error"
          message="Wrong email or password"
        />
      </View>
      <Formik
        initialValues={{ email: '', password: '' }}
        validateOnBlur
        validateOnChange
        validationSchema={ValidationSchema}
        onSubmit={values => {
          dispatch(
            getAuth({
              email: values.email,
              password: values.password,
              onSuccess: v => {
                setCredentials(v);
              },
              onError: () => {
                setSnackbarVisible(true);
              },
            }),
          );
        }}>
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
        }) => (
          <View
            style={{
              paddingTop: 72 + insets.top,
              ...styles.container,
            }}>
            <MediumText size={28} color="#BF2229" style={styles.title}>
              Sign In
            </MediumText>
            <Spacer height={40} />
            <TextInput
              ref={emailInputRef}
              id="email"
              placeholder="Email"
              keyboardType="email-address"
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              onSubmitEditing={() => {
                if (!values.password) {
                  passwordInputRef.current?.focus();
                }
                emailInputRef.current?.blur();
              }}
              value={values.email}
              error={touched.email && errors.email}
            />
            <Spacer height={16} />
            <TextInput
              ref={passwordInputRef}
              id="password"
              placeholder="Password"
              onChangeText={handleChange('password')}
              onBlur={handleBlur('password')}
              onSubmitEditing={() => {
                if (!values.email) {
                  emailInputRef.current?.focus();
                }
                passwordInputRef.current?.blur();
              }}
              secureTextEntry={passwordInvisible}
              rightIcons={{
                password: passwordInvisible ? 'eye-off' : 'eye',
              }}
              showPassword={() => {
                setPasswordInvisible(!passwordInvisible);
              }}
              value={values.password}
              error={touched.password && errors.password}
            />
            <Spacer height={32} />
            <Button
              type="primary"
              disabled={
                !values.email ||
                !!errors.email ||
                !values.password ||
                !!errors.password
              }
              onPress={handleSubmit}>
              Sign In
            </Button>
            <Spacer height={16} />
            <View style={styles.row}>
              <RegularText>Don't have an account yet? </RegularText>
              <Pressable
                onPress={() => {
                  navigation.navigate('SignUp');
                }}>
                <RegularText color="#BF2229">Sign Up</RegularText>
              </Pressable>
            </View>
          </View>
        )}
      </Formik>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  column: {
    flex: 1,
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingVertical: 6,
    paddingHorizontal: 20,
  },
  row: {
    flexDirection: 'row',
  },
  title: {
    textAlign: 'center',
  },
  tosCheck: {
    flexDirection: 'row',
  },
  rightIcon: {
    position: 'absolute',
    right: 12,
    alignSelf: 'center',
    padding: 4,
  },
});
