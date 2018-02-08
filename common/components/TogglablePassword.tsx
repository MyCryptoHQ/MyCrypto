// Either self contained, or controlled component for having a password field
// with a toggle to turn it into a visible text field.
// Pass `isVisible` and `handleToggleVisibility` to control the visibility
// yourself, otherwise all visibiility changes are managed in internal state.
import React from 'react';
import './TogglablePassword.scss';

interface Props {
  // Shared props
  value: string;
  placeholder?: string;
  name?: string;
  disabled?: boolean;
  ariaLabel?: string;
  toggleAriaLabel?: string;
  isValid?: boolean;
  isVisible?: boolean;
  validity?: 'valid' | 'invalid' | 'semivalid';

  // Textarea-only props
  isTextareaWhenVisible?: boolean;
  rows?: number;
  onEnter?(): void;

  // Shared callbacks
  onChange?(ev: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>): void;
  onFocus?(ev: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>): void;
  onBlur?(ev: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>): void;
  handleToggleVisibility?(): void;
}

interface State {
  isVisible: boolean;
}

export default class TogglablePassword extends React.PureComponent<Props, State> {
  public state: State = {
    isVisible: !!this.props.isVisible
  };

  public componentWillReceiveProps(nextProps: Props) {
    if (this.props.isVisible !== nextProps.isVisible) {
      this.setState({ isVisible: !!nextProps.isVisible });
    }
  }

  public render() {
    const {
      value,
      placeholder,
      name,
      disabled,
      ariaLabel,
      toggleAriaLabel,
      validity,
      isTextareaWhenVisible,
      isValid,
      onChange,
      onFocus,
      onBlur,
      handleToggleVisibility
    } = this.props;
    const { isVisible } = this.state;
    const validClass = validity
      ? `is-${validity}`
      : isValid === null || isValid === undefined ? '' : isValid ? 'is-valid' : 'is-invalid';

    return (
      <div className="TogglablePassword input-group">
        {isTextareaWhenVisible && isVisible ? (
          <textarea
            className={`form-control ${validClass}`}
            value={value}
            name={name}
            disabled={disabled}
            onChange={onChange}
            onKeyDown={this.handleTextareaKeyDown}
            onFocus={onFocus}
            onBlur={onBlur}
            placeholder={placeholder}
            rows={this.props.rows || 3}
            aria-label={ariaLabel}
          />
        ) : (
          <input
            value={value}
            name={name}
            disabled={disabled}
            type={isVisible ? 'text' : 'password'}
            className={`form-control ${validClass}`}
            placeholder={placeholder}
            onChange={onChange}
            onFocus={onFocus}
            onBlur={onBlur}
            aria-label={ariaLabel}
          />
        )}
        <span
          onClick={handleToggleVisibility || this.toggleVisibility}
          aria-label={toggleAriaLabel}
          role="button"
          className="TogglablePassword-toggle input-group-addon"
        >
          <i className={`fa fa-${isVisible ? 'eye-slash' : 'eye'}`} />
        </span>
      </div>
    );
  }

  private toggleVisibility = () => {
    this.setState({ isVisible: !this.state.isVisible });
  };

  private handleTextareaKeyDown = (ev: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (this.props.onEnter && ev.keyCode === 13) {
      ev.preventDefault();
      this.props.onEnter();
    }
  };
}
