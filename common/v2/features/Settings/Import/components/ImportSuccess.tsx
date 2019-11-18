import React from 'react';
import styled from 'styled-components';
import translate from 'v2/translations';

import { Button, RouterLink } from 'v2/components';

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
        <Button fullWidth={true} secondary={true}>
          {translate('SETTINGS_IMPORT_COMPLETE')}
        </Button>
      </RouterLink>
    </ImportSuccessContainer>
  );
}
