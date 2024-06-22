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
import { createMemberDue } from '../../../store/actions';
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
  const dueInputRef = useRef<RNTextInput>(null);
  const paidInputRef = useRef<RNTextInput>(null);
  const remainingInputRef = useRef<RNTextInput>(null);

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateCreated, setDateCreated] = useState<Date>(new Date());
  const [showConfirmCreateDataDropdown, setShowConfirmCreateDataDropdown] =
    useState<{ state: boolean; values: {} } | null>(null);

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
    dues: Yup.object({
      date: Yup.string().required('Harus diisi'),
      due: Yup.string().required('Harus diisi'),
      paid: Yup.string().required('Harus diisi'),
      remaining: Yup.string().required('Harus diisi'),
    }),
  });

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#FCFCFF" />
      <Formik
        initialValues={{
          dues: {
            date: '',
            due: '',
            paid: '',
            remaining: '',
          },
        }}
        validateOnBlur
        validateOnChange
        validationSchema={ValidationSchema}
        onSubmit={values => {
          setShowConfirmCreateDataDropdown({
            state: true,
            values: {
              ...values.dues,
              dues: {
                date: values.dues?.date,
                due: values.dues?.due?.replace(/[.|,| |-]/g, ''),
                paid: values.dues?.paid?.replace(/[.|,| |-]/g, ''),
                remaining: values.dues?.remaining?.replace(/[.|,| |-]/g, ''),
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
                setFieldValue('dues.date', formattedDate);
                dateInputRef.current?.blur();
                if (!values.dues?.due) {
                  dueInputRef.current?.focus();
                } else if (!values.dues?.paid) {
                  paidInputRef.current?.focus();
                } else if (!values.dues?.remaining) {
                  remainingInputRef.current?.focus();
                }
              }}
              onCancel={() => {
                setShowDatePicker(false);
                dateInputRef.current?.blur();
              }}
            />
            <DropdownConfirm
              open={showConfirmCreateDataDropdown?.state}
              onClose={() => {
                setShowConfirmCreateDataDropdown({
                  state: false,
                  values: {},
                });
              }}
              content={
                <>
                  <BoldText type="title-medium">
                    Konfirmasi tambah data iuran
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
                    dispatch(
                      createMemberDue({
                        memberCode: route.params?.memberCode ?? '',
                        duesData: showConfirmCreateDataDropdown?.values?.dues,
                        onSuccess: () => {
                          setSnackbar({
                            show: true,
                            type: 'success',
                            message: 'Data sudah tersimpan',
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
                  },
                },
              }}
            />
            <ScrollView style={styles.container}>
              <SafeAreaView>
                <DismissableView style={styles.contentContainer}>
                  <BoldText type="title-medium">Tambah data iuran</BoldText>
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
                    id="due-date"
                    label="Tanggal iuran*"
                    placeholder="Contoh: 2024/01/01"
                    filledTextColor
                    rightIcons={{ custom: ['calendar'] }}
                    onChangeText={handleChange('dues.date')}
                    onBlur={handleBlur('dues.date')}
                    onFocus={() => setShowDatePicker(true)}
                    onPress={() => {
                      dateInputRef.current?.focus();
                      setShowDatePicker(true);
                    }}
                    onSubmitEditing={() => {
                      if (!values.dues?.due) {
                        dueInputRef.current?.focus();
                      } else if (!values.dues?.paid) {
                        paidInputRef.current?.focus();
                      } else if (!values.dues?.remaining) {
                        remainingInputRef.current?.focus();
                      }
                    }}
                    value={values.dues?.date.toUpperCase()}
                    error={touched.dues?.date && errors.dues?.date}
                  />
                  <TextInput
                    ref={dueInputRef}
                    id="due"
                    label="Total Iuran*"
                    placeholder="Contoh: 300000"
                    filledTextColor
                    keyboardType="decimal-pad"
                    leftLabel="Rp"
                    onChangeText={handleChange('dues.due')}
                    onBlur={handleBlur('dues.due')}
                    onSubmitEditing={() => {
                      if (!values.dues?.date) {
                        dateInputRef.current?.focus();
                      } else if (!values.dues?.paid) {
                        paidInputRef.current?.focus();
                      } else if (!values.dues?.remaining) {
                        remainingInputRef.current?.focus();
                      }
                    }}
                    value={
                      values.dues?.due
                        ? Number(
                            values.dues?.due?.replace(/[.|,| |-]/g, '') ?? 0,
                          ).toLocaleString()
                        : ''
                    }
                    error={touched.dues?.due && errors.dues?.due}
                  />
                  <Spacer height={16} />
                  <TextInput
                    ref={paidInputRef}
                    id="paid"
                    label="Total sudah dibayar*"
                    placeholder="Contoh: 200000"
                    filledTextColor
                    keyboardType="decimal-pad"
                    leftLabel="Rp"
                    onChangeText={handleChange('dues.paid')}
                    onBlur={handleBlur('dues.paid')}
                    onSubmitEditing={() => {
                      if (!values.dues?.date) {
                        dateInputRef.current?.focus();
                      } else if (!values.dues?.due) {
                        dueInputRef.current?.focus();
                      } else if (!values.dues?.remaining) {
                        remainingInputRef.current?.focus();
                      }
                    }}
                    value={
                      values.dues?.paid
                        ? Number(
                            values.dues?.paid?.replace(/[.|,| |-]/g, '') ?? 0,
                          ).toLocaleString()
                        : ''
                    }
                    error={touched.dues?.paid && errors.dues?.paid}
                  />
                  <Spacer height={16} />
                  <TextInput
                    ref={remainingInputRef}
                    id="remaining"
                    label="Sisa*"
                    placeholder="Contoh: 100000"
                    filledTextColor
                    keyboardType="decimal-pad"
                    leftLabel="Rp"
                    onChangeText={handleChange('dues.remaining')}
                    onBlur={handleBlur('dues.remaining')}
                    onSubmitEditing={() => {
                      if (!values.dues?.date) {
                        dateInputRef.current?.focus();
                      } else if (!values.dues?.due) {
                        dueInputRef.current?.focus();
                      } else if (!values.dues?.paid) {
                        paidInputRef.current?.focus();
                      }
                    }}
                    value={
                      values.dues?.remaining
                        ? Number(
                            values.dues?.remaining?.replace(/[.|,| |-]/g, '') ??
                              0,
                          ).toLocaleString()
                        : ''
                    }
                    error={touched.dues?.remaining && errors.dues?.remaining}
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
                  !values.dues?.date ||
                  !!errors.dues?.date ||
                  !values.dues?.due ||
                  !!errors.dues?.due ||
                  !values.dues?.paid ||
                  !!errors.dues?.paid ||
                  !values.dues?.remaining ||
                  !!errors.dues?.remaining
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
