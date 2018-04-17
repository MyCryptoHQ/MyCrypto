import React from 'react';
import { connect } from 'react-redux';
import KeyCodes from 'shared/keycodes';
import { isValidETHAddress } from 'libs/validators';
import { addLabelForAddress, removeLabelForAddress } from 'actions/addressBook';
import { getAddressToLabels } from 'selectors/addressBook';
import { Input, Identicon } from 'components/ui';
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
              <div className="AddressBookTable-cell">
                <Input
                  placeholder="New address"
                  value={temporaryAddress}
                  onChange={this.setTemporaryAddress}
                />
                <Identicon address={temporaryAddress} />
              </div>
            </td>
            <td>
              <div className="AddressBookTable-cell">
                <Input
                  placeholder="New label"
                  value={temporaryLabel}
                  onChange={this.setTemporaryLabel}
                />
              </div>
            </td>
            <td>
              <div className="AddressBookTable-cell">
                <button
                  title="Add an entry"
                  className="btn btn-sm btn-default"
                  onClick={this.handleAddEntry}
                >
                  <i className="fa fa-plus" />
                </button>
              </div>
            </td>
          </tr>
          {rows.map(this.makeLabelRow)}
        </tbody>
      </table>
    );
  }

  private handleSave = (addressToLabel: AddressToLabel) => {
    const { label, address } = addressToLabel;

    this.props.addLabelForAddress({ label, address });

    this.setEditingRow(null);
  };

  private handleAddEntry = () => {
    const { temporaryLabel: label, temporaryAddress: address } = this.state;

    if (label && isValidETHAddress(address)) {
      this.handleSave({ label, address });
      this.clearTemporaryFields();
    }
  };

  private handleKeyDown = (e: React.KeyboardEvent<HTMLTableElement>) => {
    if (e.keyCode === KeyCodes.ENTER) {
      this.handleAddEntry();
    }
  };

  private setEditingRow = (editingRow: number | null) => this.setState({ editingRow });

  private removeEntry = (address: string) => this.props.removeLabelForAddress(address);

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
