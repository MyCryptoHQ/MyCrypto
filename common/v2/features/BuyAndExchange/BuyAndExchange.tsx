import React from 'react';

import { BuyAndExchangeOption } from './components';
import './BuyAndExchange.scss';

// Legacy
import shapeshiftLogo from 'assets/images/logo-shapeshift-no-text.svg';
import zeroExLogo from 'assets/images/logo-zeroex.png';
import TabSection from 'containers/TabSection';

export default function BuyAndExchange() {
  return (
    <TabSection>
      <section className="Tab-content">
        <section className="Tab-content-pane">
          <h1 className="BuyAndExchange-title">Buy & Exchange Digital Assets</h1>
          <p className="BuyAndExchange-subtitle">Choose the provider that's right for you</p>
          <section className="BuyAndExchange">
            <BuyAndExchangeOption
              option="ShapeShift"
              logo={shapeshiftLogo}
              route="/swap/shapeshift"
            >
              A platform that gives you the power to quickly swap between assets in a seamless,
              safe, and secure environment.
            </BuyAndExchangeOption>
            <BuyAndExchangeOption option="0x Instant" logo={zeroExLogo} route="/swap/0x">
              Quick and secure token purchasing.
            </BuyAndExchangeOption>
          </section>
        </section>
      </section>
    </TabSection>
  );
}
