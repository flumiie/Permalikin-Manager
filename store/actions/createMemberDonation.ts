import firestore, { firebase } from '@react-native-firebase/firestore';

import { MemberDonationsType } from '../../src/libs/dataTypes';
import {
  CREATE_MEMBER_DONATION,
  CREATE_MEMBER_DONATION_ERROR,
} from '../constants';

interface GetUserDataProps {
  memberCode: string;
  donationsData: MemberDonationsType;
  onSuccess: (v: any) => void;
  onError: (v: string) => void;
}

export default (props: GetUserDataProps) => {
  return async (dispatch: any) =>
    await firestore()
      .collection('Personels')
      .where('memberCode', '==', props.memberCode)
      .get()
      .then(querySnap => {
        if (querySnap.docs.length) {
          firestore()
            .collection('Personels')
            .doc(querySnap.docs[0].id)
            .update({
              donations: firebase.firestore.FieldValue.arrayUnion(
                props.donationsData,
              ),
            })
            .then(res => {
              dispatch({
                type: CREATE_MEMBER_DONATION,
                payload: res,
              });
              props.onSuccess(res);
            })
            .catch(err => {
              dispatch({
                type: CREATE_MEMBER_DONATION_ERROR,
                payload: err?.message,
              });
              props.onError(err?.message);
            });
        }
      })
      .catch(err => {
        dispatch({
          type: CREATE_MEMBER_DONATION_ERROR,
          payload: err?.message,
        });
        props.onError(err?.message);
      });
};
