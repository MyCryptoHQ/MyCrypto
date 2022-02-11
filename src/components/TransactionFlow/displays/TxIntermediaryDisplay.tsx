import { Copyable } from '@mycrypto/ui';
import styled from 'styled-components';

import { Icon, Tooltip } from '@components';
import { COLORS } from '@theme';
import { translateRaw } from '@translations';

interface Props {
  address: string;
  contractName?: string;
  label?: string;
}

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  div > button {
    font-size: 16px;
  }
  svg > path {
    fill: ${COLORS.BLUE_SKY};
  }
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
  align-items: center;
  display: flex;
  flex-direction: row;
`;

function TxIntermediaryDisplay({
  address,
  contractName = translateRaw('UNKNOWN').toLowerCase(),
  label
}: Props) {
  return (
    <>
      {address && (
        <IntermediaryDisplay>
          <Wrapper>
            <div>
              <IntermediaryDisplayLabel>
                {label ??
                  translateRaw('TRANSACTION_PERFORMED_VIA_CONTRACT', {
                    $contractName: contractName
                  })}
                :
              </IntermediaryDisplayLabel>
              <IntermediaryDisplayContract text={address} isCopyable={true} />
            </div>
            <Tooltip tooltip={translateRaw('TOKEN_SEND_TOOLTIP')}>
              <Icon type="questionWhite" />
            </Tooltip>
          </Wrapper>
        </IntermediaryDisplay>
      )}
    </>
  );
}

export default TxIntermediaryDisplay;
