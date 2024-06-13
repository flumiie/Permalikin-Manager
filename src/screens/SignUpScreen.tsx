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
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import { useMMKVStorage } from 'react-native-mmkv-storage';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Yup from 'yup';

import { asyncStorage } from '../../store';
import { signUp } from '../../store/actions';
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
  const [_, setRegistrationStatus] = useMMKVStorage(
    'registrationStatus',
    asyncStorage,
    null,
  );

  const nameInputRef = useRef<RNTextInput>(null);
  const emailInputRef = useRef<RNTextInput>(null);
  const passwordInputRef = useRef<RNTextInput>(null);
  const [passwordInvisible, setPasswordInvisible] = useState(true);
  const [tosChecked, setTosChecked] = useState(false);
  const [showSnackbarError, setShowSnackbarError] = useState(false);

  const ValidationSchema = Yup.object().shape({
    name: Yup.string().required('This field is mandatory'),
    email: Yup.string()
      .required('This field is mandatory')
      .email('Invalid email address'),
    password: Yup.string().required('This field is mandatory'),
  });

  return (
    <>
      <View style={{ paddingTop: insets.top }}>
        <Snackbar
          visible={showSnackbarError}
          onHide={() => setShowSnackbarError(false)}
          type="error"
          message="Something wrong happened. Please try again later"
        />
      </View>
      <View
        style={{
          paddingTop: 72 + insets.top,
          ...styles.container,
        }}>
        <MediumText size={28} color="#1B72C0" style={styles.title}>
          Sign Up
        </MediumText>
        <Spacer height={40} />
        <Formik
          enableReinitialize={false}
          initialValues={{ name: '', email: '', password: '' }}
          validateOnBlur
          validateOnChange
          validationSchema={ValidationSchema}
          onSubmit={values => {
            dispatch(
              signUp({
                name: values.name,
                email: values.email,
                password: values.password,
                onSuccess: v => {
                  setRegistrationStatus(v);
                },
                onError: () => {
                  setShowSnackbarError(true);
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
            <View>
              <TextInput
                ref={nameInputRef}
                id="name"
                placeholder="Name"
                onChangeText={handleChange('name')}
                onBlur={handleBlur('name')}
                onSubmitEditing={() => {
                  if (!values.email) {
                    emailInputRef.current?.focus();
                  } else if (!values.password) {
                    passwordInputRef.current?.focus();
                  }
                  nameInputRef.current?.blur();
                }}
                value={values.name}
                error={touched.name && errors.name}
              />
              <Spacer height={16} />
              <TextInput
                ref={emailInputRef}
                id="email"
                placeholder="Email"
                keyboardType="email-address"
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                onSubmitEditing={() => {
                  if (!values.name) {
                    nameInputRef.current?.focus();
                  } else if (!values.password) {
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
                  if (!values.name) {
                    nameInputRef.current?.focus();
                  } else if (!values.email) {
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
              <Spacer height={20} />
              <View style={styles.tosCheck}>
                <BouncyCheckbox
                  size={24}
                  fillColor="#1B72C0"
                  unFillColor="#FFF"
                  innerIconStyle={styles.checkboxIcon}
                  textComponent={
                    <>
                      <Spacer width={14} />
                      <RegularText size={12}>
                        I agree to the{' '}
                        <RegularText
                          size={12}
                          color="#1B72C0"
                          onPress={() => {
                            //TODO: Terms of Service page
                          }}>
                          Terms of Service
                        </RegularText>{' '}
                        and{' '}
                        <RegularText
                          size={12}
                          color="#1B72C0"
                          onPress={() => {
                            //TODO: Privacy Policy page
                          }}>
                          Privacy Policy
                        </RegularText>
                      </RegularText>
                    </>
                  }
                  onPress={(isChecked: boolean) => {
                    setTosChecked(isChecked);
                  }}
                />
              </View>
              <Spacer height={32} />
              <Button
                type="primary"
                disabled={
                  !values.name ||
                  !!errors.name ||
                  !values.email ||
                  !!errors.email ||
                  !values.password ||
                  !!errors.password ||
                  !tosChecked
                }
                onPress={handleSubmit}>
                Create Account
              </Button>
            </View>
          )}
        </Formik>
        <Spacer height={16} />
        <View style={styles.signInButtonContainer}>
          <RegularText>Already have an account? </RegularText>
          <Pressable
            onPress={() => {
              navigation.goBack();
            }}>
            <RegularText color="#1b72c0">Sign In</RegularText>
          </Pressable>
        </View>
      </View>
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
  title: {
    textAlign: 'center',
  },
  tosCheck: {
    flexDirection: 'row',
  },
  checkboxIcon: {
    borderRadius: 4,
    borderWidth: 3.5,
  },
  signInButtonContainer: {
    flexDirection: 'row',
  },
});
