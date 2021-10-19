import { KeyboardEvent, useEffect, useState } from 'react';

import styled from 'styled-components';

import { Checkbox, InputField, Typography } from '@components';
import { getWalletConfig } from '@config';
import { isEIP1559Supported } from '@helpers';
import { fetchUniversalGasPriceEstimate, getGasEstimate } from '@services/ApiService/Gas';
import { getNonce } from '@services/EthService';
import { COLORS, monospace } from '@theme';
import translate, { translateRaw } from '@translations';
import { ISimpleTxForm, Network, StoreAccount } from '@types';
import { inputGasPriceToHex, inputNonceToHex } from '@utils';
import { mapObjIndexed } from '@vendor';

const { GREY_LIGHTER } = COLORS;

const Wrapper = styled.div`
  display: flex;
  width: 100%;
  margin-top: 16px;
  flex-direction: column;
`;

const CustomLabel = styled(Typography)`
  font-size: 1em;
`;

const FieldWrapper = styled.div`
  input {
    font-family: ${monospace};
    :disabled {
      background-color: ${GREY_LIGHTER};
    }
  }
`;

interface Props {
  gasPrice: string;
  maxFeePerGas: string;
  maxPriorityFeePerGas: string;
  gasLimit: string;
  nonce: string;
  account: StoreAccount;
  network: Network;
  estimateGasCallProps: TObject;
  setGasPrice(
    gas: Partial<Pick<ISimpleTxForm, 'gasPrice' | 'maxFeePerGas' | 'maxPriorityFeePerGas'>>
  ): void;
  setGasLimit(gasLimit: string): void;
  setNonce(nonce: string): void;
}

export default function GasSelector({
  gasPrice,
  maxFeePerGas,
  maxPriorityFeePerGas,
  gasLimit,
  nonce,
  setGasPrice,
  setGasLimit,
  setNonce,
  estimateGasCallProps,
  account,
  network
}: Props) {
  const [isAutoGasSet, setIsAutoGasSet] = useState(true);

  const walletConfig = getWalletConfig(account.wallet);
  const supportsNonce = walletConfig.flags.supportsNonce;

  useEffect(() => {
    if (isAutoGasSet) {
      estimateGas();
    }
  }, [estimateGasCallProps, isAutoGasSet]);

  const toggleIsAutoGasSet = () => {
    setIsAutoGasSet(!isAutoGasSet);
  };

  const handleGasPriceChange = (e: KeyboardEvent<HTMLInputElement>) =>
    setGasPrice({
      gasPrice: e.currentTarget.value
    });

  const handleMaxGasPerFeeChange = (e: KeyboardEvent<HTMLInputElement>) =>
    setGasPrice({
      maxFeePerGas: e.currentTarget.value
    });

  const handleMaxPriorityFeePerGasChange = (e: KeyboardEvent<HTMLInputElement>) =>
    setGasPrice({
      maxPriorityFeePerGas: e.currentTarget.value
    });

  const handleGasLimitChange = (e: KeyboardEvent<HTMLInputElement>) =>
    setGasLimit(e.currentTarget.value);

  const handleNonceChange = (e: KeyboardEvent<HTMLInputElement>) => setNonce(e.currentTarget.value);

  const estimateGas = async () => {
    if (!account) {
      return;
    }

    try {
      const { network } = account;
      const [gasEstimate, fetchedNonce] = await Promise.all([
        fetchUniversalGasPriceEstimate(network, account),
        getNonce(network, account.address)
      ]);
      const { estimate: gas } = gasEstimate;
      setGasPrice({
        gasPrice: gas.gasPrice ?? '',
        maxFeePerGas: gas.maxFeePerGas ?? '',
        maxPriorityFeePerGas: gas.maxPriorityFeePerGas ?? ''
      });
      const txGas = mapObjIndexed((v) => v && inputGasPriceToHex(v), gas);
      setNonce(fetchedNonce.toString());

      const txConfig: any = {
        ...estimateGasCallProps,
        ...txGas,
        nonce: inputNonceToHex(fetchedNonce.toString()),
        chainId: network.chainId
      };
      const fetchedGasLimit = await getGasEstimate(network, txConfig);
      setGasLimit(fetchedGasLimit);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Wrapper>
      <Checkbox
        onChange={toggleIsAutoGasSet}
        checked={isAutoGasSet}
        name="autoGasSet"
        label={translateRaw('TRANS_AUTO_GAS_TOGGLE')}
      />
      {isEIP1559Supported(network, account) ? (
        <>
          <FieldWrapper>
            <InputField
              name="maxFeePerGas"
              label={<CustomLabel>{translateRaw('MAX_FEE_PER_GAS')}</CustomLabel>}
              value={maxFeePerGas}
              onChange={handleMaxGasPerFeeChange}
              inputMode="decimal"
            />
          </FieldWrapper>
          <FieldWrapper>
            <InputField
              name="maxPriorityFeePerGas"
              label={<CustomLabel>{translateRaw('MAX_PRIORITY_FEE')}</CustomLabel>}
              value={maxPriorityFeePerGas}
              onChange={handleMaxPriorityFeePerGasChange}
              inputMode="decimal"
            />
          </FieldWrapper>
        </>
      ) : (
        <FieldWrapper>
          <InputField
            name="gasPrice"
            label={<CustomLabel>{translateRaw('OFFLINE_STEP2_LABEL_3')}</CustomLabel>}
            value={gasPrice}
            onChange={handleGasPriceChange}
            inputMode="decimal"
          />
        </FieldWrapper>
      )}
      <FieldWrapper>
        <InputField
          name="gasLimit"
          label={<CustomLabel>{translateRaw('OFFLINE_STEP2_LABEL_4')}</CustomLabel>}
          value={gasLimit}
          onChange={handleGasLimitChange}
          disabled={isAutoGasSet}
          inputMode="decimal"
        />
      </FieldWrapper>
      <FieldWrapper>
        <InputField
          name="nonce"
          label={<CustomLabel>{translateRaw('OFFLINE_STEP2_LABEL_5')}</CustomLabel>}
          value={nonce}
          onChange={handleNonceChange}
          inputMode="decimal"
          disabled={!supportsNonce}
          inputError={
            !supportsNonce
              ? translate('DISABLED_NONCE', { $provider: walletConfig.name })
              : undefined
          }
        />
      </FieldWrapper>
    </Wrapper>
  );
}
