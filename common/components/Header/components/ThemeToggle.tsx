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

    return (
      <button className="ThemeToggle btn btn-smr btn-white" onClick={this.toggleTheme}>
        <span className="ThemeToggle-placeholder">{theme}</span>
        <span className="ThemeToggle-icon is-theme-dark" />
        <span className="ThemeToggle-icon is-theme-light" />
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
