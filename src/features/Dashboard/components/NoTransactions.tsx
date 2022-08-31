import styled from 'styled-components';

import addIcon from '@assets/images/icn-add-assets.svg';
import { LinkApp } from '@components';
import { ROUTE_PATHS } from '@config';
import { COLORS, FONT_SIZE, SPACING } from '@theme';
import translate, { Trans } from '@translations';

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
`;

const PlusIcon = styled.img`
  width: 60px;
  height: 60px;
`;

function NoTransactions() {
  return (
    <NoTransactionsWrapper>
      <NoTransactionsCenter>
        <PlusIcon src={addIcon} />
        <NoTransactionsHeading>{translate('RECENT_TX_LIST_NO_TRANSACTIONS')}</NoTransactionsHeading>
        <NoTransactionsDescription>
          <Trans
            id="RECENT_TX_LIST_NO_TRANSACTIONS_MORE"
            variables={{
              $link: () => (
                <LinkApp href={ROUTE_PATHS.SEND.path} $textTransform="capitalize">
                  {translate('SEND_LINK')}
                </LinkApp>
              )
            }}
          />
        </NoTransactionsDescription>
      </NoTransactionsCenter>
    </NoTransactionsWrapper>
  );
}

export default NoTransactions;
