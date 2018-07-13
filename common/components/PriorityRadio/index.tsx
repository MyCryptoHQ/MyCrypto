import React from 'react';
import translate from 'translations';
import Help from 'components/ui/Help';
import './PriorityRadio.scss';

interface State {
  option: { type: string; value: string | number };
}

export class PriorityRadio extends React.Component<any, State> {
  public state = {
    option: { type: 'low', value: 0 }
  };

  public componentDidMount() {
    //
  }

  public onClick = (type: string, value: string | number) => {
    this.setState({ option: { type, value } });
  };

  public render() {
    const { option } = this.state;
    const speed = { slow: '$0.075', average: '$0.088', fast: '$0.19' };
    const estimate = { slow: '4 min', average: '3.4 min', fast: '24 sec' };
    const buttons = [
      { type: 'low', price: speed.slow, ringSize: estimate.slow },
      { type: 'medium', price: speed.average, ringSize: estimate.average },
      { type: 'high', price: speed.fast, ringSize: estimate.fast }
    ];
    return (
      <div className="PriorityRadio input-group-wrapper">
        <div className="PriorityRadio-group input-group input-group-inline">
          <div className="input-group-header">
            <div className="">{translate('PRIVACY_RADIO')}</div>
            <Help size="x1" link="https://support.mycrypto.com/" />
            <div className="flex-spacer" />
          </div>
          <div className="PriorityRadio-button-wrapper">
            {buttons.map((btn, i) => (
              <button
                key={i}
                className={`PriorityRadio-button ${option.type === btn.type && 'selected'}`}
                onClick={() => this.onClick(btn.type, btn.ringSize)}
              >
                <span className="PriorityRadio-button-level">
                  {btn.type}: {btn.price}
                </span>
                <span className="PriorityRadio-button-ringsize small">~{btn.ringSize}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }
}
