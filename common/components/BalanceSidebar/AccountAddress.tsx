import React from 'react';
import { connect, MapStateToProps } from 'react-redux';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import translate, { translateRaw } from 'translations';
import { AppState } from 'reducers';
import {
  changeAddressLabelEntry,
  TChangeAddressLabelEntry,
  saveAddressLabelEntry,
  TSaveAddressLabelEntry,
  removeAddressLabel,
  TRemoveAddressLabel
} from 'actions/addressBook';
import { getAddressLabels, getAddressLabelEntries } from 'selectors/addressBook';
import { Address, Identicon, Input } from 'components/ui';

interface StateProps {
  addressLabels: ReturnType<typeof getAddressLabels>;
  addressLabelEntries: ReturnType<typeof getAddressLabelEntries>;
}

interface DispatchProps {
  changeAddressLabelEntry: TChangeAddressLabelEntry;
  saveAddressLabelEntry: TSaveAddressLabelEntry;
  removeAddressLabel: TRemoveAddressLabel;
}

interface OwnProps {
  address: string;
}

type Props = StateProps & DispatchProps & OwnProps;

interface State {
  copied: boolean;
  editingLabel: boolean;
  temporaryLabel: string;
  mostRecentValidLabel: string;
  labelInputTouched: boolean;
}

export const ACCOUNT_ADDRESS_ID: string = 'ACCOUNT_ADDRESS_ID';

class AccountAddress extends React.Component<Props, State> {
  public state = {
    copied: false,
    editingLabel: false,
    temporaryLabel: this.props.addressLabels[this.props.address] || '',
    mostRecentValidLabel: this.props.addressLabels[this.props.address] || '',
    labelInputTouched: false
  };

  private goingToClearCopied: number | null = null;

  private labelInput: HTMLInputElement | null = null;

  public handleCopy = () =>
    this.setState(
      (prevState: State) => ({
        copied: !prevState.copied
      }),
      this.clearCopied
    );

  public componentWillReceiveProps(nextProps: Props) {
    const temporaryLabel = nextProps.addressLabels[nextProps.address] || '';

    this.setState({ temporaryLabel, mostRecentValidLabel: temporaryLabel });
  }

  public componentWillUnmount() {
    if (this.goingToClearCopied) {
      window.clearTimeout(this.goingToClearCopied);
    }
  }

  public render() {
    const { address, addressLabels } = this.props;
    const { copied } = this.state;
    const label = addressLabels[address];
    const labelContent = this.generateLabelContent();
    const labelButton = this.generateLabelButton();
    const addressClassName = `AccountInfo-address-addr ${
      label ? 'AccountInfo-address-addr--small' : ''
    }`;

    return (
      <div className="AccountInfo">
        <h5 className="AccountInfo-section-header">{translate('SIDEBAR_ACCOUNTADDR')}</h5>
        <div className="AccountInfo-section AccountInfo-address-section">
          <div className="AccountInfo-address-icon">
            <Identicon address={address} size="100%" />
          </div>
          <div className="AccountInfo-address-wrapper">
            {labelContent}
            <div className={addressClassName}>
              <Address address={address} />
            </div>
            <CopyToClipboard onCopy={this.handleCopy} text={address}>
              <div
                className={`AccountInfo-copy ${copied ? 'is-copied' : ''}`}
                title="Copy To clipboard"
              >
                <i className="fa fa-copy" />
                <span>{copied ? 'copied!' : 'copy address'}</span>
              </div>
            </CopyToClipboard>
            <div className="AccountInfo-label" title="Edit label">
              {labelButton}
            </div>
          </div>
        </div>
      </div>
    );
  }

  private clearCopied = () =>
    (this.goingToClearCopied = window.setTimeout(() => this.setState({ copied: false }), 2000));

  private startEditingLabel = () =>
    this.setState({ editingLabel: true }, () => {
      if (this.labelInput) {
        this.labelInput.focus();
        this.labelInput.select();
      }
    });

  private stopEditingLabel = () => this.setState({ editingLabel: false });

