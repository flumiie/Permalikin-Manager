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
import { getMemberInterests } from '../../../store/actions';
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
import { MemberInterestsType } from '../../libs/dataTypes';

type MemberInterestsPillTypes = 'latest' | 'oldest' | 'highest' | 'lowest';

const ReportListItem = (props: {
  item: MemberInterestsType;
  index: number;
  onPress: () => void;
}) => {
  const title = useMemo(() => {
    return `Rp ${
      Number(
        props.item.amount?.replace(/[.|,| |-]/g, '') ?? 0,
      ).toLocaleString() ?? 0
    }`;
  }, [props.item]);

  if (props.item) {
    return (
      <SimpleList
        iconLabel={`${props.index + 1}.`}
        title={title}
        subtitle={`Tanggal: ${props.item.date}`}
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
  const route = useRoute<RouteProp<RootStackParamList, 'MemberInterests'>>();

  const [credentials] = useMMKVStorage<{
    token: string;
  }>('credentials', asyncStorage, {
    token: '',
  });
  const [snackbar, setSnackbar] = useMMKVStorage<{
    show: boolean;
    type: 'success' | 'error';
    message: string;
  } | null>('snackbar', asyncStorage, null);
  const [memberInterests, setMemberInterests] = useMMKVStorage<
    MemberInterestsType[] | null
  >('memberInterests', asyncStorage, null);
  const [__, setSearchMode] = useMMKVStorage('searchMode', asyncStorage, false);

  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedSortFilter, setSelectedSortFilter] =
    useState<MemberInterestsPillTypes[]>();

  const filteredData = useMemo(() => {
    let tempData: MemberInterestsType[] | null = memberInterests;

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
  }, [memberInterests]);

  const MemberInterestsHeader = (props: {
    onSelectFilter: (v: MemberInterestsPillTypes) => void;
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
      getMemberInterests({
        memberCode: route.params?.memberCode ?? '',
        onSuccess: v => {
          setMemberInterests(v);
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
          } else {
            setSnackbar({
              show: true,
              type: 'error',
              message: 'Ada kesalahan. Mohon coba lagi nanti',
            });
          }
          setLoading(false);
        },
      }),
    );
  };

  useEffect(() => {
    navigation.setOptions({
      title: `Bunga ${route.params?.fullName}`,
      header: (props: NavigationHeaderProps) => (
        <NavigationHeader {...props} useSearch search={setSearch} />
      ),
    });
  }, [navigation, route.params?.fullName]);

  useEffect(() => {
    if (credentials?.token || snackbar?.message === 'Data sudah tersimpan') {
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
          //   <MemberInterestsHeader
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
            navigation.navigate('NewMemberInterest', {
              memberCode: route.params?.memberCode ?? '',
              fullName: route.params?.fullName ?? '',
            });
          }}>
          Tambah Bunga
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
