import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/core';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FlatList, StatusBar } from 'react-native';
import { RefreshControl } from 'react-native';
import { useMMKVStorage } from 'react-native-mmkv-storage';

import { asyncStorage } from '../../store';
import { RootStackParamList } from '../Routes';
import {
  DismissableView,
  DropdownNavigator,
  Empty,
  ItemList,
  NavigationHeader,
  NavigationHeaderProps,
  Spacer,
} from '../components';
import { MasterDataType } from '../libs/dataTypes';

const ReportListItem = (props: { item: any; onPress: () => void }) => {
  return (
    <ItemList
      leftImage={require('../../assets/images/avatar.png')}
      code={props.item.memberCode}
      title={props.item.fullName}
      sub={{
        subtitle: props.item.email,
        desc: props.item.phoneNo,
      }}
      onPress={props.onPress}
    />
  );
};

export default () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const [credentials] = useMMKVStorage<{
    token: string;
  }>('userCredentials', asyncStorage, {
    token: '',
  });
  const [personels, setPersonels] = useMMKVStorage<MasterDataType[]>(
    'personels',
    asyncStorage,
    [
      {
        avatar: '',
        memberCode: '',
        fullName: '',
        birthPlaceDate: '',
        religion: '',
        address: {
          identityCardAddress: '',
          currentAddress: '',
          country: '',
          province: '',
          city: '',
          zipCode: '',
        },
        phoneNo: '',
        email: '',
        status: '',
        balance: {
          initial: '',
          end: '',
        },
      },
    ],
  );
  const [_, setSearchMode] = useMMKVStorage('searchMode', asyncStorage, false);

  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showDropdown, setShowDropdown] = useState<{
    memberCode: string | null;
    fullName: string | null;
  }>({
    memberCode: null,
    fullName: null,
  });

  const filteredData = useMemo(() => {
    let tempData: MasterDataType[] = personels;

    if (search) {
      let processedSearch = search
        .replace(/^;$/g, '; ')
        .replace(/; /g, '†')
        .toLowerCase();
      tempData = tempData.filter(
        S =>
          S.memberCode.toLowerCase().includes(processedSearch) ||
          S.fullName.toLowerCase().includes(processedSearch) ||
          S.email?.toLowerCase().includes(processedSearch) ||
          S.phoneNo.toLowerCase().includes(processedSearch),
      );
    }

    return tempData;
  }, [personels, search]);

  const fetchData = useCallback(() => {
    setLoading(true);
    return firestore()
      .collection('Personels')
      .get()
      .then(querySnap => {
        let temp: MasterDataType[] = [];
        querySnap.forEach(docSnap => {
          temp = [...temp, docSnap.data() as MasterDataType];
        });
        setPersonels(temp);
      });
  }, [setPersonels]);

  const onSelectNavigator = (
    v: string,
    data: {
      memberCode: string | null;
      fullName: string | null;
    },
  ) => {
    if (v === 'Cek Iuran Anggota') {
      return navigation.navigate('MemberDues', {
        memberCode: data.memberCode ?? '',
        fullName: data.fullName ?? '',
      });
    }
    if (v === 'Cek Donasi / Sumbangan') {
      return console.warn('donasi');
    }
    if (v === 'Cek Bunga Bank') {
      return console.warn('bunga');
    }

    return null;
  };

  useEffect(() => {
    navigation.setOptions({
      header: (props: NavigationHeaderProps) => (
        <NavigationHeader {...props} useSearch search={setSearch} />
      ),
    });
  }, [navigation]);

  useEffect(() => {
    if (credentials?.token) {
      fetchData();
    }
  }, [credentials?.token, fetchData]);

  useEffect(() => {
    if (filteredData) {
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
  }, [filteredData]);

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <DropdownNavigator
        open={!!showDropdown.memberCode}
        title={showDropdown.fullName ?? ''}
        options={[
          'Cek Iuran Anggota',
          'Cek Donasi / Sumbangan',
          'Cek Bunga Bank',
        ]}
        onSelect={v => onSelectNavigator(v, showDropdown)}
        onClose={() => {
          setShowDropdown({
            memberCode: null,
            fullName: null,
          });
        }}
      />
      <DismissableView>
        <FlatList
          data={filteredData}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={fetchData} />
          }
          keyExtractor={item => item.memberCode}
          ListEmptyComponent={
            <>
              <Spacer height={24} />
              <Empty />
            </>
          }
          renderItem={({ item }) => (
            <ReportListItem
              item={item}
              onPress={() => {
                setSearchMode(false);
                setShowDropdown({
                  memberCode: item.memberCode,
                  fullName: item.fullName,
                });
              }}
            />
          )}
        />
      </DismissableView>
    </>
  );
};
