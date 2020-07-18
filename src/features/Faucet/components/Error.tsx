import React, { FunctionComponent } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import translate from '@translations';
import { formatSupportEmail } from '@utils';
import { ROUTE_PATHS } from '@config';

const ContactUsText = styled.p`
  font-style: italic;
  margin-top: 50px;
  font-size: 14px;
`;

const getFailureMessage = (type: string) => {
  switch (type) {
    case 'API_FAILURE':
      return <p>An API error occured. Please try again later.</p>;
    case 'RUNNING_LOW':
      return <p>Our faucet is currently running low. Please try again later.</p>;
    case 'INVALID_SOLUTION':
      return (
        <p>
          Incorrect captcha response. Please <Link to={ROUTE_PATHS.FAUCET.path}>try again</Link>.
        </p>
      );
    default:
      return <p>Oops, an unknown error occured. Please try again later.</p>;
  }
};

interface Props {
  type: string;
}

const Error: FunctionComponent<Props> = ({ type }) => {
  return (
    <>
      {getFailureMessage(type)}
      <ContactUsText>
        {translate('FAUCET_ERROR', {
          $link: formatSupportEmail(`Issue with FAUCET`, `Issue: ${type}`)
        })}
      </ContactUsText>
    </>
  );
};

export default Error;
