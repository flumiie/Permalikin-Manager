import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { Image, ImageSourcePropType, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { RegularText } from './components';
import { AccountScreen, HomeScreen, MemberListScreen } from './screens';

interface TabBarIconProps {
  focused: boolean | undefined;
  image: {
    focused: ImageSourcePropType | undefined;
    unfocused: ImageSourcePropType | undefined;
  };
}

const TabBarIcon = (props: TabBarIconProps) => {
  return (
    <View
      // eslint-disable-next-line react-native/no-inline-styles
      style={{
        backgroundColor: props.focused ? '#FFD3D3' : 'transparent',
        ...styles.bottomTabImageContainer,
      }}>
      <Image
        source={props.focused ? props.image.focused : props.image.unfocused}
      />
    </View>
  );
};

const Tab = createBottomTabNavigator();

export default () => {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        paddingBottom: insets.bottom,
        ...styles.bottomTab,
      }}>
      <Tab.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            height: 65,
            paddingTop: 12,
            paddingBottom: 4,
          },
        }}>
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            tabBarLabelStyle: {
              fontFamily: 'Poppins-Regular',
            },
            tabBarIcon: ({ focused }: Partial<TabBarIconProps>) => (
              <TabBarIcon
                focused={focused}
                image={{
                  focused: require('../assets/icons/home.png'),
                  unfocused: require('../assets/icons/home-disabled.png'),
                }}
              />
            ),
            tabBarLabel: ({
              focused,
              children,
            }: {
              focused: boolean;
              children: React.ReactNode;
            }) => (
              <RegularText
                type="body-small"
                color={focused ? '#BF2229' : '#44474E'}
                style={styles.text}>
                {children}
              </RegularText>
            ),
          }}
        />
        <Tab.Screen
          name="MemberList"
          component={MemberListScreen}
          options={{
            title: 'Daftar Anggota',
            headerShown: true,
            tabBarLabelStyle: {
              fontFamily: 'Poppins-Regular',
            },
            tabBarIcon: ({ focused }: Partial<TabBarIconProps>) => (
              <TabBarIcon
                focused={focused}
                image={{
                  focused: require('../assets/icons/report.png'),
                  unfocused: require('../assets/icons/report-disabled.png'),
                }}
              />
            ),
            tabBarLabel: ({ focused }: { focused: boolean }) => (
              <RegularText
                type="body-small"
                color={focused ? '#BF2229' : '#44474E'}
                style={styles.text}>
                Anggota
              </RegularText>
            ),
          }}
        />
        <Tab.Screen
          name="Account"
          component={AccountScreen}
          options={{
            tabBarLabelStyle: {
              fontFamily: 'Poppins-Regular',
            },
            tabBarIcon: ({ focused }: Partial<TabBarIconProps>) => (
              <TabBarIcon
                focused={focused}
                image={{
                  focused: require('../assets/icons/account.png'),
                  unfocused: require('../assets/icons/account-disabled.png'),
                }}
              />
            ),
            tabBarLabel: ({
              focused,
              children,
            }: {
              focused: boolean;
              children: React.ReactNode;
            }) => (
              <RegularText
                type="body-small"
                color={focused ? '#BF2229' : '#44474E'}
                style={styles.text}>
                {children}
              </RegularText>
            ),
          }}
        />
      </Tab.Navigator>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomTabImageContainer: {
    borderRadius: 26,
    paddingHorizontal: 18,
    marginBottom: 4,
  },
  bottomTab: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  text: {
    marginBottom: 4,
  },
});
