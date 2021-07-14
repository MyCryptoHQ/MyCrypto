import { ReactNode } from 'react';

import { scale } from '@mycrypto/ui';
import styled, { css } from 'styled-components';

import { isEmpty } from '@vendor';

import Typography from './Typography';

type StackedCardEntry = string | ReactNode;

export interface Props {
  heading: ReactNode;
  entries: StackedCardEntry[][];
  icons?: ReactNode[];
}

const StackedCardContainer = styled.section`
  padding: 16px;
  border-bottom: 0.0625em solid #dde3ee;
`;

const StackedCardHead = styled.section`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const StackedCardHeading = styled(Typography).attrs({
  as: 'header'
})`
  display: flex;
  align-items: center;
  margin: 0;
  font-weight: bold;
  line-height: 1.31;
  font-size: ${scale(1)};
`;

// Arbitrary positioning of icons to respect AddressBook and AccountList designs
const StackedCardIcons = styled.div`
  height: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  > * {
    width: 15px;
  }
  ${(props) =>
    props.qty &&
    css`
      width: calc(15px * ${props.qty || 1});
    `}
  ${(props: { qty: number }) =>
    props.qty === 2 &&
    css`
      > *:first-child {
        margin-bottom: -2px;
      }
      > *:last-child {
        margin-left: 8px;
      }
    `}
`;

const StackedCardBody = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 1.5625em;
`;

const StackedCardEntry = styled.dl`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const StackedCardLabel = styled(Typography).attrs({
  as: 'dt'
})`
  flex: 0.5;
  margin: 0;
  color: ${(props) => props.theme.cardText};
  letter-spacing: 0.106875em;
  text-transform: uppercase;
  font-weight: bold;
  font-size: 0.856em;
  line-height: 1em;
`;

const StackedCardValue = styled(Typography).attrs({
  as: 'dd'
})`
  flex: 1;
  margin: 0;
`;

export const StackedCard = ({ heading, icons = [], entries, ...rest }: Props) => {
  return (
    <StackedCardContainer {...rest}>
      <StackedCardHead>
        <StackedCardHeading>{heading}</StackedCardHeading>
        <StackedCardIcons qty={icons.length}>{icons}</StackedCardIcons>
      </StackedCardHead>
      <StackedCardBody>
        {entries.map(([label, value], index) => (
          <StackedCardEntry key={index}>
            {!isEmpty(label) && <StackedCardLabel>{label}</StackedCardLabel>}
            <StackedCardValue>{value}</StackedCardValue>
          </StackedCardEntry>
        ))}
      </StackedCardBody>
    </StackedCardContainer>
  );
};

export default StackedCard;
