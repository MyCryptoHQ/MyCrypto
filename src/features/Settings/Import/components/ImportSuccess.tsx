import styled from 'styled-components';

import { Button, LinkApp } from '@components';
import translate from '@translations';

const ImportSuccessContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export default function ImportSuccess() {
  return (
    <ImportSuccessContainer>
      {translate('SETTINGS_IMPORT_SUCCESS')}
      <LinkApp href="/settings">
        <Button fullwidth={true} secondary={true}>
          {translate('SETTINGS_IMPORT_COMPLETE')}
        </Button>
      </LinkApp>
    </ImportSuccessContainer>
  );
}
