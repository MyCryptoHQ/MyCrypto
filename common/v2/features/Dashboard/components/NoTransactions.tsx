import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

import translate from 'v2/translations';
import { COLORS, FONT_SIZE, SPACING } from 'v2/theme';

import addIcon from 'common/assets/images/icn-add-assets.svg';

const { BRIGHT_SKY_BLUE } = COLORS;

const NoTransactionsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0 ${SPACING.BASE} ${SPACING.BASE} ${SPACING.BASE};
  width: 100%;
`;

const NoTransactionsCenter = styled.div`
  align-items: center;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-top: ${SPACING.BASE};
  margin-bottom: ${SPACING.LG};
`;

const NoTransactionsHeading = styled.div`
  color: ${COLORS.BLUE_GREY};
  font-size: ${FONT_SIZE.XL};
  font-weight: bold;
  text-align: center;
  margin-top: ${SPACING.SM};
  margin-bottom: ${SPACING.SM};
`;

const NoTransactionsDescription = styled.div`
  color: ${COLORS.BLUE_GREY};
  text-align: center;
  font-weight: normal;

  > a {
    color: ${BRIGHT_SKY_BLUE};
  }
`;

const PlusIcon = styled.img`
  width: 60px;
  height: 60px;
`;

function NoTransactions() {
  return (
    <NoTransactionsWrapper>
      <Link to="/send">
        <NoTransactionsCenter>
          <PlusIcon src={addIcon} />
          <NoTransactionsHeading>
            {translate('RECENT_TX_LIST_NO_TRANSACTIONS')}
          </NoTransactionsHeading>
          <NoTransactionsDescription>
            {translate('RECENT_TX_LIST_NO_TRANSACTIONS_MORE')}
          </NoTransactionsDescription>
        </NoTransactionsCenter>
      </Link>
    </NoTransactionsWrapper>
  );
}

export default NoTransactions;
