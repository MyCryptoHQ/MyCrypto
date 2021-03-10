import React from 'react';

import { ProvidersWrapper } from '@../jest_config/providersWrapper';

import { ExtendedContentPanel } from '@components';
import { LEDGER_DERIVATION_PATHS } from '@config';
import { fAssets, fDWAccounts, fNetworks } from '@fixtures';
import { DataContext, IDataContext, LedgerUSB, Wallet } from '@services';
import { noOp } from '@utils';

import {
  DeterministicWalletProps,
  default as DeterministicWalletUI
} from './DeterministicWallet';

export default {
  title: 'Hardware/DeterministicWallet'
};


const initialProps: DeterministicWalletProps = {
  state: {
    isInit: true,
    isConnected: true,
    isConnecting: false,
    isGettingAccounts: false,
    detectedChainId: 1,
    asset: fAssets[0],
    queuedAccounts: [],
    finishedAccounts: fDWAccounts,
    customDPaths: [],
    session: new LedgerUSB() as Wallet,
    promptConnectionRetry: false,
    completed: true
  },
  network: fNetworks[0],
  assets: fAssets,
  dpaths: LEDGER_DERIVATION_PATHS,
  assetToUse: fAssets[0],
  selectedDPath: {
    ...fDWAccounts[0].pathItem,
    label: 'Default ETH DPath',
    value: ''
  },
  setSelectedDPath: noOp,
  updateAsset: noOp,
  addDPaths: noOp,
  scanMoreAddresses: noOp,
  handleAssetUpdate: noOp,
  onUnlock: noOp
};

export const DeterministicWallet = () => {
  return (
    <ProvidersWrapper>
      <DataContext.Provider value={({ accounts: [], addressBook: [], contracts: [], assets: fAssets } as unknown) as IDataContext}>
        <ExtendedContentPanel width='800px'>
          <DeterministicWalletUI {...initialProps} />
        </ExtendedContentPanel>
      </DataContext.Provider>
    </ProvidersWrapper>
  );
};
