import React from 'react';
import translate from 'translations';

interface Props {
  value: string;
  onChange?(value: string): void | null;
}
export default class GasField extends React.Component<Props, {}> {
  public render() {
    const { value, onChange } = this.props;
    const isReadonly = !onChange;

    return (
      <div className="row form-group">
        <div className="col-sm-11 clearfix">
          <label>
            {translate('TRANS_gas')}{' '}
          </label>
          <input
            className={`form-control ${isFinite(parseFloat(value)) &&
            parseFloat(value) > 0
              ? 'is-valid'
              : 'is-invalid'}`}
            type="text"
            placeholder="21000"
            disabled={isReadonly}
            value={value}
            onChange={this.onChange}
          />
        </div>
      </div>
    );
  }

  public onChange = (e: React.SyntheticEvent<HTMLInputElement>) => {
    if (this.props.onChange) {
      this.props.onChange((e.target as HTMLInputElement).value);
    }
  };
}
