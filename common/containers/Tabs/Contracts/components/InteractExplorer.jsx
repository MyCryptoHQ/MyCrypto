// @flow
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import translate from 'translations';
import './Interact.scss';

type Props = {
  selectedABIFunctions: ?Array
};

export default class InteractExplorer extends Component {
  props: Props;
  static propTypes = {
    selectedABIFunctions: PropTypes.array
  };

  render() {
    const { selectedABIFunctions } = this.props;

    if (!selectedABIFunctions) {
      return null;
    }

    return <div className="InteractExplorer" />;
  }
}
