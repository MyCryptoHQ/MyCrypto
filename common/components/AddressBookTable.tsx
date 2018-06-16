import React from 'react';
import { connect, MapStateToProps } from 'react-redux';
import classnames from 'classnames';

import translate, { translateRaw } from 'translations';
import { AppState } from 'features/reducers';
import { getChecksumAddressFn } from 'features/config';
import {
  addressBookConstants,
  addressBookActions,
  addressBookSelectors
} from 'features/addressBook';
import { Input, Identicon } from 'components/ui';
import AddressBookTableRow from './AddressBookTableRow';
import './AddressBookTable.scss';

interface DispatchProps {
  changeAddressLabelEntry: addressBookActions.TChangeAddressLabelEntry;
  saveAddressLabelEntry: addressBookActions.TSaveAddressLabelEntry;
  removeAddressLabelEntry: addressBookActions.TRemoveAddressLabelEntry;
}

interface StateProps {
  rows: ReturnType<typeof addressBookSelectors.getAddressLabelRows>;
  entry: ReturnType<typeof addressBookSelectors.getAddressBookTableEntry>;
  addressLabels: ReturnType<typeof addressBookSelectors.getAddressLabels>;
  labelAddresses: ReturnType<typeof addressBookSelectors.getLabelAddresses>;
  toChecksumAddress: ReturnType<typeof getChecksumAddressFn>;
}

type Props = DispatchProps & StateProps;

interface State {
  editingRow: number | null;
  addressTouched: boolean;
  addressBlurred: boolean;
  labelTouched: boolean;
  labelBlurred: boolean;
}

class AddressBookTable extends React.Component<Props, State> {
  public state: State = {
    editingRow: null,
    addressTouched: false,
    addressBlurred: false,
    labelTouched: false,
    labelBlurred: false
  };

  private addressInput: HTMLInputElement | null = null;

  private labelInput: HTMLInputElement | null = null;

  public render() {
    const {
      entry: { temporaryAddress = '', addressError = '', temporaryLabel = '', labelError = '' },
      rows
    } = this.props;
    const { addressTouched, addressBlurred, labelTouched, labelBlurred } = this.state;

    // Classnames
    const addressTouchedWithError = addressTouched && addressError;
    const labelTouchedWithError = labelTouched && labelError;
    const nonMobileTemporaryInputErrorClassName =
      'AddressBookTable-row-error-temporary-input--non-mobile';

    const nonMobileTemporaryAddressErrorClassName = classnames({
      [nonMobileTemporaryInputErrorClassName]: true,
      [`${nonMobileTemporaryInputErrorClassName}-address`]: true,
      'is-visible': !!addressTouchedWithError
    });

    const nonMobileTemporaryLabelErrorClassName = classnames({
      [nonMobileTemporaryInputErrorClassName]: true,
      [`${nonMobileTemporaryInputErrorClassName}-label`]: true,
      'is-visible': !!labelTouchedWithError
    });

    return (
      <section className="AddressBookTable" onKeyDown={this.handleKeyDown}>
        <div className="AddressBookTable-row AddressBookTable-row-labels">
          <label className="AddressBookTable-row-label" htmlFor="temporaryAddress">
            {translate('ADDRESS')}
          </label>
          <label className="AddressBookTable-row-label" htmlFor="temporaryLabel">
            {translate('LABEL')}
          </label>
        </div>
        <div className="AddressBookTable-row AddressBookTable-row-inputs">
          <div className="AddressBookTable-row-input">
            <div className="AddressBookTable-row-input-wrapper">
              <label
                className="AddressBookTable-row-input-wrapper-label"
                htmlFor="temporaryAddress"
              >
                {translate('ADDRESS')}
              </label>
              <Input
                name="temporaryAddress"
                placeholder={translateRaw('NEW_ADDRESS')}
                value={temporaryAddress}
                onChange={this.handleAddressChange}
                onFocus={this.setAddressTouched}
                onBlur={this.setAddressBlurred}
                setInnerRef={this.setAddressInputRef}
                isValid={!addressTouchedWithError}
              />
            </div>
            <div className="AddressBookTable-row-identicon AddressBookTable-row-identicon-non-mobile">
              <Identicon address={temporaryAddress} />
            </div>
            <div className="AddressBookTable-row-identicon AddressBookTable-row-identicon-mobile">
              <Identicon address={temporaryAddress} size="3rem" />
            </div>
          </div>
          <div className="AddressBookTable-row AddressBookTable-row-error AddressBookTable-row-error--mobile">
            <label className="AddressBookTable-row-input-wrapper-error">
              {addressBlurred && addressError}
            </label>
          </div>
          <div className="AddressBookTable-row-input">
            <div className="AddressBookTable-row-input-wrapper">
              <label className="AddressBookTable-row-input-wrapper-label" htmlFor="temporaryLabel">
                {translate('LABEL')}
              </label>
              <Input
                name="temporaryLabel"
                placeholder={translateRaw('NEW_LABEL')}
                value={temporaryLabel}
                onChange={this.handleLabelChange}
                onFocus={this.setLabelTouched}
                onBlur={this.setLabelBlurred}
                setInnerRef={this.setLabelInputRef}
                isValid={!labelTouchedWithError}
              />
            </div>
            <button
              title={translateRaw('ADD_LABEL')}
              className="btn btn-sm btn-success"
              onClick={this.handleAddEntry}
            >
              <i className="fa fa-plus" />
            </button>
          </div>
          <div className="AddressBookTable-row AddressBookTable-row-error AddressBookTable-row-error--mobile">
            <label className="AddressBookTable-row-input-wrapper-error">
              {labelBlurred && labelError}
            </label>
          </div>
        </div>
        <div className="AddressBookTable-row AddressBookTable-row-error">
          <label className={nonMobileTemporaryAddressErrorClassName}>
            {addressBlurred && addressError}
          </label>
          <label className={nonMobileTemporaryLabelErrorClassName}>
            {labelBlurred && labelError}
          </label>
        </div>
        {rows.map(this.makeLabelRow)}
      </section>
    );
  }

