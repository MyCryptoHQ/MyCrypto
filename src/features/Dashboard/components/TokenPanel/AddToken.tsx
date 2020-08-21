import React, { useState, useContext } from 'react';
import styled from 'styled-components';
import { Button } from '@mycrypto/ui';

import { generateAssetUUID } from '@utils';
import { InputField, NetworkSelectDropdown, DashboardPanel } from '@components';
import { translateRaw } from '@translations';
import { NetworkContext, useAssets } from '@services/Store';
import { ExtendedAsset, NetworkId, TTicker } from '@types';
import { DEFAULT_NETWORK, DEFAULT_ASSET_DECIMAL } from '@config';
import { isValidAddress } from '@services';
import Icon from '@components/Icon';

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

const BackIcon = styled(Icon)`
  margin-right: 16px;
  cursor: pointer;
  width: 29px;
  height: 17px;
`;

interface Props {
  setShowDetailsView(setShowDetailsView: boolean): void;
  setShowAddToken(setShowAddToken: boolean): void;
  scanTokens(asset?: ExtendedAsset): Promise<void>;
}

export function AddToken(props: Props) {
  const [ticker, setTicker] = useState('');
  const [address, setAddress] = useState('');
  const [decimals, setDecimals] = useState('');
  const [symbolError, setSymbolError] = useState('');
  const [addressError, setAddressError] = useState('');
  const [decimalsError, setDecimalsError] = useState('');
  const [networkId, setNetworkId] = useState<NetworkId>(DEFAULT_NETWORK);

  const { createAssetWithID } = useAssets();
  const { getNetworkById } = useContext(NetworkContext);

  const { setShowAddToken, scanTokens, setShowDetailsView } = props;

  const validateForm = () => {
    setSymbolError('');
    setAddressError('');
    setDecimalsError('');

    let isValid = true;

    const network = getNetworkById(networkId);

    if (ticker.length === 0) {
      setSymbolError(translateRaw('ADD_TOKEN_NO_SYMBOL'));
      isValid = false;
    }
    if (!network || !isValidAddress(address, network.chainId)) {
      setAddressError(translateRaw('ADD_TOKEN_INVALID_ADDRESS'));
      isValid = false;
    }
    if (decimals.length === 0) {
      setDecimalsError(translateRaw('ADD_TOKEN_NO_DECIMALS'));
      isValid = false;
    }

    return isValid;
  };

  const handleAddTokenClick = () => {
    if (!validateForm()) {
      return;
    }

    const uuid = generateAssetUUID(networkId, address);
    const newAsset: ExtendedAsset = {
      name: ticker,
      networkId,
      ticker: ticker as TTicker,
      type: 'erc20',
      contractAddress: address,
      decimal: parseInt(decimals, 10),
      uuid,
      isCustom: true
    };

    createAssetWithID(newAsset, uuid);
    scanTokens(newAsset);
    setShowAddToken(false);
  };

  const handleCancelClick = () => {
    setShowAddToken(false);
  };

  return (
    <DashboardPanel
      heading={
        <div>
          <BackIcon
            type="back"
            onClick={() => {
              setShowDetailsView(false);
              setShowAddToken(false);
            }}
          />
          {translateRaw('ADD_CUSTOM_TOKEN')}
        </div>
      }
      padChildren={true}
    >
      <NetworkSelectorWrapper>
        <NetworkSelectDropdown network={networkId} onChange={setNetworkId} />
      </NetworkSelectorWrapper>
      <InputField
        label={translateRaw('SYMBOL')}
        placeholder={'ETH'}
        onChange={(e) => setTicker(e.target.value)}
        value={ticker}
        inputError={symbolError}
      />
      <InputField
        label={translateRaw('ADDRESS')}
        placeholder={translateRaw('ADD_TOKEN_ADDRESS_PLACEHOLDER')}
        onChange={(e) => setAddress(e.target.value)}
        value={address}
        inputError={addressError}
      />
      <InputField
        label={translateRaw('TOKEN_DEC')}
        placeholder={`${DEFAULT_ASSET_DECIMAL}`}
        onChange={(e) => setDecimals(e.target.value)}
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
    </DashboardPanel>
  );
}
