import React, { useEffect, useState } from 'react';

import BN from 'bn.js';
import { addHexPrefix } from 'ethereumjs-util';
import styled from 'styled-components';

import { Checkbox, InputField, Typography } from '@components';
import { getWalletConfig } from '@config';
import { fetchGasPriceEstimates, getGasEstimate, getNonce } from '@services';
import { COLORS, monospace } from '@theme';
import translate, { translateRaw } from '@translations';
import { StoreAccount } from '@types';
import { hexWeiToString, inputGasPriceToHex } from '@utils';

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
  gasLimit: string;
  nonce: string;
  account: StoreAccount;
  estimateGasCallProps: TObject;
  setGasPrice(gasPrice: string): void;
  setGasLimit(gasLimit: string): void;
  setNonce(nonce: string): void;
}

export default function GasSelector({
  gasPrice,
  gasLimit,
  nonce,
  setGasPrice,
  setGasLimit,
  setNonce,
  estimateGasCallProps,
  account
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

  const handleGasPriceChange = (e: React.KeyboardEvent<HTMLInputElement>) => {
    setGasPrice((e.target as HTMLTextAreaElement).value);
  };

  const handleGasLimitChange = (e: React.KeyboardEvent<HTMLInputElement>) => {
    setGasLimit((e.target as HTMLTextAreaElement).value);
  };

  const handleNonceChange = (e: React.KeyboardEvent<HTMLInputElement>) => {
    setNonce((e.target as HTMLTextAreaElement).value);
  };

  const estimateGas = async () => {
    if (!account) {
      return;
    }

    try {
      const { network } = account;
      const { fast } = await fetchGasPriceEstimates(network);
      setGasPrice(fast.toString());
      const fetchedGasPrice = hexWeiToString(inputGasPriceToHex(fast.toString()));
      const fetchedNonce = await getNonce(network, account.address);
      setNonce(fetchedNonce.toString());

      const txConfig: any = Object.assign({}, estimateGasCallProps, {
        gasPrice: addHexPrefix(new BN(fetchedGasPrice).toString(16)),
        nonce: fetchedNonce,
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
      <FieldWrapper>
        <InputField
          label={<CustomLabel>{translateRaw('OFFLINE_STEP2_LABEL_3')}</CustomLabel>}
          value={gasPrice}
          onChange={handleGasPriceChange}
          inputMode="decimal"
        />
      </FieldWrapper>
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
