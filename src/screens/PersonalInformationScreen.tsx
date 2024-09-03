import { useNavigation } from '@react-navigation/native';
import { Formik } from 'formik';
import React, { useRef } from 'react';
import {
  TextInput as RNTextInput,
  ScrollView,
  StatusBar,
  StyleSheet,
} from 'react-native';
import { useMMKVStorage } from 'react-native-mmkv-storage';
import * as Yup from 'yup';

import { asyncStorage } from '../../store';
import { setUserData } from '../../store/actions';
import { useAppDispatch } from '../../store/hooks';
import { Button, Spacer, TextInput } from '../components';

export default () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation();

  const [_, setSnackbar] = useMMKVStorage<{
    show: boolean;
    type: 'success' | 'error';
    message: string;
  } | null>('snackbar', asyncStorage, null);
  const [credentials, setCredentials] = useMMKVStorage<{
    token: string;
    name: string;
    email: string;
    photo: string;
  } | null>('credentials', asyncStorage, null);

  const nameInputRef = useRef<RNTextInput>(null);
  const emailInputRef = useRef<RNTextInput>(null);

  const ValidationSchema = Yup.object().shape({
    name: Yup.string().required('Harus diisi'),
    email: Yup.string().required('Harus diisi').email('Format email salah'),
  });

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#FCFCFF" />
      <Formik
        enableReinitialize
        initialValues={{
          name: credentials?.name,
          email: credentials?.email,
          photoURL: credentials?.photo,
        }}
        validateOnBlur
        validateOnChange
        validationSchema={ValidationSchema}
        onSubmit={values => {
          if (credentials?.token) {
            dispatch(
              setUserData({
                name: values.name ?? '',
                email: values.email ?? '',
                photo: values.photoURL ?? '',
                onSuccess: () => {
                  setCredentials({
                    token: credentials.token ?? '',
                    name: values.name ?? '',
                    email: values.email ?? '',
                    photo: values.photoURL ?? '',
                  });
                  setSnackbar({
                    show: true,
                    type: 'success',
                    message: 'Update profile sudah disimpan',
                  });
                  navigation.goBack();
                },
                onError: () => {
                  setSnackbar({
                    show: true,
                    type: 'error',
                    message: 'Ada kesalahan. Mohon coba lagi nanti',
                  });
                },
              }),
            );
          }
        }}>
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
        }) => (
          <ScrollView contentContainerStyle={styles.container}>
            {/* <Pressable
              style={styles.avatarContainer}
              onPress={() => {
                ImagePicker?.openPicker({
                  mediaType: 'photo',
                  cropping: true,
                  width: 300,
                  height: 300,
                  croppingOptions: {
                    freeStyleCropEnabled: true,
                  },
                  compressImageQuality: 0.75,
                }).then(v => {
                  setFieldValue('photoURL', v.path);
                });
              }}>
              <FastImage
                defaultSource={require('../../assets/images/avatar.png')}
                source={{ uri: values.photoURL }}
                resizeMode={FastImage.resizeMode.cover}
                style={styles.avatar}
              />
              <Pressable
                style={styles.cameraIconContainer}
                onPress={() => {
                  ImagePicker?.openPicker({
                    mediaType: 'photo',
                    cropping: true,
                    width: 300,
                    height: 300,
                    croppingOptions: {
                      freeStyleCropEnabled: true,
                    },
                    compressImageQuality: 0.75,
                  }).then(v => {
                    setFieldValue('photoURL', v.path);
                  });
                }}>
                <Icon name="camera" size={12} style={styles.cameraIcon} />
              </Pressable>
            </Pressable>
            <Spacer height={40} /> */}
            <TextInput
              ref={nameInputRef}
              editable={!!credentials?.token}
              id="name"
              placeholder="Name"
              onChangeText={handleChange('name')}
              onBlur={handleBlur('name')}
              onSubmitEditing={() => {
                if (!values.email) {
                  emailInputRef.current?.focus();
                }
              }}
              value={values.name}
              error={touched.name && errors.name}
            />
            <Spacer height={16} />
            <TextInput
              ref={emailInputRef}
              editable={!!credentials?.token}
              id="email"
              placeholder="Email"
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              onSubmitEditing={() => {
                if (!values.name) {
                  nameInputRef.current?.focus();
                }
              }}
              value={values.email}
              error={touched.email && errors.email}
            />
            <Spacer height={32} />
            <Button
              type="primary"
              disabled={
                !values.name ||
                !!errors.name ||
                !values.email ||
                !!errors.email ||
                (values.name === credentials?.name &&
                  values.email === credentials?.email)
              }
              onPress={handleSubmit}>
              Save
            </Button>
          </ScrollView>
        )}
      </Formik>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FCFCFF',
  },
  avatarContainer: {
    width: 100,
    height: 100,
    alignSelf: 'center',
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 100,
  },
  cameraIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 24,
    height: 24,
    borderRadius: 24,
    justifyContent: 'center',
    backgroundColor: '#1B72C0',
  },
  cameraIcon: {
    alignSelf: 'center',
    bottom: 1,
  },
});
