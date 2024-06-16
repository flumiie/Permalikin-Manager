import React from 'react';
import {
  Dimensions,
  Pressable,
  ScrollView,
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

import RadioButton from '../RadioButton';
import Spacer from '../Spacer';
import BoldText from '../Text/BoldText';
import MediumText from '../Text/MediumText';

interface DropdownProps {
  open: boolean;
  title: string;
  options: string[];
  selected: string | null;
  onSelect: (value: string) => void;
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
            <BoldText size={16} style={styles.headerText}>
              {props.title}
            </BoldText>
            <Spacer width={16} />
            <Pressable style={styles.transparent} />
          </View>
          <ScrollView
            style={{
              maxHeight: Dimensions.get('window').height - 250,
              ...styles.options,
            }}>
            {props.options.map((option, index) => {
              if (option) {
                return (
                  <Pressable
                    key={index.toString()}
                    style={styles.optionContainer}
                    onPress={() => {
                      props.onSelect(option);
                      setTimeout(() => props.onClose(), 100);
                    }}>
                    <MediumText>{option}</MediumText>
                    <RadioButton
                      selected={
                        option.toLowerCase() === props.selected?.toLowerCase()
                      }
                    />
                  </Pressable>
                );
              }
              return null;
            })}
            <Spacer height={insets.bottom + 30} />
          </ScrollView>
        </View>
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
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
  options: {
    paddingTop: 8,
    backgroundColor: '#FFF',
  },
  optionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    paddingHorizontal: 16,
  },
});
