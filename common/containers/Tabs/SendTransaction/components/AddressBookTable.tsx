import React from 'react';
import AddressBookTableRow from './AddressBookTableRow';
import './AddressBookTable.scss';

interface Label {
  address: string;
  label: string;
}

interface Props {
  rows: Label[];
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

  private handleSave = (index: number, label: string, address: string) => {
    console.log(index, label, address);
    this.setEditingRow(null);
  };

  private setEditingRow = (editingRow: number | null) => this.setState({ editingRow });

  private removeEntry = (index: number) => alert(`Removing #${index}`);

  private makeLabelRow = (label: Label, index: number) => {
    const { editingRow } = this.state;
    const isEditingRow = index === editingRow;

    return (
      <AddressBookTableRow
        key={index}
        index={index}
        label={label.label}
        address={label.address}
        isEditing={isEditingRow}
        onSave={(labelToSave: string, addressToSave: string) =>
          this.handleSave(index, labelToSave, addressToSave)
        }
        onEditClick={() => this.setEditingRow(index)}
        onRemoveClick={() => this.removeEntry(index)}
      />
    );
  };
}
