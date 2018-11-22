import React from 'react';

import { BuyAndExchangeOption } from './components';
import './BuyAndExchange.scss';

// Legacy
import TabSection from 'containers/TabSection';

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
