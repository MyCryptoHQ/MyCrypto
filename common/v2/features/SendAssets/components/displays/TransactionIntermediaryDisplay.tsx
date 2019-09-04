import { Asset } from 'v2/types';
import React from 'react';
import styled from 'styled-components';
import { Copyable } from '@mycrypto/ui';

interface Props {
  asset: Asset;
}

const IntermediaryDisplay = styled('div')`
  display: flex;
  border: 1px solid #55b6e2;
  box-sizing: border-box;
  box-shadow: inset 0px 1px 1px rgba(63, 63, 68, 0.05);
  border-radius: 2px;
`;

const IntermediaryDisplayBox = styled('div')`
  font-size: 16px;
  line-height: 21px;
  margin-bottom: 12px;
  margin-top: 12px;
  margin-left: 35px;
  margin-right: 35px;
`;

const IntermediaryDisplayLabel = styled('div')`
  align-items: center;
  display: flex;
  flex-direction: row;
  color: #55b6e2;
`;

const IntermediaryDisplayContract = styled(Copyable)`
  font-size: 16px;
  align-items: center;
  display: flex;
  flex-direction: row;
  color: #282d32;
`;

const truncate = (children: string) => {
  return [children.substring(0, 6), '…', children.substring(children.length - 4)].join('');
};

function TransactionIntermediaryDisplay({ asset }: Props) {
  return (
    <>
      {asset.contractAddress && (
        <div className="ConfirmTransaction-row-column">
          <IntermediaryDisplay>
            <IntermediaryDisplayBox>
              <IntermediaryDisplayLabel>{`Transaction performed via ${asset.ticker} contract:`}</IntermediaryDisplayLabel>
              <IntermediaryDisplayContract text={asset.contractAddress} truncate={truncate} />
            </IntermediaryDisplayBox>
          </IntermediaryDisplay>
        </div>
      )}
    </>
  );
}

export default TransactionIntermediaryDisplay;
