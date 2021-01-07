import { default as DeterministicWalletReducer, DWAction, DWActionTypes } from '../reducer';

const dispatch = (action: DWAction) => (state: any) => DeterministicWalletReducer(state, action);

describe('DeterministicWalletReducer', () => {
  describe('GET_ADDRESSES_FAILURE', () => {
    it('set the status as completed, isGettingAccounts to false and add error', () => {
      const prevState = { errors: [], completed: false, isGettingAccounts: true };
      const state = dispatch({
        type: DWActionTypes.GET_ADDRESSES_FAILURE,
        error: {
          code: DeterministicWalletReducer.errorCodes.GET_ACCOUNTS_FAILED,
          message: 'FAILED'
        }
      })(prevState);
      expect(state.error!.code).toEqual(DeterministicWalletReducer.errorCodes.GET_ACCOUNTS_FAILED);
      expect(state.completed).toBeTruthy();
      expect(state.isGettingAccounts).toBeFalsy();
    });
  });
  describe('GET_ADDRESS_SUCCESS', () => {
    it('set isGettingAccounts to false and clear errors', () => {
      const prevState = { errors: [], isGettingAccounts: true };
      const state = dispatch({
        type: DWActionTypes.GET_ADDRESSES_SUCCESS
      })(prevState);
      expect(state.error).toBeUndefined();
      expect(state.isGettingAccounts).toBeFalsy();
    });
  });
});
