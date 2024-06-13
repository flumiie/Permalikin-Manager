import { RouteProp, useNavigation, useRoute } from '@react-navigation/core';
import { StackNavigationProp } from '@react-navigation/stack';
import dayjs from 'dayjs';
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
  DropdownFilter,
  DropdownMultiProps,
  Empty,
  ItemList,
  Loading,
  NavigationHeader,
  NavigationHeaderProps,
  Pills,
  Spacer,
  navHeaderStyles,
} from '../components';

const ReportListItem = (props: { item: any; onPress: () => void }) => {
  const { item, onPress } = props;

  const date = `${dayjs(dayjs(item.dateCreated, 'DD-MM-YYYY').toDate()).format(
    'DD MMM',
  )}, ${item.timeCreated}`;
  const desc = () => {
    if (item.category === 'vibration') {
      const label = item.vibration?.remark
        ?.replace(/†/g, '; ')
        .substring(0, 40);
      return `${label}${(label?.length ?? 0) > 40 ? '...' : ''}`;
    }
    return '';
  };

  return (
    <ItemList
      date={date}
      leftImage="clearances"
      imageType="small-icon"
      title={item.tagNo}
      sub={{ subtitle: item.type, desc: desc() }}
      onPress={props.onPress}
    />
  );
};

const ReportsScreenHeader = (props: {
  onSelectFilter: {
    clearances: (selected: any) => void;
    vibration: (selected: any) => void;
  };
}) => {
  return (
    <ScrollView
      scrollEnabled={false}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.pillsContainer}>
      <Pills onSelect={props.onSelectFilter.clearances}>Master</Pills>
      <Spacer width={8} />
      <Pills onSelect={props.onSelectFilter.vibration}>Laporan</Pills>
      <Spacer width={8} />
      <Pills onSelect={props.onSelectFilter.vibration}>Transaksi</Pills>
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
  const [inspections, setInspections] = useMMKVStorage(
    'inspections',
    asyncStorage,
    {
      message: '',
      data: [],
      pagination: {
        page: 0,
        size: 0,
        totalPage: 0,
        totalData: 0,
      },
    },
  );
  const [_, setSearchMode] = useMMKVStorage('searchMode', asyncStorage, false);

  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showMoreFiltersDropdown, setShowMoreFiltersDropdown] = useState(false);
  const [selectedCatFilter, setSelectedCatFilter] = useState<(any | null)[]>(
    [],
  );

  const filterSections: DropdownMultiProps['sections'] = useMemo(
    () => [
      {
        type: 'checkbox',
        title: 'Type',
        options: ['OH', 'BB'],
      },
      {
        type: 'dateRange',
        title: 'Date',
        options: [
          dayjs().format('YYYY-MM-DD').toString(),
          dayjs().add(1, 'week').format('YYYY-MM-DD').toString(),
        ],
      },
      {
        type: 'checkbox',
        title: 'Area',
        options: ['CDGP', 'CDL', 'UTL', 'OM', 'PP'],
      },
      {
        type: 'radio',
        title: 'Sort',
        options: ['recently', 'oldest'],
      },
    ],
    [],
  );

  const filteredData = useMemo(() => {
    let tempData: any[] = inspections?.data;

    if (selectedCatFilter?.length) {
      tempData = tempData.filter(data => {
        if (selectedCatFilter) {
          const filter = selectedCatFilter.find(S => S === data?.category);
          return filter === data?.category;
        }
      });
    }

    if (search) {
      let processedSearch = search
        .replace(/^;$/g, '; ')
        .replace(/; /g, '†')
        .toLowerCase();
      tempData = tempData.filter(
        S =>
          S.tagNo.toLowerCase().includes(processedSearch) ||
          S.type.toLowerCase().includes(processedSearch) ||
          S.vibration?.remark.toLowerCase().includes(processedSearch),
      );
    }

    return tempData;
  }, [inspections, selectedCatFilter, search]);

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
  }, [insets.top, navigation, route.params, credentials?.token]);

  useEffect(() => {
    setLoading(true);
    // dispatch();
  }, [credentials?.token]);

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
      <DropdownFilter
        open={showMoreFiltersDropdown}
        title="Filter"
        sections={filterSections}
        onApply={() => {
          //TODO: Apply filters
        }}
        onClose={() => {
          setShowMoreFiltersDropdown(false);
          // setUnappliedFilters([
          //   {
          //     type: 'radio',
          //     option: 'recently',
          //   },
          // ]);
        }}
      />
      {loading ? (
        <View style={styles.contentContainer}>
          <ReportsScreenHeader
            onSelectFilter={{
              clearances: selected =>
                onSelectCatFilter({
                  selected,
                  category: 'Clearances',
                }),
              vibration: selected =>
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
            keyExtractor={item => item.id.toString()}
            contentContainerStyle={styles.contentContainer}
            ListHeaderComponent={
              <ReportsScreenHeader
                onSelectFilter={{
                  clearances: selected =>
                    onSelectCatFilter({
                      selected,
                      category: 'Clearances',
                    }),
                  vibration: selected =>
                    onSelectCatFilter({
                      selected,
                      category: 'Vibration',
                    }),
                }}
                moreFilterApplied={
                  false
                  // unappliedFilters.filter(S => S.option !== 'recently').length > 0
                }
                onShowMoreFilter={() => setShowMoreFiltersDropdown(true)}
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
