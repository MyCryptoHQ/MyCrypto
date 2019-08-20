import React, { PureComponent } from 'react';
import { mnemonicToSeed, validateMnemonic } from 'bip39';

import { FormData } from 'v2/features/AddAccount/types';
import { getDPath, getDPaths } from 'v2/services/EthService';
import { NetworkContext } from 'v2/services/Store';
import { InsecureWalletName } from 'config';
import translate, { translateRaw } from 'translations';
import { formatMnemonic } from 'utils/formatters';
import { TogglablePassword } from 'components';
import { Input } from 'components/ui';
import DeterministicWallets from './DeterministicWallets';
import PrivateKeyicon from 'common/assets/images/icn-privatekey-new.svg';
import { Tooltip } from '@mycrypto/ui';
import questionToolTip from 'common/assets/images/icn-question.svg';
import './Mnemonic.scss';

interface OwnProps {
  formData: FormData;
  onUnlock(param: any): void;
}

type Props = OwnProps;

interface State {
  seed: string | undefined;
  phrase: string | undefined;
  formattedPhrase: string | undefined;
  pass: string | undefined;
  selectedDPath: DPath;
}

class MnemonicDecryptClass extends PureComponent<Props, State> {
  public static contextType = NetworkContext;
  public state: State = {
    seed: undefined,
    phrase: undefined,
    formattedPhrase: undefined,
    pass: undefined,
    selectedDPath:
      getDPath(
        this.context.getNetworkByName(this.props.formData.network),
        InsecureWalletName.MNEMONIC_PHRASE
      ) || getDPaths(this.context.networks, InsecureWalletName.MNEMONIC_PHRASE)[0]
  };

  public render() {
    const { seed, phrase, formattedPhrase, pass, selectedDPath } = this.state;
    const isValidMnemonic = validateMnemonic(formattedPhrase || '');
    const networks = this.context.networks;
    const network = this.context.getNetworkByName(this.props.formData.network);

    if (seed) {
      return (
        <div className="Mnemonic-dpath">
          <DeterministicWallets
            network={network}
            seed={seed}
            dPath={selectedDPath}
            dPaths={getDPaths(networks, InsecureWalletName.MNEMONIC_PHRASE)}
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
            {translate('UNLOCK_WALLET')} {`Your ${translateRaw('X_MNEMONIC')}`}
          </div>
          <div className="Mnemonic">
            <div id="selectedTypeKey">
              <div className="Mnemonic-img">
                <img src={PrivateKeyicon} />
              </div>

              <div className="form-group">
                <label>Your Mnemonic Phrase</label>
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
                      {props => <img className="Tool-tip-img" src={questionToolTip} {...props} />}
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
              <div className="Mnemonic-help">{translate('KEYSTORE_HELP')}</div>
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

    const seed = await mnemonicToSeed(formattedPhrase, pass).toString('hex');
    this.setState({ seed });
  };

  private handleCancel = () => {
    this.setState({ seed: undefined });
  };

  private handlePathChange = (dPath: DPath) => {
    this.setState({ selectedDPath: dPath });
  };

  private handleUnlock = (address: string, index: number) => {
    const { formattedPhrase, pass, selectedDPath } = this.state;
    const networks = this.context.networks;
    const network = this.context.getNetworkByName(this.props.formData.network);

    this.props.onUnlock({
      path: `${selectedDPath.value}/${index}`,
      pass,
      phrase: formattedPhrase,
      address
    });

    this.setState({
      seed: undefined,
      phrase: undefined,
      formattedPhrase: undefined,
      pass: undefined,
      selectedDPath:
        getDPath(network, InsecureWalletName.MNEMONIC_PHRASE) ||
        getDPaths(networks, InsecureWalletName.MNEMONIC_PHRASE)[0]
    });
  };
}

export const MnemonicDecrypt = MnemonicDecryptClass;
