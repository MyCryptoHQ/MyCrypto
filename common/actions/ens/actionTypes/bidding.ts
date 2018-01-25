import { TypeKeys } from '../constants';
import { UnsealDetails } from 'selectors/ens';

export interface EnsUserDownloadedBidAction {
  type: TypeKeys.ENS_USER_DOWNLOADED_BID;
  payload: UnsealDetails & { from: string; date: number };
}

export type BiddingAction = EnsUserDownloadedBidAction;
