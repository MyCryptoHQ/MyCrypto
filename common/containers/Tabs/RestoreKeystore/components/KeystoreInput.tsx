import React from 'react';
import classnames from 'classnames';

interface Props {
  isValid: boolean;
  isVisible: boolean;
  handleInput: any;
  name: string;
  value: string;
  placeholder: string;
  handleToggle: any;
}

const KeystoreInput: React.SFC<Props> = ({
  isValid,
  isVisible,
  handleInput,
  name,
  value,
  placeholder,
  handleToggle
}) => (
  <div className="input-group">
    <input
      className={classnames(
        'form-control',
        isValid ? 'is-valid' : 'is-invalid'
      )}
      type={isVisible ? 'text' : 'password'}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={handleInput}
    />
    <span
      onClick={handleToggle}
      role="button"
      className="input-group-addon eye"
    />
  </div>
);

export default KeystoreInput;
