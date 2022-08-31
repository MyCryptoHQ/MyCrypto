import { Typography } from '@mycrypto/ui';
import { connect, ConnectedProps } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import styled from 'styled-components';

import { Box, ContentPanel, Downloader, InlineMessage } from '@components';
import { getCurrentDBConfig, getExportFileName } from '@database';
import { useAnalytics } from '@services';
import { useUserActions } from '@services/Store';
import { AppState, exportState } from '@store';
import translate, { translateRaw } from '@translations';
import { ACTION_NAME, ACTION_STATE, InlineMessageType } from '@types';
import { goBack, useScreenSize } from '@utils';

const CodeBlock = styled.code`
  overflow: auto;
  width: 100%;
  height: 30rem;
`;

export function Export(props: Props) {
  const { history, appState } = props;
  const onBack = () => goBack(history);
  const { isMobile } = useScreenSize();
  const { track } = useAnalytics();

  const { updateUserAction, findUserAction } = useUserActions();

  const backupAction = findUserAction(ACTION_NAME.BACKUP);

  return (
    <ContentPanel width={560} onBack={onBack} heading={translateRaw('SETTINGS_EXPORT_HEADING')}>
      <Box variant="columnAlign">
        <Typography>{translate('SETTINGS_EXPORT_INFO')}</Typography>
        <CodeBlock data-testid="export-json-display">{appState}</CodeBlock>
        {isMobile && (
          <InlineMessage type={InlineMessageType.INFO_CIRCLE}>
            {translateRaw('EXPORT_MOBILE_NOTICE')}{' '}
          </InlineMessage>
        )}
        <Downloader
          fileName={getExportFileName(getCurrentDBConfig(), new Date())}
          data={appState}
          onClick={() => {
            track({ action: 'Export AppState' });
            if (backupAction) {
              updateUserAction(backupAction.uuid, {
                ...backupAction,
                state: ACTION_STATE.COMPLETED
              });
            }
          }}
        />
      </Box>
    </ContentPanel>
  );
}

const mapStateToProps = (state: AppState) => ({
  appState: JSON.stringify(exportState(state))
});

const connector = connect(mapStateToProps);
type Props = ConnectedProps<typeof connector> & RouteComponentProps;

export default withRouter(connector(Export));
