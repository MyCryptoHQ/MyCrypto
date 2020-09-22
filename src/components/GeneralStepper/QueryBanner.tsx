import React from 'react';

import { Link } from 'react-router-dom';
import styled from 'styled-components';

import runningIcon from '@assets/images/icn-running.svg';
import { Query, Tooltip } from '@components';
import { IQueryResults } from '@components/Query';
import { IconID } from '@components/Tooltip';
import {
  MANDATORY_TRANSACTION_QUERY_PARAMS,
  ROUTE_PATHS,
  SUPPORTED_TRANSACTION_QUERY_PARAMS
} from '@config';
import { COLORS, SPACING } from '@theme';
import translate, { translateRaw } from '@translations';
import { TxQueryTypes } from '@types';

const BannerContainer = styled.div`
  background: ${COLORS.WARNING_ORANGE};
  padding: ${SPACING.MD} ${SPACING.LG};
  color: ${COLORS.WHITE};
  display: flex;
  justify-content: space-between;
`;

const BannerText = styled.p`
  margin: 0;
`;

const BannerContent = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: space-between;
  flex-direction: row;
`;

const CancelBtn = styled.p`
  text-decoration-line: underline;
  color: ${COLORS.WHITE};
  margin: 0 0 0 4em;
`;

const createQueryWarning = ({
  contentTranslationKey,
  tooltipTranslationKey
}: {
  contentTranslationKey: string;
  tooltipTranslationKey: string;
}) => (
  <BannerContainer>
    <BannerContent>
      <img src={runningIcon} />
      <BannerText>{translate(contentTranslationKey)}</BannerText>
      <Tooltip type={IconID.questionWhite} tooltip={translateRaw(tooltipTranslationKey)} />
    </BannerContent>
    <Link to={ROUTE_PATHS.DASHBOARD.path}>
      <CancelBtn>{translateRaw('CANCEL_ACTION')}</CancelBtn>
    </Link>
  </BannerContainer>
);

const deriveTxQueryBanner = (queries: IQueryResults) => {
  const txQueriesArePresent = MANDATORY_TRANSACTION_QUERY_PARAMS.every((param) => queries[param]);
  if (!queries.type || !txQueriesArePresent) return null;
  switch (queries.type) {
    case TxQueryTypes.SPEEDUP:
      return createQueryWarning({
        contentTranslationKey: 'TX_QUERY_SPEED_UP_BANNER',
        tooltipTranslationKey: 'TX_QUERY_SPEED_UP_TOOLTIP'
      });
    case TxQueryTypes.CANCEL:
      return createQueryWarning({
        contentTranslationKey: 'TX_QUERY_CANCEL_BANNER',
        tooltipTranslationKey: 'TX_QUERY_CANCEL_TOOLTIP'
      });
    default:
      return createQueryWarning({
        contentTranslationKey: 'TX_QUERY_DEFAULT_BANNER',
        tooltipTranslationKey: 'TX_QUERY_DEFAULT_TOOLTIP'
      });
  }
};

const QueryBanner = () => {
  const banner = (query: IQueryResults) => deriveTxQueryBanner(query);

  return <Query params={SUPPORTED_TRANSACTION_QUERY_PARAMS} withQuery={banner} />;
};

export default QueryBanner;
