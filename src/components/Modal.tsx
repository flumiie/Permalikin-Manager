import React from 'react';
import {
  Dimensions,
  Modal,
  Pressable,
  ModalProps as RNModalProps,
  StyleSheet,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

import Button from './Button';
import Spacer from './Spacer';
import RegularText from './Text/RegularText';

interface ModalProps extends RNModalProps {
  title: string;
  onClose: () => void;
  useActionButtons: boolean;
  hideCancelAction?: boolean;
  onAccept?: () => void;
}

export default ({ hideCancelAction = false, ...props }: ModalProps) => {
  return (
    <Modal animationType="fade" transparent={true} visible={props.visible}>
      <Pressable style={styles.centeredView} onPress={props.onClose} />
      <View style={styles.modalView}>
        <View style={styles.topContainer}>
          <RegularText style={styles.modalTitle}>{props.title}</RegularText>
          <Button
            type="primary"
            style={styles.buttonClose}
            onPress={props.onClose}>
            <Icon name="x" style={styles.closeIcon} />
          </Button>
        </View>
        <Spacer height={18} />
        {typeof props.children !== 'string' ? props.children : null}
        {props.useActionButtons ? (
          <>
            {typeof props.children === 'string' ? (
              <RegularText style={styles.modalText}>
                {props.children}
              </RegularText>
            ) : null}
            <View style={styles.modalActions}>
              {hideCancelAction ? null : (
                <Pressable
                  android_ripple={{ color: '#FFC0CBAA' }}
                  style={styles.modalActionCancel}
                  onPress={props.onClose}>
                  <RegularText style={styles.modalActionCancelText}>
                    CANCEL
                  </RegularText>
                </Pressable>
              )}
              <Pressable
                android_ripple={{ color: '#FFC0CBAA' }}
                style={styles.modalActionOK}
                onPress={props.onAccept}>
                <RegularText style={styles.modalActionOKText}>OK</RegularText>
              </Pressable>
            </View>
          </>
        ) : null}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  modalView: {
    flex: 1,
    position: 'absolute',
    top: Dimensions.get('window').height / 2.8,
    width: Dimensions.get('window').width - 32,
    backgroundColor: '#fff',
    borderRadius: 6,
    alignSelf: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 7,
  },
  topContainer: {
    paddingTop: 12,
    width: '100%',
    flexDirection: 'row',
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    paddingVertical: 2,
    paddingHorizontal: 8,
    marginRight: 8,
    backgroundColor: 'transparent',
    shadowColor: 'transparent',
    elevation: 0,
  },
  closeIcon: {
    color: '#000',
    fontSize: 22,
    alignItems: 'center',
  },
  cancelIcon: {
    color: '#000',
    fontSize: 20,
    alignItems: 'center',
  },
  textStyle: {
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#000',
  },
  modalTitle: {
    flex: 1,
    textAlign: 'left',
    marginHorizontal: 14,
    verticalAlign: 'middle',
    color: '#000',
    fontSize: 18,
    fontWeight: '600',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    color: '#000',
    fontSize: 16,
  },
  modalActions: {
    flexDirection: 'row',
    height: 55,
    bottom: 0,
  },
  modalActionCancel: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 18,
    borderWidth: 0.5,
    borderRightWidth: 0.5,
    borderColor: '#ddd',
    borderBottomLeftRadius: 6,
  },
  modalActionOK: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 18,
    borderTopWidth: 0.5,
    borderLeftWidth: 0.5,
    borderColor: '#ddd',
    borderBottomRightRadius: 6,
  },
  modalActionCancelText: {
    fontSize: 16,
    color: '#666',
  },
  modalActionOKText: {
    color: '#FFC0CB',
    fontSize: 16,
    fontWeight: '600',
  },
});
