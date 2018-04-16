import React from 'react';
import classnames from 'classnames';
import noop from 'lodash/noop';
import { Input } from 'components/ui';
import onClickOutside from 'react-onclickoutside';

interface Props {
  index: number;
  label: string;
  address: string;
  isEditing: boolean;
  onSave(label: string, address: string): void;
  onEditClick(): void;
  onRemoveClick(): void;
}

class AddressBookTableRow extends React.Component<Props> {
  public state = {
    label: this.props.label,
    address: this.props.address
  };

  public handleClickOutside = () => this.props.isEditing && this.handleSave();

  public render() {
    const { index, isEditing, onEditClick, onRemoveClick } = this.props;
    const { label, address } = this.state;
    const className = classnames({
      'AddressBookTable-row': true,
      'AddressBookTable-row--active': isEditing
    });
    const labelCell = isEditing ? <Input value={label} onChange={this.setLabel} /> : label;
    const addressCell = isEditing ? <Input value={address} onChange={this.setAddress} /> : address;
    const trOnClick = isEditing ? noop : onEditClick;

    return (
      <tr className={className} onClick={trOnClick}>
        <td>{index + 1}</td>
        <td>{labelCell}</td>
        <td>{addressCell}</td>
        <td>
          <div className="btn-group">
            <button className="btn btn-default" onClick={isEditing ? this.handleSave : onEditClick}>
              {isEditing ? <i className="fa fa-save" /> : <i className="fa fa-pencil" />}
            </button>
            <button className="btn btn-danger" onClick={onRemoveClick}>
              <i className="fa fa-close" />
            </button>
          </div>
        </td>
      </tr>
    );
  }

  private handleSave = () => {
    const { onSave } = this.props;
    const { label, address } = this.state;

    onSave(label, address);
  };

  private setLabel = (e: React.ChangeEvent<HTMLInputElement>) =>
    this.setState({ label: e.target.value });

  private setAddress = (e: React.ChangeEvent<HTMLInputElement>) =>
    this.setState({ address: e.target.value });
}

export default onClickOutside(AddressBookTableRow);
