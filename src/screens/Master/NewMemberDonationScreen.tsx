import { RouteProp, useNavigation, useRoute } from '@react-navigation/core';
import { StackNavigationProp } from '@react-navigation/stack';
import dayjs from 'dayjs';
import { Formik } from 'formik';
import React, { useRef, useState } from 'react';
import {
  TextInput as RNTextInput,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import DatePicker from 'react-native-date-picker';
import { useMMKVStorage } from 'react-native-mmkv-storage';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Yup from 'yup';

import { asyncStorage } from '../../../store';
import { createMemberDonation } from '../../../store/actions';
import { useAppDispatch } from '../../../store/hooks';
import { RootStackParamList } from '../../Routes';
import {
  BoldText,
  Button,
  DismissableView,
  DropdownConfirm,
  RegularText,
  Spacer,
  TextInput,
} from '../../components';
import { MemberDonationsType } from '../../libs/dataTypes';

export default () => {
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'NewMemberDue'>>();

  const [_, setSnackbar] = useMMKVStorage<{
    show: boolean;
    type: 'success' | 'error';
    message: string;
  } | null>('snackbar', asyncStorage, null);

  // const avatarInputRef = useRef<RNTextInput>(null);
  const dateInputRef = useRef<RNTextInput>(null);
  const donationInputRef = useRef<RNTextInput>(null);

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateCreated, setDateCreated] = useState<Date>(new Date());
  const [showConfirmCreateDataDropdown, setShowConfirmCreateDataDropdown] =
    useState<{
      state: boolean;
      values: { donations: MemberDonationsType } | null;
    } | null>(null);

  // const [showCountriesDropdown, setShowCountriesDropdown] = useState(false);
  // const [showProvinceDropdown, setShowProvinceDropdown] = useState(false);
  // const [showCitiesDropdown, setShowCitiesDropdown] = useState(false);
  // const [showZipCodeDropdown, setShowZipCodeDropdown] = useState(false);
  // const [selectedCountry, setSelectedCountry] = useState<CountryType>({
  //   name: '',
  //   code: '',
  //   continent: '',
  // });
  // const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
  // const [selectedCity, setSelectedCity] = useState<CityType>({
  //   name: '',
  //   country: '',
  //   admin1: '',
  //   admin2: '',
  //   lat: '',
  //   lng: '',
  // });
  // const [selectedZipCode, setSelectedZipCode] = useState<string | null>(null);

  const ValidationSchema = Yup.object().shape({
    donations: Yup.object({
      date: Yup.string().required('Harus diisi'),
      amount: Yup.string().required('Harus diisi'),
    }),
  });

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#FCFCFF" />
      <Formik
        initialValues={{
          donations: {
            date: '',
            amount: '',
          },
        }}
        validateOnBlur
        validateOnChange
        validationSchema={ValidationSchema}
        onSubmit={values => {
          setShowConfirmCreateDataDropdown({
            state: true,
            values: {
              ...values.donations,
              donations: {
                date: values.donations?.date,
                amount: values.donations?.amount?.replace(/[.|,| |-]/g, ''),
              },
            },
          });
        }}>
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          setFieldValue,
        }) => (
          <>
            <StatusBar backgroundColor="#FFF" />
            <DatePicker
              modal
              id="picker-dateCreated"
              mode="date"
              open={showDatePicker}
              date={dateCreated}
              onConfirm={date => {
                const formattedDate = dayjs(date).format('YYYY/MM/DD');
                setShowDatePicker(false);
                setDateCreated(date);
                setFieldValue('donations.date', formattedDate);
                dateInputRef.current?.blur();
                if (!values.donations?.amount) {
                  donationInputRef.current?.focus();
                }
              }}
              onCancel={() => {
                setShowDatePicker(false);
                dateInputRef.current?.blur();
              }}
            />
            <DropdownConfirm
              open={showConfirmCreateDataDropdown?.state ?? false}
              onClose={() => {
                setShowConfirmCreateDataDropdown({
                  state: false,
                  values: null,
                });
              }}
              content={
                <>
                  <BoldText type="title-medium">
                    Konfirmasi tambah data donasi
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
                      values: null,
                    });
                  },
                },
                right: {
                  label: 'OK',
                  onPress: () => {
                    dispatch(
                      createMemberDonation({
                        memberCode: route.params?.memberCode ?? '',
                        donationsData:
                          showConfirmCreateDataDropdown?.values?.donations,
                        onSuccess: () => {
                          setSnackbar({
                            show: true,
                            type: 'success',
                            message: 'Data sudah tersimpan',
                          });
                          navigation.goBack();
                        },
                        onError: v => {
                          console.log(v);
                          setSnackbar({
                            show: true,
                            type: 'error',
                            message: 'Ada kesalahan. Mohon coba lagi nanti',
                          });
                        },
                      }),
                    );
                    setShowConfirmCreateDataDropdown({
                      state: false,
                      values: null,
                    });
                  },
                },
              }}
            />
            <ScrollView style={styles.container}>
              <SafeAreaView>
                <DismissableView style={styles.contentContainer}>
                  <BoldText type="title-medium">Tambah data donasi</BoldText>
                  <Spacer height={4} />
                  <RegularText type="body-small" color="#4B4B4B">
                    Silakan masukan data terlebih dahulu untuk melanjutkan
                  </RegularText>
                  <Spacer height={8} />
                  <RegularText type="body-small" color="#AAA">
                    * Harus diisi
                  </RegularText>
                  <Spacer height={24} />
                  <TextInput
                    ref={dateInputRef}
                    id="donation-date"
                    label="Tanggal donasi*"
                    placeholder="Contoh: 2024/01/01"
                    filledTextColor
                    rightIcons={{ custom: ['calendar'] }}
                    onChangeText={handleChange('donations.date')}
                    onBlur={handleBlur('donations.date')}
                    onFocus={() => setShowDatePicker(true)}
                    onPress={() => {
                      dateInputRef.current?.focus();
                      setShowDatePicker(true);
                    }}
                    onSubmitEditing={() => {
                      if (!values.donations?.amount) {
                        donationInputRef.current?.focus();
                      }
                    }}
                    value={values.donations?.date.toUpperCase()}
                    error={touched.donations?.date && errors.donations?.date}
                  />
                  <Spacer height={16} />
                  <TextInput
                    ref={donationInputRef}
                    id="donation-amount"
                    label="Total Donasi*"
                    placeholder="Contoh: 300000"
                    filledTextColor
                    keyboardType="decimal-pad"
                    leftLabel="Rp"
                    onChangeText={handleChange('donations.amount')}
                    onBlur={handleBlur('donations.amount')}
                    onSubmitEditing={() => {
                      if (!values.donations?.date) {
                        dateInputRef.current?.focus();
                      }
                    }}
                    value={
                      values.donations?.amount
                        ? Number(
                            values.donations?.amount?.replace(
                              /[.|,| |-]/g,
                              '',
                            ) ?? 0,
                          ).toLocaleString()
                        : ''
                    }
                    error={
                      touched.donations?.amount && errors.donations?.amount
                    }
                  />
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
                  !values.donations?.date ||
                  !!errors.donations?.date ||
                  !values.donations?.amount ||
                  !!errors.donations?.amount
                }
                onPress={handleSubmit}>
                Simpan
              </Button>
            </View>
          </>
        )}
      </Formik>
    </>
  );
};

const styles = StyleSheet.create({
  // avatarContainer: {
  //   width: 100,
  //   height: 100,
  // },
  // avatar: {
  //   width: '100%',
  //   height: '100%',
  //   borderRadius: 100,
  // },
  // cameraIconContainer: {
  //   position: 'absolute',
  //   bottom: 0,
  //   right: 0,
  //   width: 24,
  //   height: 24,
  //   borderRadius: 24,
  //   justifyContent: 'center',
  //   backgroundColor: '#1B72C0',
  // },
  // cameraIcon: {
  //   alignSelf: 'center',
  //   bottom: 1,
  // },
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
