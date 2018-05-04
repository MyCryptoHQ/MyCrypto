import React from 'react';
import translate, { translateRaw } from 'translations';
import noop from 'lodash/noop';
import { isValidLabelLength } from 'libs/validators';
import { Input, Identicon } from 'components/ui';
import { getLabels } from 'selectors/addressBook';

interface Props {
  index: number;
  label: string;
  labels: ReturnType<typeof getLabels>;
  address: string;
  isEditing: boolean;
  onSave(label: string): void;
  onLabelInputBlur(): void;
  onEditClick(): void;
  onRemoveClick(): void;
  displayInvalidLabelLengthNotification(): void;
  displayLabelAlreadyExistsNotification(): void;
}

interface State {
  label: string;
  mostRecentValidLabel: string;
  labelInputTouched: boolean;
  labelInputError: string | null;
}

class AddressBookTableRow extends React.Component<Props> {
  public state: State = {
    label: this.props.label,
    mostRecentValidLabel: this.props.label,
    labelInputTouched: false,
    labelInputError: null
  };

  private labelInput: HTMLInputElement | null = null;

  public componentWillReceiveProps(nextProps: Props) {
    this.setState({ label: nextProps.label, mostRecentValidLabel: nextProps.label });
  }

  public render() {
    const { address, isEditing, onEditClick, onRemoveClick } = this.props;
    const { label, labelInputTouched, labelInputError } = this.state;
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

  private handleSave = () => {
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

    this.props.onSave(label);
  };

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
    this.handleSave();
    this.clearLabelTouched();
    this.props.onLabelInputBlur();
  };

  private setLabel = (e: React.ChangeEvent<HTMLInputElement>) => {
    const label = e.target.value;

    this.setState(
      { label, labelInputTouched: true },
      label.length > 0 ? this.checkLabelValidation : this.clearLabelTouched
    );
  };

  private setLabelInputRef = (node: HTMLInputElement) => (this.labelInput = node);

  private setLabelTouched = () => {
    const { label, labelInputTouched } = this.state;

    if (!labelInputTouched) {
      this.setState({ labelInputTouched: true });
    }

    if (label.length > 0) {
      this.checkLabelValidation();
    }
  };

  private clearLabelTouched = () =>
    this.setState({ labelInputTouched: false, labelInputError: null });

  private checkLabelValidation = () => {
    const { labels } = this.props;
    const { label, labelInputError, mostRecentValidLabel } = this.state;
    const labelAlreadyExists = !!labels[label] && label !== mostRecentValidLabel;
    const hadErrorPreviously = labelInputError !== null;
    const labelBeginsWith0x = label.startsWith('0x');
    const labelContainsENSSuffix =
      label.includes('.eth') || label.includes('.test') || label.includes('.reverse');

    if (labelAlreadyExists) {
      return this.setState({
        labelInputError: translateRaw('LABEL_ALREADY_EXISTS')
      });
    }

    if (!isValidLabelLength(label)) {
      return this.setState({
        labelInputError: translateRaw('INVALID_LABEL_LENGTH')
      });
    }

    if (labelBeginsWith0x) {
      return this.setState({
        labelInputError: translateRaw('LABEL_CANNOT_BEGIN_WITH_0X')
      });
    }

    if (labelContainsENSSuffix) {
      return this.setState({
        labelInputError: translateRaw('LABEL_CANNOT_CONTAIN_ENS_SUFFIX')
      });
    }

    if (hadErrorPreviously) {
      return this.setState({
        labelInputError: null
      });
    }
  };

  private focusAndSelectLabelInput = () => {
    if (this.labelInput) {
      this.labelInput.focus();
      this.labelInput.select();
    }
  };
}

export default AddressBookTableRow;
