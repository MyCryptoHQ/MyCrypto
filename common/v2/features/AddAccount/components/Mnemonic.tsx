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
  seed: string;
  onSeed(seed: string): void;
  onUnlock(param: any): void;
}

interface StateProps {
  dPath: DPath;
  dPaths: DPath[];
}

type Props = OwnProps & StateProps;

interface State {
  phrase: string;
  formattedPhrase: string;
  pass: string;
  dPath: DPath;
}

class MnemonicDecryptClass extends PureComponent<Props, State> {
  public state: State = {
    phrase: '',
    formattedPhrase: '',
    pass: '',
    dPath: this.props.dPath
  };

  public UNSAFE_componentWillReceiveProps(nextProps: Props) {
    if (this.props.dPath !== nextProps.dPath) {
      this.setState({ dPath: nextProps.dPath });
    }
  }

  public render() {
    const { phrase, formattedPhrase, dPath, pass } = this.state;
    const { seed } = this.props;
    const isValidMnemonic = validateMnemonic(formattedPhrase);

    if (seed) {
      return (
        <DeterministicWallets
          seed={seed}
          dPath={dPath}
          dPaths={this.props.dPaths}
          onCancel={this.handleCancel}
          onConfirmAddress={this.handleUnlock}
          onPathChange={this.handlePathChange}
        />
      );
    } else {
      return (
        <div className="Mnemonic">
          <div id="selectedTypeKey">
            <div className="Mnemonic-img">
              <img src={PrivateKeyicon} />
            </div>

            <div className="form-group">
              <label>Your Mnemonic Phrase</label>
              <TogglablePassword
                value={phrase}
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
                <div className="Mnemoinc-toolTip">
                  {' '}
                  <Tooltip tooltip={translate('MNEMONIC_TOOL_TIP')}>
                    {props => <img src={questionToolTip} {...props} />}
                  </Tooltip>
                </div>
              </label>
              <Input
                isValid={true}
                showValidAsPlain={true}
                value={pass}
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

  public onDWModalOpen = () => {
    const { formattedPhrase, pass } = this.state;

    if (!validateMnemonic(formattedPhrase)) {
      return;
    }

    try {
      const seed = mnemonicToSeed(formattedPhrase, pass).toString('hex');
      this.props.onSeed(seed);
    } catch (err) {
      console.log(err);
    }
  };

  private handleCancel = () => {
    this.props.onSeed('');
  };

  private handlePathChange = (dPath: DPath) => {
    this.setState({ dPath });
  };

  private handleUnlock = (address: string, index: number) => {
    const { formattedPhrase, pass, dPath } = this.state;

    this.props.onUnlock({
      path: `${dPath.value}/${index}`,
      pass,
      phrase: formattedPhrase,
      address
    });

    this.setState({
      pass: '',
      phrase: '',
      formattedPhrase: ''
    });

    this.props.onSeed('');
  };
}

function mapStateToProps(state: AppState): StateProps {
  return {
    // Mnemonic dPath is guaranteed to always be provided
    dPath: configSelectors.getSingleDPath(state, InsecureWalletName.MNEMONIC_PHRASE) as DPath,
    dPaths: configNetworksStaticSelectors.getPaths(state, InsecureWalletName.MNEMONIC_PHRASE)
  };
}

export const MnemonicDecrypt = connect(mapStateToProps)(MnemonicDecryptClass);
