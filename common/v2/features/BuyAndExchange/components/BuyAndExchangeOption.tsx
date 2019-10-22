import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';

import './BuyAndExchangeOption.scss';

interface Props {
  route: string;
  option: string;
  logo: string;
  children: any;
}

function BuyAndExchangeOption({
  route,
  option,
  logo,
  history,
  children
}: Props & RouteComponentProps<any>) {
  return (
    <section className="BuyAndExchangeOption" onClick={() => history.push(route)}>
      <section className="BuyAndExchangeOption-name">
        <h3>
          <img src={logo} /> {option}
        </h3>
      </section>
      <section className="BuyAndExchangeOption-content">{children}</section>
      <button className="btn btn-default">Use {option}</button>
    </section>
  );
}

export default withRouter(BuyAndExchangeOption);
