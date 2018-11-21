import React, { Component } from 'react';

// Legacy
import TabSection from 'containers/TabSection';

const ZEROEX_CONTAINER_ID = 'ZeroEx';
const RELAYERS = [
  {
    name: 'Radar Relay',
    homepage_url: 'https://radarrelay.com',
    app_url: 'https://app.radarrelay.com',
    header_img: 'radarrelay.png',
    logo_img: 'radarrelay.png',
    networks: [
      {
        networkId: 1,
        sra_http_endpoint: 'https://api.radarrelay.com/0x/v2/',
        sra_ws_endpoint: 'wss://ws.radarrelay.com/0x/v2',
        static_order_fields: {
          fee_recipient_addresses: ['0xa258b39954cef5cb142fd567a46cddb31a670124']
        }
      },
      {
        networkId: 42,
        sra_http_endpoint: 'https://api.kovan.radarrelay.com/0x/v2/',
        sra_ws_endpoint: 'wss://api.kovan.radarrelay.com/0x/v2'
      }
    ]
  }
];

export default class ZeroEx extends Component {
  public componentDidMount() {
    this.renderZeroExInstant();
  }

  public render() {
    return (
      <TabSection>
        <section className="Tab-content">
          <section className="Tab-content-pane" id={ZEROEX_CONTAINER_ID} />
        </section>
      </TabSection>
    );
  }

  private renderZeroExInstant() {
    const { zeroExInstant } = window as any;

    if (zeroExInstant) {
      zeroExInstant.render(
        {
          orderSource: 'https://api.radarrelay.com/0x/v2/'
        },
        `#${ZEROEX_CONTAINER_ID}`
      );
    }
  }
}
