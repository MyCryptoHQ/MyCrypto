import React, { Component } from 'react';
import { setUnitMeta, TSetUnitMeta } from 'actions/transaction';
import Dropdown from 'components/ui/Dropdown';
import { withConditional } from 'components/hocs';
import { TokenBalance, getTokenBalances } from 'selectors/wallet';
import { Query } from 'components/renderCbs';
import { connect } from 'react-redux';
import { AppState } from 'reducers';
import { getUnit } from 'selectors/transaction';

interface DispatchProps {
  setUnitMeta: TSetUnitMeta;
}

interface StateProps {
  unit: string;
  tokens: TokenBalance[];
}

const StringDropdown = Dropdown as new () => Dropdown<string>;
const ConditionalStringDropDown = withConditional(StringDropdown);

class UnitDropdownClass extends Component<DispatchProps & StateProps> {
  public render() {
    const { tokens, unit } = this.props;
    return (
      <div className="input-group-btn">
        <Query
          params={['readOnly']}
          withQuery={({ readOnly }) => (
            <ConditionalStringDropDown
              options={['ether', ...getTokenSymbols(tokens)]}
              value={unit}
              condition={!readOnly}
              conditionalProps={{
                onChange: this.handleOnChange
              }}
              ariaLabel={'dropdown'}
            />
          )}
        />
      </div>
    );
  }
  private handleOnChange = (unit: string) => {
    this.props.setUnitMeta(unit);
  };
}
const getTokenSymbols = (tokens: TokenBalance[]) => tokens.map(t => t.symbol);

export const UnitDropDown = connect(
  (state: AppState) => ({ tokens: getTokenBalances(state, true), unit: getUnit(state) }),
  { setUnitMeta }
)(UnitDropdownClass);
