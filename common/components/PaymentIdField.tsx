import React from 'react';
import translate, { translateRaw } from 'translations';
import { Input } from 'components/ui';

interface Props {
  placeholder?: string;
}

interface State {
  value: string;
}

export class PaymentIdField extends React.Component<Props, State> {
  public state = {
    value: ''
  };

  public onChange = (ev: React.FormEvent<HTMLInputElement>): void => {
    this.setState({ value: ev.currentTarget.value });
  };

  public render() {
    return (
      <div className="input-group-wrapper">
        <label className="input-group">
          <div className="input-group-header">
            {translate('PAYMENT_ID_TITLE')} <span className="small optional">(optional)</span>
          </div>
          <Input
            className={`input-group-input ${false ? 'invalid' : ''}`}
            isValid={false}
            type="text"
            value={this.state.value}
            placeholder={translateRaw('PAYMENT_ID_PLACEHOLDER')}
            onChange={this.onChange}
            // onFocus={onFocus}
            // onBlur={onBlur}
          />
        </label>
      </div>
    );
  }
}