  private updateAccountLabel = (label: string) => {
    const { address, addressLabels } = this.props;
    const currentLabel = addressLabels[address];

    this.stopEditingLabel();

    if (label === currentLabel) {
      return;
    }

    // label.length > 0
    //   ? this.props.addAddressLabelRequested({
    //       index: ACCOUNT_ADDRESS_INDEX,
    //       address,
    //       label
    //     })
    //   : this.props.removeAddressLabel(address);
  };

  private setLabelInputRef = (node: HTMLInputElement) => (this.labelInput = node);

  private handleBlur = () => {
    const { temporaryLabel } = this.state;

    this.updateAccountLabel(temporaryLabel);
    this.clearTemporaryLabelTouched();
  };

  private handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case 'Enter':
        return this.handleBlur();
      case 'Escape':
        return this.stopEditingLabel();
    }
  };

  private generateLabelContent = () => {
    const { address, addressLabels } = this.props;
    const { editingLabel, temporaryLabel, labelInputTouched } = this.state;
    const label = addressLabels[address];
    const labelInputError = null;
    const labelInputTouchedWithError = labelInputTouched && labelInputError;
    const inputClassName = labelInputTouchedWithError ? 'invalid' : '';

    let labelContent = null;

    if (editingLabel) {
      labelContent = (
        <React.Fragment>
          <Input
            title={translateRaw('ADD_LABEL')}
            className={inputClassName}
            placeholder={translateRaw('NEW_LABEL')}
            value={temporaryLabel}
            onChange={this.setTemporaryLabel}
            onKeyDown={this.handleKeyDown}
            onFocus={this.setTemporaryLabelTouched}
            onBlur={this.handleBlur}
            showInvalidBeforeBlur={true}
            setInnerRef={this.setLabelInputRef}
          />
          {labelInputTouchedWithError && (
            <label className="AccountInfo-address-wrapper-error">{labelInputError}</label>
          )}
        </React.Fragment>
      );
    } else if (label && !editingLabel) {
      labelContent = (
        <label title={label} className="AccountInfo-address-label">
          {label}
        </label>
      );
    }

    return labelContent;
  };

  private generateLabelButton = () => {
    const { address, addressLabels } = this.props;
    const { editingLabel } = this.state;
    const label = addressLabels[address];
    const labelButton = editingLabel ? (
      <React.Fragment>
        <i className="fa fa-save" />
        <span role="button" title={translateRaw('SAVE_LABEL')} onClick={this.stopEditingLabel}>
          {translate('SAVE_LABEL')}
        </span>
      </React.Fragment>
    ) : (
      <React.Fragment>
        <i className="fa fa-pencil" />
        <span
          role="button"
          title={label ? translateRaw('EDIT_LABEL') : translateRaw('ADD_LABEL_9')}
          onClick={this.startEditingLabel}
        >
          {label ? translate('EDIT_LABEL') : translate('ADD_LABEL_9')}
        </span>
      </React.Fragment>
    );

    return labelButton;
  };

  private setTemporaryLabel = (e: React.ChangeEvent<HTMLInputElement>) => {
    const temporaryLabel = e.target.value;

    this.setState(
      {
        temporaryLabel,
        labelInputTouched: true
      },
      () => temporaryLabel.length === 0 && this.clearTemporaryLabelTouched()
    );
  };

  private setTemporaryLabelTouched = () => {
    const { labelInputTouched } = this.state;

    if (!labelInputTouched) {
      this.setState({ labelInputTouched: true });
    }
  };

  private clearTemporaryLabelTouched = () => this.setState({ labelInputTouched: false });
}

const mapStateToProps: MapStateToProps<StateProps, {}, AppState> = (state: AppState) => ({
  addressLabels: getAddressLabels(state)
});

const mapDispatchToProps: DispatchProps = {
  removeAddressLabel
};

export default connect<StateProps, DispatchProps, OwnProps, AppState>(
  mapStateToProps,
  mapDispatchToProps
)(AccountAddress);
