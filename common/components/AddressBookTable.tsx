import React from 'react';
import { connect, MapStateToProps } from 'react-redux';
import { AppState } from 'reducers';
import translate, { translateRaw } from 'translations';
import { isValidETHAddress, isValidLabelLength } from 'libs/validators';
import {
  TAddLabelForAddress,
  TRemoveLabelForAddress,
  addLabelForAddress,
  removeLabelForAddress,
  AddressLabelPair
} from 'actions/addressBook';
import { showNotification, TShowNotification } from 'actions/notifications';
import { getAddressLabelPairs, getLabels } from 'selectors/addressBook';
import { Input, Identicon } from 'components/ui';
import AddressBookTableRow from './AddressBookTableRow';
import './AddressBookTable.scss';

interface DispatchProps {
  addLabelForAddress: TAddLabelForAddress;
  removeLabelForAddress: TRemoveLabelForAddress;
  showNotification: TShowNotification;
}

interface StateProps {
  rows: ReturnType<typeof getAddressLabelPairs>;
  labels: ReturnType<typeof getLabels>;
  reversedLabels: ReturnType<typeof getLabels>;
}

type Props = DispatchProps & StateProps;

interface State {
  editingRow: number | null;
  temporaryLabel: string;
  temporaryLabelTouched: boolean;
  temporaryAddress: string;
  temporaryAddressTouched: boolean;
  addressInputError: string | null;
  labelInputError: string | null;
}

export const ERROR_DURATION: number = 4000;

class AddressBookTable extends React.Component<Props, State> {
  public state: State = {
    editingRow: null,
    temporaryLabel: '',
    temporaryLabelTouched: false,
    temporaryAddress: '',
    temporaryAddressTouched: false,
    addressInputError: null,
    labelInputError: null
  };

  private addressInput: HTMLInputElement | null = null;

  private labelInput: HTMLInputElement | null = null;

