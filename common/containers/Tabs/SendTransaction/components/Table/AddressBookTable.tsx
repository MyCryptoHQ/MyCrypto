import React from 'react';
import classnames from 'classnames';
import { Input } from 'components/ui';
import './AddressBookTable.scss';

interface Label {
  address: string;
  label: string;
}

interface Props {
  rows: Label[];
}

interface State {
  activeRow: number | null;
}

export default class AddressBookTable extends React.Component<Props> {
  public state: State = {
    activeRow: null
  };

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

  private setActiveRow = (activeRow: number) => this.setState({ activeRow });

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
