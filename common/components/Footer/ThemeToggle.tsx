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
    return (
      <button className="ThemeToggle" onClick={this.toggleTheme} aria-hidden={true}>
        <div className="ThemeToggle-control">
          <span className="ThemeToggle-control-icon is-dark" />
          <span className="ThemeToggle-control-icon is-light" />
        </div>
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
