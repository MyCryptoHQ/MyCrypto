import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { mnemonicToSeed, validateMnemonic } from 'bip39';

import { InsecureWalletName } from 'config';
import translate, { translateRaw } from 'translations';
import { formatMnemonic } from 'utils/formatters';
import { AppState } from 'features/reducers';
import { configSelectors, configNetworksStaticSelectors } from 'features/config';
import { TogglablePassword } from 'components';
import { Input } from 'components/ui';
import DeterministicWallets from './DeterministicWallets';
import PrivateKeyicon from 'common/assets/images/icn-privatekey-new.svg';
import { Tooltip } from '@mycrypto/ui';
import questionToolTip from 'common/assets/images/icn-question.svg';
import './Mnemonic.scss';

interface OwnProps {
  onUnlock(param: any): void;
}

interface StoreProps {
  dPath: DPath;
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
  public state:State = {
    seed: undefined,
    phrase: undefined,
    formattedPhrase: undefined,
    pass: undefined,
    selectedDPath: this.props.dPath
  }

  public UNSAFE_componentWillReceiveProps(nextProps: Props) {
    if (this.props.dPath !== nextProps.dPath) {
      this.setState({ selectedDPath: nextProps.dPath });
    }
  }

  public render() {
    const { seed, phrase, formattedPhrase, pass, selectedDPath} = this.state;
    const isValidMnemonic = validateMnemonic(formattedPhrase || '');

    if (seed) {
      return (
        <div className="Mnemoinc-dpath">
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
                  <div className="Mnemoinc-tool-tip">
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
    if (!formattedPhrase || !validateMnemonic(formattedPhrase)) { return; }

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
      selectedDPath: this.props.dPath
    });
  };
}

function mapStateToProps(state: AppState): StoreProps {
  return {
    // Mnemonic dPath is guaranteed to always be provided
    dPath: configSelectors.getSingleDPath(state, InsecureWalletName.MNEMONIC_PHRASE) as DPath,
    dPaths: configNetworksStaticSelectors.getPaths(state, InsecureWalletName.MNEMONIC_PHRASE)
  };
}

export const MnemonicDecrypt = connect(mapStateToProps)(MnemonicDecryptClass);
