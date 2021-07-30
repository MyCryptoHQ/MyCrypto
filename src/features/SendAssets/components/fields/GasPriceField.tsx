import React, { ChangeEvent } from 'react';

import { Body, Box, Icon, InputField, LinkApp, Tooltip, Typography } from '@components';
import { COLORS } from '@theme';
import { translateRaw } from '@translations';
import { sanitizeDecimalSeparator } from '@utils';

export function GasPriceField({
  value,
  name,
  onChange,
  error,
  placeholder = '20',
  label,
  tooltip,
  refresh,
  disabled
}: IGasPriceField) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = sanitizeDecimalSeparator(e.target.value);

    const split = val.toString().split('.');
    if (split.length > 1) {
      return onChange(`${split[0]}.${split[1].substring(0, 9)}`);
    }
    return onChange(val);
  };

  const handleRefreshClicked = () => refresh && refresh();

  return (
    <Box mb="3">
      {label && (
        <Box variant="rowAlign" px="1" pb="1" justifyContent="space-between">
          <Box variant="rowAlign">
            <Body mb="0">{label}</Body>
            <Tooltip ml="1" tooltip={tooltip} />
          </Box>
          {refresh && (
            <Box variant="rowAlign">
              <LinkApp href="#" isExternal={false} onClick={handleRefreshClicked}>
                <Icon fill={COLORS.BLUE_BRIGHT} width="14px" height="14px" type="refresh" />
              </LinkApp>
            </Box>
          )}
        </Box>
      )}
      <InputField
        {...value}
        name={name}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className="SendAssetsForm-fieldset-input"
        inputError={error}
        inputMode="decimal"
        customIcon={() => (
          <Box variant="rowCenter">
            <Typography>{translateRaw('GWEI')}</Typography>
          </Box>
        )}
        disabled={disabled}
      />
    </Box>
  );
}

interface IGasPriceField {
  value: string;
  name: string;
  error?: string | JSX.Element | undefined;
  onChange(entry: string): void;
  placeholder?: string;
  label?: string;
  tooltip?: string;
  disabled?: boolean;
  refresh?(): void;
}

export default GasPriceField;
