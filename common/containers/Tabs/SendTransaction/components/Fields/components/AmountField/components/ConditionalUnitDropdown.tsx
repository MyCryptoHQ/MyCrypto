import React from 'react';
import Dropdown from 'components/ui/Dropdown';
import { withConditional } from 'components/hocs';
import { TokenBalance } from 'selectors/wallet';
import { getDecimal } from 'libs/units';
import {
  Query,
  GetTransactionMetaFields,
  TokenBalances
} from 'components/renderCbs';

interface Props {
  onUnitChange(value: string): void;
  onDecimalChange(value: number): void;
}

const StringDropdown = Dropdown as new () => Dropdown<string>;
const ConditionalStringDropDown = withConditional(StringDropdown);

export const ConditionalUnitDropdown: React.SFC<Props> = ({
  onUnitChange,
  onDecimalChange
}) => (
  <div className="input-group-btn">
    <TokenBalances
      nonZeroBalances={true}
      withTokens={({ tokens }) => (
        <Query
          params={['readOnly']}
          withQuery={({ readOnly }) => (
            <GetTransactionMetaFields
              withFieldValues={({ unit }) => (
                <ConditionalStringDropDown
                  options={['ether', ...getTokenSymbols(tokens)]}
                  value={unit}
                  condition={!!readOnly}
                  conditionalProps={{
                    onChange: handleOnChange(
                      onUnitChange,
                      onDecimalChange,
                      tokens
                    )
                  }}
                  ariaLabel={'dropdown'}
                />
              )}
            />
          )}
        />
      )}
    />
  </div>
);

const getTokenSymbols = (tokens: TokenBalance[]) => tokens.map(t => t.symbol);

const handleOnChange = (
  onUnitChange: Props['onUnitChange'],
  onDecimalChange: Props['onDecimalChange'],
  options: TokenBalance[]
) => (value: string) => {
  const token = options.find(t => t.symbol === value);
  if (token) {
    onDecimalChange(token.decimal);
    onUnitChange(token.symbol);
  } else if (value === 'ether') {
    onDecimalChange(getDecimal(value));
    onUnitChange(value);
  } else {
    throw Error('Invalid unit selected in drop down');
  }
};
