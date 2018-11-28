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
            <BuyAndExchangeOption option="ShapeShift" route="/swap/shapeshift">
              A platform that gives you the power to quickly swap between assets in a seamless,
              safe, and secure environment.
            </BuyAndExchangeOption>
            <BuyAndExchangeOption option="0x Instant" route="/swap/0x">
              Quick and secure token purchasing.
            </BuyAndExchangeOption>
          </section>
        </section>
      </section>
    </TabSection>
  );
}
