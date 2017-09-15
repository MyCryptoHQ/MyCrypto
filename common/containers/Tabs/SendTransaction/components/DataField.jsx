// @flow
import React from 'react';
import translate from 'translations';
import { isValidHex } from 'libs/validators';
import { donationAddressMap } from 'config/data';

type Props = {
  value: string,
  onChange?: (e: string) => void
};

type State = {
  expanded: boolean
};

export default class DataField extends React.Component<Props, State> {
  state = {
    expanded: false
  };

  render() {
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

  expand = () => {
    this.setState({ expanded: true });
  };

  onChange = (e: SyntheticInputEvent<*>) => {
    if (this.props.onChange) {
      this.props.onChange(e.target.value);
    }
  };
}
