import React from 'react';

import styled from 'styled-components';

import { DashboardPanel } from '@components';
import Layout from '@features/Layout/Layout';
import { BREAK_POINTS, COLORS, FONT_SIZE, LINE_HEIGHT, SPACING } from '@theme/constants';
import { translateRaw } from '@translations';

const DashboardPanelLoading = styled(DashboardPanel)`
  min-height: 40rem;
  width: 100%;
  @media (min-width: ${BREAK_POINTS.SCREEN_LG}) {
    max-width: ${BREAK_POINTS.SCREEN_LG};
  }
  justify-content: center;
  color: ${COLORS.BLUE_GREY};
`;

const Loader = styled.div`
  margin-top: -6rem;
  padding-bottom: 6rem;
  transform: scale(4.75);

  &&::before {
    border-width: 0.75px;
  }

  &&::after {
    border-width: 0.75px;
  }
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

export const AppLoading = () => {
  return (
    <Layout>
      <DashboardPanelLoading>
        <Loader className="loading" />
        <LoadingText>{translateRaw('APP_LOADING')}</LoadingText>
        <LoadingSubText>{translateRaw('APP_LOADING_SUBHEADER')}</LoadingSubText>
      </DashboardPanelLoading>
    </Layout>
  );
};
