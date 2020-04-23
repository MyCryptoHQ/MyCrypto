import React from 'react';
import styled from 'styled-components';
import { Input } from '@mycrypto/ui';

import { Asset, TSymbol } from 'v2/types';
import { sanitizeDecimalSeparator } from 'v2/utils';

import AssetIcon from './AssetIcon';
import Typography from './Typography';

interface Props {
  disabled?: boolean;
  asset: Asset;
  value: string;
  placeholder?: string;
  onChange(event: any): void;
  onBlur?(event: any): void;
}

const SInput = styled(Input)`
  /* Override Typography from mycrypto/ui */
  font-size: 1rem !important;
`;

const SAssetIcon = styled(AssetIcon)`
  margin-right: 16px;
`;

function AmountInput({ asset, value, onChange, onBlur, placeholder, ...props }: Props) {
  return (
    <SInput
      {...props}
      inputMode="decimal"
      value={value}
      onChange={(e) => {
        e.target.value = sanitizeDecimalSeparator(e.target.value);
        onChange(e);
      }}
      onBlur={onBlur}
      placeholder={placeholder}
      iconSide={'right'}
      icon={() => (
        <div>
          {asset.ticker && <SAssetIcon symbol={asset.ticker as TSymbol} size={'1.5rem'} />}
          <Typography>{asset.ticker}</Typography>
        </div>
      )}
    />
  );
}

export default AmountInput;
