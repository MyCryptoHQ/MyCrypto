import React, { useState } from 'react';

import { validateMnemonic } from 'bip39';
import prop from 'ramda/src/prop';
import uniqBy from 'ramda/src/uniqBy';

import PrivateKeyicon from '@assets/images/icn-privatekey-new.svg';
import questionToolTip from '@assets/images/icn-question.svg';
import { Input, RouterLink, TogglablePassword, Tooltip } from '@components';
import { DEFAULT_GAP_TO_SCAN_FOR, DEFAULT_NUM_OF_ACCOUNTS_TO_SCAN, DPathsList } from '@config';
import {
  getAssetByUUID,
  getNetworkById,
  useAssets,
  useDeterministicWallet,
  useNetworks
} from '@services';
import translate, { Trans, translateRaw } from '@translations';
import { ExtendedAsset, FormData, WalletId } from '@types';
import { formatMnemonic } from '@utils';

import DeterministicWallet from './DeterministicWallet';
import UnsupportedNetwork from './UnsupportedNetwork';
import './NewTrezor.scss';

//@todo: conflicts with comment in walletDecrypt -> onUnlock method
interface OwnProps {
  formData: FormData;
  onUnlock(param: any): void;
}

interface MnemonicLoginState {
  phrase: string;
  formattedPhrase: string;
  pass?: string;
}

const initialMnemonicLoginState: MnemonicLoginState = {
  phrase: '',
  formattedPhrase: '',
  pass: undefined
};

const MnemonicDecrypt = ({ formData, onUnlock }: OwnProps) => {
  const dpaths = uniqBy(prop('value'), Object.values(DPathsList));
  const numOfAccountsToCheck = DEFAULT_NUM_OF_ACCOUNTS_TO_SCAN;
  const extendedDPaths = dpaths.map((dpath) => ({
    ...dpath,
    offset: 0,
    numOfAddresses: numOfAccountsToCheck
  }));
  const { networks } = useNetworks();
  const { assets } = useAssets();
  const network = getNetworkById(formData.network, networks);
  const baseAsset = getAssetByUUID(assets)(network.baseAsset) as ExtendedAsset;
  const defaultDPath = network.dPaths[WalletId.MNEMONIC_PHRASE] || DPathsList.ETH_DEFAULT;
  const [assetToUse, setAssetToUse] = useState(baseAsset);
  const {
    state,
    requestConnection,
    updateAsset,
    addDPaths,
    generateFreshAddress
  } = useDeterministicWallet(extendedDPaths, WalletId.MNEMONIC_PHRASE_NEW, DEFAULT_GAP_TO_SCAN_FOR);
  const [mnemonicLoginState, setMnemonicLoginState] = useState(initialMnemonicLoginState);
  const isValidMnemonic = validateMnemonic(mnemonicLoginState.formattedPhrase || '');

  const handleNullConnect = () => {
    requestConnection(
      network,
      assetToUse,
      mnemonicLoginState.formattedPhrase,
      mnemonicLoginState.pass
    );
  };

  const onMnemonicChange = (e: React.FormEvent<HTMLTextAreaElement>) => {
    const phrase = e.currentTarget.value;
    const formattedPhrase = formatMnemonic(phrase);

    setMnemonicLoginState({
      ...mnemonicLoginState,
      phrase,
      formattedPhrase
    });
  };

  const onPasswordChange = (e: React.FormEvent<HTMLInputElement>) => {
    const pass = e.currentTarget.value;
    setMnemonicLoginState({
      ...mnemonicLoginState,
      pass
    });
  };

  const handleAssetUpdate = (newAsset: ExtendedAsset) => {
    setAssetToUse(newAsset);
    updateAsset(newAsset);
  };

  if (!network) {
    // @todo: make this better.
    return <UnsupportedNetwork walletType={translateRaw('x_Ledger')} network={network} />;
  }

  if (state.isConnected && state.asset && (state.queuedAccounts || state.finishedAccounts)) {
    return (
      <DeterministicWallet
        state={state}
        defaultDPath={defaultDPath}
        assets={assets}
        assetToUse={assetToUse}
        network={network}
        updateAsset={updateAsset}
        addDPaths={addDPaths}
        generateFreshAddress={generateFreshAddress}
        handleAssetUpdate={handleAssetUpdate}
        onUnlock={onUnlock}
      />
    );
  } else {
    return (
      <div className="Panel">
        <div className="Panel-title">
          {translate('UNLOCK_WALLET')}{' '}
          {translateRaw('YOUR_WALLET_TYPE', { $walletType: translateRaw('X_MNEMONIC') })}
        </div>
        <div className="Mnemonic">
          <div id="selectedTypeKey">
            <div className="Mnemonic-img">
              <img src={PrivateKeyicon} />
            </div>

            <div className="form-group">
              <label>{translateRaw('YOUR_MNEMONIC_PHRASE')}</label>
              <TogglablePassword
                value={mnemonicLoginState.phrase || ''}
                rows={4}
                placeholder={translateRaw('X_MNEMONIC')}
                isValid={isValidMnemonic}
                isTextareaWhenVisible={true}
                onChange={onMnemonicChange}
                onEnter={isValidMnemonic ? handleNullConnect : undefined}
              />
            </div>
            <div className="form-group">
              <label className="Mnemonic-label">
                {translate('ADD_LABEL_8')}
                <div className="Mnemonic-tool-tip">
                  {' '}
                  <Tooltip tooltip={translate('MNEMONIC_TOOL_TIP')}>
                    <img className="Tool-tip-img" src={questionToolTip} />
                  </Tooltip>
                </div>
              </label>
              <Input
                isValid={true}
                showValidAsPlain={true}
                value={mnemonicLoginState.pass || ''}
                onChange={onPasswordChange}
                placeholder={translateRaw('INPUT_PASSWORD_LABEL')}
                type="password"
              />
            </div>
            <div className="form-group">
              <button
                style={{ width: '100%' }}
                onClick={() => handleNullConnect()}
                className="btn btn-primary btn-lg"
                disabled={!isValidMnemonic}
              >
                {translate('MNEMONIC_CHOOSE_ADDR')}
              </button>
            </div>
            <div className="Mnemonic-help">
              {translate('MNEMONIC_HELP')}
              <br />
              <Trans
                id="USE_OLD_INTERFACE_ALT"
                variables={{
                  $link: () => (
                    <RouterLink to="/add-account/mnemonic_phrase">
                      {translateRaw('TRY_OLD_INTERFACE_ALT')}
                    </RouterLink>
                  )
                }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default MnemonicDecrypt;
