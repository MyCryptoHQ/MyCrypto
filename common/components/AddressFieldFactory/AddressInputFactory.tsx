import React, { Component } from 'react';
import { Identicon } from 'components/ui';
import translate from 'translations';
//import { EnsAddress } from './components';
import { Query } from 'components/renderCbs';
import { ICurrentTo, getCurrentTo, isValidCurrentTo } from 'selectors/transaction';
import { connect } from 'react-redux';
import { AppState } from 'reducers';
import { CallbackProps } from 'components/AddressFieldFactory';

interface StateProps {
  currentTo: ICurrentTo;
  isValid: boolean;
}
interface OwnProps {
  onChange(ev: React.FormEvent<HTMLInputElement>): void;
  withProps(props: CallbackProps): React.ReactElement<any> | null;
}

type Props = OwnProps & StateProps;

//TODO: ENS handling
class AddressInputFactoryClass extends Component<Props> {
  public render() {
    const { currentTo, onChange, isValid, withProps } = this.props;
    const { raw } = currentTo;
    return (
      <div className="row form-group">
        <div className="col-xs-11">
          <label>{translate('SEND_addr')}:</label>
          <Query
            params={['readOnly']}
            withQuery={({ readOnly }) =>
              withProps({
                currentTo,
                isValid,
                onChange,
                readOnly: !!readOnly,
                errorMsg: currentTo.error
              })
            }
          />
          {/*<EnsAddress ensAddress={ensAddress} />*/}
        </div>
        <div className="col-xs-1" style={{ padding: 0 }}>
          <Identicon address={/*ensAddress ||*/ raw} />
        </div>
      </div>
    );
  }
}

export const AddressInputFactory = connect((state: AppState) => ({
  currentTo: getCurrentTo(state),
  isValid: isValidCurrentTo(state)
}))(AddressInputFactoryClass);
