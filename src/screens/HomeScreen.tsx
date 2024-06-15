import { useNavigation } from '@react-navigation/core';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useEffect, useState } from 'react';
import {
  FlatList,
  ImageSourcePropType,
  StatusBar,
  StyleSheet,
  View,
  ViewProps,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { useMMKVStorage } from 'react-native-mmkv-storage';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';

import { asyncStorage } from '../../store';
import getUserData from '../../store/actions/getUserData';
import { RootStackParamList } from '../Routes';
import {
  BoldText,
  Card,
  MediumText,
  RegularText,
  Snackbar,
  Spacer,
} from '../components';

interface HeaderProps extends Partial<ViewProps> {
  user: string;
  weather: string;
  temperature: number;
}

const Header = (props: HeaderProps) => {
  return (
    <View {...props} style={headerStyles.header}>
      <View style={headerStyles.imageBackgroundColorOverlay} />
      <FastImage
        source={require('../../assets/images/banner-clean.jpg')}
        resizeMode="contain"
        style={headerStyles.imageBackground}
      />
      <View style={headerStyles.headerContents}>
        <BoldText type="title-large" color="#FAFAFA">
          Hello {props.user}
        </BoldText>
        <Spacer height={2} />

        <RegularText type="body-medium" color="#E1E1E1">
          Selamat datang di Permalikin Manager
        </RegularText>
        <Spacer height={8} />

        <View style={headerStyles.weatherContainer}>
          <View style={headerStyles.weatherLeftContents}>
            <View style={headerStyles.weatherIcon}>
              <Icon name="sun" size={20} color="#000" />
            </View>
            <Spacer width={8} />
            <View style={headerStyles.center}>
              <RegularText type="body-small" color="#E1E1E1">
                Thursday, 16 May 2024
              </RegularText>
              <Spacer height={4} />
              <MediumText type="label-large" color="#FAFAFA">
                {props.weather}
              </MediumText>
            </View>
          </View>
          <BoldText
            type="title-medium"
            color="#FAFAFA"
            style={headerStyles.center}>
            {props.temperature}°C
          </BoldText>
        </View>
      </View>
    </View>
  );
};

type RespectorActionsType = {
  id: number;
  icon: ImageSourcePropType | undefined;
  title: string;
  subtitle: string;
  disabled: boolean;
  screen: string;
};

const RESPECTOR_ACTIONS: RespectorActionsType[] = [
  {
    id: 1,
    icon: require('../../assets/images/master.png'),
    title: 'Master',
    subtitle: 'Tambah baru',
    disabled: false,
    screen: 'NewMasterData',
  },
  {
    id: 2,
    icon: require('../../assets/images/transactions.png'),
    title: 'Transaksi',
    subtitle: 'Tambah baru',
    disabled: false,
    screen: 'CreateNewVibration',
  },
  {
    id: 3,
    icon: require('../../assets/images/reports.png'),
    title: 'Laporan',
    subtitle: 'Tambah baru',
    disabled: false,
    screen: 'CreateNewVibration',
  },
  {
    id: 4,
    icon: undefined,
    title: '',
    subtitle: '',
    disabled: true,
    screen: '',
  },
];

export default () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [credentials] = useMMKVStorage<{
    token: string;
  }>('userCredentials', asyncStorage, {
    token: '',
  });
  const [registrationStatus, setRegistrationStatus] = useMMKVStorage(
    'registrationStatus',
    asyncStorage,
    null,
  );
  const [addDataStatus, setAddDataStatus] = useMMKVStorage(
    'addDataStatus',
    asyncStorage,
    '',
  );
  const [_, setSearchMode] = useMMKVStorage('searchMode', asyncStorage, false);
  const [userData, setUserData] = useState(null);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    type: 'success' | 'error';
    message: string;
  }>({
    type: 'success',
    message: '',
  });

  useEffect(() => {
    getUserData({
      token: credentials?.token,
      onSuccess: v => {
        setUserData(v);
      },
      onError: () => {
        setSnackbar({
          type: 'error',
          message: 'Something wrong happened. Please try again later',
        });
        setShowSnackbar(true);
      },
    });
  }, [credentials]);

  useEffect(() => {
    if (registrationStatus) {
      setSnackbar({
        type: 'success',
        message: 'Registration successful',
      });
      setShowSnackbar(true);
      setRegistrationStatus(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [registrationStatus]);

  useEffect(() => {
    if (addDataStatus) {
      setSnackbar({
        type: 'success',
        message: 'Data successfully added',
      });
      setShowSnackbar(true);
      setAddDataStatus('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addDataStatus]);

  return (
    <>
      <View
        // eslint-disable-next-line react-native/no-inline-styles
        style={{
          flex: 1,
          backgroundColor: '#FFF',
        }}>
        <StatusBar backgroundColor="#BF2229" />
        <View style={styles.hiddenBackground} />
        <View
          // eslint-disable-next-line react-native/no-inline-styles
          style={{
            ...styles.snackbarContainer,
            display: showSnackbar ? 'flex' : 'none',
            marginTop: insets.top,
          }}>
          <Snackbar
            visible={showSnackbar}
            onHide={() => setShowSnackbar(false)}
            type={snackbar.type}
            message={snackbar.message}
          />
        </View>
        <FlatList
          data={RESPECTOR_ACTIONS}
          ListHeaderComponent={
            <>
              <Header user="Yuslim" weather="Sunny" temperature={25} />
              <Spacer height={18} />
            </>
          }
          contentContainerStyle={styles.container}
          columnWrapperStyle={styles.column}
          numColumns={2}
          keyExtractor={item => item.id.toString()}
          renderItem={({
            item,
            index,
          }: {
            item: RespectorActionsType;
            index: number;
          }) => (
            <>
              <Card
                icon={item.icon}
                title={item.title}
                subtitle={item.subtitle}
                disabled={item.disabled}
                onPress={() => {
                  setSearchMode(false);
                  navigation.navigate(item.screen as never);
                }}
              />
              {index % 2 === 0 ? <Spacer width={12} /> : null}
            </>
          )}
        />
      </View>
    </>
  );
};

const headerStyles = StyleSheet.create({
  center: {
    alignSelf: 'center',
  },
  header: {
    aspectRatio: 2,
  },
  headerContents: {
    flex: 1,
    position: 'absolute',
    bottom: 32,
    paddingHorizontal: 20,
    width: '100%',
  },
  imageBackground: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    opacity: 0.125,
  },
  imageBackgroundColorOverlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: '#BF2229',
  },
  weatherContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(252, 252, 255, 0.1)',
    width: '100%',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  weatherLeftContents: {
    flexDirection: 'row',
  },
  weatherIcon: {
    padding: 8,
    borderRadius: 30,
    backgroundColor: '#fff',
    alignSelf: 'center',
  },
});

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingBottom: 20,
    backgroundColor: '#FFF',
  },
  column: {
    flex: 1,
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingVertical: 6,
    paddingHorizontal: 20,
  },
  hiddenBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '45%',
    backgroundColor: '#BF2229',
  },
  snackbarContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 1,
  },
});
