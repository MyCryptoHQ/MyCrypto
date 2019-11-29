import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

import translate from 'v2/translations';
import { COLORS } from 'v2/theme';

import addIcon from 'common/assets/images/icn-add-assets.svg';

const { BRIGHT_SKY_BLUE } = COLORS;

const NoTransactionsWrapper = styled.div`
  width: 100%;
  height: 400px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const NoTransactionsCenter = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;

const NoTransactionsHeading = styled.div`
  font-size: 24px;
  text-align: center;
  font-weight: bold;
  color: #b5bfc7;
`;

const NoTransactionsDescription = styled.div`
  color: #b5bfc7;
  text-align: center;
  font-weight: normal;

  > a {
    color: ${BRIGHT_SKY_BLUE};
  }
`;

const PlusIcon = styled.img`
  width: 75px;
  height: 75px;
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
