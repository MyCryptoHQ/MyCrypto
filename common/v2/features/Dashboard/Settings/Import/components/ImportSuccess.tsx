import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Button } from '@mycrypto/ui';
import translate from 'translations';

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
      {translate('SETTINGS_IMPORT_SUCCESS')}
      <FullWidthLink to="/dashboard/settings">
        <FullWidthButton secondary>{translate('SETTINGS_IMPORT_COMPLETE')}</FullWidthButton>
      </FullWidthLink>
    </ImportSuccessContainer>
  );
}
