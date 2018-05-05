import React from 'react';
import translate, { translateRaw } from 'translations';
import noop from 'lodash/noop';
import { Input, Identicon } from 'components/ui';
import { getLabelAddresses, getLabelErrors } from 'selectors/addressBook';

interface Props {
  index: number;
  address: string;
  label: string;
  labelAddresses: ReturnType<typeof getLabelAddresses>;
  labelErrors: ReturnType<typeof getLabelErrors>;
  isEditing: boolean;
  onSave(label: string): void;
  onLabelInputBlur(): void;
  onEditClick(): void;
  onRemoveClick(): void;
}

interface State {
  label: string;
  mostRecentValidLabel: string;
  labelInputTouched: boolean;
}

class AddressBookTableRow extends React.Component<Props> {
  public state: State = {
    label: this.props.label,
    mostRecentValidLabel: this.props.label,
    labelInputTouched: false
  };

  private labelInput: HTMLInputElement | null = null;

  public componentWillReceiveProps(nextProps: Props) {
    this.setState({ label: nextProps.label, mostRecentValidLabel: nextProps.label });
  }

  public render() {
    const { index, address, labelErrors, isEditing, onEditClick, onRemoveClick } = this.props;
    const { label, labelInputTouched } = this.state;
    const labelInputError = labelErrors[index];
    const trOnClick = isEditing ? noop : onEditClick;
    const labelInputClassName = labelInputTouched && labelInputError ? 'invalid' : '';
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
              <Input name={hashName} title={address} value={address} readOnly={true} />
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
                title={`${translateRaw('EDIT_LABEL_FOR')}${address}`}
                className={labelInputClassName}
                value={label}
                onChange={this.setLabel}
                onKeyDown={this.handleKeyDown}
                onFocus={this.setLabelTouched}
                onBlur={this.handleBlur}
                showInvalidBeforeBlur={true}
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
          {labelInputError && (
            <div className="AddressBookTable-row AddressBookTable-row-error AddressBookTable-row-error--mobile">
              <label className="AddressBookTable-row-input-wrapper-error">
                <div />
                {labelInputError}
              </label>
            </div>
          )}
        </div>
        {labelInputError && (
          <div className="AddressBookTable-row AddressBookTable-row-error AddressBookTable-row-error--non-mobile">
            <div />
            <label className="AddressBookTable-row-input-wrapper-error">{labelInputError}</label>
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
    const { onSave, onLabelInputBlur } = this.props;
    const { label, mostRecentValidLabel } = this.state;

    if (label === mostRecentValidLabel) {
      return;
    }

    this.clearLabelTouched();

    onSave(label);
    onLabelInputBlur();
  };

  private setLabel = (e: React.ChangeEvent<HTMLInputElement>) => {
    const label = e.target.value;

    this.setState(
      { label, labelInputTouched: true },
      () => label.length === 0 && this.clearLabelTouched()
    );
  };

  private setLabelInputRef = (node: HTMLInputElement) => (this.labelInput = node);

  private setLabelTouched = () => {
    const { labelInputTouched } = this.state;

    if (!labelInputTouched) {
      this.setState({ labelInputTouched: true });
    }
  };

  private clearLabelTouched = () => this.setState({ labelInputTouched: false });
}

export default AddressBookTableRow;
