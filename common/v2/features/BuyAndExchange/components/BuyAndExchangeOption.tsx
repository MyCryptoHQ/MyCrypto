import React from 'react';
import { Link } from 'react-router-dom';

import './BuyAndExchangeOption.scss';

export default function BuyAndExchangeOption(props) {
  return (
    <Link to={props.route} className="BuyAndExchangeOption">
      <h1>{props.option}</h1>
    </Link>
  );
}
