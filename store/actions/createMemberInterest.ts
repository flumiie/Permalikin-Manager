import firestore, { firebase } from '@react-native-firebase/firestore';

import { MemberInterestsType } from '../../src/libs/dataTypes';
import {
  CREATE_MEMBER_INTEREST,
  CREATE_MEMBER_INTEREST_ERROR,
} from '../constants';

interface GetUserDataProps {
  memberCode: string;
  interestsData: MemberInterestsType;
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
              interests: firebase.firestore.FieldValue.arrayUnion(
                props.interestsData,
              ),
            })
            .then(res => {
              dispatch({
                type: CREATE_MEMBER_INTEREST,
                payload: res,
              });
              props.onSuccess(res);
            })
            .catch(err => {
              dispatch({
                type: CREATE_MEMBER_INTEREST_ERROR,
                payload: err?.message,
              });
              props.onError(err?.message);
            });
        }
      })
      .catch(err => {
        dispatch({
          type: CREATE_MEMBER_INTEREST_ERROR,
          payload: err?.message,
        });
        props.onError(err?.message);
      });
};
