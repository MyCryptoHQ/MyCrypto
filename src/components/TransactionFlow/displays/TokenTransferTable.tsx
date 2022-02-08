import { useState } from 'react';

import { toChecksumAddress } from '@mycrypto/wallets';
import styled, { css } from 'styled-components';

import { Amount, Box, Icon } from '@components';
import { EthAddress } from '@components/EthAddress';
import { Text } from '@components/NewTypography';
import { getFiat } from '@config/fiats';
import { COLORS, SPACING } from '@theme';
import { translateRaw } from '@translations';
import { ISettings } from '@types';
import { bigify, convertToFiat } from '@utils';

import { ITxTransferEvent } from '../TxReceipt';

interface Props {
  isMobile: boolean;
  valueTransfers: ITxTransferEvent[];
  settings: ISettings;
}

const ERC20Box = styled(Box)`
  padding: 12px;
  margin: ${SPACING.MD};
  background-color: ${COLORS.GREY_LIGHTEST};
`;

const Body = styled(Box)<{ isMobile: boolean }>`
  ${({ isMobile }) =>
    isMobile &&
    css`
      border-radius: 1.3px;
      & > *:first-child {
        border-top: 1px solid ${COLORS.GREY_ATHENS};
      }
    `}
`;

const Row = styled(Box)<{ isMobile: boolean }>`
  gap: ${SPACING.XS};
  & > *:last-child {
    flex: 1;
  }
  ${({ isMobile }) =>
    isMobile &&
    css`
      padding: ${SPACING.SM} ${SPACING.NONE};
      position: relative;
      width: 100%;
      border-bottom: 1px solid ${COLORS.GREY_ATHENS};
      & > *:last-child {
        align-self: flex-end;
        flex: 1;
        border-bottom: 0px;
      }
    `}
`;

const SText = styled(Text)`
  margin: ${SPACING.NONE} ${SPACING.XS} ${SPACING.NONE} ${SPACING.NONE};
`;

const STransferAmounts = styled(Text)`
  padding: 1px 4px;
  background: ${COLORS.LEMON_GRASS};
  font-weight: bold;
  border-radius: 5px;
  color: white;
  margin: ${SPACING.NONE};
`;

const LabelBox = styled(Box)`
  gap: ${SPACING.XS};
`;

export const TokenTransferTable = ({ isMobile, valueTransfers, settings }: Props) => {
  const [isExpanded, setExpanded] = useState(false);
  const tokenTransfers = valueTransfers.filter((t) => t.asset.type === 'erc20');
  const toggleExpanded = () => setExpanded(!isExpanded);
  return (
    <ERC20Box>
      <LabelBox variant="rowAlign">
        <Text variant="subHeading" mb={SPACING.NONE}>
          {translateRaw('TOKENS_TRANSFERRED')}:
        </Text>
        <STransferAmounts>{tokenTransfers.length}</STransferAmounts>
        <Box flex="1" variant="alignRight">
          <Icon
            type="more"
            alt="More"
            isExpanded={isExpanded}
            rotate90Deg={true}
            onClick={toggleExpanded}
            height="1em"
            color={COLORS.BLUE_BRIGHT}
          />
        </Box>
      </LabelBox>
      {isExpanded && (
        <Box variant="columnAlign">
          <Body isMobile={isMobile} minHeight={SPACING.XL} variant="columnAlignLeft" width="100%">
            {tokenTransfers.map((transfer, idx) => (
              <Row
                key={idx}
                isMobile={isMobile}
                minHeight={SPACING.XL}
                variant={isMobile ? 'columnAlignLeft' : 'rowAlign'}
              >
                <Box variant="rowAlign">
                  <SText>{translateRaw('RECENT_TRANSACTIONS_FROM_ADDRESS')}:</SText>
                  <EthAddress
                    address={toChecksumAddress(transfer.from)}
                    truncate={true}
                    textColor={COLORS.BLUE_SKY}
                    iconColor={COLORS.BLUE_SKY}
                    fontSize="16px"
                  />
                </Box>
                <Box variant="rowAlign">
                  <SText>{translateRaw('RECENT_TRANSACTIONS_TO_ADDRESS')}:</SText>
                  <EthAddress
                    address={toChecksumAddress(transfer.to)}
                    truncate={true}
                    textColor={COLORS.BLUE_SKY}
                    iconColor={COLORS.BLUE_SKY}
                    fontSize="16px"
                  />
                </Box>
                {transfer.amount ? (
                  <Amount
                    // Adapt alignment for mobile display
                    alignLeft={false}
                    asset={{ ...transfer.asset, amount: bigify(transfer.amount).toFixed(5) }}
                    fiat={{
                      symbol: getFiat(settings).symbol,
                      ticker: getFiat(settings).ticker,
                      amount: convertToFiat(transfer.amount, transfer.rate).toFixed(2)
                    }}
                  />
                ) : (
                  <Amount
                    // Adapt alignment for mobile display
                    alignLeft={false}
                    text={transfer.asset.name}
                  />
                )}
              </Row>
            ))}
          </Body>
        </Box>
      )}
    </ERC20Box>
  );
};
