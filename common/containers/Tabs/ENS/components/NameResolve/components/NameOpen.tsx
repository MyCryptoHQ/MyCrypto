import React from 'react';
import { IBaseDomainRequest } from 'libs/ens';
import { NewTabLink } from 'components/ui';

export const NameOpen: React.SFC<IBaseDomainRequest> = props => (
  <section className="row">
    <section className="auction-info text-center">
      <div className="ens-title">
        <h1>
          <strong>{props.name}.eth</strong> is available!
        </h1>
      </div>

      <NewTabLink
        className="text-center"
        content={`Do you want ${
          props.name
        }.eth? You'll need open an auction on MyCrypto V3 by clicking here`}
        href="https://mycrypto.com/#ens"
      />
    </section>
  </section>
);
