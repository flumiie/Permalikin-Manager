import firestore from '@react-native-firebase/firestore';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/core';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useEffect, useMemo, useState } from 'react';
import {
  FlatList,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
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
  Pills,
  Spacer,
  navHeaderStyles,
} from '../components';
import { MasterDataType } from '../libs/dataTypes';

const ReportListItem = (props: { item: any; onPress: () => void }) => {
  const { item, onPress } = props;

  return (
    <ItemList
      leftImage={require('../../assets/images/avatar.png')}
      title={item.fullName}
      sub={{
        subtitle: item.email,
        desc: item.phoneNo,
      }}
      onPress={props.onPress}
    />
  );
};

const ReportsScreenHeader = (props: {
  onSelectFilter: {
    master: (selected: any) => void;
    laporan: (selected: any) => void;
    transaksi: (selected: any) => void;
  };
}) => {
  return (
    <ScrollView
      scrollEnabled={false}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.pillsContainer}>
      <Pills onSelect={props.onSelectFilter.master}>Master</Pills>
      <Spacer width={8} />
      <Pills onSelect={props.onSelectFilter.laporan}>Laporan</Pills>
      <Spacer width={8} />
      <Pills onSelect={props.onSelectFilter.laporan}>Transaksi</Pills>
      <Spacer width={8} />
    </ScrollView>
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
  const [showMoreFiltersDropdown, setShowMoreFiltersDropdown] = useState(false);
  const [selectedCatFilter, setSelectedCatFilter] = useState<(any | null)[]>(
    [],
  );

  const filteredData = useMemo(() => {
    let tempData: MasterDataType[] = personels;

    // if (selectedCatFilter?.length) {
    //   tempData = tempData.filter(data => {
    //     if (selectedCatFilter) {
    //       const filter = selectedCatFilter.find(S => S === data?.category);
    //       return filter === data?.category;
    //     }
    //   });
    // }

    if (search) {
      let processedSearch = search
        .replace(/^;$/g, '; ')
        .replace(/; /g, '†')
        .toLowerCase();
      tempData = tempData.filter(
        S =>
          S.fullName.toLowerCase().includes(processedSearch) ||
          S.email.toLowerCase().includes(processedSearch) ||
          S.phoneNo.toLowerCase().includes(processedSearch),
      );
    }

    return tempData;
  }, [personels, selectedCatFilter, search]);

  const onSelectCatFilter = (props: {
    selected: boolean;
    category: 'Clearances' | 'Vibration';
  }) => {
    const category = props.category.toLowerCase() as any;
    if (props.selected) {
      setSelectedCatFilter(prev => prev.filter(S => S !== category));
    } else {
      setSelectedCatFilter(prev => [...prev, category]);
    }
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
      setLoading(true);
      firestore()
        .collection('Personels')
        .get()
        .then(querySnap => {
          let temp: MasterDataType[] = [];
          querySnap.forEach(docSnap => {
            temp = [...temp, docSnap.data() as MasterDataType];
          });
          setPersonels(temp);
        });
    }
  }, [credentials?.token, setPersonels]);

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
        <View style={styles.contentContainer}>
          <ReportsScreenHeader
            onSelectFilter={{
              master: selected =>
                onSelectCatFilter({
                  selected,
                  category: 'Clearances',
                }),
              laporan: selected =>
                onSelectCatFilter({
                  selected,
                  category: 'Vibration',
                }),
              transaksi: selected =>
                onSelectCatFilter({
                  selected,
                  category: 'Vibration',
                }),
            }}
          />
          <Loading />
        </View>
      ) : (
        <DismissableView>
          <FlatList
            data={filteredData}
            keyExtractor={item => item.id?.toString() ?? ''}
            contentContainerStyle={styles.contentContainer}
            ListHeaderComponent={
              <ReportsScreenHeader
                onSelectFilter={{
                  master: selected =>
                    onSelectCatFilter({
                      selected,
                      category: 'Clearances',
                    }),
                  laporan: selected =>
                    onSelectCatFilter({
                      selected,
                      category: 'Vibration',
                    }),
                  transaksi: selected =>
                    onSelectCatFilter({
                      selected,
                      category: 'Vibration',
                    }),
                }}
              />
            }
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
                  // navigation.navigate('ClearanceList', {
                  //   id: item.id,
                  //   tagNo: item.tagNo,
                  //   category: [`${item.category as CategoryType}`],
                  //   startDate: '',
                  //   endDate: '',
                  //   type: [`${item.type as InspectionType}`],
                  //   area: [item.area],
                  //   sort: '',
                  //   page: 1,
                  //   size: 10,
                  // });
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
  contentContainer: {
    paddingVertical: 24,
  },
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
