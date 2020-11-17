import { EncryptedDataStore } from '@types';

export enum ActionY {
  CLEAR_DATA = 'CLEAR_DATA',
  SET_DATA = 'SET_DATA'
}

export interface EncryptedDbActionPayload<T> {
  data?: T;
}

export interface ActionZ {
  type: keyof typeof ActionY;
  payload: EncryptedDbActionPayload<string>;
}

export function encryptedDbReducer(
  state: EncryptedDataStore,
  { type, payload }: ActionZ
): EncryptedDataStore {
  switch (type) {
    case ActionY.SET_DATA: {
      return {
        ...state,
        ...payload
      };
    }
    case ActionY.CLEAR_DATA: {
      return {};
    }

    default: {
      throw new Error('[EncryptedDbReducer]: missing action type');
    }
  }
}
