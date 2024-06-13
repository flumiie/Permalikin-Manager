import React from 'react';
import { Keyboard, View, ViewProps } from 'react-native';

export default (props: ViewProps) => {
  return (
    <View
      {...props}
      onStartShouldSetResponder={() => {
        Keyboard.dismiss();
        return true;
      }}>
      {props.children}
    </View>
  );
};
