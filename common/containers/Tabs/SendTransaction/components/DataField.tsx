import { donationAddressMap } from 'config/data';
import { isValidHex } from 'libs/validators';
import React from 'react';
import translate from 'translations';

interface Props {
  value: string;
  onChange?(e: string): void;
}

interface State {
  expanded: boolean;
}
export default class DataField extends React.Component<Props, State> {
  public state = {
    expanded: false
  };
  public render() {
    const { value } = this.props;
    const { expanded } = this.state;
    const valid = isValidHex(value || '');
    const readOnly = !this.props.onChange;

    return (
      <div className="row form-group">
        <div className="col-sm-11 clearfix">
          {!expanded &&
            <a onClick={this.expand}>
              <p className="strong">
                {translate('TRANS_advanced')}
              </p>
            </a>}
          {expanded &&
            <section>
              <div className="form-group">
                <label>
                  {translate('TRANS_data')}
                </label>
                <input
                  className={`form-control ${valid
                    ? 'is-valid'
                    : 'is-invalid'}`}
                  type="text"
                  placeholder={readOnly ? '' : donationAddressMap.ETH}
                  value={value || ''}
                  disabled={readOnly}
                  onChange={this.onChange}
                />
              </div>
            </section>}
        </div>
      </div>
    );
  }

  public expand = () => {
    this.setState({ expanded: true });
  };

  public onChange = (e: React.SyntheticEvent<HTMLInputElement>) => {
    if (this.props.onChange) {
      this.props.onChange((e.target as HTMLInputElement).value);
    }
  };
}
