import React from 'react';
import { connect } from 'react-redux';
import { addLabelForAddress, removeLabelForAddress } from 'actions/addressBook';
import { getAddressToLabels } from 'selectors/addressBook';
import { Input } from 'components/ui';
import AddressBookTableRow from './AddressBookTableRow';
import './AddressBookTable.scss';

interface AddressToLabel {
  address: string;
  label: string;
}

interface Props {
  rows: AddressToLabel[];
  addLabelForAddress(addressToLabel: AddressToLabel): void;
  removeLabelForAddress(address: string): void;
}

interface State {
  editingRow: number | null;
  temporaryLabel: string;
  temporaryAddress: string;
}

const ENTER_KEY: number = 13;

class AddressBookTable extends React.Component<Props> {
  public state: State = {
    editingRow: null,
    temporaryLabel: '',
    temporaryAddress: ''
  };

  public render() {
    const { rows } = this.props;
    const { temporaryLabel, temporaryAddress } = this.state;

    return (
      <table className="AddressBookTable table" onKeyDown={this.handleKeyDown}>
        <thead>
          <tr>
            <th scope="col">Address</th>
            <th scope="col">Label</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <Input
                placeholder="New address"
                value={temporaryAddress}
                onChange={this.setTemporaryAddress}
              />
            </td>
            <td>
              <Input
                placeholder="New label"
                value={temporaryLabel}
                onChange={this.setTemporaryLabel}
              />
            </td>
            <td>
              <button
                title="Add an entry"
                className="btn btn-sm btn-default"
                onClick={this.handleAddEntry}
              >
                <i className="fa fa-plus" />
              </button>
            </td>
          </tr>
          {rows.map(this.makeLabelRow)}
        </tbody>
      </table>
    );
  }

  private handleSave = (addressToLabel: AddressToLabel) => {
    const { addLabelForAddress } = this.props;
    const { label, address } = addressToLabel;

    addLabelForAddress({ label, address });

    this.setEditingRow(null);
  };

  private handleAddEntry = () => {
    const { temporaryLabel: label, temporaryAddress: address } = this.state;

    if (label && address) {
      this.handleSave({ label, address });
      this.clearTemporaryFields();
    }
  };

  private handleKeyDown = (e: React.KeyboardEvent<HTMLTableElement>) => {
    if (e.keyCode === ENTER_KEY) {
      this.handleAddEntry();
    }
  };

  private setEditingRow = (editingRow: number | null) => this.setState({ editingRow });

  private removeEntry = (address: string) => {
    const { removeLabelForAddress } = this.props;

    removeLabelForAddress(address);
  };

  private makeLabelRow = (addressToLabel: AddressToLabel, index: number) => {
    const { editingRow } = this.state;
    const isEditingRow = index === editingRow;

    return (
      <AddressBookTableRow
        key={index}
        index={index}
        address={addressToLabel.address}
        label={addressToLabel.label}
        isEditing={isEditingRow}
        onSave={(labelToSave: string) =>
          this.handleSave({
            label: labelToSave,
            address: addressToLabel.address
          })
        }
        onEditClick={() => this.setEditingRow(index)}
        onRemoveClick={() => this.removeEntry(addressToLabel.address)}
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
}

const mapStateToProps = state => ({
  rows: getAddressToLabels(state)
});

const mapDispatchToProps = { addLabelForAddress, removeLabelForAddress };

export default connect(mapStateToProps, mapDispatchToProps)(AddressBookTable);
