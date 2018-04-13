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

interface RowProps {
  label: string;
  address: string;
  isActive: boolean;
  onClick(): void;
  onRemoveClick(): void;
}

export function AddressBookTableRow({
  label,
  address,
  isActive,
  onClick,
  onRemoveClick
}: RowProps) {
  const className = classnames({
    'AddressBookTable-row': true,
    'AddressBookTable-row--active': isActive
  });
  const labelCell = isActive ? <Input value={label} /> : label;
  const addressCell = isActive ? <Input value={address} /> : address;

  return (
    <tr className={className} onClick={onClick}>
      <td>{labelCell}</td>
      <td>
        {addressCell}
        {isActive && (
          <div className="AddressBookTable-row-remove" onClick={onRemoveClick}>
            <i className="fa fa-close" />
          </div>
        )}
      </td>
    </tr>
  );
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

  private removeEntry = (index: number) => alert(`Removing #${index}`);

  private makeLabelRow = (label: Label, index: number) => {
    const { activeRow } = this.state;
    const isActiveRow = index === activeRow;

    return (
      <AddressBookTableRow
        key={index}
        label={label.label}
        address={label.address}
        isActive={isActiveRow}
        onClick={() => this.setActiveRow(index)}
        onRemoveClick={() => this.removeEntry(index)}
      />
    );
  };
}
