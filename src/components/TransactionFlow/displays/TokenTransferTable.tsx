import { useState } from 'react';

import { toChecksumAddress } from '@mycrypto/wallets';
import styled from 'styled-components';

import { Amount, Box, Icon } from '@components';
import { EthAddress } from '@components/EthAddress';
import { Text } from '@components/NewTypography'
import { getFiat } from '@config/fiats';
import { BREAK_POINTS, COLORS, SPACING } from '@theme';
import { translateRaw } from '@translations';
import { ISettings } from '@types';
import { bigify, convertToFiat } from '@utils';

import { ITxTransferEvent } from '../TxReceipt';

interface Props {
  valueTransfers: ITxTransferEvent[];
  settings: ISettings;
}

const ERC20Box = styled(Box)`
  padding: 12px;
  margin: ${SPACING.MD};
  background-color: ${COLORS.GREY_LIGHTEST};
`

const Table = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const Body = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  @media screen and (max-width: ${BREAK_POINTS.SCREEN_SM}) {
    border-radius: 1.3px;
    & > *:first-child {
      border-top: 1px solid ${COLORS.GREY_ATHENS};
    }
  }
`;

const Row = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  min-height: 60px;
  width: 100%;
  gap: ${SPACING.XS};
  & > *:last-child {
    flex: 1;
  }
  @media screen and (max-width: ${BREAK_POINTS.SCREEN_SM}) {
    flex-direction: column;
    align-items: flex-start;
    position: relative;
    width: 100%;
    border-bottom: 1px solid ${COLORS.GREY_ATHENS};
    padding: ${SPACING.SM} 0 ${SPACING.SM} 0;
    & > *:last-child {
      align-self: flex-end;
      flex: 1;
      border-bottom: 0px;
    }
  }
`;

const SText = styled(Text)`
  margin: ${SPACING.NONE} ${SPACING.XS} ${SPACING.NONE} ${SPACING.NONE};
`

const STransferAmounts = styled(Text)`
  /* Night Mode/ Accent */
  padding: 1px 4px;
  background: #8F8F8F;
  font-weight: bold;
  border-radius: 5px;
  color: white;
  margin: ${SPACING.NONE};
`

const LabelBox = styled(Box)`
  gap: ${SPACING.XS};
`

const SMoreIconWrapper = styled.div`
  flex: 1;
  display: flex;
  justify-content: flex-end;
`

export const TokenTransferTable = ({ valueTransfers, settings }: Props) => {
  const [isExpanded, setExpanded] = useState(false)
  const tokenTransfers = valueTransfers.filter(t => t.asset.type === 'erc20').filter(({ amount }) => amount)
  console.debug('tx: ', tokenTransfers)
  return (
    <ERC20Box>
      <LabelBox variant="rowAlign">
        <Text variant="subHeading" mb={SPACING.NONE}>{translateRaw('TOKENS_TRANSFERRED')}:</Text>
        <STransferAmounts>{`${tokenTransfers.length}`}</STransferAmounts>
        <SMoreIconWrapper>
          <Icon
            type="more"
            alt="More"
            isExpanded={isExpanded}
            rotate90Deg={true}
            onClick={() => {
              setExpanded(!isExpanded);
            }}
            height="1em"
            color={COLORS.BLUE_BRIGHT}
          />
        </SMoreIconWrapper>
      </LabelBox>
      {isExpanded && <Table>
        <Body>
          {tokenTransfers.map((transfer, idx) => (
            <Row key={idx}>
              <Box variant='rowAlign'>
                <SText>
                  {translateRaw('RECENT_TRANSACTIONS_FROM_ADDRESS')}:
                </SText>
                <EthAddress
                  address={toChecksumAddress(transfer.from)}
                  truncate={true}
                  textColor={COLORS.BLUE_SKY}
                  iconColor={COLORS.BLUE_SKY}
                  fontSize="16px"
                />
              </Box>
              <Box variant='rowAlign'>
                <SText>
                  {translateRaw('RECENT_TRANSACTIONS_TO_ADDRESS')}:
                </SText>
                <EthAddress
                  address={toChecksumAddress(transfer.to)}
                  truncate={true}
                  textColor={COLORS.BLUE_SKY}
                  iconColor={COLORS.BLUE_SKY}
                  fontSize="16px"
                />
              </Box>
              {transfer.amount ? <Amount
                // Adapt alignment for mobile display
                alignLeft={false}
                asset={{ ...transfer.asset, amount: bigify(transfer.amount).toFixed(5) }}
                fiat={{
                  symbol: getFiat(settings).symbol,
                  ticker: getFiat(settings).ticker,
                  amount: convertToFiat(transfer.amount, transfer.rate).toFixed(2)
                }}
              /> : <Amount
                // Adapt alignment for mobile display
                alignLeft={false}
                text={transfer.asset.name}
              />}
            </Row>
          ))}
        </Body>
      </Table>}
    </ERC20Box>
  );
};

