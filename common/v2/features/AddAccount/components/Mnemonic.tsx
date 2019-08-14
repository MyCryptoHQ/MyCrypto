import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { mnemonicToSeed, validateMnemonic } from 'bip39';

import { FormData } from 'v2/features/AddAccount/types';
import { getNetworkByName } from 'v2/services/Store';
import { InsecureWalletName } from 'config';
import translate, { translateRaw } from 'translations';
import { formatMnemonic } from 'utils/formatters';
import { AppState } from 'features/reducers';
import { configNetworksStaticSelectors } from 'features/config';
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

interface StoreProps {
  dPaths: DPath[];
}

type Props = OwnProps & StoreProps;

interface State {
  seed: string | undefined;
  phrase: string | undefined;
  formattedPhrase: string | undefined;
  pass: string | undefined;
  selectedDPath: DPath;
}

class MnemonicDecryptClass extends PureComponent<Props, State> {
  public state: State = {
    seed: undefined,
    phrase: undefined,
    formattedPhrase: undefined,
    pass: undefined,
    selectedDPath: this.getInitialDPath()
  };

  public render() {
    const { seed, phrase, formattedPhrase, pass, selectedDPath } = this.state;
    const isValidMnemonic = validateMnemonic(formattedPhrase || '');

    if (seed) {
      return (
        <div className="Mnemonic-dpath">
          <DeterministicWallets
            seed={seed}
            dPath={selectedDPath}
            dPaths={this.props.dPaths}
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

  private getInitialDPath() : DPath {
    const network = getNetworkByName(this.props.formData.network);
    return network ? network.dPaths.mnemonicPhrase : this.props.dPaths[0]
  }

  private handleCancel = () => {
    this.setState({ seed: undefined });
  };

  private handlePathChange = (dPath: DPath) => {
    this.setState({ selectedDPath: dPath });
  };

  private handleUnlock = (address: string, index: number) => {
    const { formattedPhrase, pass, selectedDPath } = this.state;

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
      selectedDPath: this.getInitialDPath()
    });
  };
}

function mapStateToProps(state: AppState): StoreProps {
  return {
    dPaths: configNetworksStaticSelectors.getPaths(state, InsecureWalletName.MNEMONIC_PHRASE)
  };
}

export const MnemonicDecrypt = connect(mapStateToProps)(MnemonicDecryptClass);
