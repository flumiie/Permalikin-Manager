import { RouteProp, useNavigation, useRoute } from '@react-navigation/core';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useEffect, useMemo, useState } from 'react';
import {
  FlatList,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import { useMMKVStorage } from 'react-native-mmkv-storage';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { asyncStorage } from '../../../store';
import { getMemberDues } from '../../../store/actions';
import { useAppDispatch } from '../../../store/hooks';
import { RootStackParamList } from '../../Routes';
import {
  Button,
  DismissableView,
  Empty,
  NavigationHeader,
  NavigationHeaderProps,
  Pills,
  SimpleList,
  Spacer,
} from '../../components';
import { MemberDuesType } from '../../libs/dataTypes';

type MemberDuesPillTypes = 'latest' | 'oldest' | 'highest' | 'lowest';

const ReportListItem = (props: {
  item: MemberDuesType;
  index: number;
  onPress: () => void;
}) => {
  const title = useMemo(() => {
    if (props.item.paid < props.item.due) {
      return `Kurang: Rp ${
        Number(
          props.item.due?.replace(/[.|,| |-]/g, '') ?? 0,
        ).toLocaleString() ?? 0
      }\nDibayar: Rp ${
        Number(
          props.item.paid?.replace(/[.|,| |-]/g, '') ?? 0,
        ).toLocaleString() ?? 0
      }\nSisa: Rp ${
        Number(
          props.item.remaining?.replace(/[.|,| |-]/g, '') ?? 0,
        ).toLocaleString() ?? 0
      }`;
    }
    return `Total: Rp ${Number(
      props.item.due?.replace(/[.|,| |-]/g, '') ?? 0,
    ).toLocaleString()} (Sudah lunas)`;
  }, [props.item]);

  if (props.item) {
    return (
      <SimpleList
        iconLabel={`${props.index + 1}.`}
        title={title}
        subtitle={`Tanggal iuran: ${props.item.date}`}
      />
    );
  }

  return (
    <View style={{ flex: 1, paddingTop: 24 }}>
      <Empty />
    </View>
  );
};

export default () => {
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'MemberDues'>>();

  const [credentials] = useMMKVStorage<{
    token: string;
  }>('credentials', asyncStorage, {
    token: '',
  });
  const [_, setSnackbar] = useMMKVStorage<{
    show: boolean;
    type: 'success' | 'error';
    message: string;
  } | null>('snackbar', asyncStorage, null);
  const [memberDues, setMemberDues] = useMMKVStorage<MemberDuesType[]>(
    'memberDues',
    asyncStorage,
    [],
  );
  const [__, setSearchMode] = useMMKVStorage('searchMode', asyncStorage, false);

  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedSortFilter, setSelectedSortFilter] =
    useState<MemberDuesPillTypes[]>();

  const filteredData = useMemo(() => {
    let tempData: MemberDuesType[] | null = memberDues;

    // tempData = tempData.sort((a, b) => {
    //   if (selectedSortFilter === 'latest') {
    //     return b.date - a.date;
    //   } else if (selectedSortFilter === 'oldest') {
    //     return a.date - b.date;
    //   } else if (selectedSortFilter === 'highest') {
    //     return b.amount - a.amount;
    //   } else if (selectedSortFilter === 'lowest') {
    //     return a.amount - b.amount;
    //   }
    // });

    return tempData?.[0];
  }, [memberDues]);

  const MemberDuesHeader = (props: {
    onSelectFilter: (v: MemberDuesPillTypes) => void;
  }) => {
    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.pillsContainer}>
        <Pills
          selected={!!selectedSortFilter?.find(S => S === 'latest')}
          onSelect={() => {
            props.onSelectFilter('latest');
          }}>
          Terbaru
        </Pills>
        <Spacer width={8} />
        <Pills
          selected={!!selectedSortFilter?.find(S => S === 'oldest')}
          onSelect={() => {
            props.onSelectFilter('oldest');
          }}>
          Terlama
        </Pills>
        <Spacer width={8} />
        <Pills
          selected={!!selectedSortFilter?.find(S => S === 'highest')}
          onSelect={() => {
            props.onSelectFilter('highest');
          }}>
          Tertinggi
        </Pills>
        <Spacer width={8} />
        <Pills
          selected={!!selectedSortFilter?.find(S => S === 'lowest')}
          onSelect={() => {
            props.onSelectFilter('lowest');
          }}>
          Terendah
        </Pills>
        <Spacer width={8} />
      </ScrollView>
    );
  };

  const fetchData = () => {
    setLoading(true);

    dispatch(
      getMemberDues({
        memberCode: route.params?.memberCode ?? '',
        onSuccess: v => {
          setMemberDues(v);
          setLoading(false);
        },
        onError: v => {
          if (
            v.includes('The query requires an index. You can create it here')
          ) {
            setSnackbar({
              show: true,
              type: 'error',
              message: 'Data belum di index. Mohon coba lagi nanti',
            });
          }
          if (
            v.includes(
              'The query requires an index. That index is currently building and cannot be used yet.',
            )
          ) {
            setSnackbar({
              show: true,
              type: 'error',
              message: 'Data sedang di index. Mohon coba lagi nanti',
            });
          }
          setLoading(false);
        },
      }),
    );
  };

  useEffect(() => {
    navigation.setOptions({
      title: `Iuran ${route.params?.fullName}`,
      header: (props: NavigationHeaderProps) => (
        <NavigationHeader {...props} useSearch search={setSearch} />
      ),
    });
  }, [navigation, route.params?.fullName]);

  useEffect(() => {
    if (credentials?.token) {
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [credentials?.token]);

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#FCFCFF" />
      <DismissableView style={{ flex: 1 }}>
        <FlatList
          data={filteredData}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={fetchData} />
          }
          keyExtractor={(___, index) => index.toString()}
          // ListHeaderComponent={
          //   <MemberDuesHeader
          //     onSelectFilter={v =>
          //       setSelectedSortFilter(prev => {
          //         let temp = prev;

          //         if (temp?.find(S => S === v)) {
          //           temp = temp?.filter(S => S !== v);
          //         } else {
          //           temp = [...(temp ?? []), v];
          //         }

          //         return temp;
          //       })
          //     }
          //   />
          // }
          ListEmptyComponent={
            <>
              <Spacer height={24} />
              <Empty />
            </>
          }
          renderItem={({ item, index }) => (
            <ReportListItem
              item={item}
              index={index}
              onPress={() => {
                setSearchMode(false);
              }}
            />
          )}
        />
        <Spacer height={16} />
      </DismissableView>
      <View
        style={{
          ...styles.buttonContainer,
          paddingBottom: insets.bottom + 16,
        }}>
        <Button
          type="primary"
          onPress={() => {
            navigation.navigate('NewMemberDue', {
              memberCode: route.params?.memberCode ?? '',
              fullName: route.params?.fullName ?? '',
            });
          }}>
          Tambah Iuran
        </Button>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  buttonContainer: {
    paddingTop: 16,
    paddingHorizontal: 24,
    borderTopWidth: 1,
    borderTopColor: '#EEE',
    backgroundColor: '#FFF',
  },
  pillsContainer: {
    padding: 12,
  },
});
