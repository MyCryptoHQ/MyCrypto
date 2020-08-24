import React from 'react';

import { MANDATORY_TRANSACTION_QUERY_PARAMS } from '@config';
import { TxParam } from '@features/SendAssets/preFillTx';

import { Query, IQueryResults } from './Query';

interface Props {
  displayQueryMessage(id?: string): JSX.Element | null;
}

const params: TxParam[] = [
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
  // This message banner is shown on the send form.
  // When passing in a complete transaction as query params the user will never reach the send form because the
  // stepper will slice out the first step UNLESS they don't have an associated network or account with the specified details
  // Therefore, we only display errors / messages.
  const deriveSendFormQueryWarning = (queries: IQueryResults) => {
    const queriesArePresent = Object.values(queries).some((v) => !!v);
    const resubmitQueriesArePresent = MANDATORY_TRANSACTION_QUERY_PARAMS.every(
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
  return <Query params={params} withQuery={deriveSendFormQueryWarning} />;
};
