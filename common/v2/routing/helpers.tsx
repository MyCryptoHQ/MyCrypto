import flatten from 'lodash/flatten';
import React, { useContext } from 'react';
import { withRouter } from 'react-router-dom';

import * as features from 'v2/features';
import { AccountContext, LockScreenContext } from 'v2/providers';
import featureRegistry from 'v2/features/registry.json';

interface FeatureRegistryEntry {
  name: string;
  key: string;
}

export const gatherFeatureRoutes = () =>
  flatten(
    (featureRegistry as FeatureRegistryEntry[]).map(({ key }) => (features as any)[`${key}Routes`])
  );

export const HomepageChoiceRedirect = withRouter(({ history, children }) => {
  const { accounts } = useContext(AccountContext);
  const { locked } = useContext(LockScreenContext);

  const path = history.location.pathname;
  if (path === '/') {
    if (accounts.length > 0 || locked) {
      history.push('/dashboard');
    } else {
      history.push('/home');
    }
  }
  return <React.Fragment>{children}</React.Fragment>;
});
