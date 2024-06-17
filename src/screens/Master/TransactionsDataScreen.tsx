import firestore from '@react-native-firebase/firestore';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/core';
import { StackNavigationProp } from '@react-navigation/stack';
import { Formik } from 'formik';
import React, { useEffect, useRef, useState } from 'react';
import {
  Dimensions,
  TextInput as RNTextInput,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import { useMMKVStorage } from 'react-native-mmkv-storage';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Yup from 'yup';

import { asyncStorage } from '../../../store';
import { RootStackParamList } from '../../Routes';
import {
  BoldText,
  Button,
  DismissableView,
  DropdownConfirm,
  RegularText,
  Spacer,
} from '../../components';

export default () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'TransactionsData'>>();

  const [_, setAddDataStatus] = useMMKVStorage(
    'addDataStatus',
    asyncStorage,
    false,
  );

  const [showConfirmCreateDataDropdown, setShowConfirmCreateDataDropdown] =
    useState({
      state: false,
      values: {},
    });

  const ValidationSchema = Yup.object().shape({
    fullName: Yup.string().required('Harus diisi'),
  });

  useEffect(() => {
    navigation.setOptions({
      title: 'Riwayat Transaksi',
    });
  });

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#FCFCFF" />
      <Formik
        initialValues={
          {
            // income: [
            //   {
            //     memberDues: '',
            //     donation: '',
            //     interest: '',
            //   },
            // ],
            // outcome: {
            //   employeeSalary: '',
            //   KTRNeeds: '',
            //   financialAllowance: '',
            //   interestTax: '',
            //   tax: '',
            //   consumptions: '',
            // },
          }
        }
        validateOnBlur
        validateOnChange
        validationSchema={ValidationSchema}
        onSubmit={values => {
          setShowConfirmCreateDataDropdown({
            state: true,
            values,
          });
        }}>
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
        }) => (
          <>
            <StatusBar backgroundColor="#FFF" />
            <DropdownConfirm
              open={showConfirmCreateDataDropdown.state}
              onClose={() => {
                setShowConfirmCreateDataDropdown({
                  state: false,
                  values: {},
                });
              }}
              content={
                <>
                  <BoldText type="title-medium">
                    Konfirmasi tambah master data
                  </BoldText>
                  <Spacer height={8} />
                  <RegularText type="body-small">
                    Yakin data sudah benar? Data akan ditambahkan setelah
                    menekan OK
                  </RegularText>
                </>
              }
              actions={{
                left: {
                  label: 'Batal',
                  onPress: () => {
                    setShowConfirmCreateDataDropdown({
                      state: false,
                      values: {},
                    });
                  },
                },
                right: {
                  label: 'OK',
                  onPress: () => {
                    setShowConfirmCreateDataDropdown({
                      state: false,
                      values: {},
                    });
                    firestore()
                      .collection('Personels')
                      .doc()
                      .get()
                      .then(res => {
                        return res;
                      });
                  },
                },
              }}
            />
            <ScrollView style={styles.container}>
              <SafeAreaView>
                <DismissableView style={styles.contentContainer}>
                  <BoldText type="title-medium">
                    Riwayat transaksi {route.params?.fullName}
                  </BoldText>
                  <Spacer height={24} />
                  <RegularText>PUT flatlist data here</RegularText>
                  <Spacer height={16} />
                </DismissableView>
              </SafeAreaView>
            </ScrollView>
            <View
              style={{
                ...styles.buttonContainer,
                paddingBottom: insets.bottom + 16,
              }}>
              <Button
                type="primary"
                disabled={
                  false
                  // !values.avatar ||
                  // !!errors.avatar ||
                }
                onPress={handleSubmit}>
                Tambah Transaksi
              </Button>
            </View>
          </>
        )}
      </Formik>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  buttonContainer: {
    paddingTop: 16,
    paddingHorizontal: 24,
    borderTopWidth: 1,
    borderTopColor: '#EEE',
    backgroundColor: '#FFF',
  },
});
