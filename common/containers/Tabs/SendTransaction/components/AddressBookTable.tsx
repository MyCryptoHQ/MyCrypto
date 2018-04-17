import React from 'react';
import { connect } from 'react-redux';
import { addLabelForAddress, removeLabelForAddress } from 'actions/addressBook';
import { getAddressToLabels } from 'selectors/addressBook';
// import { Input } from 'components/ui';
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
      <table className="AddressBookTable table">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Label</th>
            <th scope="col">Address</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td />
            <td>
              <input
                className="input-group-input"
                placeholder="New label"
                value={temporaryLabel}
                onChange={this.setTemporaryLabel}
              />
            </td>
            <td>
              <input
                className="input-group-input"
                placeholder="New address"
                value={temporaryAddress}
                onChange={this.setTemporaryAddress}
              />
            </td>
            <td>
              <button className="btn btn-sm btn-default" onClick={this.handleAddEntry}>
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
        label={addressToLabel.label}
        address={addressToLabel.address}
        isEditing={isEditingRow}
        onSave={(labelToSave: string, addressToSave: string) =>
          this.handleSave({ label: labelToSave, address: addressToSave })
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

function mapStateToProps(state) {
  return {
    rows: getAddressToLabels(state)
  };
}

const mapDispatchToProps = { addLabelForAddress, removeLabelForAddress };

export default connect(mapStateToProps, mapDispatchToProps)(AddressBookTable);
