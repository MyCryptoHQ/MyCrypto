import React from 'react';

import { useHistory } from 'react-router-dom';

import { ROUTE_PATHS, SUPPORT_EMAIL } from '@config';
import { translateRaw } from '@translations';
import { TURL } from '@types';
import { openLink } from '@utils';

import Box from './Box';
import Icon from './Icon';
import { Link } from './NewTypography';

const configs = {
  GENERAL: [
    { copy: 'FLOW_FOOTER_GENERAL_1', link: ROUTE_PATHS.CREATE_WALLET.path },
    { copy: 'FLOW_FOOTER_GENERAL_2', link: ROUTE_PATHS.DOWNLOAD_DESKTOP_APP.path },
    { copy: 'FLOW_FOOTER_GENERAL_3', link: ROUTE_PATHS.SETTINGS_IMPORT.path },
    { copy: 'FLOW_FOOTER_GENERAL_4', link: `mailto:${SUPPORT_EMAIL}`, external: true }
  ]
};

export type FlowFooterConfig = keyof typeof configs;

export const FlowFooter = ({ type }: { type: FlowFooterConfig }) => {
  const history = useHistory();

  return (
    <Box mt={4}>
      <Box style={{ textAlign: 'center' }} mb={2}>
        {translateRaw('FLOW_FOOTER_HEADER')}
      </Box>
      <Box variant="rowAlign" justifyContent="center">
        {configs[type].map(({ copy, link, external }, index) => (
          <>
            <Box
              key={link}
              onClick={() => (external ? openLink(link as TURL) : history.push(link))}
            >
              <Link>{translateRaw(copy)}</Link>
            </Box>
            {index < configs[type].length - 1 && (
              <Box paddingX="15px" paddingY={1} variant="rowAlign">
                <Icon type="separator" />
              </Box>
            )}
          </>
        ))}
      </Box>
    </Box>
  );
};
