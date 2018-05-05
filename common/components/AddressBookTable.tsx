import React from 'react';
import { connect, MapStateToProps } from 'react-redux';
import { AppState } from 'reducers';
import translate, { translateRaw } from 'translations';
import {
  addAddressLabelRequested,
  TAddAddressLabelRequested,
  removeAddressLabel,
  TRemoveAddressLabel
} from 'actions/addressBook';
import {
  getAddressLabels,
  getAddressErrors,
  getLabelErrors,
  getAddressLabelPairs
} from 'selectors/addressBook';
import { Input, Identicon } from 'components/ui';
import AddressBookTableRow from './AddressBookTableRow';
import './AddressBookTable.scss';

interface DispatchProps {
  addAddressLabelRequested: TAddAddressLabelRequested;
  removeAddressLabel: TRemoveAddressLabel;
}

interface StateProps {
  rows: ReturnType<typeof getAddressLabelPairs>;
  addressLabels: ReturnType<typeof getAddressLabels>;
  addressErrors: ReturnType<typeof getAddressErrors>;
  labelErrors: ReturnType<typeof getLabelErrors>;
}

type Props = DispatchProps & StateProps;

interface State {
  editingRow: number | null;
  temporaryAddress: string;
  temporaryAddressTouched: boolean;
  temporaryAddressBlurred: boolean;
  temporaryLabel: string;
  temporaryLabelTouched: boolean;
  temporaryLabelBlurred: boolean;
}

export const ADDRESS_BOOK_TABLE_INDEX: number = -5;

class AddressBookTable extends React.Component<Props, State> {
  public state: State = {
    editingRow: null,
    temporaryAddress: '',
    temporaryAddressTouched: false,
    temporaryAddressBlurred: false,
    temporaryLabel: '',
    temporaryLabelTouched: false,
    temporaryLabelBlurred: false
  };

  private addressInput: HTMLInputElement | null = null;

  private labelInput: HTMLInputElement | null = null;

