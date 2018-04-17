import React from 'react';
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

  public componentWillReceiveProps(nextProps: Props) {
    this.setState({
      label: nextProps.label,
      address: nextProps.address
    });
  }

  public render() {
    const { isEditing, onEditClick, onRemoveClick } = this.props;
    const { label, address } = this.state;
    const labelCell = isEditing ? <Input value={label} onChange={this.setLabel} /> : label;
    const addressCell = isEditing ? <Input value={address} onChange={this.setAddress} /> : address;
    const trOnClick = isEditing ? noop : onEditClick;

    return (
      <tr onClick={trOnClick}>
        <td>{labelCell}</td>
        <td>{addressCell}</td>
        <td>
          <button
            className="btn btn-sm btn-default"
            onClick={isEditing ? this.handleSave : onEditClick}
          >
            {isEditing ? <i className="fa fa-save" /> : <i className="fa fa-pencil" />}
          </button>
          <button className="btn btn-sm  btn-danger" onClick={onRemoveClick}>
            <i className="fa fa-close" />
          </button>
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
