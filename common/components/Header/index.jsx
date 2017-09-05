// @flow
import React, { Component } from 'react';
import Navigation from './components/Navigation';
import GasPriceDropdown from './components/GasPriceDropdown';
import { Link } from 'react-router';
import { Dropdown } from 'components/ui';
import {
  languages,
  NODES,
  VERSION,
  ANNOUNCEMENT_TYPE,
  ANNOUNCEMENT_MESSAGE
} from '../../config/data';
import logo from 'assets/images/logo-myetherwallet.svg';

import './index.scss';

export default class Header extends Component {
  props: {
    location: {},
    languageSelection: string,
    nodeSelection: string,
    gasPriceGwei: number,

    changeLanguage: (sign: string) => any,
    changeNode: (key: string) => any,
    changeGasPrice: (price: number) => any
  };

  render() {
    const { languageSelection, changeNode, nodeSelection } = this.props;
    const selectedLanguage =
      languages.find(l => l.sign === languageSelection) || languages[0];
    const selectedNode = NODES[nodeSelection];

    return (
      <div className="Header">
        {ANNOUNCEMENT_MESSAGE &&
          <div
            className={`Header-announcement is-${ANNOUNCEMENT_TYPE}`}
            dangerouslySetInnerHTML={{
              __html: ANNOUNCEMENT_MESSAGE
            }}
          />}

        <section className="Header-branding">
          <section className="Header-branding-inner container">
            <Link
              to={'/'}
              className="Header-branding-title"
              aria-label="Go to homepage"
            >
              {/* TODO - don't hardcode image path*/}
              <img
                className="Header-branding-title-logo"
                src={logo}
                height="64px"
                width="245px"
                alt="MyEtherWallet"
              />
            </Link>
            <div className="Header-branding-title-tagline">
              <span className="Header-branding-title-tagline-version">
                v{VERSION}
              </span>

              <GasPriceDropdown
                value={this.props.gasPriceGwei}
                onChange={this.props.changeGasPrice}
              />

              <Dropdown
                ariaLabel={`change language. current language ${selectedLanguage.name}`}
                options={languages}
                formatTitle={o => o.name}
                value={selectedLanguage}
                extra={[
                  <li key={'separator'} role="separator" className="divider" />,
                  <li key={'disclaimer'}>
                    <a data-toggle="modal" data-target="#disclaimerModal">
                      Disclaimer
                    </a>
                  </li>
                ]}
                onChange={this.changeLanguage}
              />

              <Dropdown
                ariaLabel={`change node. current node ${selectedNode.network} node by ${selectedNode.service}`}
                options={Object.keys(NODES)}
                formatTitle={o => [
                  NODES[o].network,
                  ' ',
                  <small key="service">
                    ({NODES[o].service})
                  </small>
                ]}
                value={nodeSelection}
                extra={
                  <li>
                    <a onClick={() => {}}>Add Custom Node</a>
                  </li>
                }
                onChange={changeNode}
              />
            </div>
          </section>
        </section>

        <Navigation location={this.props.location} />
      </div>
    );
  }

  changeLanguage = (value: { sign: string }) => {
    this.props.changeLanguage(value.sign);
  };
}
