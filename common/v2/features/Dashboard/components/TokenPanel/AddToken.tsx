import React, { useState } from 'react';
import styled from 'styled-components';
import { Button } from '@mycrypto/ui';

import { generateUUID } from 'v2/utils';
import { InputField, NetworkSelectDropdown } from 'v2/components';
import { translateRaw } from 'translations';
import { createAssetWithID, getNetworkByName } from 'v2/services/Store';
import { ExtendedAsset, NetworkId } from 'v2/types';
import { DEFAULT_NETWORK } from 'v2/config';
import { isValidAddress } from 'v2/services';

const ActionsWrapper = styled.div`
  margin-top: 52px;
  display: flex;
  justify-content: space-between;
`;

const NetworkSelectorWrapper = styled.div`
  margin-bottom: 15px;

  label {
    font-weight: normal;
  }
`;

interface Props {
  setShowAddToken(setShowAddToken: boolean): void;
  scanTokens(): void;
}

export function AddToken(props: Props) {
  const [symbol, setSymbol] = useState('');
  const [address, setAddress] = useState('');
  const [decimals, setDecimals] = useState('');
  const [symbolError, setSymbolError] = useState('');
  const [addressError, setAddressError] = useState('');
  const [decimalsError, setDecimalsError] = useState('');
  const [networkId, setNetworkId] = useState<NetworkId>(DEFAULT_NETWORK);

  const { setShowAddToken, scanTokens } = props;

  const validateForm = () => {
    setSymbolError('');
    setAddressError('');
    setDecimalsError('');

    let isValid = true;

    const network = getNetworkByName(networkId);

    if (symbol.length === 0) {
      setSymbolError('Missing symbol');
      isValid = false;
    }
    if (!network || !isValidAddress(address, network.chainId)) {
      setAddressError('Invalid address');
      isValid = false;
    }
    if (decimals.length === 0) {
      setDecimalsError('Missing decimals');
      isValid = false;
    }

    if (!isValid) {
      return false;
    }

    return true;
  };

  const handleAddTokenClick = () => {
    if (!validateForm()) {
      return;
    }

    const uuid = generateUUID();

    const newAsset: ExtendedAsset = {
      name: symbol,
      networkId,
      ticker: symbol,
      type: 'erc20',
      contractAddress: address,
      decimal: parseInt(decimals, 10),
      uuid
    };

    createAssetWithID(newAsset, uuid);
    scanTokens();
    setShowAddToken(false);
  };

  const handleCancelClick = () => {
    setShowAddToken(false);
  };

  return (
    <div>
      <NetworkSelectorWrapper>
        <NetworkSelectDropdown network={networkId} onChange={setNetworkId} />
      </NetworkSelectorWrapper>
      <InputField
        label={translateRaw('SYMBOL')}
        placeholder={'ETH'}
        onChange={e => setSymbol(e.target.value)}
        value={symbol}
        inputError={symbolError}
      />
      <InputField
        label={translateRaw('ADDRESS')}
        placeholder={translateRaw('ADD_TOKEN_ADDRESS_PLACEHOLDER')}
        onChange={e => setAddress(e.target.value)}
        value={address}
        inputError={addressError}
      />
      <InputField
        label={translateRaw('TOKEN_DEC')}
        placeholder={'4'}
        onChange={e => setDecimals(e.target.value)}
        value={decimals}
        inputError={decimalsError}
        type="number"
      />
      <ActionsWrapper>
        <Button onClick={handleCancelClick} secondary={true}>
          {translateRaw('ACTION_2')}
        </Button>
        <Button onClick={handleAddTokenClick}>{translateRaw('ADD_TOKEN')}</Button>
      </ActionsWrapper>
    </div>
  );
}
