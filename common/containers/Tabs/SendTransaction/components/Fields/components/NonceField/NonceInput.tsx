import React from 'react';
import { Aux } from 'components/ui';
import { Offline, Query, GetTransactionFields } from 'components/renderCbs';
import Help from 'components/ui/Help';

const nonceHelp = (
  <Help
    size={'x1'}
    link={
      'https://myetherwallet.github.io/knowledge-base/transactions/what-is-nonce.html'
    }
  />
);

interface Props {
  onChange(ev: React.FormEvent<HTMLInputElement>): void;
}

export const NonceInput: React.StatelessComponent<Props> = props => {
  const content = (
    <Aux>
      {nonceHelp}
      <label>Nonce</label>
      <GetTransactionFields
        withFieldValues={({ nonce: { raw, valid } }) => (
          <Query
            params={['readOnly']}
            withQuery={({ readOnly }) => (
              <input
                className={`form-control ${valid ? 'is-valid' : 'is-invalid'}`}
                type="text"
                value={raw}
                readOnly={!!readOnly}
                onChange={props.onChange}
              />
            )}
          />
        )}
      />
    </Aux>
  );

  return (
    <Offline
      withOffline={({ offline, forceOffline }) =>
        offline || forceOffline ? content : null
      }
    />
  );
};