  public render() {
    const { rows, addressErrors, labelErrors } = this.props;
    const {
      temporaryAddress,
      temporaryAddressTouched,
      temporaryAddressBlurred,
      temporaryLabel,
      temporaryLabelTouched,
      temporaryLabelBlurred
    } = this.state;

    const addressInputError = addressErrors[ADDRESS_BOOK_TABLE_INDEX];
    const labelInputError = labelErrors[ADDRESS_BOOK_TABLE_INDEX];
    const addressTouchedWithError = temporaryAddressTouched && addressInputError;
    const labelTouchedWithError = temporaryLabelTouched && labelInputError;

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
                value={temporaryAddress}
                onChange={this.setTemporaryAddress}
                onFocus={this.setTemporaryAddressTouched}
                onBlur={this.setTemporaryAddressBlurred}
                setInnerRef={this.setAddressInputRef}
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
              {temporaryAddressBlurred && addressInputError}
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
                value={temporaryLabel}
                onChange={this.setTemporaryLabel}
                onFocus={this.setTemporaryLabelTouched}
                onBlur={this.setTemporaryLabelBlurred}
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
              {temporaryLabelBlurred && labelInputError}
            </label>
          </div>
        </div>
        <div className="AddressBookTable-row AddressBookTable-row-error">
          <label className={nonMobileTemporaryAddressErrorClassName}>
            {temporaryAddressBlurred && addressInputError}
          </label>
          <label className={nonMobileTemporaryLabelErrorClassName}>
            {temporaryLabelBlurred && labelInputError}
          </label>
        </div>
        {rows.map(this.makeLabelRow)}
      </section>
    );
  }

  private handleAddEntry = () => {
    const { addAddressLabelRequested } = this.props;
    const { temporaryLabel: label, temporaryAddress: address } = this.state;

    addAddressLabelRequested({
      index: ADDRESS_BOOK_TABLE_INDEX,
      address,
      label
    });

    this.clearTemporaryFields();
    this.setEditingRow(null);
  };

  private handleKeyDown = (e: React.KeyboardEvent<HTMLTableElement>) => {
    if (e.key === 'Enter') {
      this.handleAddEntry();
    }
  };

  private setEditingRow = (editingRow: number | null) => this.setState({ editingRow });

  private clearEditingRow = () => this.setEditingRow(null);

  private makeLabelRow = (addressToLabel: AddressLabelPair, index: number) => {
    // const { addLabelForAddress, removeLabelForAddress } = this.props;
    // const { editingRow } = this.state;
    // const isEditingRow = index === editingRow;
    // const onSave = (label: string) => {
    //   addLabelForAddress({ label, address: addressToLabel.address });
    //   this.setEditingRow(null);
    // };

    return null;
    // <AddressBookTableRow
    //   key={index}
    //   index={index}
    //   address={addressToLabel.address}
    //   label={addressToLabel.label}
    //   isEditing={isEditingRow}
    //   onSave={onSave}
    //   onLabelInputBlur={this.clearEditingRow}
    //   onEditClick={() => this.setEditingRow(index)}
    //   onRemoveClick={() => removeLabelForAddress(addressToLabel.address)}
    // />
  };

  private setTemporaryAddress = (e: React.ChangeEvent<HTMLInputElement>) => {
    const temporaryAddress = e.target.value;

    this.setState(
      { temporaryAddress, temporaryAddressTouched: true },
      () => temporaryAddress.length === 0 && this.clearTemporaryAddressTouched
    );
  };

  private setTemporaryAddressTouched = () => {
    const { temporaryAddressTouched } = this.state;

    if (!temporaryAddressTouched) {
      this.setState({ temporaryAddressTouched: true });
    }
  };

  private clearTemporaryAddressTouched = () => this.setState({ temporaryAddressTouched: false });

  private setTemporaryAddressBlurred = () => this.setState({ temporaryAddressBlurred: true });

  private setTemporaryLabel = (e: React.ChangeEvent<HTMLInputElement>) => {
    const temporaryLabel = e.target.value;

    this.setState(
      { temporaryLabel, temporaryLabelTouched: true },
      () => temporaryLabel.length === 0 && this.clearTemporaryLabelTouched()
    );
  };

  private setTemporaryLabelTouched = () => {
    const { temporaryLabelTouched } = this.state;

    if (!temporaryLabelTouched) {
      this.setState({ temporaryLabelTouched: true });
    }
  };

  private clearTemporaryLabelTouched = () => this.setState({ temporaryLabelTouched: false });

  private setTemporaryLabelBlurred = () => this.setState({ temporaryLabelBlurred: true });

  private clearTemporaryFields = () =>
    this.setState({
      temporaryAddress: '',
      temporaryAddressTouched: false,
      temporaryAddressBlurred: false,
      temporaryLabel: '',
      temporaryLabelTouched: false,
      temporaryLabelBlurred: false
    });

  private setAddressInputRef = (node: HTMLInputElement) => (this.addressInput = node);

  private setLabelInputRef = (node: HTMLInputElement) => (this.labelInput = node);

  private focusAndSelectAddressInput = () => {
    if (this.addressInput) {
      this.addressInput.focus();
      this.addressInput.select();
    }
  };

  private focusAndSelectLabelInput = () => {
    if (this.labelInput) {
      this.labelInput.focus();
      this.labelInput.select();
    }
  };
}

const mapStateToProps: MapStateToProps<StateProps, {}, AppState> = state => ({
  rows: getAddressLabelPairs(state),
  addressLabels: getAddressLabels(state),
  addressErrors: getAddressErrors(state),
  labelErrors: getLabelErrors(state)
});

const mapDispatchToProps: DispatchProps = {
  addAddressLabelRequested,
  removeAddressLabel
};

export default connect(mapStateToProps, mapDispatchToProps)(AddressBookTable);
