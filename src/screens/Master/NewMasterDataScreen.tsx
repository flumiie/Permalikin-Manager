import { RouteProp, useNavigation, useRoute } from '@react-navigation/core';
import { StackNavigationProp } from '@react-navigation/stack';
import { Formik } from 'formik';
import React, { useRef, useState } from 'react';
import {
  Dimensions,
  TextInput as RNTextInput,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Yup from 'yup';

import { RootStackParamList } from '../../Routes';
import {
  BoldText,
  Button,
  DismissableView,
  DropdownSelect,
  MediumText,
  RegularText,
  Spacer,
  TextInput,
} from '../../components';
import CITIES from '../../libs/cities.json';
import COUNTRIES from '../../libs/countries.json';
import { CityType, CountryType } from '../../libs/dataTypes';
import { decimalize, getProvincesFromCountry } from '../../libs/functions';

const TYPES = ['OH', 'BB'];
const STATES = ['CDGP', 'CDL', 'UTL', 'OM', 'PP'];

export default () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'NewMasterData'>>();

  const fullNameInputRef = useRef<RNTextInput>(null);
  const birthPlaceDateInputRef = useRef<RNTextInput>(null);
  const identityCardAddressInputRef = useRef<RNTextInput>(null);
  const countryInputRef = useRef<RNTextInput>(null);
  const stateInputRef = useRef<RNTextInput>(null);
  const cityInputRef = useRef<RNTextInput>(null);
  const zipCodeInputRef = useRef<RNTextInput>(null);
  const phoneNoInputRef = useRef<RNTextInput>(null);
  const emailInputRef = useRef<RNTextInput>(null);
  const statusInputRef = useRef<RNTextInput>(null);
  const balanceInitialInputRef = useRef<RNTextInput>(null);
  const balanceEndInputRef = useRef<RNTextInput>(null);

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
    fullName: Yup.string().required('Harus diisi'),
    birthPlaceDate: Yup.string().required('Harus diisi'),
    address: Yup.object({
      identityCardAddress: Yup.string().required('Harus diisi'),
      country: Yup.string().required('Harus diisi'),
      state: Yup.string().required('Harus diisi'),
      city: Yup.string().required('Harus diisi'),
      zipCode: Yup.string().required('Harus diisi'),
    }),
    phoneNo: Yup.string().required('Harus diisi'),
    email: Yup.string().email('Format email salah').required('Harus diisi'),
    status: Yup.string().required('Harus diisi'),
    balance: Yup.object({
      initial: Yup.string().required('Harus diisi'),
      end: Yup.string().required('Harus diisi'),
    }),
  });

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#FCFCFF" />
      <Formik
        enableReinitialize
        initialValues={{
          fullName: '',
          birthPlaceDate: '',
          phoneNo: '',
          email: '',
          status: '',
          address: {
            identityCardAddress: '',
            country: '',
            state: '',
            zipCode: '',
            city: '',
          },
          balance: {
            initial: '',
            end: '',
          },
        }}
        validateOnBlur
        validateOnChange
        validationSchema={ValidationSchema}
        onSubmit={values => {
          // navigation.navigate(
          //   route.name.includes('Clearance')
          //     ? 'AddClearanceData'
          //     : 'AddVibrationData',
          //   {
          //     areaCode: values.areaCode,
          //     category: values.category,
          //     dateCreated: values.dateCreated,
          //     timeCreated: values.timeCreated,
          //     type: values.type,
          //     unit: values.unit,
          //     area: values.area,
          //   },
          // );
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
            {/* <DropdownSelect
              open={showCountriesDropdown}
              title="Pilih Negara"
              options={COUNTRIES.map(S => S.name)}
              selected={selectedCountry?.name ?? ''}
              onSelect={v => {
                const countryFound = COUNTRIES.find(
                  S => S.name === v && S.filename !== undefined,
                );
                setSelectedCountry(countryFound);
                setFieldValue('address.country', v);
                countryInputRef.current?.blur();
                // if (!values.fullName) {
                //   fullNameInputRef.current?.focus();
                // } else if (!values.birthPlaceDate) {
                //   birthPlaceDateInputRef.current?.focus();
                // }
              }}
              onClose={() => {
                setShowCountriesDropdown(false);
                countryInputRef.current?.blur();
              }}
            />
            <DropdownSelect
              open={showProvinceDropdown}
              title="Pilih Provinsi"
              options={
                getProvincesFromCountry(selectedCountry?.name).map(
                  S => S?.name,
                ) ?? ['']
              }
              selected={selectedProvince}
              onSelect={v => {
                setSelectedProvince(v);
                setFieldValue('address.state', v);
                stateInputRef.current?.blur();
                // if (!values.fullName) {
                //   fullNameInputRef.current?.focus();
                // } else if (!values.birthPlaceDate) {
                //   birthPlaceDateInputRef.current?.focus();
                // }
              }}
              onClose={() => {
                setShowProvinceDropdown(false);
                stateInputRef.current?.blur();
              }}
            />
            <DropdownSelect
              open={showCitiesDropdown}
              title="Pilih Kota"
              options={(CITIES as CityType[])
                .filter(
                  S => (S?.country ?? '') === (selectedCountry?.code ?? ''),
                )
                .map(S => S?.name ?? '')}
              selected={selectedCity?.name ?? ''}
              onSelect={v => {
                const res = (CITIES as CityType[]).find(S => S?.name === v);
                setSelectedCity(res);
                setFieldValue('address.city', res?.name);
                cityInputRef.current?.blur();
                // if (!values.fullName) {
                //   fullNameInputRef.current?.focus();
                // } else if (!values.birthPlaceDate) {
                //   birthPlaceDateInputRef.current?.focus();
                // }
              }}
              onClose={() => {
                setShowCitiesDropdown(false);
                cityInputRef.current?.blur();
              }}
            />
            <DropdownSelect
              open={showZipCodeDropdown}
              title="Pilih Kode Pos"
              options={['Zip code list here']}
              selected={selectedZipCode}
              onSelect={v => {
                setSelectedZipCode(v);
                setFieldValue('address.zipCode', v);
                zipCodeInputRef.current?.blur();
                // if (!values.fullName) {
                //   fullNameInputRef.current?.focus();
                // } else if (!values.birthPlaceDate) {
                //   birthPlaceDateInputRef.current?.focus();
                // }
              }}
              onClose={() => {
                setShowZipCodeDropdown(false);
                zipCodeInputRef.current?.blur();
              }}
            /> */}
            <ScrollView style={styles.container}>
              <SafeAreaView>
                <DismissableView style={styles.contentContainer}>
                  <BoldText type="title-medium">Buat master data baru</BoldText>
                  <Spacer height={4} />
                  <RegularText type="body-small" color="#4B4B4B">
                    Silakan masukan data terlebih dahulu untuk melanjutkan
                  </RegularText>
                  <Spacer height={24} />
                  <TextInput
                    ref={fullNameInputRef}
                    id="full-name"
                    label="Nama Lengkap"
                    placeholder="Contoh: Robbi Firmansyah"
                    filledTextColor
                    onChangeText={handleChange('fullName')}
                    onBlur={handleBlur('fullName')}
                    onSubmitEditing={() => {
                      // if (!values.areaCode) {
                      //   birthPlaceDateInputRef.current?.focus();
                      // } else if (!values.timeCreated) {
                      //   identityCardAddressInputRef.current?.focus();
                      // } else if (!values.type) {
                      //   domicileInputRef.current?.focus();
                      // } else if (!values.unit) {
                      //   phoneNoInputRef.current?.focus();
                      // } else if (!values.area) {
                      //   areaInputRef.current?.focus();
                      // }
                    }}
                    value={values.fullName}
                    error={touched.fullName && errors.fullName}
                  />
                  <Spacer height={16} />
                  <TextInput
                    ref={birthPlaceDateInputRef}
                    id="birth-place-date"
                    label="Tempat / Tgl. Lahir"
                    placeholder="Contoh: Jakarta, 01 Jan 1960"
                    filledTextColor
                    onChangeText={handleChange('birthPlaceDate')}
                    onBlur={handleBlur('birthPlaceDate')}
                    onSubmitEditing={() => {
                      //
                    }}
                    value={values.birthPlaceDate}
                    error={touched.birthPlaceDate && errors.birthPlaceDate}
                  />
                  <Spacer height={16} />
                  <TextInput
                    ref={phoneNoInputRef}
                    id="phoneNo"
                    label="Nomor HP"
                    placeholder="Contoh: 082111983759"
                    filledTextColor
                    onChangeText={handleChange('phoneNo')}
                    onBlur={handleBlur('phoneNo')}
                    value={values.phoneNo}
                    error={touched.phoneNo && errors.phoneNo}
                  />
                  <Spacer height={16} />
                  <TextInput
                    ref={emailInputRef}
                    id="email"
                    label="Email"
                    placeholder="Contoh: robbi@gmail.com"
                    filledTextColor
                    onChangeText={handleChange('email')}
                    onBlur={handleBlur('email')}
                    value={values.email}
                    error={touched.email && errors.email}
                  />
                  <Spacer height={16} />
                  <TextInput
                    ref={statusInputRef}
                    id="status"
                    label="Status"
                    placeholder="Contoh: Menikah"
                    filledTextColor
                    onChangeText={handleChange('status')}
                    onBlur={handleBlur('status')}
                    value={values.status}
                    error={touched.status && errors.status}
                  />
                  <Spacer height={16} />
                  <TextInput
                    ref={identityCardAddressInputRef}
                    id="identity-card-address"
                    label="Alamat KTP"
                    placeholder="Contoh: Jl. X, Blok A, No. 1"
                    filledTextColor
                    onChangeText={handleChange('address.identityCardAddress')}
                    onBlur={handleBlur('address.identityCardAddress')}
                    onSubmitEditing={() => {
                      //
                    }}
                    value={values.address?.identityCardAddress}
                    error={
                      touched.address?.identityCardAddress &&
                      errors.address?.identityCardAddress
                    }
                  />
                </DismissableView>

                <Spacer
                  height={1}
                  width={Dimensions.get('window').width}
                  color="#DDD"
                />

                <DismissableView style={styles.contentContainer}>
                  <MediumText type="label-large">Domisili</MediumText>
                  <Spacer height={16} />
                  <TextInput
                    ref={countryInputRef}
                    id="country"
                    label="Negara"
                    placeholder="Contoh: Indonesia"
                    filledTextColor
                    // showSoftInputOnFocus={false}
                    // rightIcons={{ custom: ['chevron-down'] }}
                    onChangeText={handleChange('address.country')}
                    onBlur={handleBlur('address.country')}
                    // onPress={() => {
                    //   countryInputRef.current?.focus();
                    //   setShowCountriesDropdown(true);
                    // }}
                    value={`${values.address.country
                      .charAt(0)
                      .toUpperCase()}${values.address?.country.substring(1)}`}
                    error={touched.address?.country && errors.address?.country}
                  />

                  <Spacer height={16} />
                  <TextInput
                    ref={stateInputRef}
                    // disabled={!values.address?.country}
                    id="state"
                    label="Provinsi"
                    placeholder="Contoh: Jawa Barat"
                    filledTextColor
                    // showSoftInputOnFocus={false}
                    // rightIcons={{ custom: ['chevron-down'] }}
                    onChangeText={handleChange('address.state')}
                    onBlur={handleBlur('address.state')}
                    // onFocus={() => {
                    //   if (selectedCountry?.filename) {
                    //     setShowProvinceDropdown(true);
                    //   }
                    // }}
                    value={`${values.address.state
                      .charAt(0)
                      .toUpperCase()}${values.address?.state.substring(1)}`}
                    error={touched.address?.state && errors.address?.state}
                    // onPress={() => {
                    //   stateInputRef.current?.focus();
                    //   if (selectedCountry?.filename) {
                    //     setShowProvinceDropdown(true);
                    //   }
                    // }}
                  />

                  <Spacer height={16} />
                  <TextInput
                    ref={cityInputRef}
                    // disabled={!values.address?.state}
                    id="city"
                    label="Kota"
                    placeholder="Contoh: Bekasi"
                    filledTextColor
                    // showSoftInputOnFocus={false}
                    // rightIcons={{ custom: ['chevron-down'] }}
                    onChangeText={handleChange('address.city')}
                    onBlur={handleBlur('address.city')}
                    // onFocus={() => setShowCitiesDropdown(true)}
                    value={`${values.address.city
                      .charAt(0)
                      .toUpperCase()}${values.address?.city.substring(1)}`}
                    error={touched.address?.city && errors.address?.city}
                    // onPress={() => {
                    //   cityInputRef.current?.focus();
                    //   setShowCitiesDropdown(true);
                    // }}
                  />
                  <Spacer height={16} />
                  <TextInput
                    ref={zipCodeInputRef}
                    // disabled={!values.address?.city}
                    id="zipCode"
                    label="Kode Pos"
                    placeholder="Contoh: 12345"
                    filledTextColor
                    keyboardType="number-pad"
                    // showSoftInputOnFocus={false}
                    // rightIcons={{ custom: ['chevron-down'] }}
                    onChangeText={handleChange('address.zipCode')}
                    onBlur={handleBlur('address.zipCode')}
                    // onFocus={() => setShowZipCodeDropdown(true)}
                    value={values.address.zipCode.replace(/[.|,| |-]/g, '')}
                    error={touched.address?.zipCode && errors.address?.zipCode}
                    // onPress={() => {
                    //   zipCodeInputRef.current?.focus();
                    //   setShowZipCodeDropdown(true);
                    // }}
                  />
                </DismissableView>

                <Spacer
                  height={1}
                  width={Dimensions.get('window').width}
                  color="#DDD"
                />

                <DismissableView style={styles.contentContainer}>
                  <MediumText type="label-large">Saldo</MediumText>
                  <Spacer height={16} />
                  <TextInput
                    ref={balanceInitialInputRef}
                    id="initial-balance"
                    label="Saldo Awal"
                    placeholder="Contoh: 1000000"
                    filledTextColor
                    keyboardType="decimal-pad"
                    leftLabel="Rp"
                    onChangeText={handleChange('balance.initial')}
                    onBlur={handleBlur('balance.initial')}
                    value={
                      values.balance.initial
                        ? Number(
                            values.balance.initial.replace(/[.|,| ]/g, ''),
                          ).toLocaleString()
                        : ''
                    }
                    error={touched.balance?.initial && errors.balance?.initial}
                  />
                  <Spacer height={16} />
                  <TextInput
                    ref={balanceEndInputRef}
                    id="end-balance"
                    label="Saldo Akhir"
                    placeholder="Contoh: 1000000"
                    filledTextColor
                    keyboardType="decimal-pad"
                    leftLabel="Rp"
                    onChangeText={handleChange('balance.end')}
                    onBlur={handleBlur('balance.end')}
                    value={
                      values.balance.end
                        ? Number(
                            values.balance.end.replace(/[.|,| ]/g, ''),
                          ).toLocaleString()
                        : ''
                    }
                    error={touched.balance?.end && errors.balance?.end}
                  />
                  <Spacer height={44} />
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
                  !values.fullName ||
                  !!errors.fullName ||
                  !values.birthPlaceDate ||
                  !!errors.birthPlaceDate ||
                  !values.phoneNo ||
                  !!errors.phoneNo ||
                  !values.email ||
                  !!errors.email ||
                  !values.status ||
                  !!errors.status ||
                  !values.address?.identityCardAddress ||
                  !!errors.address?.identityCardAddress ||
                  !values.address?.country ||
                  !!errors.address?.country ||
                  !values.address?.state ||
                  !!errors.address?.state ||
                  !values.address?.zipCode ||
                  !!errors.address?.zipCode ||
                  !values.address?.city ||
                  !!errors.address?.city ||
                  !values.balance?.initial ||
                  !!errors.balance?.initial ||
                  !values.balance?.end ||
                  !!errors.balance?.end
                }
                onPress={handleSubmit}>
                Next
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
