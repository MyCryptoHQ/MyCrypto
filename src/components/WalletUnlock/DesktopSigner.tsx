import React, { FC, useCallback, useContext, useState } from 'react';
const Web3WsProvider = require('web3-providers-ws');
import { Web3Provider } from 'ethers/providers/web3-provider';

import translate from '@translations';
import { FormData } from '@types';
import { InlineMessage } from '@components';
import { SettingsContext, useNetworks } from '@services/Store';

import myCryptoIcon from '@assets/icons/brand/logo.svg';

interface Props {
  formDispatch: any;
  formData: FormData;
  wallet: object;
  onUnlock(param: string[]): void;
}

interface IWeb3UnlockError {
  error: boolean;
  message: string;
}

const DesktopSignerDecrypt: FC<Props> = ({ formData, onUnlock }) => {
  const { updateSettingsNode } = useContext(SettingsContext);
  const { addNodeToNetwork, networks } = useNetworks();
  const network = networks.find((n) => n.id === formData.network);
  const ws = new Web3WsProvider('ws://localhost:8000');
  const ethersProvider = new Web3Provider(ws, network!.chainId);

  const [web3Unlocked, setWeb3Unlocked] = useState<boolean | undefined>(undefined);
  const [web3UnlockError, setWeb3UnlockError] = useState<IWeb3UnlockError | undefined>(undefined);
  const unlockWallet = useCallback(async () => {
    try {
      const walletPayload: string[] | undefined = await ethersProvider.listAccounts();

      if (!walletPayload) {
        throw new Error('Failed to unlock web3 wallet');
      }

      onUnlock(walletPayload);
    } catch (e) {
      setWeb3UnlockError({ error: true, message: e.message });
      setWeb3Unlocked(false);
    }
  }, [updateSettingsNode, addNodeToNetwork, setWeb3Unlocked]);

  return (
    <div className="Panel">
      <div className="Panel-title">{translate('ADD_ACCOUNT_WEB3_TITLE_DEFAULT')}</div>
      <div className="Panel-description">{translate(`ADD_ACCOUNT_WEB3_DESC`)}</div>
      <div className="Panel-content">
        <div className="Web3-img-container">
          <div className={'Web3-img-default'}>
            <img src={myCryptoIcon} />
          </div>
        </div>
        <button className="btn btn-primary btn-lg btn-block" onClick={unlockWallet}>
          {translate('ADD_WEB3_DEFAULT')}
        </button>

        {web3Unlocked === false && (
          <>
            {web3UnlockError && web3UnlockError.error && (
              <InlineMessage>{web3UnlockError.message}</InlineMessage>
            )}
            <InlineMessage>{translate('WEB3_ONUNLOCK_NOT_FOUND_ERROR')}</InlineMessage>
          </>
        )}
      </div>
    </div>
  );
};

export default DesktopSignerDecrypt;
