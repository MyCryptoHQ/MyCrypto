import React from 'react';
import noop from 'lodash/noop';
import { Input } from 'components/ui';
import onClickOutside from 'react-onclickoutside';

interface Props {
  index: number;
  label: string;
  address: string;
  isEditing: boolean;
  onSave(thing: any): void;
  onEditClick(): void;
  onRemoveClick(): void;
}

interface State {
  label: string;
}

class AddressBookTableRow extends React.Component<Props> {
  public state: State = {
    label: this.props.label
  };

  public handleClickOutside = () => this.props.isEditing && this.handleSave();

  public render() {
    const { address, isEditing, onEditClick, onRemoveClick } = this.props;
    const { label } = this.state;
    const labelCell = isEditing ? <Input value={label} onChange={this.setLabel} /> : label;
    const trOnClick = isEditing ? noop : onEditClick;

    return (
      <tr onClick={trOnClick}>
        <td>{address}</td>
        <td>{labelCell}</td>
        <td>
          <button
            title={isEditing ? 'Save this entry' : 'Edit this entry'}
            className="btn btn-sm btn-default"
            onClick={isEditing ? this.handleSave : onEditClick}
          >
            {isEditing ? <i className="fa fa-save" /> : <i className="fa fa-pencil" />}
          </button>
          <button
            title="Remove this entry"
            className="btn btn-sm  btn-danger"
            onClick={onRemoveClick}
          >
            <i className="fa fa-close" />
          </button>
        </td>
      </tr>
    );
  }

  private handleSave = () => {
    const { onSave } = this.props;
    const { label } = this.state;

    onSave(label);
  };

  private setLabel = (e: React.ChangeEvent<HTMLInputElement>) =>
    this.setState({ label: e.target.value });
}

export default onClickOutside(AddressBookTableRow);
