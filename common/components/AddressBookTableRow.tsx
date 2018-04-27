import React from 'react';
import KeyCodes from 'shared/keycodes';
import { translateRaw } from 'translations';
import noop from 'lodash/noop';
import { Input, Identicon } from 'components/ui';
import onClickOutside from 'react-onclickoutside';

interface Props {
  index: number;
  label: string;
  address: string;
  isEditing: boolean;
  onSave(label: string): void;
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

  private labelInput: HTMLInputElement | null = null;

  public handleClickOutside = () => this.props.isEditing && this.handleSave();

  public componentWillReceiveProps(nextProps: Props) {
    this.setState({ label: nextProps.label });
  }

  public render() {
    const { address, isEditing, onEditClick, onRemoveClick } = this.props;
    const { label } = this.state;
    const trOnClick = isEditing ? noop : onEditClick;

    return (
      <div className="AddressBookTable-row" onClick={trOnClick}>
        <div className="AddressBookTable-identicon">
          <Identicon address={address} />
        </div>
        <Input value={address} readOnly={true} />
        <Input
          value={label}
          onChange={this.setLabel}
          onKeyDown={this.handleKeyDown}
          setInnerRef={this.setLabelInputRef}
        />
        <button
          title={translateRaw('REMOVE_LABEL')}
          className="btn btn-sm btn-danger"
          onClick={onRemoveClick}
        >
          <i className="fa fa-close" />
        </button>
      </div>
    );
  }

  private handleSave = () => this.props.onSave(this.state.label);

  private handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.keyCode === KeyCodes.ENTER) {
      this.handleSave();

      if (this.labelInput) {
        this.labelInput.blur();
      }
    }
  };

  private setLabel = (e: React.ChangeEvent<HTMLInputElement>) =>
    this.setState({ label: e.target.value });

  private setLabelInputRef = (node: HTMLInputElement) => (this.labelInput = node);
}

export default onClickOutside(AddressBookTableRow);
