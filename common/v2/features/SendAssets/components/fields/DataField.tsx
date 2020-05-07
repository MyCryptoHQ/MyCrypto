import React, { useState } from 'react';

import { InputField } from 'v2/components';
import { translateRaw } from 'v2/translations';
import { isTransactionDataEmpty } from 'v2/utils';

const getNonEmptyData = (data: string) => (isTransactionDataEmpty(data) ? '' : data);

export function DataField({ value, errors, name, onChange }: IDataField) {
  const [displayed, setDisplayed] = useState(getNonEmptyData(value));

  return (
    <InputField
      {...value}
      name={name}
      value={displayed}
      onChange={(e) => {
        setDisplayed(e.target.value);
        onChange(e.target.value);
      }}
      placeholder={translateRaw('TRANS_DATA_NONE')}
      className="SendAssetsForm-fieldset-input"
      inputError={errors}
      onFocus={() => setDisplayed(value)}
      onBlur={() => setDisplayed(getNonEmptyData(value))}
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