  private handleAddEntry = () => {
    const { entry: { temporaryAddress, addressError, labelError } } = this.props;

    if (!temporaryAddress || addressError || temporaryAddress.length === 0) {
      return this.addressInput && this.addressInput.focus();
    }

    if (labelError && this.labelInput) {
      this.labelInput.focus();
    }

    this.props.saveAddressLabelEntry(addressBookConstants.ADDRESS_BOOK_TABLE_ID);

    if (!addressError && !labelError) {
      this.clearFieldStatuses();
      this.setEditingRow(null);
    }
  };

  private handleKeyDown = (e: React.KeyboardEvent<HTMLTableElement>) => {
    if (e.key === 'Enter') {
      this.handleAddEntry();
    }
  };

  private setEditingRow = (editingRow: number | null) => this.setState({ editingRow });

  private clearEditingRow = () => this.setEditingRow(null);

  private makeLabelRow = (row: any, index: number) => {
    const { editingRow } = this.state;
    const { id, label, temporaryLabel, labelError } = row;
    const address = this.props.toChecksumAddress(row.address);
    const isEditing = index === editingRow;
    const onChange = (newLabel: string) =>
      this.props.changeAddressLabelEntry({
        id,
        address,
        label: newLabel,
        isEditing: true
      });
    const onSave = () => {
      this.props.saveAddressLabelEntry(id);
      this.setEditingRow(null);
    };
    const onLabelInputBlur = () => {
      // If the new changes aren't valid, undo them.
      if (labelError) {
        this.props.changeAddressLabelEntry({
          id,
          address,
          temporaryAddress: address,
          label,
          temporaryLabel: label,
          overrideValidation: true
        });
      }

      this.clearEditingRow();
    };

    return (
      <AddressBookTableRow
        key={address}
        index={index}
        address={address}
        label={label}
        temporaryLabel={temporaryLabel}
        labelError={labelError}
        isEditing={isEditing}
        onChange={onChange}
        onSave={onSave}
        onLabelInputBlur={onLabelInputBlur}
        onEditClick={() => this.setEditingRow(index)}
        onRemoveClick={() => this.props.removeAddressLabelEntry(id)}
      />
    );
  };

  private setAddressInputRef = (node: HTMLInputElement) => (this.addressInput = node);

  private setAddressTouched = () =>
    !this.state.addressTouched && this.setState({ addressTouched: true });

  private clearAddressTouched = () => this.setState({ addressTouched: false });

  private setAddressBlurred = () => this.setState({ addressBlurred: true });

  private handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { entry } = this.props;
    const address = e.target.value;
    const label = entry.temporaryLabel || '';

    this.props.changeAddressLabelEntry({
      id: addressBookConstants.ADDRESS_BOOK_TABLE_ID,
      address,
      label
    });

    this.setState(
      { addressTouched: true },
      () => address.length === 0 && this.clearAddressTouched()
    );
  };

  private setLabelInputRef = (node: HTMLInputElement) => (this.labelInput = node);

  private setLabelTouched = () => !this.state.labelTouched && this.setState({ labelTouched: true });

  private clearLabelTouched = () => this.setState({ labelTouched: false });

  private setLabelBlurred = () => this.setState({ labelBlurred: true });

  private handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { entry } = this.props;
    const address = entry.temporaryAddress || '';
    const label = e.target.value;

    this.props.changeAddressLabelEntry({
      id: addressBookConstants.ADDRESS_BOOK_TABLE_ID,
      address,
      label
    });

    this.setState({ labelTouched: true }, () => label.length === 0 && this.clearLabelTouched());
  };

  private clearFieldStatuses = () =>
    this.setState({
      addressTouched: false,
      addressBlurred: false,
      labelTouched: false,
      labelBlurred: false
    });
}

const mapStateToProps: MapStateToProps<StateProps, {}, AppState> = state => ({
  rows: addressBookSelectors.getAddressLabelRows(state),
  entry: addressBookSelectors.getAddressBookTableEntry(state),
  addressLabels: addressBookSelectors.getAddressLabels(state),
  labelAddresses: addressBookSelectors.getLabelAddresses(state),
  toChecksumAddress: getChecksumAddressFn(state)
});

const mapDispatchToProps: DispatchProps = {
  changeAddressLabelEntry: addressBookActions.changeAddressLabelEntry,
  saveAddressLabelEntry: addressBookActions.saveAddressLabelEntry,
  removeAddressLabelEntry: addressBookActions.removeAddressLabelEntry
};

export default connect(mapStateToProps, mapDispatchToProps)(AddressBookTable);
