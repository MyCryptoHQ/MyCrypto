import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import queryString from 'query-string';
import { getParam } from '@utils';
import { TxParam } from '@features/SendAssets/preFillTx';
import { TxQueryTypes } from '@types';

const parse = (location: RouteComponentProps<any>['location']): Query => {
  const searchStr = location.search;
  const query = queryString.parse(searchStr);
  return query;
};

export interface IQueryResults {
  [key: string]: TxQueryTypes | null;
}

interface Props extends RouteComponentProps<{}> {
  params: TxParam[];
  withQuery(query: IQueryResults): React.ReactElement<any> | null;
}

interface Query {
  [key: string]: string;
}

export const Query = withRouter(
  class extends React.Component<Props, {}> {
    public render() {
      const { withQuery, params, location } = this.props;
      const query = parse(location);
      const res = params.reduce((obj, param) => ({ ...obj, [param]: getParam(query, param) }), {});

      return withQuery(res);
    }
  }
);
