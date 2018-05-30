import { TypeKeys } from '../constants';
import BN from 'bn.js';

interface ShaBidRequested {
  type: TypeKeys.ENS_SHA_BID_REQUESTED;
  payload: {
    nameHash: string;
    bidAddress: string;
    amountWei: BN;
    secretHash: string;
    loading: boolean;
  };
}

interface ShaBidSucceeded {
  type: TypeKeys.ENS_SHA_BID_SUCCEEDED;
  payload: { sealedBid: string; loading: boolean };
}

interface ShaBidFailed {
  type: TypeKeys.ENS_SHA_BID_FAILED;
  payload: { error: any; loading: boolean };
}

type ShaBidAction = ShaBidRequested | ShaBidSucceeded | ShaBidFailed;

export { ShaBidRequested, ShaBidSucceeded, ShaBidFailed, ShaBidAction };
