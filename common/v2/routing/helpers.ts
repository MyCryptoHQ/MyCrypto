import flatten from 'lodash/flatten';

import * as features from 'v2/features';
import featureRegistry from 'v2/features/registry.json';

interface FeatureRegistryEntry {
  name: string;
  key: string;
}

export const gatherFeatureRoutes = () =>
  flatten(
    (featureRegistry as FeatureRegistryEntry[]).map(({ key }) => (features as any)[`${key}Routes`])
  );
