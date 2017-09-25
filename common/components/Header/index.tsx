import { TChangeGasPrice, TChangeLanguage, TChangeNode } from 'actions/config';
import logo from 'assets/images/logo-myetherwallet.svg';
import { Dropdown } from 'components/ui';
import React, { Component } from 'react';
import { Link } from 'react-router';
import {
  ANNOUNCEMENT_MESSAGE,
  ANNOUNCEMENT_TYPE,
  languages,
  NETWORKS,
  NODES,
  VERSION
} from '../../config/data';
import GasPriceDropdown from './components/GasPriceDropdown';
import Navigation from './components/Navigation';

import './index.scss';

interface Props {
  location: {};
  languageSelection: string;
  nodeSelection: string;
  gasPriceGwei: number;

  changeLanguage: TChangeLanguage;
  changeNode: TChangeNode;
  changeGasPrice: TChangeGasPrice;
}

export default class Header extends Component<Props, {}> {
  public render() {
    const { languageSelection, changeNode, nodeSelection } = this.props;
    const selectedLanguage =
      languages.find(l => l.sign === languageSelection) || languages[0];
    const selectedNode = NODES[nodeSelection];
    const selectedNetwork = NETWORKS[selectedNode.network];
    const LanguageDropDown = Dropdown as new () => Dropdown<
      typeof selectedLanguage
    >;
    const NodeDropDown = Dropdown as new () => Dropdown<keyof typeof NODES>;
    return (
      <div className="Header">
        {ANNOUNCEMENT_MESSAGE && (
          <div
            className={`Header-announcement is-${ANNOUNCEMENT_TYPE}`}
            dangerouslySetInnerHTML={{
              __html: ANNOUNCEMENT_MESSAGE
            }}
          />
        )}

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

              <LanguageDropDown
                ariaLabel={`change language. current language ${selectedLanguage.name}`}
                options={languages}
                formatTitle={this.extractName}
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

              <NodeDropDown
                ariaLabel={`change node. current node ${selectedNode.network} node by ${selectedNode.service}`}
                options={Object.keys(NODES)}
                formatTitle={this.nodeNetworkAndService}
                value={nodeSelection}
                extra={
                  <li>
                    <a>Add Custom Node</a>
                  </li>
                }
                onChange={changeNode}
              />
            </div>
          </section>
        </section>

        <Navigation
          location={this.props.location}
          // color={selectedNetwork.color}
        />
      </div>
    );
  }

  public changeLanguage = (value: { sign: string }) => {
    this.props.changeLanguage(value.sign);
  };

  private extractName(): (option: { sign: string; name: string }) => string {
    return name;
  }

  private nodeNetworkAndService = (option: string) => [
    NODES[option].network,
    ' ',
    <small key="service">({NODES[option].service}) </small>
  ];
}
