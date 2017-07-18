import React from 'react';
import PropTypes from 'prop-types';
import './RegisterName.scss';

export default class RegisterName extends React.Component {
  state = {
    desiredName: ''
  };

  _handleSubmit = ev => {
    ev.preventDefault();
  };

  _handleInput = ev => {
    this.setState({
      desiredName: ev.target.value.toLowerCase()
    });
  };

  render() {
    const { desiredName } = this.state;

    return (
      <div className="RegisterName">
        <form className="RegisterName-nameform" onSubmit={this._handleSubmit}>
          <div className="RegisterName-nameform-inputs">
            <div className="input-group">
              <input
                className="form-control"
                placeholder="myetherwallet"
                value={desiredName}
                onChange={this._handleInput}
              />
              <span className="input-group-addon">.eth</span>
            </div>
          </div>

          <button className="RegisterName-nameform-submit btn btn-primary">
            Check Availability
          </button>
        </form>
      </div>
    );
  }
}
