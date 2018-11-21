import React from 'react';
import { Link } from 'react-router-dom';

import './BuyAndExchangeOption.scss';

interface Props {
  route: string;
  option: string;
}

export default function BuyAndExchangeOption({ route, option }: Props) {
  return (
    <Link to={route} className="BuyAndExchangeOption">
      <h1>{option}</h1>
    </Link>
  );
}
