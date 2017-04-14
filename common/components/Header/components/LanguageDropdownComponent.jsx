import React, {Component} from 'react'
import {languages} from 'reducers/config'
import PropTypes from 'prop-types';


export default class LanguageDropdownComponent extends Component {
    constructor(props) {
        super(props);
    }

    static propTypes = {
        changeLanguage: PropTypes.func,
        languageSelection: PropTypes.number,
        languageToggle: PropTypes.bool,
        toggleLanguageDropdown: PropTypes.func
    };

    render() {
        let {
            languageSelection,
            changeLanguage,
            toggleLanguageDropdown,
            languageToggle
        } = this.props;

        return (
            <span className="dropdown">
              <a tabIndex="0" aria-haspopup="true" aria-expanded="false"
                 aria-label="change language. current language English"
                 className="dropdown-toggle"
                 onClick={() => toggleLanguageDropdown()}>
                  {languages[languageSelection].name}
                  <i className="caret"/>
              </a>
                {
                    languageToggle &&
                    <ul className="dropdown-menu">
                        {languages.map((object, i) => {
                            return (
                                <li key={i}>
                                    <a className={i === languageSelection ? 'active' : ''}
                                       onClick={() => changeLanguage(i)}>
                                        {object.name}
                                    </a>
                                </li>
                            )
                        })}
                        <li role="separator" className="divider"/>
                        <li>
                            <a data-toggle="modal" data-target="#disclaimerModal">
                                Disclaimer
                            </a>
                        </li>
                    </ul>
                }
            </span>
        )
    }
}