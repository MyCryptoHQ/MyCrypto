import React from 'react';
import { connect } from 'react-redux';
import { Theme } from 'config';
import { TChangeTheme, changeTheme } from 'actions/config';
import { getTheme } from 'selectors/config';
import { AppState } from 'reducers';
import './ThemeToggle.scss';

interface ActionProps {
  changeTheme: TChangeTheme;
}

interface StateProps {
  theme: ReturnType<typeof getTheme>;
}

type Props = ActionProps & StateProps;

class ThemeToggle extends React.Component<Props> {
  public render() {
    const { theme } = this.props;
    let pathD = '';

    if (theme === Theme.DARK) {
      pathD =
        'M30,11c-10.49,0-19,8.51-19,19c0,10.49,8.51,19,19,19c5.18,0,9.87-2.08,13.3-5.44c-10.37-0.15-18.73-8.58-18.73-18.99C24.57,16.52,30,11,30,11z';
    } else {
      pathD =
        'M30,16c7.73,0,14,6.27,14,14c0,3.81-1.53,7.27-4,9.8c-2.54,2.59-6.08,4.2-10,4.2c-7.73,0-14-6.27-14-14C16,22.27,22.27,16,30,16z';
    }

    return (
      <button className="ThemeToggle btn btn-smr btn-white" onClick={this.toggleTheme}>
        <span className="ThemeToggle-placeholder">{theme}</span>
        <svg className={`ThemeToggle-icon is-theme-${theme}`} viewBox="0 0 60 60">
          <path d={pathD} />
        </svg>
      </button>
    );
  }

  private toggleTheme = () => {
    const theme = this.props.theme === Theme.LIGHT ? Theme.DARK : Theme.LIGHT;
    this.props.changeTheme(theme);
  };
}

export default connect(
  (state: AppState) => ({
    theme: getTheme(state)
  }),
  {
    changeTheme
  }
)(ThemeToggle);
