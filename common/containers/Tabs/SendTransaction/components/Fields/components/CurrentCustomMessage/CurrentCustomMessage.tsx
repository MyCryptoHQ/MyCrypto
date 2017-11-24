import { CustomMessage, messages } from './components';
import { CurrentTo } from 'components/renderCbs';
import React from 'react';

export const CurrentCustomMessage: React.SFC<{}> = () => (
  <CurrentTo
    withCurrentTo={({ to }) => (
      <CustomMessage message={messages.find(m => m.to === to.raw)} />
    )}
  />
);
