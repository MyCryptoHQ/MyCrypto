import React, { FunctionComponent } from 'react';
import translate from '@translations';

const getFailureMessage = (type: string) => {
  switch (type) {
    case 'NO_TOKENS':
      return <p>{translate('TOKEN_ALLOWANCES_NO_TOKENS_ERROR')}</p>;
    default:
      return <p>{translate('TOKEN_ALLOWANCES_UNKNOWN_ERROR')}</p>;
  }
};

interface Props {
  type: string;
}

const Error: FunctionComponent<Props> = ({ type }) => {
  return (
    <>
      {getFailureMessage(type)}
    </>
  );
};

export default Error;
