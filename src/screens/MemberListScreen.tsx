import firestore from '@react-native-firebase/firestore';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/core';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FlatList, StatusBar, StyleSheet } from 'react-native';
import { RefreshControl } from 'react-native';
import { useMMKVStorage } from 'react-native-mmkv-storage';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { asyncStorage } from '../../store';
import { useAppDispatch } from '../../store/hooks';
import { BottomTabsParamList, RootStackParamList } from '../Routes';
import {
  DismissableView,
  Empty,
  ItemList,
  Loading,
  NavigationHeader,
  NavigationHeaderProps,
  Spacer,
  navHeaderStyles,
} from '../components';
import { MasterDataType } from '../libs/dataTypes';

const ReportListItem = (props: {
  item: any;
  showNavigator: { code: string } | undefined;
  navigators: {
    label: string;
    onPress: () => void;
  }[];
  onPress: () => void;
}) => {
  return (
    <ItemList
      showNavigator={props.showNavigator}
      navigators={props.navigators}
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
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<BottomTabsParamList, 'Report'>>();

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
  const [showNavigator, setShowNavigator] = useState<{
    code: string;
  }>();

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
      {loading ? (
        <Loading />
      ) : (
        <DismissableView>
          <FlatList
            data={filteredData}
            refreshControl={
              <RefreshControl refreshing={loading} onRefresh={() => {}} />
            }
            keyExtractor={item => item.memberCode ?? ''}
            ListEmptyComponent={
              <>
                <Spacer height={24} />
                <Empty />
              </>
            }
            renderItem={({ item }) => (
              <ReportListItem
                item={item}
                showNavigator={showNavigator}
                navigators={[
                  {
                    label: 'Transaksi',
                    onPress: () => {
                      navigation.navigate('TransactionsData', {
                        memberCode: item.memberCode,
                        fullName: item.fullName,
                      });
                    },
                  },
                  {
                    label: 'Laporan',
                    onPress: () => {
                      // navigation.navigate('MemberDetail', {
                      //   memberCode: item.memberCode,
                      // });
                    },
                  },
                ]}
                onPress={() => {
                  setShowNavigator({
                    code: item.memberCode,
                  });
                  setSearchMode(false);
                }}
              />
            )}
          />
        </DismissableView>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  filterPill: {
    flexDirection: 'row',
  },
  filterIcon: {
    alignSelf: 'center',
  },
  headerRight: {
    ...navHeaderStyles.buttonContainer,
    position: 'absolute',
    right: 10,
  },
  pillsContainer: {
    paddingBottom: 12,
    paddingHorizontal: 20,
  },
  saveButtonContainer: {
    position: 'absolute',
    right: 16,
  },
  saveText: {
    margin: -6,
    lineHeight: 21,
  },
  searchInput: {
    borderWidth: 0,
    backgroundColor: 'transparent',
  },
});
