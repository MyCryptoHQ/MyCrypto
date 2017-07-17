import React from 'react';
import PropTypes from 'prop-types';
import './RegisterName.scss';

export default class RegisterName extends React.Component {
  render() {
    return (
      <div className="RegisterName">
        <form className="RegisterName-nameform">
          <div className="RegisterName-nameform-inputs input-group">
            <input className="form-control" placeholder="myetherwallet" />
            <span className="input-group-addon">.eth</span>
          </div>

          <button className="RegisterName-nameform-submit btn btn-primary">
            Check Availability
          </button>
        </form>
      </div>
    );
  }
}
