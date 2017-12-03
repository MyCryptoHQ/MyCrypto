import { SwapEtherToTokenAction, SwapTokenToEtherAction } from '../actionTypes';
import { TypeKeys } from '../constants';
export {
  swapEtherToToken,
  swapTokenToEther,
  TSwapTokenToEther,
  TSwapEtherToToken
};

type TSwapTokenToEther = typeof swapTokenToEther;
const swapTokenToEther = (): SwapTokenToEtherAction => ({
  type: TypeKeys.TOKEN_TO_ETHER_SWAP
});

type TSwapEtherToToken = typeof swapEtherToToken;
const swapEtherToToken = (): SwapEtherToTokenAction => ({
  type: TypeKeys.ETHER_TO_TOKEN_SWAP
});
