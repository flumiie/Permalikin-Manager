import React from 'react';
import {
  Dimensions,
  Pressable,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import Animated, {
  FadeIn,
  FadeOut,
  SlideInDown,
  SlideOutDown,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';

import Button from '../Button';
import Spacer from '../Spacer';
import BoldText from '../Text/BoldText';

interface DropdownProps {
  open: boolean;
  title?: string;
  content?: React.ReactNode;
  actions: {
    left: {
      label: string;
      onPress: () => void;
    };
    right: {
      label: string;
      onPress: () => void;
    };
  };
  onClose: () => void;
  style?: ViewStyle;
  overlayStyle?: ViewStyle;
}

export default (props: DropdownProps) => {
  const insets = useSafeAreaInsets();

  if (!props.open) {
    return null;
  }

  return (
    <>
      <Animated.View
        entering={props.open ? FadeIn : undefined}
        exiting={FadeOut}
        style={{
          ...styles.overlay,
          ...props.overlayStyle,
        }}
        onTouchStart={props.onClose}
      />
      <Animated.View
        entering={props.open ? SlideInDown : undefined}
        exiting={SlideOutDown}
        style={{
          ...styles.container,
          ...props.style,
        }}>
        <View>
          <Pressable
            style={styles.handleContainer}
            onTouchMove={e => {
              if (props.open && e.nativeEvent.locationY > 15) {
                props.onClose();
              }
            }}>
            <View style={styles.handle} />
          </Pressable>
          <View style={styles.headerContents}>
            <Pressable onPress={props.onClose}>
              <Icon name="x" size={24} color="#1F1F1F" />
            </Pressable>
            <Spacer width={16} />
            <BoldText type="title-medium" style={styles.headerText}>
              {props.title ?? ''}
            </BoldText>
            <Spacer width={16} />
            <Pressable style={styles.transparent} />
          </View>
          <View style={styles.content}>{props.content}</View>
          <View
            style={{
              ...styles.buttonsContainer,
              paddingBottom: insets.bottom + 16,
            }}>
            <View style={styles.flex}>
              <Button
                type="secondary"
                style={styles.button}
                onPress={props.actions.left.onPress}>
                {props.actions.left.label}
              </Button>
            </View>
            <Spacer width={12} />
            <View style={styles.flex}>
              <Button
                type="primary"
                style={styles.button}
                onPress={props.actions.right.onPress}>
                {props.actions.right.label}
              </Button>
            </View>
          </View>
        </View>
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(34, 34, 34, 0.5)',
    zIndex: 100,
    marginTop: -60,
    height: Dimensions.get('window').height,
  },
  container: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: 101,
  },
  handleContainer: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    backgroundColor: '#FFF',
  },
  handle: {
    width: 40,
    height: 5,
    borderRadius: 2,
    backgroundColor: '#CACACA',
  },
  headerContents: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
    backgroundColor: '#FFF',
  },
  headerText: {
    flex: 1,
    textAlign: 'center',
  },
  transparent: {
    width: 24,
  },
  content: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: '#FFF',
  },
  buttonsContainer: {
    flexDirection: 'row',
    paddingTop: 16,
    paddingHorizontal: 24,
    borderTopWidth: 1,
    borderTopColor: '#EEE',
    backgroundColor: '#FFF',
  },
  button: {
    flex: 1,
  },
});
