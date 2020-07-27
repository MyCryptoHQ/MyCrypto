import React, { FunctionComponent } from 'react';
import styled from 'styled-components';

import translate from '@translations';
import { formatSupportEmail } from '@utils';
import { InlineMessage } from '@components';
import { InlineMessageType } from '@types';

const Box = styled.div`
  border: 1px solid #fa863f;
  box-sizing: border-box;
  box-shadow: inset 0px 1px 1px rgba(63, 63, 68, 0.05);
  border-radius: 2px;
  margin-top: 40px;
`;

const ContactUsText = styled(InlineMessage)`
  font-style: italic;
  font-size: 14px;
  margin: 20px;
  a {
    color: var(--color-link-color);
    text-decoration: none;
  }
  a:hover {
    color: var(--color-link-color);
  }
`;

const getFailureMessage = (type: string) => {
  switch (type) {
    case 'API_FAILURE':
      return <p>An API error occured. Please try again later.</p>;
    case 'RUNNING_LOW':
      return <p>Our faucet is currently running low. Please try again later.</p>;
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
      <Box>
        <ContactUsText type={InlineMessageType.WARNING}>
          {translate('FAUCET_ERROR', {
            $link: formatSupportEmail(`Issue with FAUCET`, `Issue: ${type}`)
          })}
        </ContactUsText>
      </Box>
    </>
  );
};

export default Error;
