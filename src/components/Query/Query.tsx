import { ReactElement } from 'react';

import queryString from 'query-string';
import { RouteComponentProps, withRouter } from 'react-router-dom';

import { TxParam } from '@features/SendAssets/preFillTx';
import { IQueryResults } from '@types';
import { getParam } from '@utils';

const parse = (location: RouteComponentProps['location']): Query => {
  const searchStr = location.search;
  const query = queryString.parse(searchStr);
  return query;
};

interface Props {
  params: TxParam[];
  withQuery(query: IQueryResults): ReactElement<any> | null;
}

interface Query {
  [key: string]: string;
}

export const Query = withRouter(({ withQuery, params, location }: RouteComponentProps & Props) => {
  const query = parse(location);
  const res = params.reduce((acc, param) => ({ ...acc, [param]: getParam(query, param) }), {});
  return withQuery(res);
});
