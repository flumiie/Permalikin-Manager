import { useNavigation } from '@react-navigation/core';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useEffect, useMemo, useState } from 'react';
import { FlatList } from 'react-native';
import { RefreshControl } from 'react-native';
import { useMMKVStorage } from 'react-native-mmkv-storage';

import { asyncStorage } from '../../store';
import { getMemberList } from '../../store/actions';
import { useAppDispatch } from '../../store/hooks';
import { RootStackParamList } from '../Routes';
import {
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
      id={props.item.memberCode}
      leftImage={require('../../assets/images/avatar.png')}
      title={props.item.fullName}
      sub={{
        subtitle: props.item.email,
        desc: props.item.memberCode,
      }}
      onPress={props.onPress}
    />
  );
};

export default () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const [credentials] = useMMKVStorage<{
    token: string;
  }>('credentials', asyncStorage, {
    token: '',
  });
  const [personels, setPersonels] = useMMKVStorage<MasterDataType[]>(
    'personels',
    asyncStorage,
    [
      // {
      //   avatar: '',
      //   memberCode: '',
      //   fullName: '',
      //   birthPlaceDate: '',
      //   religion: '',
      //   address: {
      //     identityCardAddress: '',
      //     currentAddress: '',
      //     country: '',
      //     province: '',
      //     city: '',
      //     zipCode: '',
      //   },
      //   phoneNo: '',
      //   email: '',
      //   status: '',
      //   balance: {
      //     initial: '',
      //     end: '',
      //   },
      // },
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

  const fetchData = () => {
    setLoading(true);

    dispatch(
      getMemberList({
        onSuccess: v => {
          setPersonels(v);
          setLoading(false);
        },
        onError: () => {
          setLoading(false);
        },
      }),
    );
  };

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
      return navigation.navigate('MemberDonations', {
        memberCode: data.memberCode ?? '',
        fullName: data.fullName ?? '',
      });
    }
    if (v === 'Cek Bunga Bank') {
      return navigation.navigate('MemberInterests', {
        memberCode: data.memberCode ?? '',
        fullName: data.fullName ?? '',
      });
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [credentials?.token]);

  return (
    <>
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
    </>
  );
};
