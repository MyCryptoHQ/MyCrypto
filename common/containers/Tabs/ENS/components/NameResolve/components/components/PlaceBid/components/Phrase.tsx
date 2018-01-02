import * as React from 'react';
import { connect } from 'react-redux';
import { AppState } from 'reducers';
import { bindActionCreators } from 'redux';

class PhraseClass extends React.Component<any, any> {
  public state = {
    value: ''
  };

  public onChange = e => {
    this.setState({
      value: e.target.value
    });
    if (this.props.onChange) {
      this.props.onChange(e.target.value);
    }
  };

  public render(): JSX.Element {
    return (
      <section className="form-group">
        <label>Secret Phrase</label>
        <em className="col-xs-12">
          <small>You must remember this to claim your name later.</small>
        </em>
        <section className="input-group col-xs-12">
          <input
            type="text"
            className="form-control"
            value={this.state.value}
            onChange={this.onChange}
            placeholder="tide kitten pool"
          />
        </section>
      </section>
    );
  }
}

const mapStateToProps = (state: AppState) => {
  return {};
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({}, dispatch);
};

export const Phrase = connect(mapStateToProps, mapDispatchToProps)(PhraseClass);
