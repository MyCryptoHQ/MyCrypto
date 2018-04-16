import React from 'react';
import { connect } from 'react-redux';
import { addLabelForAddress, removeLabelForAddress } from 'actions/addressBook';
import { getAddressToLabels } from 'selectors/addressBook';
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
}

class AddressBookTable extends React.Component<Props> {
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
    const { addLabelForAddress } = this.props;
    const { label, address } = addressToLabel;

    addLabelForAddress({ label, address });

    this.setEditingRow(null);
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
}

function mapStateToProps(state) {
  return {
    rows: getAddressToLabels(state)
  };
}

const mapDispatchToProps = { addLabelForAddress, removeLabelForAddress };

export default connect(mapStateToProps, mapDispatchToProps)(AddressBookTable);
