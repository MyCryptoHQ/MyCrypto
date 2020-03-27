import React from 'react';

import { WalletId } from 'v2/types';
import { getWalletConfig } from 'v2/config';
import { translateRaw } from 'v2/translations';
import { noOp } from 'v2/utils';

import { WalletButton } from './WalletButton';

export default { title: 'WalletButton' };

const walletInfo = getWalletConfig(WalletId.PRIVATE_KEY);

const getWalletButton = (disabled?: boolean) => (
  <WalletButton
    key={`wallet-icon-${walletInfo.name}`}
    name={translateRaw(walletInfo.lid)}
    icon={walletInfo.icon}
    description={translateRaw(walletInfo.description)}
    onClick={noOp}
    isDisabled={disabled}
  />
);

export const defaultState = () => getWalletButton();

export const disabledState = () => getWalletButton(true);
