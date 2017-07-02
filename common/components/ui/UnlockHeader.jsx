// @flow
import React from 'react';
import PropTypes from 'prop-types';
import translate from 'translations';

export default class UnlockHeader extends React.Component {
  props: {
    title: string
  };
  static propTypes = {
    title: PropTypes.string.isRequired
  };

  state: {
    expanded: boolean
  } = {
    expanded: true
  };

  render() {
    return (
      <article className="collapse-container">
        <div onClick={this.toggleExpanded}>
          <a className="collapse-button">
            <span>{this.state.expanded ? '-' : '+'}</span>
          </a>
          <h1>{translate(this.props.title)}</h1>
        </div>
        {this.state.expanded &&
          <div>
            {/* @@if (site === 'cx' )  {  <cx-wallet-decrypt-drtv></cx-wallet-decrypt-drtv>   }
    @@if (site === 'mew' ) {  <wallet-decrypt-drtv></wallet-decrypt-drtv>         } */}
          </div>}

        {this.state.expanded && <hr />}
      </article>
    );
  }

  toggleExpanded = () => {
    this.setState(state => {
      return { expanded: !state.expanded };
    });
  };
}
