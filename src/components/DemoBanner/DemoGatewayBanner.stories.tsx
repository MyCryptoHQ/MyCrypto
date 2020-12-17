import React from 'react';

import { translateRaw } from '@translations';

import { DemoGatewayBanner } from './DemoGatewayBanner';

export default { title: 'DemoGatewayBanner' };

export const defaultState = () => (
  <div className="sb-container" style={{ width: '100%', maxWidth: '300px' }}>
    <DemoGatewayBanner copy={translateRaw('DEMO_GATEWAY_BANNER')} />
  </div>
);