  public render() {
    const { rows } = this.props;
    const {
      temporaryAddress,
      temporaryAddressTouched,
      addressInputError,
      temporaryLabel,
      temporaryLabelTouched,
      labelInputError
    } = this.state;
    const addressTouchedWithError = temporaryAddressTouched && addressInputError;
    const addressInputClassName = addressTouchedWithError ? 'invalid' : '';

    const labelTouchedWithError = temporaryLabelTouched && labelInputError;
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
            <label className="AddressBookTable-row-input-wrapper-error">{addressInputError}</label>
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
            <label className="AddressBookTable-row-input-wrapper-error">{labelInputError}</label>
          </div>
        </div>
        <div className="AddressBookTable-row AddressBookTable-row-error">
          <label className={nonMobileTemporaryAddressErrorClassName}>{addressInputError}</label>
          <label className={nonMobileTemporaryLabelErrorClassName}>{labelInputError}</label>
        </div>
        {rows.map(this.makeLabelRow)}
      </section>
    );
  }

  private handleSave = (addressToLabel: AddressLabelPair) => {
    this.props.addLabelForAddress(addressToLabel);
    this.setEditingRow(null);
  };

  private handleAddEntry = () => {
    const { labels, reversedLabels } = this.props;
    const { temporaryLabel: label, temporaryAddress: address } = this.state;
    const addressAlreadyExists = !!labels[address];
    const labelAlreadyExists = !!reversedLabels[label];

    if (!isValidETHAddress(address)) {
      this.displayInvalidETHAddressNotification();
      return this.focusAndSelectAddressInput();
    }

    if (addressAlreadyExists) {
      this.displayAddressAlreadyExistsNotification();
      return this.focusAndSelectAddressInput();
    }

    if (!label) {
      return this.focusAndSelectLabelInput();
    }

    if (!isValidLabelLength(label)) {
      this.displayInvalidLabelLengthNotification();
      return this.focusAndSelectLabelInput();
    }

    if (labelAlreadyExists) {
      this.displayLabelAlreadyExistsNotification();
      return this.focusAndSelectLabelInput();
    }

    this.handleSave({ label, address });
    this.clearTemporaryFields();
  };

  private handleKeyDown = (e: React.KeyboardEvent<HTMLTableElement>) => {
    if (e.key === 'Enter') {
      this.handleAddEntry();
    }
  };

  private setEditingRow = (editingRow: number | null) => this.setState({ editingRow });

  private clearEditingRow = () => this.setEditingRow(null);

  private makeLabelRow = (addressToLabel: AddressLabelPair, index: number) => {
    const { editingRow } = this.state;
    const isEditingRow = index === editingRow;

    return (
      <AddressBookTableRow
        key={index}
        index={index}
        address={addressToLabel.address}
        label={addressToLabel.label}
        labels={this.props.reversedLabels}
        isEditing={isEditingRow}
        onSave={(labelToSave: string) =>
          this.handleSave({
            label: labelToSave,
            address: addressToLabel.address
          })
        }
        onLabelInputBlur={this.clearEditingRow}
        onEditClick={() => this.setEditingRow(index)}
        onRemoveClick={() => this.props.removeLabelForAddress(addressToLabel.address)}
        displayInvalidLabelLengthNotification={this.displayInvalidLabelLengthNotification}
        displayLabelAlreadyExistsNotification={this.displayLabelAlreadyExistsNotification}
      />
    );
  };

  private setTemporaryAddress = (e: React.ChangeEvent<HTMLInputElement>) => {
    const temporaryAddress = e.target.value;

    this.setState(
      { temporaryAddress, temporaryAddressTouched: true },
      temporaryAddress.length > 0
        ? this.checkTemporaryAddressValidation
        : this.clearTemporaryAddressTouched
    );
  };

  private setTemporaryAddressTouched = () => {
    const { temporaryAddress, temporaryAddressTouched } = this.state;

    if (!temporaryAddressTouched) {
      this.setState({ temporaryAddressTouched: true });
    }

    if (temporaryAddress.length > 0) {
      this.checkTemporaryAddressValidation();
    }
  };

  private clearTemporaryAddressTouched = () =>
    this.setState({ temporaryAddressTouched: false, addressInputError: null });

  private checkTemporaryAddressValidation = () => {
    const { labels } = this.props;
    const { temporaryAddress, addressInputError } = this.state;
    const addressAlreadyExists = !!labels[temporaryAddress];
    const hadErrorPreviously = addressInputError !== null;

    if (addressAlreadyExists) {
      return this.setState({
        addressInputError: translateRaw('ADDRESS_ALREADY_EXISTS')
      });
    }

    if (!isValidETHAddress(temporaryAddress)) {
      return this.setState({
        addressInputError: translateRaw('INVALID_ADDRESS')
      });
    }

    if (hadErrorPreviously) {
      return this.setState({
        addressInputError: null
      });
    }
  };

  private setTemporaryLabel = (e: React.ChangeEvent<HTMLInputElement>) => {
    const temporaryLabel = e.target.value;

    this.setState(
      { temporaryLabel, temporaryLabelTouched: true },
      temporaryLabel.length > 0
        ? this.checkTemporaryLabelValidation
        : this.clearTemporaryLabelTouched
    );
  };

  private setTemporaryLabelTouched = () => {
    const { temporaryLabel, temporaryLabelTouched } = this.state;

    if (!temporaryLabelTouched) {
      this.setState({ temporaryLabelTouched: true });
    }

    if (temporaryLabel.length > 0) {
      this.checkTemporaryLabelValidation();
    }
  };

  private clearTemporaryLabelTouched = () =>
    this.setState({ temporaryLabelTouched: false, labelInputError: null });

  private checkTemporaryLabelValidation = () => {
    const { reversedLabels } = this.props;
    const { temporaryLabel, labelInputError } = this.state;
    const labelAlreadyExists = !!reversedLabels[temporaryLabel];
    const hadErrorPreviously = labelInputError !== null;

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

  private clearTemporaryFields = () =>
    this.setState({
      temporaryLabel: '',
      temporaryLabelTouched: false,
      temporaryAddress: '',
      temporaryAddressTouched: false
    });

  private setAddressInputRef = (node: HTMLInputElement) => (this.addressInput = node);

  private setLabelInputRef = (node: HTMLInputElement) => (this.labelInput = node);

  private displayInvalidETHAddressNotification = () =>
    this.props.showNotification('danger', translateRaw('INVALID_ADDRESS'), ERROR_DURATION);

  private displayAddressAlreadyExistsNotification = () =>
    this.props.showNotification('danger', translateRaw('ADDRESS_ALREADY_EXISTS'), ERROR_DURATION);

  private displayInvalidLabelLengthNotification = () =>
    this.props.showNotification('danger', translateRaw('INVALID_LABEL_LENGTH'), ERROR_DURATION);

  private displayLabelAlreadyExistsNotification = () =>
    this.props.showNotification('danger', translateRaw('LABEL_ALREADY_EXISTS'), ERROR_DURATION);

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
  labels: getLabels(state),
  reversedLabels: getLabels(state, { reversed: true })
});

const mapDispatchToProps: DispatchProps = {
  addLabelForAddress,
  removeLabelForAddress,
  showNotification
};

export default connect(mapStateToProps, mapDispatchToProps)(AddressBookTable);
