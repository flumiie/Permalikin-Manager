import React, { useEffect } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import RegularText from './Text/RegularText';

interface SnackbarProps {
  visible: boolean;
  onHide: () => void;
  type: 'success' | 'error';
  message: string;
  actionText?: string;
  onActionPress?: () => void;
  duration?: number;
  position?: string;
  actionTextColor?: string;
}

export default ({
  duration = 3000,
  position = 'top',
  actionTextColor = 'white',
  ...props
}: SnackbarProps) => {
  useEffect(() => {
    if (props.visible) {
      const timeout = setTimeout(() => {
        props.onHide();
      }, duration);

      return () => clearTimeout(timeout);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.visible, duration]);

  return props.visible ? (
    <View
      // eslint-disable-next-line react-native/no-inline-styles
      style={{
        ...styles.container,
        top: position === 'top' ? 24 : undefined,
        bottom: position === 'bottom' ? 24 : undefined,
        backgroundColor: props.type === 'success' ? '#5FBC4F' : '#C42A1C',
      }}>
      <RegularText type="body-medium" style={styles.messageText}>
        {props.message}
      </RegularText>
      {props.actionText && (
        <TouchableOpacity
          onPress={() => {
            if (props.onActionPress) {
              props.onActionPress();
            }
          }}>
          <RegularText
            type="body-medium"
            style={[styles.actionText, { color: actionTextColor }]}>
            {props.actionText}
          </RegularText>
        </TouchableOpacity>
      )}
    </View>
  ) : null;
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 8,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'absolute',
    left: 0,
    right: 0,
    elevation: 4,
    shadowOpacity: 0.4,
    shadowRadius: 16,
    zIndex: 1000,
  },
  messageText: {
    color: '#FFF',
  },
  actionText: {
    marginLeft: 8,
    fontSize: 14,
  },
});
