import React from 'react';
import { connect, MapStateToProps } from 'react-redux';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import translate, { translateRaw } from 'translations';
import { AppState } from 'reducers';
import {
  addLabelForAddress,
  TAddLabelForAddress,
  removeLabelForAddress,
  TRemoveLabelForAddress
} from 'actions/addressBook';
import { showNotification, TShowNotification } from 'actions/notifications';
import { Address, Identicon, Input } from 'components/ui';
import { getLabels } from 'selectors/addressBook';
import { isValidLabelLength } from 'libs/validators';
import { ERROR_DURATION } from 'components/AddressBookTable';

interface StateProps {
  labels: ReturnType<typeof getLabels>;
  reversedLabels: ReturnType<typeof getLabels>;
}

interface DispatchProps {
  addLabelForAddress: TAddLabelForAddress;
  removeLabelForAddress: TRemoveLabelForAddress;
  showNotification: TShowNotification;
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
  labelInputError: string | null;
}

class AccountAddress extends React.Component<Props, State> {
  public state = {
    copied: false,
    editingLabel: false,
    temporaryLabel: this.props.labels[this.props.address] || '',
    mostRecentValidLabel: this.props.labels[this.props.address] || '',
    labelInputTouched: false,
    labelInputError: null
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
    const temporaryLabel = nextProps.labels[nextProps.address] || '';

    this.setState({ temporaryLabel, mostRecentValidLabel: temporaryLabel });
  }

  public componentWillUnmount() {
    if (this.goingToClearCopied) {
      window.clearTimeout(this.goingToClearCopied);
    }
  }

  public render() {
    const { address, labels } = this.props;
    const { copied } = this.state;
    const label = labels[address];
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
    const { address, labels } = this.props;
    const currentLabel = labels[address];

    this.stopEditingLabel();

    if (label === currentLabel) {
      return;
    }

    if (this.isValidLabel(label)) {
      label.length > 0
        ? this.props.addLabelForAddress({
            address,
            label
          })
        : this.props.removeLabelForAddress(address);
    }
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
    const { address, labels } = this.props;
    const { editingLabel, temporaryLabel, labelInputTouched, labelInputError } = this.state;
    const label = labels[address];
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
    const { address, labels } = this.props;
    const { editingLabel } = this.state;
    const label = labels[address];
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

  private setTemporaryLabel = (e: React.ChangeEvent<HTMLInputElement>) =>
    this.setState({ temporaryLabel: e.target.value }, this.checkTemporaryLabelValidation);

  private setTemporaryLabelTouched = () => {
    const { temporaryLabel, labelInputTouched } = this.state;

    if (!labelInputTouched) {
      this.setState({ labelInputTouched: true });
    }

    if (temporaryLabel.length > 0) {
      this.checkTemporaryLabelValidation();
    }
  };

  private clearTemporaryLabelTouched = () =>
    this.setState({ labelInputTouched: false, labelInputError: null });

  private checkTemporaryLabelValidation = () => {
    const { reversedLabels } = this.props;
    const { temporaryLabel, mostRecentValidLabel, labelInputError } = this.state;
    const labelAlreadyExists = !!reversedLabels[temporaryLabel];
    const hadErrorPreviously = labelInputError !== null;

    if (temporaryLabel === mostRecentValidLabel) {
      return;
    }

    if (temporaryLabel.length === 0) {
      return this.setState({
        labelInputError: null
      });
    }

    if (labelAlreadyExists) {
      return this.setState({
        labelInputError: translateRaw('LABEL_ALREADY_EXISTS')
      });
    }

    if (!isValidLabelLength(temporaryLabel)) {
      return this.setState({
        labelInputError: translateRaw('INVALID_LABEL_LENGTH')
      });
    }

    if (hadErrorPreviously) {
      return this.setState({
        labelInputError: null
      });
    }
  };

  private isValidLabel = (label: string) => {
    const { reversedLabels } = this.props;
    const isValidLength = isValidLabelLength(label, {
      allowEmpty: true
    });
    const isUnique = !reversedLabels[label];

    if (!isValidLength) {
      this.displayInvalidLabelLengthNotification();

      return false;
    }

    if (!isUnique) {
      this.displayLabelAlreadyExistsNotification();

      return false;
    }

    return true;
  };

  private displayInvalidLabelLengthNotification = () =>
    this.props.showNotification('danger', translateRaw('INVALID_LABEL_LENGTH'), ERROR_DURATION);

  private displayLabelAlreadyExistsNotification = () =>
    this.props.showNotification('danger', translateRaw('LABEL_ALREADY_EXISTS'), ERROR_DURATION);
}

const mapStateToProps: MapStateToProps<StateProps, {}, AppState> = state => ({
  labels: getLabels(state),
  reversedLabels: getLabels(state, { reversed: true })
});

const mapDispatchToProps: DispatchProps = {
  addLabelForAddress,
  removeLabelForAddress,
  showNotification
};

export default connect<StateProps, DispatchProps, OwnProps, AppState>(
  mapStateToProps,
  mapDispatchToProps
)(AccountAddress);
