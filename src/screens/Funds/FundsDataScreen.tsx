import React, { useEffect, useState } from 'react';
import {
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { useMMKVStorage } from 'react-native-mmkv-storage';

import { asyncStorage } from '../../../store';
import { getFunds } from '../../../store/actions';
import { useAppDispatch } from '../../../store/hooks';
import {
  BoldText,
  DismissableView,
  RegularText,
  Spacer,
} from '../../components';
import { decimalize } from '../../libs/functions';

export default () => {
  const dispatch = useAppDispatch();

  const [funds, setFunds] = useMMKVStorage<{
    totalFunds: number;
    totalUnpaidBills: number;
  } | null>('funds', asyncStorage, null);

  const [loading, setLoading] = useState(false);

  const fetchData = () => {
    setLoading(true);
    dispatch(
      getFunds({
        onSuccess: v => {
          setFunds(v);
          setLoading(false);
        },
        onError: () => {
          setLoading(false);
        },
      }),
    );
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl refreshing={false} onRefresh={() => {}} />
      }>
      <SafeAreaView>
        <DismissableView style={styles.contentContainer}>
          <BoldText type="title-medium">Total Kas</BoldText>
          <Spacer height={16} />
          <RegularText type="body-medium">
            {`Rp ${decimalize(funds?.totalFunds ?? 0)}`}
          </RegularText>

          <Spacer height={16} />

          <BoldText type="title-medium">Total Bill</BoldText>
          <Spacer height={16} />
          <RegularText type="body-medium">
            {`Rp ${decimalize(funds?.totalUnpaidBills ?? 0)}`}
          </RegularText>
        </DismissableView>
      </SafeAreaView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  contentContainer: {
    padding: 20,
  },
});
