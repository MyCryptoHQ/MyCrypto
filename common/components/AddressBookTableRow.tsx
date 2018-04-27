import React from 'react';
import { translateRaw } from 'translations';
import noop from 'lodash/noop';
import { isValidLabelLength } from 'libs/validators';
import { Input, Identicon } from 'components/ui';
import onClickOutside from 'react-onclickoutside';
import { getLabels } from 'selectors/addressBook';
import { ERROR_DURATION } from './AddressBookTable';

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
  labelInputError: boolean;
}

class AddressBookTableRow extends React.Component<Props> {
  public state: State = {
    label: this.props.label,
    mostRecentValidLabel: this.props.label,
    labelInputError: false
  };

  private labelInput: HTMLInputElement | null = null;

  private goingToClearError: number | null = null;

  public handleClickOutside = () => this.props.isEditing && this.handleSave();

  public componentWillReceiveProps(nextProps: Props) {
    this.setState({ label: nextProps.label, mostRecentValidLabel: nextProps.label });
  }

  public componentWillUnmount() {
    if (this.goingToClearError) {
      window.clearTimeout(this.goingToClearError);
    }
  }

  public render() {
    const { address, isEditing, onEditClick, onRemoveClick } = this.props;
    const { label, labelInputError } = this.state;
    const trOnClick = isEditing ? noop : onEditClick;
    const labelInputClassName = labelInputError ? 'AddressBookTable-row-input-error' : '';

    return (
      <div className="AddressBookTable-row" onClick={trOnClick}>
        <div className="AddressBookTable-identicon">
          <Identicon address={address} />
        </div>
        <Input value={address} readOnly={true} />
        <Input
          className={labelInputClassName}
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

  private handleSave = () => {
    const { labels } = this.props;
    const { label, mostRecentValidLabel } = this.state;
    const labelAlreadyExists = !!labels[label];

    if (label === mostRecentValidLabel) {
      return;
    }

    if (!isValidLabelLength(label)) {
      this.props.displayInvalidLabelLengthNotification();
      return this.flashLabelInputError();
    }

    if (labelAlreadyExists) {
      this.props.displayLabelAlreadyExistsNotification();
      return this.flashLabelInputError();
    }

    this.props.onSave(this.state.label);

    if (this.labelInput) {
      this.labelInput.blur();
    }
  };

  private handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    e.stopPropagation();

    if (e.key === 'Enter') {
      this.handleSave();
    }
  };

  private setLabel = (e: React.ChangeEvent<HTMLInputElement>) =>
    this.setState({ label: e.target.value });

  private setLabelInputRef = (node: HTMLInputElement) => (this.labelInput = node);

  private flashLabelInputError = () => {
    const { mostRecentValidLabel } = this.state;

    this.setState(
      {
        label: mostRecentValidLabel,
        labelInputError: true
      },
      () =>
        (this.goingToClearError = window.setTimeout(
          () =>
            this.setState({
              labelInputError: false
            }),
          ERROR_DURATION
        ))
    );

    if (this.labelInput) {
      this.labelInput.focus();
    }
  };
}

export default onClickOutside(AddressBookTableRow);
