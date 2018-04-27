import React from 'react';
import { connect, MapStateToProps } from 'react-redux';
import { AppState } from 'reducers';
import { translateRaw } from 'translations';
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
}

type Props = DispatchProps & StateProps;

interface State {
  editingRow: number | null;
  temporaryLabel: string;
  temporaryAddress: string;
  labelInputError: boolean;
}

export const ERROR_DURATION: number = 4000;

class AddressBookTable extends React.Component<Props, State> {
  public state: State = {
    editingRow: null,
    temporaryLabel: '',
    temporaryAddress: '',
    labelInputError: false
  };

  private addressInput: HTMLInputElement | null = null;

  private labelInput: HTMLInputElement | null = null;

  private goingToClearError: number | null = null;

  public componentWillUnmount() {
    if (this.goingToClearError) {
      window.clearTimeout(this.goingToClearError);
    }
  }

  public render() {
    const { rows } = this.props;
    const { temporaryLabel, temporaryAddress, labelInputError } = this.state;
    const labelInputClassName = labelInputError ? 'invalid' : '';

    return (
      <section className="AddressBookTable" onKeyDown={this.handleKeyDown}>
        <div className="AddressBookTable-row AddressBookTable-row-first">
          <div className="AddressBookTable-identicon">
            <Identicon address={temporaryAddress} />
          </div>
          <Input
            placeholder={translateRaw('NEW_ADDRESS')}
            value={temporaryAddress}
            onChange={this.setTemporaryAddress}
            setInnerRef={this.setAddressInputRef}
          />
          <Input
            className={labelInputClassName}
            placeholder={translateRaw('NEW_LABEL')}
            value={temporaryLabel}
            onChange={this.setTemporaryLabel}
            setInnerRef={this.setLabelInputRef}
          />
          <button
            title={translateRaw('ADD_LABEL')}
            className="btn btn-sm btn-success"
            onClick={this.handleAddEntry}
          >
            <i className="fa fa-plus" />
          </button>
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
    const { labels } = this.props;
    const { temporaryLabel: label, temporaryAddress: address } = this.state;
    const labelAlreadyExists = !!labels[label];

    if (!isValidETHAddress(address)) {
      return this.addressInput && this.addressInput.focus();
    }

    if (!label) {
      return this.labelInput && this.labelInput.focus();
    }

    if (!isValidLabelLength(label)) {
      this.displayInvalidLabelLengthNotification();
      return this.flashLabelInputError();
    }

    if (labelAlreadyExists) {
      this.displayLabelAlreadyExistsNotification();
      return this.flashLabelInputError();
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

  private makeLabelRow = (addressToLabel: AddressLabelPair, index: number) => {
    const { editingRow } = this.state;
    const isEditingRow = index === editingRow;

    return (
      <AddressBookTableRow
        key={index}
        index={index}
        address={addressToLabel.address}
        label={addressToLabel.label}
        labels={this.props.labels}
        isEditing={isEditingRow}
        onSave={(labelToSave: string) =>
          this.handleSave({
            label: labelToSave,
            address: addressToLabel.address
          })
        }
        onEditClick={() => this.setEditingRow(index)}
        onRemoveClick={() => this.props.removeLabelForAddress(addressToLabel.address)}
        displayInvalidLabelLengthNotification={this.displayInvalidLabelLengthNotification}
        displayLabelAlreadyExistsNotification={this.displayLabelAlreadyExistsNotification}
      />
    );
  };

  private setTemporaryLabel = (e: React.ChangeEvent<HTMLInputElement>) =>
    this.setState({ temporaryLabel: e.target.value });

  private setTemporaryAddress = (e: React.ChangeEvent<HTMLInputElement>) =>
    this.setState({ temporaryAddress: e.target.value });

  private clearTemporaryFields = () =>
    this.setState({
      temporaryLabel: '',
      temporaryAddress: ''
    });

  private setAddressInputRef = (node: HTMLInputElement) => (this.addressInput = node);

  private setLabelInputRef = (node: HTMLInputElement) => (this.labelInput = node);

  private displayInvalidLabelLengthNotification = () =>
    this.props.showNotification('danger', translateRaw('INVALID_LABEL_LENGTH'), ERROR_DURATION);

  private displayLabelAlreadyExistsNotification = () =>
    this.props.showNotification('danger', translateRaw('LABEL_ALREADY_EXISTS'), ERROR_DURATION);

  private flashLabelInputError = () => {
    this.setState(
      {
        labelInputError: true
      },
      () =>
        (this.goingToClearError = window.setTimeout(
          () =>
            this.setState({
              labelInputError: false
            }),
          ERROR_DURATION
        ))
    );

    if (this.labelInput) {
      this.labelInput.focus();
    }
  };
}

const mapStateToProps: MapStateToProps<StateProps, {}, AppState> = state => ({
  rows: getAddressLabelPairs(state),
  labels: getLabels(state, { reversed: true })
});

const mapDispatchToProps: DispatchProps = {
  addLabelForAddress,
  removeLabelForAddress,
  showNotification
};

export default connect(mapStateToProps, mapDispatchToProps)(AddressBookTable);
