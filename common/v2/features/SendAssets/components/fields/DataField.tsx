import React, { useState } from 'react';

import { InputField } from 'v2/components';
import { translateRaw } from 'v2/translations';

const getSanitizedData = (data: string) => (['', '0x', '0x0', '0x00'].includes(data) ? '' : data);

export function DataField({ value, errors, name, onChange }: IDataField) {
  const [displayed, setDisplayed] = useState(getSanitizedData(value));

  return (
    <InputField
      {...value}
      name={name}
      value={displayed}
      onChange={e => {
        setDisplayed(e.target.value);
        onChange(e.target.value);
      }}
      placeholder={translateRaw('TRANS_DATA_NONE')}
      className="SendAssetsForm-fieldset-input"
      inputError={errors}
      onFocus={() => setDisplayed(value)}
      onBlur={() => setDisplayed(getSanitizedData(value))}
    />
  );
}

interface IDataField {
  value: string;
  name: string;
  errors: string | undefined;
  onChange(entry: string): void;
}

export default DataField;
