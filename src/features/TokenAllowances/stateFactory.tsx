import { StoreAccount } from '@types';
import { TUseStateReducerFactory } from '@utils';

import { TokenAllowancesState } from './types';

const TokenAllowancesFactory: TUseStateReducerFactory<TokenAllowancesState> = ({ state, setState }) => {
  const reset = () => {
    setState(() => ({
      step: 0,
      loading: false
    }));
  };

  const getTokenAllowancesForAccount = (recipientAddress: StoreAccount) => {
    const accountErc20Assets = recipientAddress.assets.filter(asset => asset.type.toLowerCase() === 'erc20')
    if (accountErc20Assets.length === 0) {
      setState((prevState: TokenAllowancesState) => ({
        ...prevState,
        error: "NO_TOKENS",
        loading: false,
        step: 1
      }));
    } else {
      console.log(recipientAddress)
      setState((prevState: TokenAllowancesState) => ({
        ...prevState,
        account: recipientAddress,
        address: recipientAddress.address,
        assets: accountErc20Assets,
        step: 1
      }));
    }
  };

  return {
    reset,
    getTokenAllowancesForAccount,
    tokenAllowancesState: state
  };
};

export default TokenAllowancesFactory;
