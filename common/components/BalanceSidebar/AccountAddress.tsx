import React from 'react';
import { connect, MapStateToProps } from 'react-redux';
import translate, { translateRaw } from 'translations';
import { AppState } from 'features/reducers';
import {
  addressBookConstants,
  addressBookActions,
  addressBookSelectors
} from 'features/addressBook';
import { Address, Identicon, Input } from 'components/ui';

interface StateProps {
  entry: ReturnType<typeof addressBookSelectors.getAccountAddressEntry>;
  addressLabel: string;
}

interface DispatchProps {
  changeAddressLabelEntry: addressBookActions.TChangeAddressLabelEntry;
  saveAddressLabelEntry: addressBookActions.TSaveAddressLabelEntry;
  removeAddressLabelEntry: addressBookActions.TRemoveAddressLabelEntry;
}

interface OwnProps {
  address: string;
  networkId?: string;
}

type Props = StateProps & DispatchProps & OwnProps;

interface State {
  editingLabel: boolean;
  labelInputTouched: boolean;
}

class AccountAddress extends React.Component<Props, State> {
  public state = {
    editingLabel: false,
    labelInputTouched: false
  };

  private goingToClearCopied: number | null = null;

  private labelInput: HTMLInputElement | null = null;

  public componentWillUnmount() {
    if (this.goingToClearCopied) {
      window.clearTimeout(this.goingToClearCopied);
    }
  }

  public render() {
    const { address, addressLabel, networkId } = this.props;
    const labelContent = this.generateLabelContent();

    return (
      <div className="AccountInfo-section address">
        {labelContent}
        <div className="AccountInfo-section AccountInfo-address-section">
          {networkId !== 'XMR' && (
            <div className="AccountInfo-address-icon">
              <Identicon address={address} size="100%" />
            </div>
          )}
          <div
            className={`AccountInfo-address-wrapper ${networkId === 'XMR' ? 'no-identicon' : ''}`}
          >
            <div
              className={`AccountInfo-address-addr ${
                addressLabel ? 'AccountInfo-address-addr--small' : ''
              }`}
            >
              <Address address={address} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  private startEditingLabel = () =>
    this.setState({ editingLabel: true }, () => {
      if (this.labelInput) {
        this.labelInput.focus();
        this.labelInput.select();
      }
    });

  private stopEditingLabel = () => this.setState({ editingLabel: false });

  private setLabelInputRef = (node: HTMLInputElement) => (this.labelInput = node);

  private generateLabelContent = () => {
    const { addressLabel, entry: { temporaryLabel, labelError } } = this.props;
    const { editingLabel, labelInputTouched } = this.state;
    const newLabelSameAsPrevious = temporaryLabel === addressLabel;
    const labelInputTouchedWithError = labelInputTouched && !newLabelSameAsPrevious && labelError;

    let labelContent = null;

    if (editingLabel) {
      labelContent = (
        <React.Fragment>
          <Input
            title={translateRaw('ADD_LABEL')}
            placeholder={translateRaw('NEW_LABEL')}
            defaultValue={addressLabel}
            onChange={this.handleLabelChange}
            onKeyDown={this.handleKeyDown}
            onFocus={this.setTemporaryLabelTouched}
            onBlur={this.handleBlur}
            showInvalidBeforeBlur={true}
            setInnerRef={this.setLabelInputRef}
            isValid={!labelInputTouchedWithError}
          />
          {labelInputTouchedWithError && (
            <label className="AccountInfo-address-wrapper-error">{labelError}</label>
          )}
        </React.Fragment>
      );
    } else {
      labelContent = (
        <div className="AccountInfo-section-header-wrapper">
          <h5 className="AccountInfo-section-header">
            {!!addressLabel && addressLabel.length > 0
              ? addressLabel
              : translate('SIDEBAR_ACCOUNTADDR')}
          </h5>
          <button onClick={this.startEditingLabel}>
            <i className="fa fa-pencil" />
          </button>
        </div>
      );
    }

    return labelContent;
  };

  private handleBlur = () => {
    const { address, addressLabel, entry: { id, label, temporaryLabel, labelError } } = this.props;

    this.clearTemporaryLabelTouched();
    this.stopEditingLabel();

    if (temporaryLabel === addressLabel) {
      return;
    }

    if (temporaryLabel && temporaryLabel.length > 0) {
      this.props.saveAddressLabelEntry(id);

      if (labelError) {
        // If the new changes aren't valid, undo them.
        this.props.changeAddressLabelEntry({
          id,
          address,
          temporaryAddress: address,
          label,
          temporaryLabel: label,
          overrideValidation: true
        });
      }
    } else {
      this.props.removeAddressLabelEntry(id);
    }
  };

  private handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case 'Enter':
        return this.handleBlur();
      case 'Escape':
        return this.stopEditingLabel();
    }
  };

  private handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { address } = this.props;
    const label = e.target.value;

    this.props.changeAddressLabelEntry({
      id: addressBookConstants.ACCOUNT_ADDRESS_ID,
      address,
      label,
      isEditing: true
    });

    this.setState(
      {
        labelInputTouched: true
      },
      () => label.length === 0 && this.clearTemporaryLabelTouched()
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

const mapStateToProps: MapStateToProps<StateProps, {}, AppState> = (
  state: AppState,
  ownProps: OwnProps
) => {
  const labelEntry = addressBookSelectors.getAddressLabelEntryFromAddress(state, ownProps.address);
  return {
    entry: addressBookSelectors.getAccountAddressEntry(state),
    addressLabel: labelEntry ? labelEntry.label : ''
  };
};

const mapDispatchToProps: DispatchProps = {
  changeAddressLabelEntry: addressBookActions.changeAddressLabelEntry,
  saveAddressLabelEntry: addressBookActions.saveAddressLabelEntry,
  removeAddressLabelEntry: addressBookActions.removeAddressLabelEntry
};

export default connect<StateProps, DispatchProps, OwnProps, AppState>(
  mapStateToProps,
  mapDispatchToProps
)(AccountAddress);
