import React from 'react';
import AddressBookTableRow from './AddressBookTableRow';
import './AddressBookTable.scss';
import { Address } from 'libs/units';

interface AddressToLabel {
  address: string;
  label: string;
}

interface Props {
  rows: AddressToLabel[];
}

interface State {
  editingRow: number | null;
}

export default class AddressBookTable extends React.Component<Props> {
  public state: State = {
    editingRow: null
  };

  public render() {
    const { rows } = this.props;

    return (
      <table className="AddressBookTable table table-hover">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Label</th>
            <th scope="col">Address</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>{rows.map(this.makeLabelRow)}</tbody>
      </table>
    );
  }

  private handleSave = (addressToLabel: AddressToLabel) => {
    const { label, address } = addressToLabel;

    console.log(label, address);

    this.setEditingRow(null);
  };

  private setEditingRow = (editingRow: number | null) => this.setState({ editingRow });

  private removeEntry = (address: string) => alert(`Removing ${address}`);

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
}
