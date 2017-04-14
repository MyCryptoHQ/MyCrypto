import React, {Component} from 'react'

const languages = [
    {
        'sign': 'en',
        'name': 'English'
    },
    {
        'sign': 'de',
        'name': 'Deutsch'
    },
    {
        'sign': 'el',
        'name': 'Ελληνικά'
    },
    // {
    //     "sign": 'el',
    //     "name": 'Ελληνικά'
    // },
    // {
    //     "sign": 'el',
    //     "name": 'Ελληνικά'
    // },
    // {
    //     "sign": 'el',
    //     "name": 'Ελληνικά'
    // },
    // {
    //     "sign": 'el',
    //     "name": 'Ελληνικά'
    // },
    // {
    //     "sign": 'el',
    //     "name": 'Ελληνικά'
    // },

]

export default class LanguageDropdownComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            languageToggle: false,
            languageSelection: 0
        }
    }

    languageToggle() {
        let nextState = this.state;
        nextState['languageToggle'] = !nextState['languageToggle'];
        this.setState(nextState)
    }


    changeLanguage(i) {
        let nextState = this.state;
        nextState["languageSelection"] = i;
        nextState['languageToggle'] = false;
        this.setState(nextState);
    }

    render() {
        return (
            <span className="dropdown">
              <a tabIndex="0" aria-haspopup="true" aria-expanded="false"
                 aria-label="change language. current language English"
                 className="dropdown-toggle"
                 onClick={() => this.languageToggle()}>
                  {languages[this.state.languageSelection].name}
                  <i className="caret"/>
              </a>
                {
                    this.state.languageToggle &&
                    <ul className="dropdown-menu">
                        {languages.map((object, i) => {
                            return (
                                <li key={i}>
                                    <a className={i === this.state.languageSelection ? 'active' : ''}
                                       onClick={() => this.changeLanguage(i)}>
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