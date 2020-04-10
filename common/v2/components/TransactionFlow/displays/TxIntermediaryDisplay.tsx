import React from 'react';
import styled from 'styled-components';
import { Copyable } from '@mycrypto/ui';

import { translateRaw } from 'v2/translations';
import { Tooltip } from 'v2/components';

interface Props {
  address: string;
  contractName: string;
}

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const IntermediaryDisplay = styled('div')`
  max-width: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  border: 1px solid #55b6e2;
  box-sizing: border-box;
  box-shadow: inset 0px 1px 1px rgba(63, 63, 68, 0.05);
  border-radius: 2px;
  line-height: 21px;
  padding: 12px;
  font-size: 16px;
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

function TxIntermediaryDisplay({ address, contractName }: Props) {
  return (
    <>
      {address && (
        <IntermediaryDisplay>
          <Wrapper>
            <div>
              <IntermediaryDisplayLabel>
                {translateRaw('TRANSACTION_PERFORMED_VIA_CONTRACT', {
                  $contractName: contractName
                })}
                :
              </IntermediaryDisplayLabel>
              <IntermediaryDisplayContract text={address} isCopyable={true} />
            </div>
            <Tooltip tooltip={translateRaw('TOKEN_SEND_TOOLTIP')} />
          </Wrapper>
        </IntermediaryDisplay>
      )}
    </>
  );
}

export default TxIntermediaryDisplay;
