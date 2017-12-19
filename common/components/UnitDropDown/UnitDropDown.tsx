import React, { Component } from 'react';
import { setUnitMeta, TSetUnitMeta } from 'actions/transaction';
import Dropdown from 'components/ui/Dropdown';
import { withConditional } from 'components/hocs';
import { TokenBalance, getShownTokenBalances } from 'selectors/wallet';
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

function mapStateToProps(state: AppState) {
  return {
    tokens: getShownTokenBalances(state, true),
    unit: getUnit(state)
  };
}

export const UnitDropDown = connect(mapStateToProps, { setUnitMeta })(UnitDropdownClass);
