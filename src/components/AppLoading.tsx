import React from 'react';

import styled from 'styled-components';

import { Box, DashboardPanel, Spinner } from '@components';
import { BREAK_POINTS, COLORS, FONT_SIZE, LINE_HEIGHT, SPACING } from '@theme/constants';
import { translateRaw } from '@translations';

const DashboardPanelLoading = styled(DashboardPanel)`
  width: 100%;
  min-height: 40rem;
  @media (min-width: ${BREAK_POINTS.SCREEN_LG}) {
    max-width: ${BREAK_POINTS.SCREEN_LG};
  }
  justify-content: center;
  color: ${COLORS.BLUE_GREY};
`;

const LoadingText = styled.h6`
  margin: 0;
  font-weight: bold;
  font-size: ${FONT_SIZE.XL};
  line-height: ${LINE_HEIGHT.XXL};
  text-align: center;
`;

const LoadingSubText = styled.h6`
  padding-top: ${SPACING.XS};
  margin: 0;
  font-size: ${FONT_SIZE.BASE};
  line-height: ${LINE_HEIGHT.XL};
  text-align: center;
`;

const AppLoading = () => (
  <DashboardPanelLoading>
    <Box variant="rowCenter" mb={'1em'}>
      <Spinner color="brand" size={3} />
    </Box>
    <LoadingText>{translateRaw('APP_LOADING')}</LoadingText>
    <LoadingSubText>{translateRaw('APP_LOADING_SUBHEADER')}</LoadingSubText>
  </DashboardPanelLoading>
);

export default AppLoading;
