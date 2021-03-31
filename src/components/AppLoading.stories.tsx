import React from 'react';

import { ErrorProvider } from '@features';
import { Layout } from '@features/Layout';

import AppLoading from './AppLoading';

export default {
  title: 'Atoms/AppLoading',
  component: AppLoading,
  decorators: [
    (Story: React.FC) => (
      <ErrorProvider>
        <Story />
      </ErrorProvider>
    )
  ]
};

export const Default = () => <AppLoading />;
export const InLayout = () => (
  <Layout>
    <AppLoading />
  </Layout>
);
