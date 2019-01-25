import React, { Component } from 'react';

import { SendAmountResponse } from 'v2/services';
import { SHAPESHIFT_SUPPORT_EMAILS } from '../constants';
import { formatShapeShiftSupportEmail } from '../helpers';
import './Support.scss';

// Legacy
import { TextArea } from 'components/ui';

interface Props {
  transaction: SendAmountResponse;
}

interface State {
  open: boolean;
}

export default class Support extends Component<Props> {
  public state: State = {
    open: false
  };

  public render() {
    const { transaction } = this.props;
    const { open } = this.state;
    const { subject, body, fallbackBody } = formatShapeShiftSupportEmail(transaction);

    return (
      <section className="Support">
        <a
          className="btn ShapeShiftWidget-button separated"
          href={`mailto:${SHAPESHIFT_SUPPORT_EMAILS}?Subject=${subject}&Body=${body}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          Contact Support
        </a>
        <button className="Support-button" onClick={this.toggleOpen}>
          {open ? 'Close' : "Above link doesn't work"}
        </button>
        {open && (
          <section className="Support-fallback">
            <section>
              <label>To</label>
              <p>{SHAPESHIFT_SUPPORT_EMAILS}</p>
            </section>
            <section>
              <label>Subject</label>
              <p>{decodeURI(subject)}</p>
            </section>
            <section>
              <label>Body</label>
              <TextArea
                isValid={true}
                showValidAsPlain={true}
                defaultValue={fallbackBody}
                className="input-sm"
                rows={9}
              />
            </section>
          </section>
        )}
      </section>
    );
  }

  private toggleOpen = () =>
    this.setState((prevState: State) => ({
      open: !prevState.open
    }));
}
