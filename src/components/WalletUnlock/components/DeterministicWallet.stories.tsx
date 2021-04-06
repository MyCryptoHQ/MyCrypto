import React from 'react';

import { ProvidersWrapper } from 'test-utils';

import { ExtendedContentPanel } from '@components';
import { LEDGER_DERIVATION_PATHS } from '@config';
import { fAssets, fDWAccounts, fNetworks } from '@fixtures';
import { noOp } from '@utils';

import { DeterministicWalletProps, default as DeterministicWalletUI } from './DeterministicWallet';

export default {
  title: 'Organisms/DeterministicWallet'
};

const initialProps: DeterministicWalletProps = {
  selectedAsset: fAssets[0],
  finishedAccounts: fDWAccounts,
  isCompleted: true,
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

export const DeterministicWallet = () => (
  <ProvidersWrapper>
    <ExtendedContentPanel width="800px">
      <DeterministicWalletUI {...initialProps} />
    </ExtendedContentPanel>
  </ProvidersWrapper>
);
