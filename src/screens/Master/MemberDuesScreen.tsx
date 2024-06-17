import firestore from '@react-native-firebase/firestore';
import { RouteProp, useRoute } from '@react-navigation/core';
import React, { useMemo, useState } from 'react';
import {
  FlatList,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { RootStackParamList } from '../../Routes';
import {
  BoldText,
  Button,
  DismissableView,
  Empty,
  Pills,
  RegularText,
  Spacer,
} from '../../components';

type MemberDuesPillTypes = 'latest' | 'oldest' | 'highest' | 'lowest';

export default () => {
  const insets = useSafeAreaInsets();
  const route = useRoute<RouteProp<RootStackParamList, 'MemberDues'>>();

  const [loading, setLoading] = useState(true);
  const [showConfirmCreateDataDropdown, setShowConfirmCreateDataDropdown] =
    useState({
      state: false,
      values: {},
    });
  const [selectedSortFilter, setSelectedSortFilter] =
    useState<MemberDuesPillTypes>();

  const memberDuesData = useMemo(() => {
    let tempData: any[] = inspections;

    tempData = tempData.sort((a, b) => {
      if (selectedSortFilter === 'latest') {
        return b.date - a.date;
      } else if (selectedSortFilter === 'oldest') {
        return a.date - b.date;
      } else if (selectedSortFilter === 'highest') {
        return b.amount - a.amount;
      } else if (selectedSortFilter === 'lowest') {
        return a.amount - b.amount;
      }
    });

    return tempData;
  }, [selectedSortFilter]);

  const MemberDuesHeader = (props: {
    onSelectFilter: (v: MemberDuesPillTypes) => void;
  }) => {
    return (
      <ScrollView
        scrollEnabled={false}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.pillsContainer}>
        <Pills
          onSelect={() => {
            props.onSelectFilter('latest');
          }}>
          Terbaru
        </Pills>
        <Spacer width={8} />
        <Pills
          onSelect={() => {
            props.onSelectFilter('oldest');
          }}>
          Terlama
        </Pills>
        <Spacer width={8} />
        <Pills
          onSelect={() => {
            props.onSelectFilter('highest');
          }}>
          Tertinggi
        </Pills>
        <Spacer width={8} />
        <Pills
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
    // firestore()
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

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#FCFCFF" />
      <DismissableView style={styles.contentContainer}>
        <BoldText type="title-medium">{`Iuran ${route.params?.fullName}`}</BoldText>
        <Spacer height={24} />
        <FlatList
          data={memberDuesData}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={fetchData} />
          }
          keyExtractor={item => item.memberCode}
          ListHeaderComponent={
            <MemberDuesHeader onSelectFilter={v => setSelectedSortFilter(v)} />
          }
          ListEmptyComponent={
            <>
              <Spacer height={24} />
              <Empty />
            </>
          }
          renderItem={({ item }) => (
            <RegularText>{'Hello'}</RegularText>
            // <ReportListItem
            //   item={item}
            //   onPress={() => {
            //     setSearchMode(false);
            //     setShowDropdown({
            //       memberCode: item.memberCode,
            //       fullName: item.fullName,
            //     });
            //   }}
            // />
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
          disabled={
            false
            // !values.avatar ||
            // !!errors.avatar ||
          }
          onPress={() => {
            // navigation.navigate('NewMemberDuesData')
          }}>
          Tambah Transaksi
        </Button>
      </View>
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
  pillsContainer: {
    paddingBottom: 12,
    paddingHorizontal: 20,
  },
});
