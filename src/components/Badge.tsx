import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import RegularText from './Text/RegularText';

export interface BadgeProps {
  type: 'Warning';
  label: string;
}

export default (props: BadgeProps) => {
  const badgeBackground = useMemo(() => {
    if (props.type === 'Warning') {
      return {
        backgroundColor: '#FFF3E8',
      };
    }
    return {};
  }, [props.type]);

  const pillTextColor = useMemo(() => {
    if (props.type === 'Warning') {
      return '#B78812';
    }
    return '#000';
  }, [props.type]);
  return (
    <View
      style={{
        ...styles.badge,
        ...badgeBackground,
      }}>
      <RegularText type="label-small" color={pillTextColor}>
        {props.label}
      </RegularText>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 6,
  },
});
