import React from 'react';

import { InputField } from '@components';

export function NonceField({ value, name, onChange, error }: INonceField) {
  return (
    <div>
      <InputField
        {...value}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="0"
        className="SendAssetsForm-fieldset-input"
        inputError={error}
        inputMode="decimal"
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
