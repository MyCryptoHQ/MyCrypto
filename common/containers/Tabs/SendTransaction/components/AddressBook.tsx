import React from 'react';
import classnames from 'classnames';
import { IWallet } from 'libs/wallet';
import { AddressField } from 'components';
import { Input } from 'components/ui';
import './AddressBook.scss';

interface AddressBookProps {
  wallet: IWallet;
}

interface Label {
  address: string;
  label: string;
}

interface AddressBookTableProps {
  rows: Label[];
}

interface AddressBookTableState {
  activeRow: number | null;
}

const EXAMPLE_DATA = [
  {
    label: 'Main',
    address: '0x004160cffF97850Ad7d5aec67E321782a0B62786'
  },
  {
    label: 'Second',
    address: '0x004160cffF97850Ad7d5aec67E321782a0B62786'
  },
  {
    label: 'Third',
    address: '0x004160cffF97850Ad7d5aec67E321782a0B62786'
  }
];

class AddressBookTable extends React.Component<AddressBookTableProps> {
  public state: AddressBookTableState = {
    activeRow: null
  };

  setActiveRow = (activeRow: number) => this.setState({ activeRow });

  public render() {
    const { rows } = this.props;

    return (
      <table className="AddressBookTable table">
        <thead>
          <tr>
            <th scope="col">Label</th>
            <th scope="col">Address</th>
          </tr>
        </thead>
        <tbody>{rows.map(this.makeLabelRow)}</tbody>
      </table>
    );
  }

  private makeLabelRow = (label: Label, index: number) => {
    const { activeRow } = this.state;
    const isActiveRow = index === activeRow;
    const className = classnames({
      'AddressBookTable-row': true,
      'AddressBookTable-row--active': isActiveRow
    });
    const labelCell = isActiveRow ? <Input value={label.label} /> : label.label;
    const addressCell = isActiveRow ? <Input value={label.address} /> : label.address;

    return (
      <tr key={index} className={className} onClick={() => this.setActiveRow(index)}>
        <td>{labelCell}</td>
        <td>
          {addressCell}
          {isActiveRow && (
            <div className="AddressBookTable-row-remove">
              <i className="fa fa-close" />
            </div>
          )}
        </td>
      </tr>
    );
  };
}

export default class AddressBook extends React.Component<AddressBookProps> {
  public render() {
    return (
      <div className="AddressBook">
        <div className="Tab-content-pane">
          <div className="row form-group">
            <div className="col-sm-12">
              <label>Label</label>
              <Input />
            </div>
            <div className="col-sm-12">
              <AddressField />
            </div>
            <div className="col-xs-12">
              <button className="btn btn-primary pull-right">
                <i className="fa fa-plus" /> Add Entry
              </button>
            </div>
          </div>
        </div>
        <div className="Tab-content-pane">
          <AddressBookTable rows={EXAMPLE_DATA} />
        </div>
      </div>
    );
  }
}
