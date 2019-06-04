import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import translate from 'translations';

import { Button } from 'v2/components';

const ImportSuccessContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const FullWidthLink = styled(Link)`
  width: 100%;
`;

export default function ImportSuccess() {
  return (
    <ImportSuccessContainer>
      {translate('SETTINGS_IMPORT_SUCCESS')}
      <FullWidthLink to="/dashboard/settings">
        <Button fullWidth={true} secondary={true}>
          {translate('SETTINGS_IMPORT_COMPLETE')}
        </Button>
      </FullWidthLink>
    </ImportSuccessContainer>
  );
}
