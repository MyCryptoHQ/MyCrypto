import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as ensActions from 'actions/ens';
import PropTypes from 'prop-types';
import RegisterName from './components/RegisterName';
import Guide from './components/Guide';

const ensHref = 'http://ens.readthedocs.io/en/latest/introduction.html';
const ensLink = (
  <a href={ensHref} target="_blank" rel="noopener">
    Ethereum Name Service
  </a>
);

class NameService extends Component {
  constructor(props) {
    super(props);
  }

  static propTypes = {};

  render() {
    // TODO: Translate me!
    return (
      <section className="container" style={{ minHeight: '50%' }}>
        <div className="tab-content">
          <main className="tab-pane active">
            <div className="NameService">
              <h1 className="NameService-title">ENS</h1>
              <p className="NameService-desc">
                The {ensLink} is a distributed, open, and extensible naming
                system based on the Ethereum blockchain. Once you have a name,
                you can tell your friends to send ETH to{' '}
                <code>mewtopia.eth</code> instead of
                <code>0x7cB57B5A97eAbe942......</code>
              </p>

              <RegisterName />

              <hr className="NameService-divider" />

              <Guide />
            </div>
          </main>
        </div>
      </section>
    );
  }
}

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps, ensActions)(NameService);
