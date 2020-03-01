import { AssetContext } from '../../services/Store/Asset';
import {
  IFormikFields,
  ISignedTx,
  ITxConfig,
  ITxObject,
  ITxReceipt,
  Asset,
  ITxStatus
} from '../../types';
import { hexWeiToString } from '../../services/EthService/utils';
import { useCallback, useContext } from 'react';
import { processFormDataToTx } from '../SendAssets/helpers';
import { fromTxReceiptObj, makeTxConfigFromSignedTx, TUseStateReducerFactory } from '../../utils';
import { getBaseAssetByNetwork, NetworkContext } from '../../services/Store/Network';
import { ProviderHandler } from '../../services/EthService/network';
import { AccountContext } from '../../services/Store/Account';
import { Arrayish, hexlify } from 'ethers/utils';
import CryptoScamDBService from '../../services/ApiService/CryptoScamDB/CryptoScamDB';
import { getNonce } from '../../services/EthService';
import {
  CryptoScamDBInfoResponse,
  CryptoScamDBNoInfoResponse
} from '../../services/ApiService/CryptoScamDB/types';

const protectedTxConfigInitialState = {
  tx: {
    gasLimit: null,
    gasPrice: null,
    nonce: null,
    data: null,
    to: null
  },
  amount: null,
  receiverAddress: null,
  senderAccount: null,
  network: undefined,
  asset: null
};

const protectedTxReceiptInitialState = {
  network: {
    id: 'Ropsten',
    name: 'Ropsten',
    chainId: 3,
    isCustom: false,
    isTestnet: true,
    color: '#adc101',
    gasPriceSettings: {
      min: 0.1,
      max: 40,
      initial: 4
    },
    dPaths: {
      TREZOR: {
        label: 'Testnet (ETH)',
        value: "m/44'/1'/0'/0"
      },
      SAFE_T_MINI: {
        label: 'Testnet (ETH)',
        value: "m/44'/1'/0'/0"
      },
      LEDGER_NANO_S: {
        label: 'Ledger (ETH)',
        value: "m/44'/60'/0'"
      },
      MNEMONIC_PHRASE: {
        label: 'Testnet (ETH)',
        value: "m/44'/1'/0'/0"
      },
      default: {
        label: 'Testnet (ETH)',
        value: "m/44'/1'/0'/0"
      }
    },
    contracts: [],
    assets: [
      '77de68da-ecd8-53ba-bbb5-8edb1c8e14d7',
      'e0977bcb-30be-53cf-99d2-e5f031e8624b',
      '8fa21ab1-48ac-544a-b13c-69d86528d126',
      '3849a248-49b4-5e85-91cb-0f9f97eaa0c9',
      '528fb72f-8536-5219-8b65-20fbd0e4355d',
      '4f6380d2-303e-5fe4-8f0b-25f944e5dc84',
      '39a543b0-ac4f-5b14-9467-86fd6538a6a2'
    ],
    baseAsset: '77de68da-ecd8-53ba-bbb5-8edb1c8e14d7',
    baseUnit: 'RopstenETH',
    nodes: [
      {
        name: 'ropsten_infura',
        type: 'infura',
        service: 'Infura',
        url: 'https://ropsten.infura.io/v3/c02fff6b5daa434d8422b8ece54c7286'
      }
    ],
    blockExplorer: {
      name: 'Etherscan',
      origin: 'https://ropsten.etherscan.io'
    }
  },
  hash: '0x71d2aa464f5b2a99b60fb2fe856e5dd9a84ce3e3ed23d885edad937a10586e5d',
  from: '0x8fe684ae26557DfFF70ceE9a4Ff5ee7251a31AD5',
  asset: {
    uuid: '77de68da-ecd8-53ba-bbb5-8edb1c8e14d7',
    ticker: 'RopstenETH',
    name: 'Ropsten',
    networkId: 'Ropsten',
    type: 'base',
    decimal: 18
  },
  amount: '0.01',
  to: '0x88F7B1E26c3A52CA3cD8aF4ba1b448391eb31d88',
  nonce: 1,
  gasLimit: {
    _hex: '0x5208'
  },
  gasPrice: {
    _hex: '0xee6b2800'
  },
  data: '0x'
};

