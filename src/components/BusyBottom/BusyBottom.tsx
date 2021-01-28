import React from 'react';

import { Link as RouterLink } from 'react-router-dom';

import { Box, Icon, NewTabLink } from '@components';
import { Link } from '@components/NewTypography';
import { translateRaw } from '@translations';
import { BusyBottomConfig } from '@types';

import { configs } from './constants';

export const BusyBottom = ({ type }: { type: BusyBottomConfig }) => {
  return (
    <Box mt={4}>
      <Box style={{ textAlign: 'center' }} mb={2}>
        {translateRaw('BUSY_BOTTOM_HEADER')}
      </Box>
      <Box variant="rowAlign" justifyContent="center">
        {configs[type].map(({ copy, copyVariables, link, external }, index) => {
          const linkContent = <Link>{translateRaw(copy, copyVariables)}</Link>;
          return (
            <>
              {external ? (
                <NewTabLink href={link}>{linkContent}</NewTabLink>
              ) : (
                <RouterLink to={link!}>{linkContent}</RouterLink>
              )}
              {index < configs[type].length - 1 && (
                <Box paddingX="15px" paddingY={1} variant="rowAlign">
                  <Icon type="separator" />
                </Box>
              )}
            </>
          );
        })}
      </Box>
    </Box>
  );
};
