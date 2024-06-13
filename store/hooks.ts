import { useDispatch, useSelector } from 'react-redux';

import { Dispatch, RootState } from '.';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = useDispatch.withTypes<Dispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
