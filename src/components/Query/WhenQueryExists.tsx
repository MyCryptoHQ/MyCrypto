import React from 'react';

import { MANDATORY_TRANSACTION_QUERY_PARAMS, SUPPORTED_TRANSACTION_QUERY_PARAMS } from '@config';
import { TxQueryTypes } from '@types';

import { IQueryResults, Query } from './Query';

interface Props {
  displayQueryMessage(id?: string): JSX.Element | null;
}

export const WhenQueryExists = ({ displayQueryMessage }: Props) => {
  // This message banner is shown on the send form.
  // When passing in a complete transaction as query params the user will never reach the send form because the
  // stepper will slice out the first step UNLESS they don't have an associated network or account with the specified details
  // Therefore, we only display errors / messages.
  const deriveSendFormQueryWarning = (queries: IQueryResults) => {
    const queriesArePresent = Object.values(queries).some((v) => !!v);
    const txQueriesArePresent = MANDATORY_TRANSACTION_QUERY_PARAMS.every((param) => queries[param]);
    if (!queriesArePresent) return null;
    if (txQueriesArePresent) {
      return displayQueryMessage('WARN_SEND_UNDETECTED_NETWORK_OR_ACCOUNT');
    }
    if (queries.type && [TxQueryTypes.SPEEDUP, TxQueryTypes.CANCEL].includes(queries.type)) {
      return displayQueryMessage('WARN_SEND_INCORRECT_PROPS');
    }
    return displayQueryMessage();
  };
  return (
    <Query params={SUPPORTED_TRANSACTION_QUERY_PARAMS} withQuery={deriveSendFormQueryWarning} />
  );
};
