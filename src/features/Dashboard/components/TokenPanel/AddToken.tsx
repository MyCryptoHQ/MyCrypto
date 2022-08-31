import { ChangeEvent, useEffect, useState } from 'react';

import styled from 'styled-components';

import { Button, DashboardPanel, InputField, NetworkSelector } from '@components';
import Icon from '@components/Icon';
import { DEFAULT_ASSET_DECIMAL, DEFAULT_NETWORK } from '@config';
import { CustomAssetService, isValidAddress, ProviderHandler } from '@services';
import { useAssets, useNetworks } from '@services/Store';
import { translateRaw } from '@translations';
import { ExtendedAsset, NetworkId, TAddress, TTicker } from '@types';
import { generateAssetUUID } from '@utils';

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
  scanTokens(asset?: ExtendedAsset): void;
}

export function AddToken(props: Props) {
  const [ticker, setTicker] = useState('');
  const [address, setAddress] = useState('');
  const [decimals, setDecimals] = useState('');
  const [symbolError, setSymbolError] = useState('');
  const [addressError, setAddressError] = useState('');
  const [decimalsError, setDecimalsError] = useState('');
  const [networkId, setNetworkId] = useState<NetworkId>(DEFAULT_NETWORK);
  const [isFetching, setFetching] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { createAsset } = useAssets();
  const { getNetworkById } = useNetworks();

  const network = getNetworkById(networkId);

  const { setShowAddToken, scanTokens, setShowDetailsView } = props;

  const validateForm = () => {
    setSymbolError('');
    setAddressError('');
    setDecimalsError('');

    let isValid = true;

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

  const handleAddTokenClick = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    const { coinGeckoId } = await CustomAssetService.instance.fetchCoingeckoID(
      address as TAddress,
      networkId
    );
    const uuid = generateAssetUUID(network.chainId, address);

    const newAsset: ExtendedAsset = {
      name: ticker,
      networkId,
      ticker: ticker as TTicker,
      type: 'erc20',
      contractAddress: address,
      decimal: parseInt(decimals, 10),
      uuid,
      isCustom: true,
      mappings: {
        coinGeckoId
      }
    };

    createAsset(newAsset);
    scanTokens(newAsset);
    setShowAddToken(false);
    setIsSubmitting(false);
  };

  const handleCancelClick = () => {
    setShowAddToken(false);
  };

  const handleChangeAddress = (event: ChangeEvent<HTMLInputElement>) =>
    setAddress(event.target.value);

  const handleChangeTicker = (event: ChangeEvent<HTMLInputElement>) =>
    setTicker(event.target.value);

  const handleChangeDecimals = (event: ChangeEvent<HTMLInputElement>) =>
    setDecimals(event.target.value);

  useEffect(() => {
    if (isValidAddress(address, network.chainId)) {
      setFetching(true);

      const provider = new ProviderHandler(network);
      provider
        .getTokenInformation(address as TAddress)
        .then((tokenInformation) => {
          if (tokenInformation) {
            const { symbol, decimals: fetchedDecimals } = tokenInformation;
            setTicker(symbol ?? ticker);
            setDecimals(fetchedDecimals?.toString() ?? decimals);
          }
        })
        .catch(() => {
          // noop
        })
        .finally(() => {
          setFetching(false);
        });
    }
  }, [network, address]);

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
        <NetworkSelector network={networkId} onChange={setNetworkId} />
      </NetworkSelectorWrapper>
      <InputField
        name="custom-token-address"
        label={translateRaw('ADDRESS')}
        placeholder={translateRaw('ADD_TOKEN_ADDRESS_PLACEHOLDER')}
        onChange={handleChangeAddress}
        value={address}
        inputError={addressError}
        disabled={isFetching || isSubmitting}
      />
      <InputField
        name="custom-token-symbol"
        label={translateRaw('SYMBOL')}
        placeholder={'ETH'}
        onChange={handleChangeTicker}
        value={ticker}
        inputError={symbolError}
        disabled={isFetching || isSubmitting}
      />
      <InputField
        name="custom-token-decimals"
        label={translateRaw('TOKEN_DEC')}
        placeholder={`${DEFAULT_ASSET_DECIMAL}`}
        onChange={handleChangeDecimals}
        value={decimals}
        inputError={decimalsError}
        type="number"
        disabled={isFetching || isSubmitting}
      />
      <ActionsWrapper>
        <Button onClick={handleCancelClick} disabled={isFetching || isSubmitting}>
          {translateRaw('CANCEL_ACTION')}
        </Button>
        <Button onClick={handleAddTokenClick} loading={isFetching || isSubmitting}>
          {translateRaw('ADD_TOKEN')}
        </Button>
      </ActionsWrapper>
    </DashboardPanel>
  );
}
