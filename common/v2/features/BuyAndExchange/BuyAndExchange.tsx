import React from 'react';

// Legacy
import TabSection from 'containers/TabSection';

import { BuyAndExchangeOption } from './components';
import './BuyAndExchange.scss';

export default function BuyAndExchange() {
  return (
    <TabSection>
      <section className="Tab-content">
        <section className="Tab-content-pane">
          <section className="BuyAndExchange">
            <BuyAndExchangeOption option="ShapeShift" route="/swap/shapeshift" />
            <BuyAndExchangeOption option="0x" route="/swap/0x" />
          </section>
        </section>
      </section>
    </TabSection>
  );
}
