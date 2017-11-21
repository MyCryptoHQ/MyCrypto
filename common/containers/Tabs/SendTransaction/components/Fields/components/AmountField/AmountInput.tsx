import { Aux } from 'components/ui';
import * as React from 'react';
import translate, { translateRaw } from 'translations';
import {
  UnitConverter,
  GetTransactionMetaFields,
  Query,
  GetTransactionFields
} from 'components/renderCbs';

const AmountInput: React.SFC<any> = props => (
  <Query
    params={['readOnly']}
    withQuery={({ readOnly }) => (
      <Aux>
        <label>{translate('SEND_amount')}</label>
        <div className="input-group">
          <GetTransactionMetaFields
            withFieldValues={({ decimal }) => (
              <UnitConverter decimal={decimal} onChange={callWithBaseUnit}>
                {({ onUserInput, convertedUnit }) => (
                  <input
                    className={`form-control ${
                      validInput(convertedUnit) ? 'is-valid' : 'is-invalid'
                    }`}
                    type="text"
                    placeholder={translateRaw('SEND_amount_short')}
                    value={convertedUnit}
                    readOnly={!!readOnly}
                    onChange={onUserInput}
                  />
                )}
              </UnitConverter>
            )}
          />
        </div>
        {!readOnly &&
          balance && (
            <span className="help-block">
              <a onClick={onSendEverything}>
                <span className="strong">
                  {translate('SEND_TransferTotal')}
                </span>
              </a>
            </span>
          )}
      </Aux>
    )}
  />
);
