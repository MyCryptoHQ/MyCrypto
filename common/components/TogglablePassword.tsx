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

  // Textarea-only props
  isTextareaWhenVisible?: boolean;
  rows?: number;
  onEnter?(): void;

  // Shared callbacks
  onChange(ev: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>): void;
}

interface State {
  isVisible: boolean;
}

export default class TogglablePassword extends React.PureComponent<Props, State> {
  public state: State = {
    isVisible: false
  };

  public render() {
    const {
      value,
      placeholder,
      name,
      disabled,
      ariaLabel,
      isTextareaWhenVisible,
      onChange,
      isValid
    } = this.props;
    const { isVisible } = this.state;
    const validClass =
      isValid === null || isValid === undefined ? '' : isValid ? 'is-valid' : 'is-invalid';

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
            aria-label={ariaLabel}
          />
        )}
        <span
          onClick={this.toggleVisibility}
          aria-label="show private key"
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
