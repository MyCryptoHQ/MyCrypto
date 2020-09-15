import React from 'react';

import { getWalletConfig } from '@config';
import { translateRaw } from '@translations';
import { WalletId } from '@types';
import { noOp } from '@utils';

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
