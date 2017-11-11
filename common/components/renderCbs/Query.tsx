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

interface Props {
  params: string[];
  paramGetter?(query: Query, param: string): string | null;
  withQuery(query: IQueryResults): React.ReactElement<any>;
}

interface Query {
  [key: string]: string;
}

export const Query = withRouter(
  class extends React.Component<Props, {}> {
    get injected() {
      return this.props as Props & RouteComponentProps<any>;
    }

    public render() {
      const { paramGetter, withQuery, params } = this.props;
      const { location } = this.injected;
      const query = parse(location);
      const getter = paramGetter ? paramGetter : getParam;
      const res = params.reduce(
        (obj, param) => ({ ...obj, [param]: getter(query, param) }),
        {}
      );

      return withQuery(res);
    }
  }
);

/*
const parseQuery = () => {
  const searchStr = this.props.location.search;
  const query = queryString.parse(searchStr);
  const to = getParam(query, 'to');
  const data = getParam(query, 'data');
  const unit = getParam(query, 'tokenSymbol');
  const token = this.props.tokens.find(x => x.symbol === unit);
  const value = getParam(query, 'value');
  let gasLimit = getParam(query, 'gaslimit');
  if (gasLimit === null) {
    gasLimit = getParam(query, 'limit');
  }
  const readOnly = getParam(query, 'readOnly') != null;
  return { to, token, data, value, unit, gasLimit, readOnly };
};
*/
