import React from 'react';
import { NonceFieldFactory } from 'components/NonceFieldFactory';
import Help from 'components/ui/Help';

interface Props {
  alwaysDisplay: boolean;
}

const nonceHelp = (
  <Help
    size={'x1'}
    link={'https://myetherwallet.github.io/knowledge-base/transactions/what-is-nonce.html'}
  />
);

export const NonceField: React.SFC<Props> = ({ alwaysDisplay }) => (
  <NonceFieldFactory
    withProps={({ nonce: { raw, value }, onChange, readOnly, shouldDisplay }) => {
      const content = (
        <>
          <label>Nonce</label>
          {nonceHelp}

          <input
            className={`form-control ${!!value ? 'is-valid' : 'is-invalid'}`}
            type="number"
            placeholder="e.g. 7"
            value={raw}
            readOnly={readOnly}
            onChange={onChange}
          />
        </>
      );

      return alwaysDisplay || shouldDisplay ? content : null;
    }}
  />
);
