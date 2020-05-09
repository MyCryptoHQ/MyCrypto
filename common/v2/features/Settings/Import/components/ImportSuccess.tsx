import React from 'react';
import styled from 'styled-components';
import translate from '@translations';

import { Button, RouterLink } from '@components';

const ImportSuccessContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export default function ImportSuccess() {
  return (
    <ImportSuccessContainer>
      {translate('SETTINGS_IMPORT_SUCCESS')}
      <RouterLink to="/settings">
        <Button fullwidth={true} secondary={true}>
          {translate('SETTINGS_IMPORT_COMPLETE')}
        </Button>
      </RouterLink>
    </ImportSuccessContainer>
  );
}
