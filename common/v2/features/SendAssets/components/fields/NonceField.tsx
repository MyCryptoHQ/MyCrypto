import React from 'react';

import { InputField } from 'v2/components';

export function NonceField({ value, name, onChange, error }: INonceField) {
  return (
    <div>
      <InputField
        {...value}
        name={name}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="0"
        className="SendAssetsForm-fieldset-input"
        inputError={error}
      />
    </div>
  );
}

interface INonceField {
  value: string;
  name: string;
  error?: string | JSX.Element | undefined;
  onChange(entry: string): void;
}

export default NonceField;
