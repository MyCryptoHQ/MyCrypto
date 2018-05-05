import React from 'react';
import { connect, MapStateToProps } from 'react-redux';
import { AppState } from 'reducers';
import translate, { translateRaw } from 'translations';
import {
  changeAddressLabelEntry,
  TChangeAddressLabelEntry,
  saveAddressLabelEntry,
  TSaveAddressLabelEntry,
  removeAddressLabel,
  TRemoveAddressLabel
} from 'actions/addressBook';
import { getAddressLabels, getLabelAddresses, getAddressLabelEntries } from 'selectors/addressBook';
import { Input, Identicon } from 'components/ui';
import AddressBookTableRow from './AddressBookTableRow';
import './AddressBookTable.scss';

interface DispatchProps {
  changeAddressLabelEntry: TChangeAddressLabelEntry;
  saveAddressLabelEntry: TSaveAddressLabelEntry;
  removeAddressLabel: TRemoveAddressLabel;
}

interface StateProps {
  entries: ReturnType<typeof getAddressLabelEntries>;
  addressLabels: ReturnType<typeof getAddressLabels>;
  labelAddresses: ReturnType<typeof getLabelAddresses>;
}

type Props = DispatchProps & StateProps;

interface State {
  editingRow: number | null;
  addressTouched: boolean;
  addressBlurred: boolean;
  labelTouched: boolean;
  labelBlurred: boolean;
}

export const ADDRESS_BOOK_TABLE_ID: string = 'ADDRESS_BOOK_TABLE_ID';

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
    const { entries } = this.props;
    const { addressTouched, addressBlurred, labelTouched, labelBlurred } = this.state;

    const newEntry = entries.ADDRESS_BOOK_TABLE_ID || {};
    const { address = '', addressError = '', label = '', labelError = '' } = newEntry;
    const addressTouchedWithError = addressTouched && addressError;
    const labelTouchedWithError = labelTouched && labelError;
    const { ADDRESS_BOOK_TABLE_ID, ...rowEntries } = entries;

    const rows = Object.keys(rowEntries).map(entry => ({
      id: rowEntries[entry].id,
      address: rowEntries[entry].address,
      label: rowEntries[entry].label,
      labelError: rowEntries[entry].labelError
    }));

    // Classnames
    const addressInputClassName = addressTouchedWithError ? 'invalid' : '';
    const labelInputClassName = labelTouchedWithError ? 'invalid' : '';
    const nonMobileTemporaryInputErrorClassName =
      'AddressBookTable-row-error-temporary-input--non-mobile';
    const nonMobileVisibleErrorClassName = `${nonMobileTemporaryInputErrorClassName}--visible`;
    const nonMobileTemporaryAddressErrorClassName = `${nonMobileTemporaryInputErrorClassName} ${nonMobileTemporaryInputErrorClassName}-address ${
      addressTouchedWithError ? nonMobileVisibleErrorClassName : ''
    }`;
    const nonMobileTemporaryLabelErrorClassName = `${nonMobileTemporaryInputErrorClassName} ${nonMobileTemporaryInputErrorClassName}-label ${
      labelTouchedWithError ? nonMobileVisibleErrorClassName : ''
    }`;

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
                className={addressInputClassName}
                placeholder={translateRaw('NEW_ADDRESS')}
                value={address}
                onChange={this.handleAddressChange}
                onFocus={this.setAddressTouched}
                onBlur={this.setAddressBlurred}
                setInnerRef={this.setAddressInputRef}
              />
            </div>
            <div className="AddressBookTable-row-identicon AddressBookTable-row-identicon-non-mobile">
              <Identicon address={address} />
            </div>
            <div className="AddressBookTable-row-identicon AddressBookTable-row-identicon-mobile">
              <Identicon address={address} size="3rem" />
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
                className={labelInputClassName}
                placeholder={translateRaw('NEW_LABEL')}
                value={label}
                onChange={this.handleLabelChange}
                onFocus={this.setLabelTouched}
                onBlur={this.setLabelBlurred}
                setInnerRef={this.setLabelInputRef}
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
    this.props.saveAddressLabelEntry(ADDRESS_BOOK_TABLE_ID);
    this.clearFieldStatuses();
    this.setEditingRow(null);
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
    const { id, address, label, labelError } = row;
    const isEditing = index === editingRow;
    const onChange = (newLabel: string) =>
      this.props.changeAddressLabelEntry({
        id,
        address,
        label: newLabel
      });
    const onSave = () => {
      this.props.saveAddressLabelEntry(id);
      this.setEditingRow(null);
    };

    return (
      <AddressBookTableRow
        key={address}
        index={index}
        address={address}
        label={label}
        labelError={labelError}
        isEditing={isEditing}
        onChange={onChange}
        onSave={onSave}
        onLabelInputBlur={this.clearEditingRow}
        onEditClick={() => this.setEditingRow(index)}
        onRemoveClick={() => this.props.removeAddressLabel(address)}
      />
    );
  };

  private setAddressInputRef = (node: HTMLInputElement) => (this.addressInput = node);

  private setAddressTouched = () =>
    !this.state.addressTouched && this.setState({ addressTouched: true });

  private clearAddressTouched = () => this.setState({ addressTouched: false });

  private setAddressBlurred = () => this.setState({ addressBlurred: true });

  private handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { entries } = this.props;
    const label = (entries[ADDRESS_BOOK_TABLE_ID] || {}).label || '';
    const address = e.target.value;

    this.props.changeAddressLabelEntry({
      id: ADDRESS_BOOK_TABLE_ID,
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
    const { entries } = this.props;
    const address = (entries[ADDRESS_BOOK_TABLE_ID] || {}).address || '';
    const label = e.target.value;

    this.props.changeAddressLabelEntry({
      id: ADDRESS_BOOK_TABLE_ID,
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
  entries: getAddressLabelEntries(state),
  addressLabels: getAddressLabels(state),
  labelAddresses: getLabelAddresses(state)
});

const mapDispatchToProps: DispatchProps = {
  changeAddressLabelEntry,
  saveAddressLabelEntry,
  removeAddressLabel
};

export default connect(mapStateToProps, mapDispatchToProps)(AddressBookTable);
