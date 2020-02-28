import React, { useState } from 'react';
import styled from 'styled-components';
import { Button } from '@mycrypto/ui';

import translate from 'v2/translations';
import { StoreAccount, TSymbol, TBN } from 'v2/types';
import { COLORS } from 'v2/theme';
import { truncate } from 'v2/utils';
import { Account, Typography, Currency, Steps, Step } from 'v2/components';

import { default as SwapFromToDiagram } from './SwapFromToDiagram';
import { ISwapAsset } from '../SwapAssets/types';

const ConversionRateBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: ${COLORS.GREY_LIGHTEST};
  font-size: 20px;
  font-weight: bold;
  height: 150px;
`;

const ConversionLabel = styled(Typography)`
  color: ${COLORS.GREY};
`;

const STitle = styled(Typography)`
  margin-top: -3px;
  font-size: 1rem;
`;

const Row = styled.div`
  width: 100%;
`;

const Step1 = ({ fromSymbol, onSuccess }: { fromSymbol: TSymbol; onSuccess(): void }) => {
  return (
    <Row>
      <Typography as="p">{`Before converting ${fromSymbol} for the first time your first need to authorize the DEXAG contract`}</Typography>
      <Button onClick={onSuccess}>Authorize</Button>
    </Row>
  );
};
const Step2 = ({
  fromSymbol,
  toSymbol,
  fromAmount,
  toAmount,
  onSuccess
}: {
  fromSymbol: TSymbol;
  toSymbol: TSymbol;
  fromAmount: TBN;
  toAmount: TBN;
  onSuccess(): void;
}) => {
  const isSubmitting = '';
  return (
    <Row>
      <SwapFromToDiagram
        fromSymbol={fromSymbol}
        toSymbol={toSymbol}
        fromAmount={fromAmount.toString()}
        toAmount={toAmount.toString()}
      />
      <ConversionRateBox>
        <ConversionLabel bold={true} value={translate('SWAP_RATE')} fontSize="0.65em" />
        <div>
          <Currency bold={true} amount="1" symbol={fromSymbol} decimals={6} /> ≈{' '}
          <Currency bold={true} amount={toAmount.toString()} symbol={toSymbol} decimals={8} />
        </div>
      </ConversionRateBox>
      <Typography as="p">{`Confirm the exchange from ${fromSymbol} to ${toSymbol}`}</Typography>
      <Button onClick={onSuccess}>
        {isSubmitting ? translate('SUBMITTING') : translate('CONFIRM_AND_SEND')}
      </Button>
    </Row>
  );
};

interface Props {
  fromAsset: ISwapAsset;
  toAsset: ISwapAsset;
  fromAmount: TBN;
  toAmount: TBN;
  account: StoreAccount;
  exchangeRate: TBN;
  isSubmitting: boolean;
  isMultiStep: boolean;
  onSuccess(): void;
}

export default function ConfirmSwap({
  fromAsset,
  toAsset,
  fromAmount,
  toAmount,
  account,
  onSuccess,
  isMultiStep
}: Props) {
  const [currentStep, setCurrentStep] = useState(0);
  const sendTx = () => {
    setCurrentStep(currentStep + 1);
    onSuccess();
  };

  return (
    <>
      <Account address={account.address} title={account.label} truncate={truncate} />
      {isMultiStep ? (
        <Steps direction="vertical" current={currentStep} initial={0}>
          <Step
            title={
              <STitle as="div" bold={true}>
                Enable Eth
              </STitle>
            }
            description={
              currentStep === 0 && <Step1 onSuccess={sendTx} fromSymbol={fromAsset.symbol} />
            }
          />
          <Step
            title={
              <STitle as="div" bold={true}>
                Convert tokens
              </STitle>
            }
            description={
              currentStep === 1 && (
                <Step2
                  fromSymbol={fromAsset.symbol}
                  toSymbol={toAsset.symbol}
                  fromAmount={fromAmount}
                  toAmount={toAmount}
                  onSuccess={sendTx}
                />
              )
            }
          />
        </Steps>
      ) : (
        <Step2
          fromSymbol={fromAsset.symbol}
          toSymbol={toAsset.symbol}
          fromAmount={fromAmount}
          toAmount={toAmount}
          onSuccess={sendTx}
        />
      )}
    </>
  );
}
