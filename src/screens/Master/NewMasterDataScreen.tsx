import { RouteProp, useNavigation, useRoute } from '@react-navigation/core';
import { StackNavigationProp } from '@react-navigation/stack';
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
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Yup from 'yup';

import { RootStackParamList } from '../../Routes';
import {
  BoldText,
  Button,
  DismissableView,
  DropdownSelect,
  RegularText,
  Spacer,
  TextInput,
} from '../../components';
import COUNTRIES from '../../libs/countries.json';

const TYPES = ['OH', 'BB'];
const AREAS = ['CDGP', 'CDL', 'UTL', 'OM', 'PP'];

export default () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'NewMasterData'>>();

  const fullNameInputRef = useRef<RNTextInput>(null);
  const birthPlaceDateInputRef = useRef<RNTextInput>(null);
  const identityCardAddressInputRef = useRef<RNTextInput>(null);
  const countryInputRef = useRef<RNTextInput>(null);
  const areaInputRef = useRef<RNTextInput>(null);
  const areaCodeInputRef = useRef<RNTextInput>(null);
  const phoneNoInputRef = useRef<RNTextInput>(null);
  const emailInputRef = useRef<RNTextInput>(null);
  const statusInputRef = useRef<RNTextInput>(null);
  const balanceInitialInputRef = useRef<RNTextInput>(null);
  const balanceEndInputRef = useRef<RNTextInput>(null);

  const [showAreaDropdown, setShowAreaDropdown] = useState(false);
  const [showCountriesDropdown, setShowCountriesDropdown] = useState(false);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedArea, setSelectedArea] = useState<string | null>(null);

  const ValidationSchema = Yup.object().shape({
    areaCode: Yup.string().required('Harus diisi'),
    dateCreated: Yup.string()
      .matches(
        /^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/g,
        'Format must be yyyy-mm-dd',
      )
      .required('Harus diisi'),
    timeCreated: Yup.string()
      .matches(
        /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/g,
        'Format must be in 24h format',
      )
      .required('Harus diisi'),
    type: Yup.string()
      .matches(/^(OH|BB)$/g, 'Please select the correct type')
      .required('Harus diisi'),
    unit: Yup.string().required('Harus diisi'),
    area: Yup.string()
      .matches(/^(CDGP|CDL|UTL|OM|PP)$/g, 'Please select the correct area')
      .required('Harus diisi'),
  });

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#FCFCFF" />
      <Formik
        enableReinitialize
        initialValues={{
          fullName: '',
          birthPlaceDate: '',
          identityCardAddress: '',
          country: '',
          area: '',
          areaCode: '',
          phoneNo: '',
          email: '',
          status: '',
          balance: {
            initial: 0,
            end: 0,
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
            <DropdownSelect
              open={showAreaDropdown}
              title="Pilih Wilayah"
              options={AREAS}
              selected={selectedArea}
              onSelect={v => {
                setSelectedArea(v);
                setFieldValue('area', v);
                areaInputRef.current?.blur();
                // if (!values.fullName) {
                //   fullNameInputRef.current?.focus();
                // } else if (!values.birthPlaceDate) {
                //   birthPlaceDateInputRef.current?.focus();
                // }
              }}
              onClose={() => {
                setShowAreaDropdown(false);
                areaInputRef.current?.blur();
              }}
            />
            <DropdownSelect
              open={showCountriesDropdown}
              title="Pilih Negara"
              options={COUNTRIES.map(S => S.name)}
              optionKeys={['name', 'code', 'continent']}
              selected={selectedArea}
              onSelect={v => {
                setSelectedArea(v);
                setFieldValue('area', v);
                areaInputRef.current?.blur();
                // if (!values.fullName) {
                //   fullNameInputRef.current?.focus();
                // } else if (!values.birthPlaceDate) {
                //   birthPlaceDateInputRef.current?.focus();
                // }
              }}
              onClose={() => {
                setShowAreaDropdown(false);
                areaInputRef.current?.blur();
              }}
            />
            <ScrollView style={styles.container}>
              <SafeAreaView>
                <DismissableView>
                  <BoldText type="title-medium">Buat master data baru</BoldText>
                  <Spacer height={4} />
                  <RegularText type="body-small" color="#4B4B4B">
                    Please input these data first to continue.
                  </RegularText>
                  <Spacer height={24} />
                  <TextInput
                    ref={fullNameInputRef}
                    id="full-name"
                    label="Nama Lengkap"
                    placeholder="Contoh: Robbi Firmansyah"
                    filledTextColor
                    showSoftInputOnFocus={false}
                    rightIcons={{ custom: ['calendar'] }}
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
                    ref={identityCardAddressInputRef}
                    id="identity-card-address"
                    label="Alamat KTP"
                    placeholder="Contoh: Jl. X, Blok A, No. 1"
                    filledTextColor
                    onChangeText={handleChange('identityCardAddress')}
                    onBlur={handleBlur('identityCardAddress')}
                    onSubmitEditing={() => {
                      //
                    }}
                    value={values.identityCardAddress}
                    error={
                      touched.identityCardAddress && errors.identityCardAddress
                    }
                  />
                  <Spacer height={16} />
                  <TextInput
                    ref={countryInputRef}
                    id="country"
                    label="Negara"
                    placeholder="Contoh: Indonesia"
                    filledTextColor
                    showSoftInputOnFocus={false}
                    onChangeText={handleChange('country')}
                    onBlur={handleBlur('country')}
                    onPress={() => {
                      countryInputRef.current?.focus();
                      setShowCountriesDropdown(true);
                    }}
                    value={values.country}
                    error={touched.country && errors.country}
                  />
                  <Spacer height={16} />
                  <TextInput
                    ref={areaInputRef}
                    id="area"
                    label="Wilayah"
                    placeholder="Pilih ..."
                    filledTextColor
                    showSoftInputOnFocus={false}
                    rightIcons={{ custom: ['chevron-down'] }}
                    onChangeText={handleChange('area')}
                    onBlur={handleBlur('area')}
                    onFocus={() => setShowAreaDropdown(true)}
                    value={values.area}
                    error={touched.area && errors.area}
                    onPress={() => {
                      countryInputRef.current?.focus();
                      setShowAreaDropdown(true);
                    }}
                  />
                  <Spacer height={16} />
                  <TextInput
                    ref={phoneNoInputRef}
                    id="unit"
                    label="Unit"
                    placeholder="example: RPM"
                    filledTextColor
                    onChangeText={handleChange('unit')}
                    onBlur={handleBlur('unit')}
                    onSubmitEditing={() => {
                      if (!values.areaCode) {
                        areaCodeInputRef.current?.focus();
                      } else if (!values.fullName) {
                        birthPlaceDateInputRef.current?.focus();
                      } else if (!values.timeCreated) {
                        identityCardAddressInputRef.current?.focus();
                      } else if (!values.type) {
                        countryInputRef.current?.focus();
                      } else if (!values.area) {
                        areaInputRef.current?.focus();
                      }
                    }}
                    value={values.unit}
                    error={touched.unit && errors.unit}
                    inputStyle={styles.darkerInput}
                  />
                  <Spacer height={16} />
                  <TextInput
                    ref={areaInputRef}
                    id="area"
                    label="Area"
                    placeholder="Choose one"
                    filledTextColor
                    showSoftInputOnFocus={false}
                    rightIcons={{ custom: ['chevron-down'] }}
                    onChangeText={handleChange('area')}
                    onBlur={handleBlur('area')}
                    onFocus={() => setShowAreaDropdown(true)}
                    value={values.area}
                    error={touched.area && errors.area}
                    onPress={() => {
                      areaInputRef.current?.focus();
                      setShowAreaDropdown(true);
                    }}
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
                  !values.areaCode ||
                  !!errors.areaCode ||
                  !values.fullName ||
                  !!errors.fullName ||
                  !values.timeCreated ||
                  !!errors.timeCreated ||
                  !values.type ||
                  !!errors.type ||
                  !values.unit ||
                  !!errors.unit ||
                  !values.area ||
                  !!errors.area
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
    padding: 20,
  },
  buttonContainer: {
    paddingTop: 16,
    paddingHorizontal: 24,
    borderTopWidth: 1,
    borderTopColor: '#EEE',
    backgroundColor: '#FFF',
  },
  darkerInput: {
    backgroundColor: '#EFF1F8',
  },
});
