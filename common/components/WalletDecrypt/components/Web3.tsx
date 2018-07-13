import React from 'react';
import translate, { translateRaw } from 'translations';
import { NewTabLink } from 'components/ui';
import { PrimaryButton, SecondaryButton } from 'components';
import img from 'assets/images/logo-metamask.svg';
import './Web3.scss';

interface Props {
  onUnlock(): void;
}

export const Web3Decrypt: React.SFC<Props> = props => (
  <div className="Web3Decrypt">
    <div className="Web3Decrypt-header">
      <h2 className="Web3Decrypt-decrypt-title">{translate('ADD_METAMASK')}</h2>
    </div>
    <img src={img} alt="Metamask Logo" className="Web3Decrypt-illustration" />
    <br />
    <NewTabLink
      className="Web3Decrypt-buy"
      href="https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en"
    >
      {translate('ACTION_13', { $thing: 'MetaMask' })}
    </NewTabLink>
    <div className="Web3Decrypt-btn-wrapper">
      <SecondaryButton
        text="Back"
        onClick={(props as any).clearWalletChoice}
        className="Web3Decrypt-btn"
      />
      <div className="flex-spacer" />
      <PrimaryButton
        text="Connect"
        onClick={props.onUnlock}
        loadingTxt={translateRaw('ADD_METAMASK')}
        className="Web3Decrypt-btn"
      />
    </div>
  </div>
);
