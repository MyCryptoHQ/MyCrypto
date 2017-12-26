import {
  SwapEtherToTokenAction,
  SwapTokenToEtherAction,
  SwapTokenToTokenAction
} from '../actionTypes';
import { TypeKeys } from '../constants';

type TSwapTokenToEther = typeof swapTokenToEther;
const swapTokenToEther = (payload: SwapTokenToEtherAction['payload']): SwapTokenToEtherAction => ({
  type: TypeKeys.TOKEN_TO_ETHER_SWAP,
  payload
});

type TSwapEtherToToken = typeof swapEtherToToken;
const swapEtherToToken = (payload: SwapEtherToTokenAction['payload']): SwapEtherToTokenAction => ({
  payload,
  type: TypeKeys.ETHER_TO_TOKEN_SWAP
});

type TSwapTokenToToken = typeof swapTokenToToken;
const swapTokenToToken = (payload: SwapTokenToTokenAction['payload']): SwapTokenToTokenAction => ({
  payload,
  type: TypeKeys.TOKEN_TO_TOKEN_SWAP
});

export {
  swapEtherToToken,
  swapTokenToEther,
  swapTokenToToken,
  TSwapTokenToEther,
  TSwapEtherToToken,
  TSwapTokenToToken
};
