import { Marquee } from '@animatereactnative/marquee';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import dayjs from 'dayjs';
import 'dayjs/locale/id';
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
import Icon from 'react-native-vector-icons/FontAwesome6';

import { asyncStorage } from '../../store';
import getRSSNews from '../../store/actions/getRSSNews';
import { useAppDispatch } from '../../store/hooks';
import { RootStackParamList } from '../Routes';
import { BoldText, Card, MediumText, RegularText, Spacer } from '../components';

interface HeaderProps extends Partial<ViewProps> {
  user: string;
  news: string;
}

const Header = (props: HeaderProps) => {
  const news = () => {
    if (props.news) {
      let res = props.news
        .split('&nbsp;')
        .join(' ')
        .split('&quot;')
        .join(' "')
        .split('&rsquo;')
        .join(" '")
        .split('&ldquo;')
        .join(' “');
      return (
        <Marquee spacing={0} speed={1.25}>
          <MediumText type="label-large" color="#FAFAFA">
            {`${res}   |   `}
          </MediumText>
        </Marquee>
      );
    }
    return <RegularText>RSS Feed</RegularText>;
  };

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

        <View style={headerStyles.newsContainer}>
          <View style={headerStyles.newsLeftContents}>
            <View style={headerStyles.newsIcon}>
              <Icon name="newspaper" size={20} color="#000" />
            </View>
            <Spacer width={8} />
            <View style={headerStyles.center}>
              {news()}
              <Spacer height={4} />
              <RegularText type="body-small" color="#E1E1E1">
                {dayjs().locale('id').format('dddd, D MMMM YYYY')}
              </RegularText>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

type ActionsType = {
  id: number;
  icon: ImageSourcePropType | undefined;
  title: string;
  subtitle: string;
  disabled: boolean;
  screen: string;
  type: string;
};

const HOME_ACTIONS: ActionsType[] = [
  {
    id: 1,
    icon: require('../../assets/images/master.png'),
    title: 'Master',
    subtitle: 'Tambah baru',
    disabled: false,
    screen: 'NewMasterData',
    type: 'screen',
  },
  {
    id: 2,
    icon: require('../../assets/images/transactions.png'),
    title: 'Kas',
    subtitle: 'Detail kas',
    disabled: false,
    screen: 'FundsData',
    type: 'screen',
  },
  {
    id: 3,
    icon: require('../../assets/images/reports.png'),
    title: 'Laporan',
    subtitle: 'Listing data',
    disabled: false,
    screen: 'MemberList',
    type: 'bottom-tab',
  },
  {
    id: 4,
    icon: undefined,
    title: '',
    subtitle: '',
    disabled: true,
    screen: '',
    type: '',
  },
];

export default () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const [_, setSnackbar] = useMMKVStorage<{
    show: boolean;
    type: 'success' | 'error';
    message: string;
  } | null>('snackbar', asyncStorage, null);
  const [credentials] = useMMKVStorage<{
    token: string;
    name: string;
  }>('credentials', asyncStorage, {
    token: '',
    name: '',
  });
  const [registrationStatus] = useMMKVStorage(
    'registrationStatus',
    asyncStorage,
    false,
  );
  const [__, setSearchMode] = useMMKVStorage('searchMode', asyncStorage, false);

  const [news, setNews] = useState<[]>([]);

  useEffect(() => {
    if (credentials?.token && registrationStatus) {
      setSnackbar({
        show: true,
        type: 'success',
        message: `Registrasi berhasil, selamat datang ${credentials?.token}`,
      });
      asyncStorage.removeItem('registrationStatus');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [credentials?.token && registrationStatus]);

  useEffect(() => {
    dispatch(
      getRSSNews({
        onSuccess: v => {
          setNews(v._j.items);
        },
        onError: () => {
          setNews([]);
        },
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#BF2229" />
      <View
        // eslint-disable-next-line react-native/no-inline-styles
        style={{
          flex: 1,
          backgroundColor: '#FFF',
        }}>
        <View style={styles.hiddenBackground} />
        <FlatList
          data={HOME_ACTIONS}
          ListHeaderComponent={
            <>
              <Header
                user={credentials?.name}
                news={news
                  .map((S: any) => {
                    let res = S.content.split('<p>');
                    res = res[res.length - 1];
                    res = res.split('</p>')[0];
                    return res;
                  })
                  .join('   |   ')}
              />
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
            item: ActionsType;
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
                  if (item.type === 'screen') {
                    navigation.navigate(item.screen as never);
                  } else {
                    navigation.navigate('BottomTabs', {
                      screen: item.screen as never,
                    });
                  }
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
    flex: 1,
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
  newsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(252, 252, 255, 0.1)',
    width: '100%',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  newsLeftContents: {
    flex: 1,
    flexDirection: 'row',
  },
  newsIcon: {
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
    zIndex: 0,
    height: '45%',
    backgroundColor: '#BF2229',
  },
});
