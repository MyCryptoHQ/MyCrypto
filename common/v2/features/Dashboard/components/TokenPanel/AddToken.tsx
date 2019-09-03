import React, { useState } from 'react';
import styled from 'styled-components';

import { InputField } from 'v2/components';
import { Button } from '@mycrypto/ui';
import { translateRaw } from 'translations';

const ActionsWrapper = styled.div`
  margin-top: 52px;
  display: flex;
  justify-content: space-between;
`;

export function AddToken() {
  const [symbol, setSymbol] = useState('');
  const [address, setAddress] = useState('');
  const [decimals, setDecimals] = useState('');

  const handleAddTokenClick = () => {
    // TODO: Add token
  };

  return (
    <div>
      <InputField
        label={translateRaw('SYMBOL')}
        placeholder={'ETH'}
        onChange={e => setSymbol(e.target.value)}
        value={symbol}
      />
      <InputField
        label={translateRaw('ADDRESS')}
        placeholder={translateRaw('ADD_TOKEN_ADDRESS_PLACEHOLDER')}
        onChange={e => setAddress(e.target.value)}
        value={address}
      />
      <InputField
        label={translateRaw('TOKEN_DEC')}
        placeholder={'4'}
        onChange={e => setDecimals(e.target.value)}
        value={decimals}
      />
      <ActionsWrapper>
        <Button secondary={true}>{translateRaw('ACTION_2')}</Button>
        <Button onClick={handleAddTokenClick}>{translateRaw('ADD_TOKEN')}</Button>
      </ActionsWrapper>
    </div>
  );
}
