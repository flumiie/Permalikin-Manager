import React, { useState } from 'react';
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

import Button from '../Button';
import Checkbox from '../Checkbox';
import RadioButton from '../RadioButton';
import Spacer from '../Spacer';
import BoldText from '../Text/BoldText';
import MediumText from '../Text/MediumText';

type SectionType = {
  title: string;
  type: 'checkbox' | 'radio' | 'dateRange';
  options: string[];
};

interface OptionsProps {
  sections: (SectionType | undefined)[];
  selectedFilters: {
    [k: string]: never[];
  };
  onSelect: (section: SectionType, option: string) => void;
  onClose: () => void;
}

export interface DropdownMultiProps {
  open: boolean;
  title: string;
  sections: OptionsProps['sections'];
  onApply: () => void;
  onClose: () => void;
  style?: ViewStyle;
  overlayStyle?: ViewStyle;
}

const RenderOptions = (props: OptionsProps) => {
  const render = props.sections?.map((section, sectionIndex) => {
    console.log(
      props.selectedFilters[section?.title ?? '']?.find(S => {
        const opt = section?.options?.find(O => O === S);
        return S === opt;
      }),
    );

    if (section && section.type === 'checkbox') {
      return (
        <View
          key={`${section.title}-${sectionIndex}`}
          style={styles.dropdownFilterContainer}>
          <BoldText size={16} color="#222" style={styles.title}>
            {section.title}
          </BoldText>
          {(section.options as string[])?.map((option, optionIndex) => (
            <Pressable
              key={`${option}-${optionIndex}`}
              style={styles.optionContainer}
              onPress={() => {
                props.onSelect(section, option);
              }}>
              <MediumText color="#222">{option}</MediumText>
              <Checkbox
                selected={
                  !!props.selectedFilters[section?.title ?? '']?.find(S => {
                    const opt = section?.options?.find(O => O === S);
                    return S !== opt;
                  })
                }
              />
            </Pressable>
          ))}
        </View>
      );
    }

    if (section && section.type === 'radio') {
      return (
        <View
          key={`${section.title}-${sectionIndex}`}
          style={styles.dropdownFilterContainer}>
          <BoldText size={16} color="#222" style={styles.title}>
            {section.title}
          </BoldText>
          {(section.options as string[])?.map((option, optionIndex) => (
            <Pressable
              key={`${option}-${optionIndex}`}
              style={styles.optionContainer}
              onPress={() => {
                props.onSelect(section, option);
              }}>
              <MediumText color="#222">{option}</MediumText>
              <RadioButton
                selected={
                  !!props.selectedFilters[section?.title ?? '']?.find(S => {
                    const opt = section?.options?.find(O => O === S);
                    return S !== opt;
                  })
                }
              />
            </Pressable>
          ))}
        </View>
      );
    }

    if (section && section.type === 'dateRange') {
      return (
        <View
          key={`${section.title}-${sectionIndex}`}
          style={styles.dropdownFilterContainer}>
          <BoldText size={16} color="#222" style={styles.title}>
            {section.title}
          </BoldText>
          {/* TODO: Add date range picker */}
          <MediumText color="#222" style={styles.title}>
            A
          </MediumText>
        </View>
      );
    }

    return <></>;
  });
  return <>{render}</>;
};

export default (props: DropdownMultiProps) => {
  const insets = useSafeAreaInsets();
  const [unappliedFilters, setUnappliedFilters] = useState(
    Object.fromEntries(props.sections.map(S => [S?.title ?? '', []])),
  );

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
            <RenderOptions
              sections={props.sections}
              selectedFilters={unappliedFilters}
              onSelect={(section, option) => {
                const currentSection = props.sections?.find(
                  S => S?.title === section.title,
                );
                // const selectedOption = currentSection?.options.find(
                //   S => S === option,
                // );

                setUnappliedFilters(prev => {
                  if (prev) {
                    const selOptFound = prev[currentSection?.title ?? ''].find(
                      S => S === option,
                    );

                    if (selOptFound) {
                      return {
                        ...(prev as any),
                        [currentSection?.title ?? '']:
                          currentSection?.options.filter(S => S !== option),
                      };
                    } else {
                      return {
                        ...(prev as any),
                        [currentSection?.title ?? '']: [
                          ...(currentSection?.options ?? []),
                          option,
                        ],
                      };
                    }
                  }
                  return prev;
                });
              }}
              onClose={props.onClose}
            />
            <Spacer height={insets.bottom + 30} />
          </ScrollView>
          <View style={styles.applyFilterContainer}>
            <Button
              type="primary"
              onPress={() => {
                props.onApply();
                setTimeout(() => props.onClose(), 100);
              }}>
              Apply filter
            </Button>
          </View>
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
  dropdownFilterContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#DDD',
  },
  title: {
    paddingHorizontal: 20,
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
    paddingVertical: 8,
    backgroundColor: '#FFF',
  },
  optionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    paddingHorizontal: 20,
  },
  radioContainer: {
    right: 0,
    backgroundColor: 'red',
  },
  radioIcon: {
    display: 'none',
  },
  applyFilterContainer: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: '#FFF',
  },
});
