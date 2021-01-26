import React from 'react';

import { useHistory } from 'react-router-dom';

import { getKBHelpArticle, KB_HELP_ARTICLE, ROUTE_PATHS, SUPPORT_EMAIL } from '@config';
import { translateRaw } from '@translations';
import { TURL } from '@types';
import { openLink } from '@utils';

import Box from './Box';
import Icon from './Icon';
import { Link } from './NewTypography';

const SUPPORT_LINK = {
  copy: 'FLOW_FOOTER_SUPPORT',
  link: `mailto:${SUPPORT_EMAIL}`,
  external: true
};

const configs = {
  GENERAL: [
    { copy: 'FLOW_FOOTER_GENERAL_1', link: ROUTE_PATHS.CREATE_WALLET.path, external: false },
    { copy: 'FLOW_FOOTER_GENERAL_2', link: ROUTE_PATHS.DOWNLOAD_DESKTOP_APP.path, external: false },
    { copy: 'FLOW_FOOTER_GENERAL_3', link: ROUTE_PATHS.SETTINGS_IMPORT.path, external: false },
    SUPPORT_LINK
  ],
  WALLETCONNECT: [
    {
      copy: 'FLOW_FOOTER_WALLETCONNECT_1',
      link: getKBHelpArticle(KB_HELP_ARTICLE.WHAT_IS_WALLETCONNECT),
      external: true
    },
    {
      copy: 'FLOW_FOOTER_WALLETCONNECT_2',
      link: getKBHelpArticle(KB_HELP_ARTICLE.HOW_TO_USE_WALLETCONNECT),
      external: true
    },
    SUPPORT_LINK
  ],
  SUPPORT: [SUPPORT_LINK]
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
