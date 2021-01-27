import React from 'react';

import { useHistory } from 'react-router-dom';

import { Box, Icon, Link } from '@components';
import { translateRaw } from '@translations';
import { BusyBottomConfig, TURL } from '@types';
import { openLink } from '@utils';

import { configs } from './constants';

export const BusyBottom = ({ type }: { type: BusyBottomConfig }) => {
  const history = useHistory();

  return (
    <Box mt={4}>
      <Box style={{ textAlign: 'center' }} mb={2}>
        {translateRaw('BUSY_BOTTOM_HEADER')}
      </Box>
      <Box variant="rowAlign" justifyContent="center">
        {configs[type].map(({ copy, copyVariables, link, external }, index) => (
          <>
            <Box
              key={link}
              onClick={() => (external ? openLink(link as TURL) : history.push(link!))}
            >
              <Link>{translateRaw(copy, copyVariables)}</Link>
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
