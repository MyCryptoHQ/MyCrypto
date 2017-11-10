import { donationAddressMap } from 'config/data';
import { isValidHex } from 'libs/validators';
import React from 'react';
import translate from 'translations';
import { ConditionalInput } from 'components/ui';

interface Props {
  value: string;
  readOnly: boolean;
  onChange(e: string): void;
}

interface State {
  expanded: boolean;
}

export class DataField extends React.Component<Props, State> {
  public static defaultProps: Partial<Props> = {
    value: ''
  };

  public state: State = {
    expanded: false
  };

  public render() {
    const { value, onChange, readOnly } = this.props;
    const { expanded } = this.state;
    const valid = isValidHex(value);

    return (
      <div className="row form-group">
        <div className="col-sm-11 clearfix">
          {!expanded ? (
            <a onClick={this.expand}>
              <p className="strong">{translate('TRANS_advanced')}</p>
            </a>
          ) : (
            <section>
              <div className="form-group">
                <label>{translate('TRANS_data')}</label>
                <ConditionalInput
                  className={`form-control ${
                    valid ? 'is-valid' : 'is-invalid'
                  }`}
                  type="text"
                  placeholder={donationAddressMap.ETH}
                  value={value}
                  condition={readOnly}
                  conditionalProps={{ onChange, placeholder: '' }}
                />
              </div>
            </section>
          )}
        </div>
      </div>
    );
  }

  public expand = () => this.setState({ expanded: true });
}
