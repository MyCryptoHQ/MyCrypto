import { TypeKeys } from '../constants';
import BN from 'bn.js';

interface ShaBidRequested {
  type: TypeKeys.ENS_SHA_BID_REQUESTED;
  payload: { nameHash: string; bidAddress: string; amountWei: BN; secretHash: string };
}

interface ShaBidSucceeded {
  type: TypeKeys.ENS_SHA_BID_SUCCEEDED;
  payload: { sealedBid: string };
}

interface ShaBidFailed {
  type: TypeKeys.ENS_SHA_BID_FAILED;
  payload: { error: any };
}

type ShaBidAction = ShaBidRequested | ShaBidSucceeded | ShaBidFailed;

export { ShaBidRequested, ShaBidSucceeded, ShaBidFailed, ShaBidAction };