interface State {
  txConfig: ITxConfig;
  txReceipt?: ITxReceipt;
  signedTx: ISignedTx; // make sure signedTx is only used within stateFactory
  txReport: CryptoScamDBNoInfoResponse | CryptoScamDBInfoResponse;
}

const ProtectedTxConfigFactory: TUseStateReducerFactory<State> = ({ state, setState }) => {
  const { assets } = useContext(AssetContext);
  const { networks } = useContext(NetworkContext);

  const { addNewTransactionToAccount, accounts } = useContext(AccountContext);

  const handleProtectedTransactionSubmit = useCallback(
    async (payload: IFormikFields): Promise<void> => {
      const {
        gasEstimates: { safeLow },
        network,
        account
      } = payload;
      const transSafeLow = Math.min(safeLow, 10);

      payload = {
        ...payload,
        nonceField: (await getNonce(network, account)).toString()
      };

      if (payload.advancedTransaction) {
        payload = {
          ...payload,
          gasPriceField: transSafeLow.toString()
        };
      } else {
        payload = {
          ...payload,
          gasPriceSlider: transSafeLow.toString()
        };
      }

      const rawTransaction: ITxObject = processFormDataToTx(payload);
      const baseAsset: Asset | undefined = getBaseAssetByNetwork({
        network: payload.network,
        assets
      });

      setState((prevState: State) => ({
        ...prevState,
        txConfig: {
          rawTransaction,
          amount: payload.amount,
          senderAccount: payload.account,
          receiverAddress: payload.address.value,
          network: payload.network,
          asset: payload.asset,
          baseAsset: baseAsset || ({} as Asset),
          from: payload.account.address,
          gasPrice: hexWeiToString(rawTransaction.gasPrice),
          gasLimit: payload.gasLimitField,
          nonce: payload.nonceField,
          data: rawTransaction.data,
          value: hexWeiToString(rawTransaction.value)
        }
      }));

      await handleTransactionReport(payload.address.value);

      return Promise.resolve();
    },
    [state, setState, assets]
  );

  const handleProtectedTransactionConfirmAndSend = useCallback(
    (payload: Arrayish, cb: () => void) => {
      const provider = new ProviderHandler(state.txConfig.network);

      const signedTx = hexlify(payload);

      provider
        .sendRawTx(signedTx)
        .then(retrievedTxReceipt => retrievedTxReceipt)
        .catch(txHash => provider.getTransactionByHash(txHash))
        .then(retrievedTransactionReceipt => {
          const txReceipt = fromTxReceiptObj(retrievedTransactionReceipt)(assets, networks);
          addNewTransactionToAccount(
            state.txConfig.senderAccount,
            { ...txReceipt, stage: ITxStatus.PENDING } || {}
          );
          setState((prevState: State) => ({
            ...prevState,
            txConfig: makeTxConfigFromSignedTx(
              payload,
              assets,
              networks,
              accounts,
              prevState.txConfig
            ),
            txReceipt,
            signedTx
          }));
        })
        .finally(cb);
    },
    [state, setState, assets, networks, addNewTransactionToAccount, accounts]
  );

  const handleTransactionReport = useCallback(
    async (receiverAddress): Promise<void> => {
      if (!receiverAddress) return;

      const txReport = await CryptoScamDBService.instance.check(receiverAddress);

      setState((prevState: State) => ({
        ...prevState,
        txReport
      }));

      return Promise.resolve();
    },
    [state, setState]
  );

  const txFactoryState: State = {
    txConfig: state.txConfig,
    txReceipt: state.txReceipt,
    signedTx: state.signedTx,
    txReport: state.txReport
  };

  return {
    handleProtectedTransactionSubmit,
    handleProtectedTransactionConfirmAndSend,
    handleTransactionReport,
    protectedTransactionTxFactoryState: txFactoryState
  };
};

export { protectedTxConfigInitialState, protectedTxReceiptInitialState, ProtectedTxConfigFactory };
