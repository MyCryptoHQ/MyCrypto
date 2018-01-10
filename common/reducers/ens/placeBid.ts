import { EnsAction, TypeKeys } from 'actions/ens';

export interface State {
  bidPlaced: boolean;
  bidPlaceFailed: boolean;
}

const INITIAL_STATE: State = {
  bidPlaced: false,
  bidPlaceFailed: false
};

const bidPlaceSucceeded = () => ({ bidPlaceFailed: false, bidPlaced: true });

const bidPlaceFailed = () => ({ bidPlaced: true, bidPlaceFailed: true });

export default (state: State = INITIAL_STATE, action: EnsAction): State => {
  switch (action.type) {
    case TypeKeys.ENS_BID_PLACE_SUCCEEDED:
      return bidPlaceSucceeded();
    case TypeKeys.ENS_BID_PLACE_FAILED:
      return bidPlaceFailed();
    default:
      return state;
  }
};
