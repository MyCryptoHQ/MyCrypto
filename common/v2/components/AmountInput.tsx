import React from 'react';
import styled from 'styled-components';

import { Input } from '@mycrypto/ui';
import { Asset } from 'v2/types';
import { monospace } from 'v2/theme';
import AssetIcon from './AssetIcon';
import Typography from './Typography';

interface Props {
  asset: Asset;
  value: string;
  placeholder?: string;
  onChange(event: any): void;
  onBlur?(event: any): void;
}

const SInput = styled(Input)`
  font-family: ${monospace};
`;

const SAssetIcon = styled(AssetIcon)`
  margin-right: 16px;
`;

function AmountInput({ asset, value, onChange, onBlur, placeholder, ...props }: Props) {
  return (
    <SInput
      {...props}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      placeholder={placeholder}
      iconSide={'right'}
      icon={() => (
        <div>
          {asset.ticker && <SAssetIcon symbol={asset.ticker} size={'1.5rem'} />}
          <Typography>{asset.ticker}</Typography>
        </div>
      )}
    />
  );
}

export default AmountInput;
