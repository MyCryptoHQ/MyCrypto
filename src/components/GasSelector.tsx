import { KeyboardEvent, useEffect, useState } from 'react';

import styled from 'styled-components';

import { Checkbox, InputField, Typography } from '@components';
import { getWalletConfig } from '@config';
import { fetchUniversalGasPriceEstimate, getGasEstimate, getNonce } from '@services';
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
  setGasPrice(gas: Pick<ISimpleTxForm, 'gasPrice' | 'maxFeePerGas' | 'maxPriorityFeePerGas'>): void;
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

  const handleGasPriceChange = (e: KeyboardEvent<HTMLInputElement>) => {
    setGasPrice({
      gasPrice: (e.target as HTMLTextAreaElement).value,
      maxFeePerGas,
      maxPriorityFeePerGas
    });
  };

  const handleMaxGasPerFeeChange = (e: KeyboardEvent<HTMLInputElement>) => {
    setGasPrice({
      gasPrice,
      maxFeePerGas: (e.target as HTMLTextAreaElement).value,
      maxPriorityFeePerGas
    });
  };

  const handleMaxPriorityFeePerGasChange = (e: KeyboardEvent<HTMLInputElement>) => {
    setGasPrice({
      gasPrice,
      maxFeePerGas,
      maxPriorityFeePerGas: (e.target as HTMLTextAreaElement).value
    });
  };

  const handleGasLimitChange = (e: KeyboardEvent<HTMLInputElement>) => {
    setGasLimit((e.target as HTMLTextAreaElement).value);
  };

  const handleNonceChange = (e: KeyboardEvent<HTMLInputElement>) => {
    setNonce((e.target as HTMLTextAreaElement).value);
  };

  const estimateGas = async () => {
    if (!account) {
      return;
    }

    try {
      const { network } = account;
      const gas = await fetchUniversalGasPriceEstimate(network);
      setGasPrice(gas);
      const txGas = mapObjIndexed((v) => v && inputGasPriceToHex(v), gas);
      const fetchedNonce = await getNonce(network, account.address);
      setNonce(fetchedNonce.toString());

      const txConfig: any = Object.assign({}, estimateGasCallProps, {
        ...txGas,
        nonce: inputNonceToHex(fetchedNonce.toString()),
        chainId: network.chainId
      });
      const fetchedGasLimit = await getGasEstimate(network, txConfig);
      setGasLimit(fetchedGasLimit);
    } catch (e) {
      console.debug(e);
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
      {network.supportsEIP1559 ? (
        <>
          <FieldWrapper>
            <InputField
              label={<CustomLabel>{translateRaw('MAX_FEE_PER_GAS')}</CustomLabel>}
              value={maxFeePerGas}
              onChange={handleMaxGasPerFeeChange}
              inputMode="decimal"
            />
          </FieldWrapper>
          <FieldWrapper>
            <InputField
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
            label={<CustomLabel>{translateRaw('OFFLINE_STEP2_LABEL_3')}</CustomLabel>}
            value={gasPrice}
            onChange={handleGasPriceChange}
            inputMode="decimal"
          />
        </FieldWrapper>
      )}
      <FieldWrapper>
        <InputField
          label={<CustomLabel>{translateRaw('OFFLINE_STEP2_LABEL_4')}</CustomLabel>}
          value={gasLimit}
          onChange={handleGasLimitChange}
          disabled={isAutoGasSet}
          inputMode="decimal"
        />
      </FieldWrapper>
      <FieldWrapper>
        <InputField
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
