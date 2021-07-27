import React, { ChangeEvent } from 'react';

import { Input } from '@mycrypto/ui';
import styled from 'styled-components';

import { Box, InlineMessage, Typography } from '@components';
import { translateRaw } from '@translations';
import { sanitizeDecimalSeparator } from '@utils';

const SInput = styled(Input)`
  /* Override Typography from mycrypto/ui */
  font-size: 1rem !important;
`;

export function GasPriceField({
  value,
  name,
  onChange,
  error,
  placeholder = '20'
}: IGasPriceField) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = sanitizeDecimalSeparator(e.target.value);

    const split = val.toString().split('.');
    if (split.length > 1) {
      return onChange(`${split[0]}.${split[1].substring(0, 9)}`);
    }
    return onChange(val);
  };

  return (
    <Box mb="3">
      <SInput
        {...value}
        name={name}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className="SendAssetsForm-fieldset-input"
        inputError={error}
        inputMode="decimal"
        iconSide="right"
        icon={() => (
          <Box variant="rowCenter">
            <Typography>{translateRaw('GWEI')}</Typography>
          </Box>
        )}
      />
      {error && <InlineMessage>{error}</InlineMessage>}
    </Box>
  );
}

interface IGasPriceField {
  value: string;
  name: string;
  error?: string | JSX.Element | undefined;
  onChange(entry: string): void;
  placeholder?: string;
}

export default GasPriceField;
