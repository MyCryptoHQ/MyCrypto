import { FunctionComponent } from 'react';

import styled from 'styled-components';

import { InlineMessage } from '@components';
import { COLORS, SPACING } from '@theme';
import translate from '@translations';
import { InlineMessageType } from '@types';
import { formatSupportEmail } from '@utils';

const Box = styled.div`
  border: 1px solid ${COLORS.WARNING_ORANGE};
  box-sizing: border-box;
  border-radius: 2px;
  margin-top: ${SPACING.LG};
`;

const ContactUsText = styled(InlineMessage)`
  font-style: italic;
  font-size: 14px;
  margin: ${SPACING.BASE};
  a,
  a:hover {
    color: ${COLORS.BLUE_MYC};
    text-decoration: none;
    font-weight: bold;
  }
`;

const getFailureMessage = (type: string) => {
  switch (type) {
    case 'API_FAILURE':
      return <p>{translate('FAUCET_API_FAILURE')}</p>;
    case 'RUNNING_LOW':
      return <p>{translate('FAUCET_RUNNING_LOW')}</p>;
    case 'DAILY_LIMIT_REACHED':
      return <p>{translate('FAUCET_LIMIT_REACHED')}</p>;
    default:
      return <p>{translate('FAUCET_UNKNOWN_ERROR')}</p>;
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
