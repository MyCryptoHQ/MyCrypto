import React from 'react';

import { Query, Param, IQueryResults } from './Query';
import { MANDATORY_RESUBMIT_QUERY_PARAMS } from '@config';

interface Props {
  displayQueryMessage(id?: string): JSX.Element | null;
}

const params: Param[] = [
  'type',
  'gasPrice',
  'gasLimit',
  'to',
  'data',
  'nonce',
  'from',
  'value',
  'chainId'
];

export const WhenQueryExists = ({ displayQueryMessage }: Props) => {
  const deriveQueryMsg = (queries: IQueryResults) => {
    const queriesArePresent = Object.values(queries).some((v) => !!v);
    const resubmitQueriesArePresent = MANDATORY_RESUBMIT_QUERY_PARAMS.every(
      (resubmitParam) => queries[resubmitParam]
    );
    if (!queriesArePresent) return null;
    if (resubmitQueriesArePresent) {
      return displayQueryMessage('WARN_SEND_UNDETECTED_NETWORK_OR_ACCOUNT');
    }
    if (queries.type && queries.type === 'resubmit') {
      return displayQueryMessage('WARN_SEND_INCORRECT_PROPS');
    }
    return displayQueryMessage();
  };
  return <Query params={params} withQuery={deriveQueryMsg} />;
};
