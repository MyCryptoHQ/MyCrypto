import { TypeKeys } from 'actions/transaction/constants';
export { SwapTokenToEtherAction, SwapEtherToTokenAction, SwapAction };

/* Swapping actions */
interface SwapTokenToEtherAction {
  type: TypeKeys.TOKEN_TO_ETHER_SWAP;
}
interface SwapEtherToTokenAction {
  type: TypeKeys.ETHER_TO_TOKEN_SWAP;
}

type SwapAction = SwapEtherToTokenAction | SwapTokenToEtherAction;
