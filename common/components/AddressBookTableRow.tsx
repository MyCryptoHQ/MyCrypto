import React from 'react';
import noop from 'lodash/noop';

import translate, { translateRaw } from 'translations';
import { Input, Identicon } from 'components/ui';

interface Props {
  index: number;
  address: string;
  label: string;
  temporaryLabel: string;
  labelError?: string;
  isEditing: boolean;
  onChange(label: string): void;
  onSave(): void;
  onLabelInputBlur(): void;
  onEditClick(): void;
  onRemoveClick(): void;
}

interface State {
  labelInputTouched: boolean;
}

class AddressBookTableRow extends React.Component<Props> {
  public state: State = {
    labelInputTouched: false
  };

  private labelInput: HTMLInputElement | null = null;

  public UNSAFE_componentWillReceiveProps(nextProps: Props) {
    this.setState({ label: nextProps.label, mostRecentValidLabel: nextProps.label });
  }

  public render() {
    const {
      address,
      temporaryLabel,
      labelError,
      isEditing,
      onEditClick,
      onRemoveClick
    } = this.props;
    const { labelInputTouched } = this.state;
    const trOnClick = isEditing ? noop : onEditClick;
    const hashName = `${address}-hash`;
    const labelName = `${address}-label`;

    return (
      <React.Fragment>
        <div className="AddressBookTable-row" onClick={trOnClick}>
          <div className="AddressBookTable-row-input">
            <div className="AddressBookTable-row-input-wrapper">
              <label htmlFor={hashName} className="AddressBookTable-row-input-wrapper-label">
                {translate('ADDRESS')}
              </label>
              <Input
                name={hashName}
                title={address}
                value={address}
                readOnly={true}
                isValid={true}
              />
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
              <label htmlFor={labelName} className="AddressBookTable-row-input-wrapper-label">
                {translate('LABEL')}
              </label>
              <Input
                name={labelName}
                title={translateRaw('EDIT_LABEL_FOR', {
                  $address: address
                })}
                value={temporaryLabel}
                onChange={this.handleLabelChange}
                onKeyDown={this.handleKeyDown}
                onFocus={this.setLabelTouched}
                onBlur={this.handleBlur}
                showInvalidBeforeBlur={true}
                setInnerRef={this.setLabelInputRef}
                isValid={!(labelInputTouched && labelError)}
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
          {labelError && (
            <div className="AddressBookTable-row AddressBookTable-row-error AddressBookTable-row-error--mobile">
              <label className="AddressBookTable-row-input-wrapper-error">{labelError}</label>
            </div>
          )}
        </div>
        {labelError && (
          <div className="AddressBookTable-row AddressBookTable-row-error AddressBookTable-row-error--non-mobile">
            <label className="AddressBookTable-row-input-wrapper-error">{labelError}</label>
          </div>
        )}
      </React.Fragment>
    );
  }

  private handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const { labelInputTouched } = this.state;

    e.stopPropagation();

    if (e.key === 'Enter' && this.labelInput) {
      this.labelInput.blur();
    } else if (!labelInputTouched) {
      this.setLabelTouched();
    }
  };

  private handleBlur = () => {
    this.clearLabelTouched();
    this.props.onSave();
    this.props.onLabelInputBlur();
  };

  private setLabelInputRef = (node: HTMLInputElement) => (this.labelInput = node);

  private setLabelTouched = () =>
    !this.state.labelInputTouched && this.setState({ labelInputTouched: true });

  private clearLabelTouched = () => this.setState({ labelInputTouched: false });

  private handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const label = e.target.value;

    this.props.onChange(label);

    this.setState(
      { labelInputTouched: true },
      () => label.length === 0 && this.clearLabelTouched()
    );
  };
}

export default AddressBookTableRow;
