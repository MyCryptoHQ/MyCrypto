import { TChangeGasPrice, TChangeLanguage, TChangeNode } from 'actions/config';
import logo from 'assets/images/logo-myetherwallet.svg';
import { Dropdown, ColorDropdown } from 'components/ui';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
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
import { getKeyByValue } from 'utils/helpers';
import './index.scss';

interface Props {
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
    const selectedLanguage = languageSelection;
    const selectedNode = NODES[nodeSelection];
    const selectedNetwork = NETWORKS[selectedNode.network];
    const LanguageDropDown = Dropdown as new () => Dropdown<
      typeof selectedLanguage
    >;
    const nodeOptions = Object.keys(NODES).map(key => {
      return {
        value: key,
        name: (
          <span>
            {NODES[key].network} <small>({NODES[key].service})</small>
          </span>
        ),
        color: NETWORKS[NODES[key].network].color
      };
    });

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
            <div className="Header-branding-right">
              <span className="Header-branding-right-version">v{VERSION}</span>

              <div className="Header-branding-right-dropdown">
                <GasPriceDropdown
                  value={this.props.gasPriceGwei}
                  onChange={this.props.changeGasPrice}
                />
              </div>

              <div className="Header-branding-right-dropdown">
                <LanguageDropDown
                  ariaLabel={`change language. current language ${languages[
                    selectedLanguage
                  ]}`}
                  options={Object.values(languages)}
                  value={languages[selectedLanguage]}
                  extra={
                    <li key="disclaimer">
                      <a data-toggle="modal" data-target="#disclaimerModal">
                        Disclaimer
                      </a>
                    </li>
                  }
                  onChange={this.changeLanguage}
                  size="smr"
                  color="white"
                />
              </div>

              <div className="Header-branding-right-dropdown">
                <ColorDropdown
                  ariaLabel={`change node. current node ${selectedNode.network} node by ${selectedNode.service}`}
                  options={nodeOptions}
                  value={nodeSelection}
                  extra={
                    <li>
                      <a>Add Custom Node</a>
                    </li>
                  }
                  onChange={changeNode}
                  size="smr"
                  color="white"
                />
              </div>
            </div>
          </section>
        </section>

        <Navigation color={selectedNetwork.color} />
      </div>
    );
  }

  public changeLanguage = (value: string) => {
    const key = getKeyByValue(languages, value);
    if (key) {
      this.props.changeLanguage(key);
    }
  };
}
