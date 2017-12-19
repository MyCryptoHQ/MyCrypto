import { getParam } from 'utils/helpers';
import queryString from 'query-string';
import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';

const parse = (location: RouteComponentProps<any>['location']): Query => {
  const searchStr = location.search;
  const query = queryString.parse(searchStr);
  return query;
};

interface IQueryResults {
  [key: string]: string | null;
}

export type Param = 'to' | 'data' | 'readOnly' | 'tokenSymbol' | 'value' | 'gaslimit' | 'limit';

interface Props extends RouteComponentProps<{}> {
  params: Param[];
  withQuery(query: IQueryResults): React.ReactElement<any> | null;
}

interface Query {
  [key: string]: string;
}

export const Query = withRouter<Props>(
  class extends React.Component<Props, {}> {
    public render() {
      const { withQuery, params, location } = this.props;
      const query = parse(location);
      const res = params.reduce((obj, param) => ({ ...obj, [param]: getParam(query, param) }), {});

      return withQuery(res);
    }
  }
);
