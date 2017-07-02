// @flow
import React from 'react';
import translate from 'translations';
import { isValidHex } from 'libs/validators';

export default class DataField extends React.Component {
  props: {
    value: string,
    onChange?: (e: string) => void
  };
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
                  placeholder={
                    readOnly
                      ? ''
                      : '0x6d79657468657277616c6c65742e636f6d20697320746865206265737421'
                  }
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

  onChange = (e: SyntheticInputEvent) => {
    if (this.props.onChange) {
      this.props.onChange(e.target.value);
    }
  };
}
