import React from 'react';
import classnames from 'classnames';

interface Props {
  isValid: boolean;
  isVisible: boolean;
  name: string;
  value: string;
  placeholder: string;
  disabled?: boolean;
  handleInput(e: React.FormEvent<HTMLInputElement>): void;
  handleToggle(): void;
}

const KeystoreInput: React.SFC<Props> = ({
  isValid,
  isVisible,
  handleInput,
  name,
  value,
  placeholder,
  disabled,
  handleToggle
}) => (
  <div className="input-group">
    <input
      className={classnames('form-control', isValid ? 'is-valid' : 'is-invalid')}
      type={isVisible ? 'text' : 'password'}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={handleInput}
      disabled={disabled}
    />
    <span onClick={handleToggle} role="button" className="input-group-addon eye" />
  </div>
);

export default KeystoreInput;
