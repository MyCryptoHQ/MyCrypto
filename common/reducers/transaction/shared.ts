import { State } from './transaction';
import { Omit } from 'react-redux';
import { ResetAction } from 'actions/transaction';

export const resetHOF = (
  reducerName: keyof (Omit<State, 'broadcast' | 'network'>),
  initialState: State[typeof reducerName],
  returnCb?: (
    state: State[typeof reducerName],
    returnedState: State[typeof reducerName]
  ) => State[typeof reducerName]
) => (state: State[typeof reducerName], { payload: { exclude, include } }: ResetAction) => {
  const excludeFields = exclude[reducerName];
  const includeFields = include[reducerName];

  // sanity check
  if (includeFields && excludeFields) {
    throw Error('Cant have include and exclude fields at the same time');
  }
  const returnState = { ...initialState };
  const stateCopy = { ...state };

  if (includeFields) {
    (includeFields as any[]).forEach(fieldName => {
      stateCopy[fieldName] = returnState[fieldName];
    });
    return returnCb ? returnCb(state, returnState) : { ...stateCopy };
  }

  if (excludeFields) {
    (excludeFields as any[]).forEach(fieldName => {
      returnState[fieldName] = state[fieldName];
    });
  }

  return returnCb ? returnCb(state, returnState) : returnState;
};
