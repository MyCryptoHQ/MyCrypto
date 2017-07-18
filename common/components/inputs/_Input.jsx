// @flow
import React from 'react';
import PropTypes from 'prop-types';
import './_Input.scss';

export type InputProps = {
  name: ?string,
  placeholder: ?string,
  value: ?React.Element<*>,
  readonly: boolean,
  type: ?string,
  rows: ?number,

  label: ?React.Element<*>,
  rootClass: string,
  preInput: ?React.Element<*>,
  postInput: ?React.Element<*>,
  validator: ?Function,
  onChange: Function
};

export const inputPropTypes = {
  // Input props
  name: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.node,
  readonly: PropTypes.bool,
  type: PropTypes.string,
  rows: PropTypes.number,
  // Custom props
  label: PropTypes.node,
  rootClass: PropTypes.string.isRequired,
  preInput: PropTypes.node,
  postInput: PropTypes.node,
  validator: PropTypes.func,
  onChange: PropTypes.func.isRequired
};

export default class ByteCodeInput extends React.Component {
  props: InputProps;
  static propTypes = inputPropTypes;

  state = {
    isValid: null
  };

  _handleInput = ev => {
    if (this.props.validator) {
      this.setState({ isValid: this.props.validator(ev.target.value) });
    }

    this.props.onChange(ev);
  };

  render() {
    const {
      label,
      name,
      placeholder,
      value,
      readonly,
      type,
      rows,
      rootClass,
      preInput,
      postInput
    } = this.props;
    const { isValid } = this.state;

    // If we have a validator that sets isValid and content, set a class
    let validClass = '';
    if (value && isValid !== null) {
      validClass = isValid ? 'is-valid' : 'is-invalid';
    }

    // Some ByteCode inputs are full contracts, others are simple data
    const inputClass = `Input-fields-input ${rootClass}-fields-input form-control ${validClass}`;
    let input;

    if (type === 'textarea') {
      input = (
        <textarea
          name={name}
          value={value}
          placeholder={placeholder}
          readOnly={readonly}
          rows={rows}
          className={inputClass}
          onChange={this._handleInput}
        >
          {value}
        </textarea>
      );
    } else {
      input = (
        <input
          name={name}
          value={value}
          placeholder={placeholder}
          type={type}
          readOnly={readonly}
          className={inputClass}
          onChange={this._handleInput}
        />
      );
    }

    return (
      <label className={`Input ${rootClass}`}>
        {label &&
          <h4 className={`Input-label ${rootClass}-label`}>
            {label}
          </h4>}

        <div className={`Input-fields ${rootClass}-fields`}>
          {preInput}
          {input}
          {postInput}
        </div>
      </label>
    );
  }
}
