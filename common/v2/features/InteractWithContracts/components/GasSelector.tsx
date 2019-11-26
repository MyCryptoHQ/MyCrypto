import React, { useEffect } from 'react';

import styled from 'styled-components';

import { InputField, Typography, Checkbox } from 'v2/components';

const Wrapper = styled.div`
  display: flex;
  width: 100%;
  margin-top: 16px;
  flex-direction: column;
`;

const CustomLabel = styled(Typography)`
  font-size: 16px;
`;

const FieldWrapper = styled.div``;
interface Props {
  gasPrice: string;
  gasLimit: string;
  nonce: string;
  isAutoGasSet: boolean;
  handleGasPriceChange(e: React.KeyboardEvent<HTMLInputElement>): void;
  handleGasLimitChange(e: React.KeyboardEvent<HTMLInputElement>): void;
  handleNonceChange(e: React.KeyboardEvent<HTMLInputElement>): void;
  estimateGasHandle(forceEstimate?: boolean): Promise<void>;
  setIsAutoGasSet(value: boolean): void;
}

export default function GasSelector(props: Props) {
  const {
    gasPrice,
    gasLimit,
    nonce,
    isAutoGasSet,
    handleGasPriceChange,
    handleGasLimitChange,
    handleNonceChange,
    setIsAutoGasSet,
    estimateGasHandle
  } = props;

  useEffect(() => {
    estimateGasHandle();
  }, []);

  const setAutoGasSet = () => {
    if (!isAutoGasSet) {
      estimateGasHandle(true);
    }

    setIsAutoGasSet(!isAutoGasSet);
  };

  return (
    <Wrapper>
      <Checkbox
        onChange={setAutoGasSet}
        checked={isAutoGasSet}
        name="autoGasSet"
        label="Automatically Calculate Gas Limit"
      />
      <FieldWrapper>
        <InputField
          label={<CustomLabel>Gas Price</CustomLabel>}
          value={gasPrice}
          onChange={handleGasPriceChange}
        />
      </FieldWrapper>
      <FieldWrapper>
        <InputField
          label={<CustomLabel>Gas Limit</CustomLabel>}
          value={gasLimit}
          onChange={handleGasLimitChange}
          disabled={isAutoGasSet}
        />
      </FieldWrapper>
      <FieldWrapper>
        <InputField
          label={<CustomLabel>Nonce</CustomLabel>}
          value={nonce}
          onChange={handleNonceChange}
        />
      </FieldWrapper>
    </Wrapper>
  );
}
