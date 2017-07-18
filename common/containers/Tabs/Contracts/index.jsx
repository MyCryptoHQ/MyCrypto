// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import './index.scss';

type Props = {};

class Contracts extends Component {
  props: Props;
  static propTypes = {};
  render() {
    return (
      <section className="container" style={{ minHeight: '50%' }}>
        <div className="tab-content">
          <main className="tab-pane active text-center" role="main">
            <div className="Contracts" />
          </main>
        </div>
      </section>
    );
  }
}

function mapStateToProps(state: State) {
  return {};
}

export default connect(mapStateToProps)(Contracts);
