import React from 'react';
import { ConditionalInput } from 'components/ui';
import { Offline, Query } from 'components/renderCbs';
import Help from 'components/ui/Help';

const nonceHelp = (
  <Help
    size={'small'}
    link={
      'https://myetherwallet.github.io/knowledge-base/transactions/what-is-nonce.html'
    }
  />
);

interface Props {
  value: string;
  validNonce: boolean;
  onChange(ev: React.FormEvent<HTMLInputElement>): void;
}

export const NonceInput: React.StatelessComponent<Props> = props => {
  const { value, onChange, validNonce } = props;
  const content = (
    <div className="row form-group">
      <div className="col-xs-11">
        {nonceHelp}
        <label>Nonce</label>
        <Query
          params={['readOnly']}
          withQuery={({ readOnly }) => (
            <ConditionalInput
              className={`form-control ${
                validNonce ? 'is-valid' : 'is-invalid'
              }`}
              type="number"
              value={value || '0'}
              condition={!readOnly}
              conditionalProps={{ onChange }}
            />
          )}
        />
      </div>
    </div>
  );

  return (
    <Offline
      withOffline={({ offline, forceOffline }) =>
        offline || forceOffline ? content : null
      }
    />
  );
};
