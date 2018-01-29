import { EnsUserDownloadedBidAction } from '../actionTypes';
import { TypeKeys } from '../constants';

export type TEnsUserDownloadedBid = typeof ensUserDownloadedBid;
export const ensUserDownloadedBid = (
  payload: EnsUserDownloadedBidAction['payload']
): EnsUserDownloadedBidAction => ({
  type: TypeKeys.ENS_USER_DOWNLOADED_BID,
  payload
});
