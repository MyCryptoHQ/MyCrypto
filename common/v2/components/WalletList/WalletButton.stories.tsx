import React from 'react';

import { WalletId } from '@types';
import { getWalletConfig } from '@config';
import { translateRaw } from '@translations';
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
