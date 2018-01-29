import { UnsealDetails } from 'selectors/ens';
import { EnsUserDownloadedBidAction, BiddingAction } from 'actions/ens';
import { TypeKeys } from 'actions/ens/constants';

export interface State {
  [placedBids: string]: UnsealDetails[];
}

const handleUserDownloadedBid = (state: State, { payload }: EnsUserDownloadedBidAction): State => {
  const { from } = payload;
  const entryExists = state[from];
  const newState = { ...state, [from]: entryExists ? [...entryExists, payload] : [payload] };
  return newState;
};

export default (state: State = {}, action: BiddingAction): State => {
  switch (action.type) {
    case TypeKeys.ENS_USER_DOWNLOADED_BID:
      return handleUserDownloadedBid(state, action);

    default:
      return state;
  }
};
