import React, { PureComponent } from 'react';
import { mnemonicToSeedSync, validateMnemonic } from 'bip39';
import { Tooltip } from '@mycrypto/ui';

import translate, { translateRaw } from '@translations';
import { formatMnemonic } from '@utils';
import { TogglablePassword, Input } from '@components';

import { FormData, WalletId } from '@types';
import { getDPath, getDPaths } from '@services/EthService';
import { NetworkContext } from '@services/Store';
import { WalletFactory } from '@services/WalletService';
import DeterministicWallets from './DeterministicWallets';
import PrivateKeyicon from '@assets/images/icn-privatekey-new.svg';
import questionToolTip from '@assets/images/icn-question.svg';

import './Mnemonic.scss';

interface OwnProps {
  formData: FormData;
  onUnlock(param: any): void;
}

interface State {
  seed: string | undefined;
  phrase: string | undefined;
  formattedPhrase: string | undefined;
  pass: string | undefined;
  selectedDPath: DPath;
}

const WalletService = WalletFactory(WalletId.MNEMONIC_PHRASE);

class MnemonicDecryptClass extends PureComponent<OwnProps, State> {
  public static contextType = NetworkContext;
  public state: State = {
    seed: undefined,
    phrase: undefined,
    formattedPhrase: undefined,
    pass: undefined,
    selectedDPath:
      getDPath(
        this.context.getNetworkById(this.props.formData.network),
        WalletId.MNEMONIC_PHRASE
      ) || getDPaths(this.context.networks, WalletId.MNEMONIC_PHRASE)[0]
  };

  public render() {
    const { seed, phrase, formattedPhrase, pass, selectedDPath } = this.state;
    const isValidMnemonic = validateMnemonic(formattedPhrase || '');
    const networks = this.context.networks;
    const network = this.context.getNetworkById(this.props.formData.network);

    if (seed) {
      return (
        <div className="Mnemonic-dpath">
          <DeterministicWallets
            network={network}
            seed={seed}
            dPath={selectedDPath}
            dPaths={getDPaths(networks, WalletId.MNEMONIC_PHRASE)}
            onCancel={this.handleCancel}
            onConfirmAddress={this.handleUnlock}
            onPathChange={this.handlePathChange}
          />
        </div>
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
                  value={phrase || ''}
                  rows={4}
                  placeholder={translateRaw('X_MNEMONIC')}
                  isValid={isValidMnemonic}
                  isTextareaWhenVisible={true}
                  onChange={this.onMnemonicChange}
                  onEnter={isValidMnemonic ? this.onDWModalOpen : undefined}
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
                  value={pass || ''}
                  onChange={this.onPasswordChange}
                  placeholder={translateRaw('INPUT_PASSWORD_LABEL')}
                  type="password"
                />
              </div>
              <div className="form-group">
                <button
                  style={{ width: '100%' }}
                  onClick={this.onDWModalOpen}
                  className="btn btn-primary btn-lg"
                  disabled={!isValidMnemonic}
                >
                  {translate('MNEMONIC_CHOOSE_ADDR')}
                </button>
              </div>
              <div className="Mnemonic-help">{translate('MNEMONIC_HELP')}</div>
            </div>
          </div>
        </div>
      );
    }
  }

  public onPasswordChange = (e: React.FormEvent<HTMLInputElement>) => {
    this.setState({ pass: e.currentTarget.value });
  };

  public onMnemonicChange = (e: React.FormEvent<HTMLTextAreaElement>) => {
    const phrase = e.currentTarget.value;
    const formattedPhrase = formatMnemonic(phrase);

    this.setState({
      phrase,
      formattedPhrase
    });
  };

  public onDWModalOpen = async () => {
    const { formattedPhrase, pass = '' } = this.state;
    if (!formattedPhrase || !validateMnemonic(formattedPhrase)) {
      return;
    }

    const seed = await mnemonicToSeedSync(formattedPhrase, pass).toString('hex');
    this.setState({ seed });
  };

  private handleCancel = () => {
    this.setState({ seed: undefined });
  };

  private handlePathChange = (dPath: DPath) => {
    this.setState({ selectedDPath: dPath });
  };

  private handleUnlock = async (address: string, index: number) => {
    const { formattedPhrase, pass, selectedDPath } = this.state;

    if (!formattedPhrase) return;

    const wallet = await WalletService.init({
      path: `${selectedDPath.value}/${index}`,
      pass,
      phrase: formattedPhrase,
      address
    });
    this.props.onUnlock(wallet);
  };
}

export const MnemonicDecrypt = MnemonicDecryptClass;
