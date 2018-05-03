import React from 'react';
import { translateRaw } from 'translations';
import noop from 'lodash/noop';
import { isValidLabelLength } from 'libs/validators';
import { Input, Identicon } from 'components/ui';
import onClickOutside from 'react-onclickoutside';
import { getLabels } from 'selectors/addressBook';

interface Props {
  index: number;
  label: string;
  labels: ReturnType<typeof getLabels>;
  address: string;
  isEditing: boolean;
  onSave(label: string): void;
  onEditClick(): void;
  onRemoveClick(): void;
  displayInvalidLabelLengthNotification(): void;
  displayLabelAlreadyExistsNotification(): void;
}

interface State {
  label: string;
  mostRecentValidLabel: string;
  labelInputTouched: boolean;
  labelInputError: boolean;
}

class AddressBookTableRow extends React.Component<Props> {
  public state: State = {
    label: this.props.label,
    mostRecentValidLabel: this.props.label,
    labelInputTouched: false,
    labelInputError: false
  };

  private labelInput: HTMLInputElement | null = null;

  public handleClickOutside = () => this.props.isEditing && this.handleSave({ skipBlur: true });

  public componentWillReceiveProps(nextProps: Props) {
    const { label } = this.state;

    if (nextProps.label !== label) {
      this.setState({ label: nextProps.label, mostRecentValidLabel: nextProps.label });
    }
  }

  public render() {
    const { address, isEditing, onEditClick, onRemoveClick } = this.props;
    const { label, labelInputTouched, labelInputError } = this.state;
    const trOnClick = isEditing ? noop : onEditClick;
    const labelInputClassName = labelInputTouched && labelInputError ? 'invalid' : '';

    return (
      <div className="AddressBookTable-row" onClick={trOnClick}>
        <div className="AddressBookTable-row-input">
          <div className="AddressBookTable-row-input-wrapper">
            <label className="AddressBookTable-row-input-wrapper-label">Address</label>
            <Input title={address} value={address} readOnly={true} />
          </div>
          <div className="AddressBookTable-row-identicon AddressBookTable-row-identicon-non-mobile">
            <Identicon address={address} />
          </div>
          <div className="AddressBookTable-row-identicon AddressBookTable-row-identicon-mobile">
            <Identicon address={address} size="3rem" />
          </div>
        </div>
        <div className="AddressBookTable-row-input">
          <div className="AddressBookTable-row-input-wrapper">
            <label className="AddressBookTable-row-input-wrapper-label">Label</label>
            <Input
              title={`${translateRaw('EDIT_LABEL_FOR')}${address}`}
              className={labelInputClassName}
              value={label}
              onChange={this.setLabel}
              onKeyDown={this.handleKeyDown}
              onFocus={this.setLabelTouched}
              onClick={this.setLabelTouched}
              onBlur={this.handleClickOutside}
              setInnerRef={this.setLabelInputRef}
            />
          </div>
          <button
            title={translateRaw('REMOVE_LABEL')}
            className="btn btn-sm btn-danger"
            onClick={onRemoveClick}
          >
            <i className="fa fa-close" />
          </button>
        </div>
      </div>
    );
  }

  private handleSave = (options: { skipBlur?: boolean } = {}) => {
    const { labels } = this.props;
    const { label, mostRecentValidLabel } = this.state;
    const labelAlreadyExists = !!labels[label];

    if (label === mostRecentValidLabel) {
      return;
    }

    if (!isValidLabelLength(label)) {
      this.props.displayInvalidLabelLengthNotification();
      return this.focusAndSelectLabelInput();
    }

    if (labelAlreadyExists) {
      this.props.displayLabelAlreadyExistsNotification();
      return this.focusAndSelectLabelInput();
    }

    this.props.onSave(this.state.label);

    if (this.labelInput && !options.skipBlur) {
      this.labelInput.blur();
    }
  };

  private handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    e.stopPropagation();

    if (e.key === 'Enter' && this.labelInput) {
      this.labelInput.blur();
    }
  };

  private setLabel = (e: React.ChangeEvent<HTMLInputElement>) =>
    this.setState({ label: e.target.value }, this.checkLabelValidation);

  private setLabelInputRef = (node: HTMLInputElement) => (this.labelInput = node);

  private setLabelTouched = () => {
    const { labelInputTouched } = this.state;

    if (!labelInputTouched) {
      this.setState({ labelInputTouched: true });
    }
  };

  private checkLabelValidation = () => {
    const { labels } = this.props;
    const { label, labelInputError } = this.state;
    const labelAlreadyExists = !!labels[label];
    const isValid = !labelAlreadyExists && isValidLabelLength(label);

    if (isValid && labelInputError) {
      this.setState({ labelInputError: false });
    } else if (!isValid && !labelInputError) {
      this.setState({ labelInputError: true });
    }
  };

  private focusAndSelectLabelInput = () => {
    if (this.labelInput) {
      this.labelInput.focus();
    }
  };
}

export default onClickOutside(AddressBookTableRow);
