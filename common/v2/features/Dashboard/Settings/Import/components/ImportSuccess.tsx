import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Button } from '@mycrypto/ui';

const ImportSuccessContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const FullWidthButton = styled(Button)`
  width: 100%;
  margin-top: 1rem;
`;

const FullWidthLink = styled(Link)`
  width: 100%;
`;

export default function ImportSuccess(props) {
  return (
    <ImportSuccessContainer>
      You will see the imported files in settings!
      <FullWidthLink to="/dashboard/settings">
        <FullWidthButton secondary>Back To Settings</FullWidthButton>
      </FullWidthLink>
    </ImportSuccessContainer>
  );
}
