import React from 'react';

import { DemoGatewayBanner } from './DemoGatewayBanner';

export default { title: 'DemoGatewayBanner' };

export const defaultState = () => (
  <div className="sb-container" style={{ width: '100%', maxWidth: '300px' }}>
    <DemoGatewayBanner />
  </div>
);
