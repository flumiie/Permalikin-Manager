import firestore from '@react-native-firebase/firestore';
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
import { getUserData } from '../../../store/actions';
import { useAppDispatch } from '../../../store/hooks';
import { RootStackParamList } from '../../Routes';
import {
  Button,
  DismissableView,
  Empty,
  ItemList,
  NavigationHeader,
  NavigationHeaderProps,
  Pills,
  Spacer,
} from '../../components';

type MemberDuesPillTypes = 'latest' | 'oldest' | 'highest' | 'lowest';

const ReportListItem = (props: { item: any; onPress: () => void }) => {
  if (props.item.dues) {
    return (
      <ItemList
        code={props.item.memberCode}
        title={props.item.fullName}
        sub={{
          subtitle: props.item.email,
          desc: props.item.phoneNo,
        }}
        onPress={props.onPress}
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
  const [userData, setUserData] = useMMKVStorage('userData', asyncStorage, []);
  const [_, setSearchMode] = useMMKVStorage('searchMode', asyncStorage, false);

  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [showConfirmCreateDataDropdown, setShowConfirmCreateDataDropdown] =
    useState({
      state: false,
      values: {},
    });
  const [selectedSortFilter, setSelectedSortFilter] =
    useState<MemberDuesPillTypes[]>();

  const memberDuesData = useMemo(() => {
    let tempData: any[] = userData;

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

    return tempData;
  }, [userData]);

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
      getUserData({
        memberCode: route.params?.memberCode ?? '',
        onSuccess: v => {
          setUserData(v);
          setLoading(false);
        },
        onError: () => {
          setLoading(false);
        },
      }),
    );
  };

  const addMemberDueData = (memberCode: string) => {
    // Create a reference to the post
    const postReference = firestore().doc(`posts/${memberCode}`);

    return firestore().runTransaction(async transaction => {
      // Get post data first
      const postSnapshot = await transaction.get(postReference);

      if (!postSnapshot.exists) {
        throw 'Post does not exist!';
      }

      transaction.update(postReference, {
        likes: postSnapshot.data()?.likes + 1,
      });
    });
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
          data={memberDuesData}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={fetchData} />
          }
          keyExtractor={item => item.memberCode}
          ListHeaderComponent={
            <MemberDuesHeader
              onSelectFilter={v =>
                setSelectedSortFilter(prev => {
                  let temp = prev;

                  if (temp?.find(S => S === v)) {
                    temp = temp?.filter(S => S !== v);
                  } else {
                    temp = [...(temp ?? []), v];
                  }

                  return temp;
                })
              }
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
            // navigation.navigate('NewMemberDuesData')
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
