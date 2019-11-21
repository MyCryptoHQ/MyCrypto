import React from 'react';

import styled from 'styled-components';
import { InputField, Typography } from 'v2/components';

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
  handleGasPriceChange(e: React.KeyboardEvent<HTMLInputElement>): void;
  handleGasLimitChange(e: React.KeyboardEvent<HTMLInputElement>): void;
  handleNonceChange(e: React.KeyboardEvent<HTMLInputElement>): void;
}

export default function GasSelector(props: Props) {
  const {
    gasPrice,
    gasLimit,
    nonce,
    handleGasPriceChange,
    handleGasLimitChange,
    handleNonceChange
  } = props;

  return (
    <Wrapper>
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
