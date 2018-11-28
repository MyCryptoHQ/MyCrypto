import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';

import './BuyAndExchangeOption.scss';

interface Props {
  route: string;
  option: string;
  children: any;
}

function BuyAndExchangeOption({
  route,
  option,
  history,
  children
}: Props & RouteComponentProps<any>) {
  return (
    <section className="BuyAndExchangeOption" onClick={() => history.push(route)}>
      <h1>{option}</h1>
      {children}
    </section>
  );
}

export default withRouter(BuyAndExchangeOption);
